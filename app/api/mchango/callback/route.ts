import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get('reference');
  const party = searchParams.get('party');
  const amount = searchParams.get('amount');
  const locale = searchParams.get('locale') || 'en';
  const base = request.nextUrl.origin;
  const successUrl = `${base}/${locale}/mchango/success?reference=${reference || ''}&party=${party || ''}&amount=${amount || ''}`;
  return NextResponse.redirect(successUrl);
}
