import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { searchPersonWithGemini } from '@/lib/scraper/gemini'
import { PersonIntelligence } from '@/lib/types/intelligence'

export async function POST(req: NextRequest) {
  try {
    const { personName, personId, forceRefresh, startDate, endDate } = await req.json()

    if (!personName || !personId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check cache (6 hours) - but ignore cache if date range is specified
    const cacheKey = startDate && endDate ? `${personId}_${startDate}_${endDate}` : personId
    const existingDoc = await adminDb
      .collection('personIntelligence')
      .doc(cacheKey)
      .get()

    if (existingDoc.exists && !forceRefresh && !startDate) {
      const data = existingDoc.data()
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000)
      if (data?.scrapedAt?.toDate() > sixHoursAgo) {
        return NextResponse.json({ 
          cached: true, 
          data: { ...data, id: existingDoc.id } 
        })
      }
    }

    console.log(`Scraping campaign finance data for ${personName}...`)
    
    // Use AI to scrape comprehensive campaign finance data
    const activities = await searchPersonWithGemini(personName, startDate, endDate)

    if (activities.length === 0) {
      return NextResponse.json({ 
        error: 'No campaign finance data found for this person',
        suggestion: 'Try a different name or check spelling'
      }, { status: 404 })
    }

    // Extract financial signals
    const financialSignals = activities
      .filter(a => a.amountMentioned !== null)
      .map(a => ({
        date: a.publishedAt,
        type: a.type === 'ad-spend' ? 'ad-spend' : 'estimated-spend',
        amountKes: a.amountMentioned,
        description: a.headline,
        source: a.source,
        sourceUrl: a.sourceUrl,
        confidenceLevel: a.confidenceLevel,
      }))

    // Extract rally locations and corruption incidents
    const rallyLocations = activities
      .filter(a => a.location)
      .map(a => ({
        lat: a.locationLat || 0,
        lng: a.locationLng || 0,
        location: a.location!,
        date: a.publishedAt,
        headline: a.headline,
        source: a.source,
        sourceUrl: a.sourceUrl,
        confidenceLevel: a.confidenceLevel,
      }))

    // Store in Firestore
    const intelligenceData: Omit<PersonIntelligence, 'scrapedAt'> & { scrapedAt: Date } = {
      personName,
      personId,
      activities,
      totalActivities: activities.length,
      scrapedAt: new Date(),
      sources: ['Public Records', 'News Media', 'Social Media', 'Official Documents'],
      financialSignals: financialSignals as any,
      rallyLocations: rallyLocations as any,
      photoUrl: null,
      wikipediaSummary: null,
    }

    await adminDb
      .collection('personIntelligence')
      .doc(cacheKey)
      .set(intelligenceData)

    // Serialize dates for JSON response
    const serializedData = {
      ...intelligenceData,
      scrapedAt: intelligenceData.scrapedAt.toISOString(),
      activities: intelligenceData.activities.map(a => ({
        ...a,
        publishedAt: a.publishedAt instanceof Date ? a.publishedAt.toISOString() : a.publishedAt,
      })),
      financialSignals: intelligenceData.financialSignals.map((s: any) => ({
        ...s,
        date: s.date instanceof Date ? s.date.toISOString() : s.date,
      })),
      rallyLocations: intelligenceData.rallyLocations.map((r: any) => ({
        ...r,
        date: r.date instanceof Date ? r.date.toISOString() : r.date,
      })),
    }

    return NextResponse.json({ 
      cached: false, 
      data: serializedData,
      stats: {
        totalActivities: activities.length,
        sources: 1,
        financialSignals: financialSignals.length,
        corruptionCases: activities.filter(a => 
          a.type === 'corruption' || a.type === 'bribery'
        ).length,
        fundingRecords: activities.filter(a => 
          a.type === 'donation-received' || a.type === 'ppf-allocation'
        ).length,
        violations: activities.filter(a => 
          a.type === 'illegal-donations' || a.type === 'public-resource-misuse'
        ).length,
        dateRange: startDate && endDate ? `${startDate} to ${endDate}` : 'All time',
      }
    })
  } catch (error: any) {
    console.error('Person scrape error:', error)
    return NextResponse.json({ 
      error: 'Failed to scrape person intelligence',
      details: error.message 
    }, { status: 500 })
  }
}
