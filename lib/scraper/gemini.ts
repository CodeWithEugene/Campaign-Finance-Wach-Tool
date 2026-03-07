import { GoogleGenerativeAI } from '@google/generative-ai'
import { ActivityItem } from '@/lib/types/intelligence'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

/**
 * Use Gemini to intelligently extract structured data from scraped text
 */
export async function extractWithGemini(
  personName: string,
  rawText: string,
  source: string
): Promise<ActivityItem[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `
You are analyzing news articles and public records about Kenyan politician "${personName}".

Extract structured information from the following text and return a JSON array of activities.

For each activity found, extract:
- headline: A clear, concise headline (max 200 chars)
- summary: A brief summary (max 300 chars)
- type: One of: "rally", "donation-received", "donation-given", "ad-spend", "public-resource-misuse", "statement", "news"
- publishedDate: Date in ISO format (YYYY-MM-DD) or "unknown"
- location: Kenya county or city name, or null
- amountKes: Any KES amount mentioned as a number (e.g., 4400000000 for 4.4 billion), or null
- confidenceLevel: "verified" (official sources), "reported" (news), or "alleged" (unconfirmed)

Rules:
1. Only extract activities directly related to ${personName}
2. Focus on campaign finance, rallies, donations, spending
3. Extract exact KES amounts when mentioned (convert billions/millions to numbers)
4. Identify Kenya locations (counties, cities)
5. Return empty array if no relevant information found
6. Maximum 5 activities per text

Text to analyze:
${rawText.slice(0, 5000)}

Return ONLY valid JSON array, no other text.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return []
    }

    const activities = JSON.parse(jsonMatch[0])

    // Convert to ActivityItem format
    return activities.map((activity: any) => ({
      source,
      headline: activity.headline || '',
      summary: activity.summary || '',
      sourceUrl: '',
      publishedAt: activity.publishedDate !== 'unknown' 
        ? new Date(activity.publishedDate) 
        : new Date(),
      type: activity.type || 'news',
      confidenceLevel: activity.confidenceLevel || 'reported',
      rawText: activity.headline + ' ' + activity.summary,
      location: activity.location || null,
      locationLat: null,
      locationLng: null,
      amountMentioned: activity.amountKes || null,
    }))
  } catch (error) {
    console.error('Gemini extraction error:', error)
    return []
  }
}

/**
 * Use Gemini to search for a politician and get comprehensive campaign finance information
 */
export async function searchPersonWithGemini(
  personName: string,
  startDate?: string,
  endDate?: string
): Promise<ActivityItem[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const dateRange = startDate && endDate 
      ? `between ${startDate} and ${endDate}` 
      : 'from 2017 to present'

    const prompt = `
You are a campaign finance investigator analyzing Kenyan politician "${personName}".

FOCUS ONLY ON CAMPAIGN FINANCE TOPICS ${dateRange}:

1. CORRUPTION & BRIBERY:
   - Alleged corruption cases
   - Bribery allegations
   - Misuse of public funds
   - Unexplained wealth
   - Asset declarations

2. CAMPAIGN FUNDING:
   - Party funding received (PPF allocations)
   - Donations received (amounts, sources)
   - Fundraising events (harambees)
   - Campaign spending
   - Financial disclosures

3. FINANCIAL VIOLATIONS:
   - Exceeding spending limits
   - Illegal donations (foreign, anonymous, corporate)
   - Undeclared expenditures
   - Money laundering allegations
   - Tax evasion cases

4. PUBLIC RESOURCE MISUSE:
   - Use of government vehicles for campaigns
   - Use of state resources
   - Abuse of office for campaign advantage

5. VOTE BUYING:
   - Cash handouts to voters
   - Distribution of goods/food
   - Promises of jobs/contracts

IGNORE:
- General political news
- Policy statements
- Non-financial activities
- Personal life
- Unrelated controversies

For each incident, extract:
- headline: Clear, specific headline about the financial issue
- summary: Brief description with amounts if mentioned
- type: One of: corruption, bribery, donation-received, ppf-allocation, vote-buying, public-resource-misuse, illegal-donations
- date: Specific date (YYYY-MM-DD) or best estimate within ${dateRange}
- location: Kenya county/city
- amount: Exact KES amount as number (e.g., 5000000 for 5 million)
- confidence: verified (official records), reported (news), alleged (unconfirmed)

Return maximum 15 most significant incidents.
Return ONLY valid JSON array, no other text.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return []
    }

    const activities = JSON.parse(jsonMatch[0])

    // Convert to ActivityItem format
    return activities.map((activity: any) => ({
      source: 'Public Records',
      headline: activity.headline || '',
      summary: activity.summary || '',
      sourceUrl: `https://www.google.com/search?q=${encodeURIComponent(personName + ' ' + activity.headline + ' Kenya')}`,
      publishedAt: activity.date !== 'unknown' 
        ? new Date(activity.date) 
        : new Date(),
      type: activity.type || 'news',
      confidenceLevel: activity.confidence || 'reported',
      rawText: activity.headline + ' ' + activity.summary,
      location: activity.location || null,
      locationLat: null,
      locationLng: null,
      amountMentioned: activity.amount || null,
    }))
  } catch (error) {
    console.error('Gemini search error:', error)
    return []
  }
}

