import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const categoryMap: Record<string, 'vote-buying' | 'illegal-donations' | 'misuse-public-resources' | 'undeclared-spending' | 'bribery' | 'other'> = {
  '1': 'vote-buying',
  '2': 'illegal-donations',
  '3': 'misuse-public-resources',
  '4': 'undeclared-spending',
  '5': 'bribery',
  '6': 'other',
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const text = (formData.get('text') as string) || '';
    const parts = text.split('*').filter(Boolean);

    let response: string;

    if (parts.length === 0) {
      response = 'CON Welcome to Campaign Finance Watch\n1. English\n2. Kiswahili';
    } else if (parts.length === 1) {
      const lang = parts[0];
      if (lang === '1' || lang === '2') {
        response =
          'CON Select category:\n1. Vote buying\n2. Illegal donations\n3. Misuse of public resources\n4. Undeclared spending\n5. Bribery\n6. Other';
      } else {
        response = 'CON Invalid. Select 1 or 2';
      }
    } else if (parts.length === 2) {
      const category = parts[1];
      if (['1', '2', '3', '4', '5', '6'].includes(category)) {
        response = 'CON Enter brief description (max 160 chars):';
      } else {
        response = 'CON Invalid category. Select 1-6';
      }
    } else if (parts.length === 3) {
      response = 'CON Enter county or town:';
    } else if (parts.length === 4) {
      response = 'CON Confirm? 1 Yes, 2 No';
    } else if (parts.length === 5) {
      const confirm = parts[4];
      if (confirm === '1') {
        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
        if (!convexUrl) {
          response = 'END Service unavailable. Please try again later.';
        } else {
          const convex = new ConvexHttpClient(convexUrl);
          const categoryKey = parts[1];
          const description = (parts[2] || '').slice(0, 500);
          const location = (parts[3] || '').slice(0, 200);
          const category = categoryMap[categoryKey] || 'other';
          const title = description.slice(0, 80) || 'USSD Report';
          try {
            const reportId = await convex.mutation(api.reports.create, {
              title,
              description: description || 'No description provided.',
              category,
              location: location || 'Not specified',
              county: location || undefined,
              anonymous: true,
              source: 'ussd',
            });
            response = `END Thank you. Report ID: ${reportId}. We will review it.`;
          } catch (e) {
            console.error('USSD Convex create error:', e);
            response = 'END Sorry, we could not save your report. Please try again later.';
          }
        }
      } else {
        response = 'END Report cancelled.';
      }
    } else {
      response = 'END Session expired. Please dial again.';
    }

    return new NextResponse(response, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('USSD error:', error);
    return new NextResponse('END An error occurred. Please try again.', {
      headers: { 'Content-Type': 'text/plain' },
      status: 500,
    });
  }
}
