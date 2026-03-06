import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const sessionId = formData.get('sessionId') as string;
    const serviceCode = formData.get('serviceCode') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
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
        const reportId = 'RPT-' + Date.now();
        response = `END Thank you. Report ID: ${reportId}. We will review it.`;
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
