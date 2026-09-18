import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import Stripe from 'stripe';
import { db, admin } from '@/lib/admin';
import { SITE } from '@/lib/i18n';

export const runtime = 'nodejs';

const MIN_CENTS = 100; // 1 €
const MAX_CENTS = 20000; // 200 €

/**
 * Apoyo económico (pago único, cantidad libre): crea una sesión de
 * Checkout tipo donación. NO concede paid_access — el webhook marca a la
 * usuaria como `supporter`. Monto validado server-side (1–200 €).
 */
export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 });
  }
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
    const decoded = await getAuth(admin()).verifyIdToken(token);

    const { amountCents, locale = 'es' } = (await req.json().catch(() => ({}))) as {
      amountCents?: number;
      locale?: string;
    };
    const cents = Math.round(Number(amountCents));
    if (!Number.isInteger(cents) || cents < MIN_CENTS || cents > MAX_CENTS) {
      return NextResponse.json({ error: 'invalid_amount' }, { status: 400 });
    }

    const stripe = new Stripe(key);
    const userSnap = await db().collection('users').doc(decoded.uid).get();
    const email = userSnap.exists ? (userSnap.data()?.email as string | undefined) : undefined;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: cents,
            product_data: {
              name: 'Apoyo a FertiMind',
              description:
                'Ayudas a mantener una comunidad libre, sin anuncios, para quien atraviesa la fertilidad.',
            },
          },
        },
      ],
      locale: locale === 'en' ? 'en' : 'es',
      submit_type: 'donate',
      ...(email ? { customer_email: email } : {}),
      client_reference_id: decoded.uid,
      metadata: { uid: decoded.uid, type: 'donation', source: 'web' },
      success_url: `${SITE.url}${locale === 'en' ? '/en/thanks?type=support&session_id={CHECKOUT_SESSION_ID}' : '/gracias?type=apoyo&session_id={CHECKOUT_SESSION_ID}'}`,
      cancel_url: `${SITE.url}${locale === 'en' ? '/en/support' : '/apoyar'}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('stripe donate error', (err as Error).message);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
