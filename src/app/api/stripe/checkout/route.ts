import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import Stripe from 'stripe';
import { db } from '@/lib/admin';
import { SITE } from '@/lib/i18n';

export const runtime = 'nodejs';

const AMOUNT_CENTS = 799;
const CURRENCY = 'eur';

/**
 * Crea una sesión de Stripe Checkout (pago único 7,99 €).
 * Requiere autenticación Firebase. Si STRIPE_SECRET_KEY no está
 * configurada responde 503 sin fingir éxito.
 */
export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 });
  }
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
    const decoded = await getAuth().verifyIdToken(token);

    const { locale = 'es' } = await req.json().catch(() => ({}) as { locale?: string });
    const stripe = new Stripe(key);
    const userSnap = await db().collection('users').doc(decoded.uid).get();
    const email = userSnap.exists ? (userSnap.data()?.email as string | undefined) : undefined;

    const lineItem = process.env.STRIPE_PRICE_ID
      ? { price: process.env.STRIPE_PRICE_ID, quantity: 1 }
      : {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            unit_amount: AMOUNT_CENTS,
            product_data: {
              name: 'FertiMind Premium — pago único',
              description:
                'Todos los módulos premium de los cursos, para siempre. Web + app.',
            },
          },
        };

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [lineItem],
      locale: locale === 'en' ? 'en' : 'es',
      ...(email ? { customer_email: email } : {}),
      client_reference_id: decoded.uid,
      metadata: { uid: decoded.uid, source: 'web' },
      success_url: `${SITE.url}${locale === 'en' ? '/en/thanks' : '/gracias'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE.url}${locale === 'en' ? '/en/courses' : '/cursos'}`,
    });

    await db()
      .collection('users')
      .doc(decoded.uid)
      .set(
        {
          stripe_checkout_session: session.id,
          stripe_checkout_created_at: new Date().toISOString(),
        },
        { merge: true },
      );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('stripe checkout error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
