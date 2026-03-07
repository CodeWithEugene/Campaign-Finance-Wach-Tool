import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type ActivityCategory = 'rally' | 'financial' | 'news' | 'other';

export interface IntelligenceActivity {
  title: string;
  description: string;
  date: string;
  category: ActivityCategory;
  tags: string[];
  location: string;
  amount?: string;
  sourceUrl?: string;
}

const CAMPAIGN_PERIODS: Record<string, string> = {
  '2017': '2017 general election campaign period (roughly 2016–2017)',
  '2022': '2022 general election campaign period (roughly 2021–2022)',
  '2027': '2027 general election campaign period (from 2024 onwards)',
};

function buildPrompt(
  query: string,
  type: 'party' | 'politician',
  campaignPeriod: string
): string {
  const periodDesc = CAMPAIGN_PERIODS[campaignPeriod] ?? CAMPAIGN_PERIODS['2022'];
  const subject = type === 'party' ? 'political party' : 'politician';
  return `You are a researcher for a Kenyan campaign finance transparency tool. Return a JSON array of intelligence "activities" about the ${subject} "${query}" in Kenya, limited to the ${periodDesc}.

Focus ONLY on:
- Corruption allegations or investigations
- Party funding amounts (PPF, donations, harambee, unexplained wealth)
- Bribery or vote-buying allegations
- Misuse of public resources or state assets for campaigns
- Campaign spending and financial disclosures
- Other political news strictly within campaign finance / transparency scope

For each activity return a JSON object with exactly these fields (use null when unknown):
- title (string): short headline
- description (string): 2–3 sentence summary
- date (string): ISO date or "YYYY-MM-DD" if known, else approximate e.g. "2021-08-01"
- category (string): one of "rally", "financial", "news", "other"
- tags (array of strings): e.g. ["Public Records", "reported", "funding"]
- location (string): e.g. "Nairobi", "Various counties, Kenya"
- amount (string or null): if monetary e.g. "KSh 300.0M"
- sourceUrl (string or null): if you know a real public source URL

Return ONLY a valid JSON array of such objects, no markdown or extra text. Maximum 15 items.`;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Intelligence API not configured (missing GEMINI_API_KEY)' },
      { status: 503 }
    );
  }

  let body: { q?: string; type?: string; campaignPeriod?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const q = (body.q ?? '').trim();
  const type = (body.type === 'politician' ? 'politician' : 'party') as 'party' | 'politician';
  const rawPeriod = body.campaignPeriod ?? '2022';
  const campaignPeriod = ['2017', '2022', '2027'].includes(rawPeriod) ? rawPeriod : '2022';

  if (!q) {
    return NextResponse.json({ error: 'Missing or empty query "q"' }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192,
      },
    });

    const prompt = buildPrompt(q, type, campaignPeriod);
    const result = await model.generateContent(prompt);
    let text = result.response.text() ?? '';
    if (!text) {
      return NextResponse.json({ activities: [], message: 'No response from model' });
    }
    // Strip markdown code block if present
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) ?? [null, text];
    const jsonStr = (jsonMatch[1] ?? text).trim();
    const parsed = JSON.parse(jsonStr) as unknown;
    const activities: IntelligenceActivity[] = Array.isArray(parsed)
      ? parsed.filter(
          (item): item is IntelligenceActivity =>
            item &&
            typeof item === 'object' &&
            typeof (item as IntelligenceActivity).title === 'string' &&
            typeof (item as IntelligenceActivity).description === 'string'
        )
      : [];

    return NextResponse.json({ activities, query: q, type, campaignPeriod });
  } catch (err) {
    console.error('[intelligence] Gemini error:', err);
    return NextResponse.json(
      { error: 'Intelligence search failed', details: String(err) },
      { status: 500 }
    );
  }
}
