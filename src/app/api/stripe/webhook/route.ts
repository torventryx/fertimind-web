import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/admin';

export const runtime = 'nodejs';

/**
 * Webhook de Stripe: concede paid_access al completarse el checkout.
 * Configurar en Stripe → Webhooks → endpoint:
 *   https://fertimind.es/api/stripe/webhook
 * evento: checkout.session.completed, con STRIPE_WEBHOOK_SECRET en el server.
 */
export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !secret) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 });
  }
  const stripe = new Stripe(key);
  const signature = req.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'missing signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error('stripe webhook verification failed', (err as Error).message);
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const uid = session.client_reference_id || session.metadata?.uid;
    if (uid && session.payment_status === 'paid') {
      if (session.metadata?.type === 'donation') {
        // Apoyo económico: marca supporter, NUNCA paid_access.
        await db()
          .collection('users')
          .doc(uid)
          .set(
            {
              supporter: true,
              supporter_since: new Date().toISOString(),
              stripe_customer_id: session.customer || null,
            },
            { merge: true },
          );
      } else {
        await db()
          .collection('users')
          .doc(uid)
          .set(
            {
              paid_access: true,
              paid_access_source: 'stripe',
              paid_access_updated_at: new Date().toISOString(),
              stripe_customer_id: session.customer || null,
            },
            { merge: true },
          );
      }
    }
  }

  return NextResponse.json({ received: true });
}
