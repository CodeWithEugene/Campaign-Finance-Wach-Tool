import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: 'Missing PAYSTACK_SECRET_KEY' }, { status: 500 });
    }
    const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    const event = JSON.parse(body) as {
      event: string;
      data?: { reference?: string; status?: string };
    };
    if (event.event === 'charge.success' && event.data?.reference) {
      await convex.mutation(api.contributions.updateFromWebhook, {
        paystackReference: event.data.reference,
        status: 'success',
      });
    } else if (
      (event.event === 'charge.failed' || event.event === 'charge.abandoned') &&
      event.data?.reference
    ) {
      await convex.mutation(api.contributions.updateFromWebhook, {
        paystackReference: event.data.reference,
        status: event.event === 'charge.failed' ? 'failed' : 'abandoned',
      });
    }
    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('Paystack webhook error:', e);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
