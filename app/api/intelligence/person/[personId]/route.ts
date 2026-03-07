import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export async function GET(
  req: NextRequest,
  { params }: { params: { personId: string } }
) {
  try {
    const { personId } = params

    // Fetch from Firestore
    const doc = await adminDb
      .collection('personIntelligence')
      .doc(personId)
      .get()

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Person intelligence not found' },
        { status: 404 }
      )
    }

    const data = doc.data()
    
    // Convert Firestore Timestamps to ISO strings for JSON serialization
    const serializedData = {
      ...data,
      id: doc.id,
      scrapedAt: data?.scrapedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      activities: data?.activities?.map((activity: any) => ({
        ...activity,
        publishedAt: activity.publishedAt?.toDate?.()?.toISOString() || activity.publishedAt,
      })) || [],
      financialSignals: data?.financialSignals?.map((signal: any) => ({
        ...signal,
        date: signal.date?.toDate?.()?.toISOString() || signal.date,
      })) || [],
      rallyLocations: data?.rallyLocations?.map((location: any) => ({
        ...location,
        date: location.date?.toDate?.()?.toISOString() || location.date,
      })) || [],
    }
    
    return NextResponse.json(serializedData)
  } catch (error: any) {
    console.error('Fetch person intelligence error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch intelligence', details: error.message },
      { status: 500 }
    )
  }
}
