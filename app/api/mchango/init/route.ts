import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export async function POST(request: NextRequest) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
  if (!convexUrl) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const publicKey = process.env.PAYSTACK_PUBLIC_KEY;
  if (!publicKey) {
    return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 });
  }

  try {
    const convex = new ConvexHttpClient(convexUrl);
    const body = await request.json();
    const { amount, partyId, partyName, email } = body as {
      amount: number;
      partyId: string;
      partyName: string;
      email?: string;
    };

    if (!amount || amount < 100 || !partyId || !partyName) {
      return NextResponse.json(
        { error: 'Missing or invalid amount, partyId, or partyName' },
        { status: 400 }
      );
    }

    // Generate a unique reference and record the pending contribution in Convex.
    // The Paystack Inline popup in the browser will use the public key + reference
    // to process the payment — no server-side Paystack session needed.
    const reference = `mchango-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    await convex.mutation(api.contributions.create, {
      amount,
      partyId,
      partyName,
      paystackReference: reference,
      email: email || undefined,
    });

    // Return public key and reference to the client for use with PaystackPop.
    // Never return the secret key here.
    return NextResponse.json({ reference, publicKey });
  } catch (e) {
    console.error('Mchango init error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
