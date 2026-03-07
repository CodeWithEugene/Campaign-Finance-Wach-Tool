import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, partyId, partyName, email, locale } = body as {
      amount: number;
      partyId: string;
      partyName: string;
      email?: string;
      locale?: string;
    };
    const loc = locale || 'en';
    if (!amount || amount < 100 || !partyId || !partyName) {
      return NextResponse.json(
        { error: 'Missing or invalid amount, partyId, or partyName' },
        { status: 400 }
      );
    }
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 });
    }
    const reference = `mchango-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const contributionId = await convex.mutation(api.contributions.create, {
      amount,
      partyId,
      partyName,
      paystackReference: reference,
      email: email || undefined,
    });
    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email || 'donor@campaignwatch.ke',
        amount: amount * 100,
        reference,
        callback_url: `${process.env.NEXTAUTH_URL || request.nextUrl.origin}/api/mchango/callback?reference=${reference}&party=${encodeURIComponent(partyId)}&amount=${amount}&locale=${loc}`,
        metadata: {
          contributionId: contributionId,
          partyId,
          partyName,
        },
      }),
    });
    const data = (await res.json()) as { status?: boolean; data?: { authorization_url: string }; message?: string };
    if (!data.status || !data.data?.authorization_url) {
      return NextResponse.json(
        { error: data.message || 'Paystack init failed' },
        { status: 400 }
      );
    }
    return NextResponse.json({
      authorizationUrl: data.data.authorization_url,
      reference,
    });
  } catch (e) {
    console.error('Mchango init error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
