import { NextRequest, NextResponse } from 'next/server'
import { adminDb, adminStorage } from '@/lib/firebase/admin'
import { hashWithSalt, hashEmail } from '@/lib/utils/hash'
import { enforceRateLimit } from '@/lib/firestore/reports'
import sharp from 'sharp'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    const ipHash = hashWithSalt(ip)
    await enforceRateLimit(ipHash, 10)

    // Parse fields
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const subcategory = formData.get('subcategory') as string
    const county = formData.get('county') as string
    const locationText = formData.get('locationText') as string
    const isAnonymous = formData.get('isAnonymous') === 'true'
    const submitterEmail = formData.get('email') as string | null

    // Validate
    if (!title || !description || !category || !county) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (description.length < 20) {
      return NextResponse.json({ error: 'Description must be at least 20 characters' }, { status: 400 })
    }

    // Handle media uploads
    const mediaUrls: string[] = []
    const thumbnailUrls: string[] = []
    const files = formData.getAll('media') as File[]

    for (const file of files.slice(0, 5)) {
      if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        const buffer = Buffer.from(await file.arrayBuffer())

        // Strip EXIF
        const stripped = await sharp(buffer).rotate().toBuffer()
        const thumbnail = await sharp(stripped).resize(400).toBuffer()

        // Upload to Firebase Storage
        const fileName = `reports/${Date.now()}-${Math.random().toString(36).slice(2)}`
        const bucket = adminStorage.bucket()

        await bucket.file(`${fileName}-full.jpg`).save(stripped, { 
          contentType: 'image/jpeg', 
          metadata: { cacheControl: 'public, max-age=31536000' }
        })
        await bucket.file(`${fileName}-thumb.jpg`).save(thumbnail, { 
          contentType: 'image/jpeg',
          metadata: { cacheControl: 'public, max-age=31536000' }
        })

        const [fullUrl] = await bucket.file(`${fileName}-full.jpg`).getSignedUrl({
          action: 'read',
          expires: '03-01-2500'
        })
        const [thumbUrl] = await bucket.file(`${fileName}-thumb.jpg`).getSignedUrl({
          action: 'read',
          expires: '03-01-2500'
        })

        mediaUrls.push(fullUrl)
        thumbnailUrls.push(thumbUrl)
      }
    }

    // Create report
    const reportRef = await adminDb.collection('reports').add({
      title: title.trim(),
      description: description.trim(),
      category,
      subcategory: subcategory ?? '',
      tags: [],
      county,
      constituency: formData.get('constituency') ?? '',
      locationText: locationText ?? '',
      locationLat: parseFloat(formData.get('lat') as string) || null,
      locationLng: parseFloat(formData.get('lng') as string) || null,
      incidentDate: formData.get('incidentDate') ? new Date(formData.get('incidentDate') as string) : null,
      status: 'submitted',
      trustScore: 40,
      submissionChannel: 'web',
      isAnonymous,
      submitterEmailHash: submitterEmail ? hashEmail(submitterEmail) : null,
      ipHash,
      mediaUrls,
      thumbnailUrls,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true, reportId: reportRef.id })
  } catch (error: any) {
    console.error('Report submission error:', error)
    if (error.message === 'Daily report limit reached') {
      return NextResponse.json({ error: 'Daily report limit reached. Try again tomorrow.' }, { status: 429 })
    }
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 })
  }
}
