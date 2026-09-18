import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/admin';

export const runtime = 'nodejs';

/**
 * Verificación del pago tras el retorno de Stripe (gracias?session_id=…).
 * Recupera la sesión y, si está pagada, concede paid_access al uid
 * referenciado. Complementa al webhook (si el usuario cierra la pestaña
 * antes del redirect, el webhook ya habrá concedido el acceso).
 */
export async function GET(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 });
  }
  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) return NextResponse.json({ error: 'missing session_id' }, { status: 400 });

  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const uid = session.client_reference_id || session.metadata?.uid;
    if (session.payment_status === 'paid' && uid) {
      await db()
        .collection('users')
        .doc(uid)
        .set(
          {
            paid_access: true,
            paid_access_source: 'stripe',
            paid_access_updated_at: new Date().toISOString(),
          },
          { merge: true },
        );
      return NextResponse.json({ paid: true });
    }
    return NextResponse.json({ paid: false });
  } catch (err) {
    console.error('stripe verify error', (err as Error).message);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