/**
 * Generate a detailed campaign finance report using Gemini
 */
export async function generateCampaignFinanceReport(
  personName: string,
  activities: ActivityItem[],
  dateRange?: { start: string; end: string }
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const dateRangeText = dateRange 
      ? `between ${dateRange.start} and ${dateRange.end}` 
      : 'from 2017 to present'

    const activitiesSummary = activities.map(a => ({
      type: a.type,
      headline: a.headline,
      summary: a.summary,
      date: a.publishedAt,
      amount: a.amountMentioned,
      location: a.location,
      confidence: a.confidenceLevel,
    }))

    const prompt = `
You are a campaign finance investigator writing a comprehensive report about Kenyan politician "${personName}".

Based on the following ${activities.length} campaign finance incidents found ${dateRangeText}, write a detailed investigative report.

DATA:
${JSON.stringify(activitiesSummary, null, 2)}

Write a professional investigative report with the following structure:

# CAMPAIGN FINANCE INTELLIGENCE REPORT
## Subject: ${personName}
## Period: ${dateRangeText}
## Report Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

---

### EXECUTIVE SUMMARY
Write a 2-3 paragraph overview of the key findings, highlighting the most significant financial issues, total amounts involved, and overall assessment of campaign finance compliance.

### KEY FINDINGS

#### 1. CORRUPTION & BRIBERY
Summarize all corruption and bribery allegations found. Include specific amounts, dates, and confidence levels. If none found, state "No corruption or bribery allegations found in this period."

#### 2. CAMPAIGN FUNDING
Detail all funding received including PPF allocations, donations, and fundraising events. Calculate total amounts where available. Identify any patterns or concerns.

#### 3. FINANCIAL VIOLATIONS
List all violations of campaign finance laws including spending limit breaches, illegal donations, and undeclared expenditures. Assess severity and legal implications.

#### 4. PUBLIC RESOURCE MISUSE
Document any instances of government resources being used for campaign purposes. Include specific examples and estimated values.

#### 5. VOTE BUYING INCIDENTS
Report on any vote buying activities including cash handouts, goods distribution, or promises of benefits. Include locations and amounts.

### FINANCIAL ANALYSIS
- Total documented amounts: [Calculate sum of all amounts mentioned]
- Number of financial transactions: [Count]
- Average transaction size: [Calculate]
- Largest single amount: [Identify]
- Geographic distribution: [List counties/locations]

### RISK ASSESSMENT
Rate the overall campaign finance compliance risk as: LOW / MEDIUM / HIGH / CRITICAL
Provide justification based on:
- Severity of violations
- Frequency of incidents
- Amounts involved
- Confidence level of evidence

### RECOMMENDATIONS
Provide 3-5 specific recommendations for:
- Further investigation areas
- Regulatory actions needed
- Transparency improvements
- Monitoring priorities

### DATA QUALITY NOTES
- Total incidents analyzed: ${activities.length}
- Verified incidents: [Count where confidence = 'verified']
- Reported incidents: [Count where confidence = 'reported']
- Alleged incidents: [Count where confidence = 'alleged']
- Date range coverage: ${dateRangeText}

### DISCLAIMER
This report is based on publicly available information and AI-assisted analysis. All allegations should be verified through official channels. This report is for informational purposes only and does not constitute legal advice or official findings.

---

**Report Generated by**: FedhaWatch Intelligence System
**Data Sources**: Public records, news media, social media, official documents
**Contact**: intelligence@fedhawatch.org

Write the report in clear, professional language. Use specific numbers and dates from the data. Be objective and factual. Format using Markdown.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Report generation error:', error)
    return `# CAMPAIGN FINANCE REPORT - ERROR

Unable to generate detailed report due to technical error.

## Basic Summary
- Subject: ${personName}
- Incidents Found: ${activities.length}
- Period: ${dateRange ? `${dateRange.start} to ${dateRange.end}` : 'All time'}

Please try again or contact support.
`
  }
}

/**
 * Use Gemini to enhance scraped data with better summaries and classifications
 */
export async function enhanceWithGemini(activities: ActivityItem[]): Promise<ActivityItem[]> {
  if (activities.length === 0) return activities

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `
Analyze these political activities and improve their summaries and classifications:

${JSON.stringify(activities.slice(0, 10).map(a => ({
  headline: a.headline,
  summary: a.summary,
  type: a.type,
})), null, 2)}

For each activity:
1. Improve the summary to be more concise and informative (max 300 chars)
2. Verify the type classification is correct
3. Extract any KES amounts mentioned
4. Identify Kenya locations mentioned

Return the same JSON structure with improved data.
Return ONLY valid JSON array, no other text.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return activities
    }

    const enhanced = JSON.parse(jsonMatch[0])

    // Merge enhanced data back
    return activities.map((activity, index) => {
      if (index < enhanced.length) {
        return {
          ...activity,
          summary: enhanced[index].summary || activity.summary,
          type: enhanced[index].type || activity.type,
        }
      }
      return activity
    })
  } catch (error) {
    console.error('Gemini enhancement error:', error)
    return activities
  }
}
