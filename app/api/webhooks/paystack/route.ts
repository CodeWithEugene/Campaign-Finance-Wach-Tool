import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export async function POST(request: NextRequest) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
  if (!convexUrl) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: 'Missing PAYSTACK_SECRET_KEY' }, { status: 500 });
    }

    // Verify HMAC signature before processing any data
    const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body) as {
      event: string;
      data?: { reference?: string; status?: string };
    };

    const convex = new ConvexHttpClient(convexUrl);

    if (event.event === 'charge.success' && event.data?.reference) {
      // Call the public Convex action which internally calls the internalMutation.
      // This keeps updateFromWebhook unreachable from browser clients.
      await convex.action(api.webhooks.processPaystackWebhook, {
        paystackReference: event.data.reference,
        status: 'success',
      });
    } else if (
      (event.event === 'charge.failed' || event.event === 'charge.abandoned') &&
      event.data?.reference
    ) {
      await convex.action(api.webhooks.processPaystackWebhook, {
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
