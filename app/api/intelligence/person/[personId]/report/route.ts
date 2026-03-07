import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { generateCampaignFinanceReport } from '@/lib/scraper/gemini'
import { generatePDFReport } from '@/lib/utils/pdf-generator'
import { PersonIntelligence } from '@/lib/types/intelligence'

export async function POST(
  req: NextRequest,
  { params }: { params: { personId: string } }
) {
  try {
    const { personId } = params
    const { startDate, endDate } = await req.json()

    // Build cache key
    const cacheKey = startDate && endDate ? `${personId}_${startDate}_${endDate}` : personId

    // Fetch intelligence data from Firestore
    const doc = await adminDb
      .collection('personIntelligence')
      .doc(cacheKey)
      .get()

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'No intelligence data found. Please scrape data first.' },
        { status: 404 }
      )
    }

    const intelligence = doc.data() as PersonIntelligence

    console.log(`Generating campaign finance report for ${intelligence.personName}...`)

    // Generate detailed report using AI
    const reportMarkdown = await generateCampaignFinanceReport(
      intelligence.personName,
      intelligence.activities,
      startDate && endDate ? { start: startDate, end: endDate } : undefined
    )

    // Convert markdown to PDF
    const dateRangeText = startDate && endDate ? `${startDate} to ${endDate}` : 'All Time'
    const pdfBuffer = generatePDFReport(
      intelligence.personName,
      reportMarkdown,
      dateRangeText
    )

    // Return as downloadable PDF file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${personId}-campaign-finance-report-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report', details: error.message },
      { status: 500 }
    )
  }
}
