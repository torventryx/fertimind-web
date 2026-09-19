// POST /api/newsletter — alta de newsletter con doble opt-in.
// Guarda en newsletter_subscribers (Admin SDK, sin exponer rules) y envía
// el email de confirmación por Brevo. Idempotente por email.
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { db } from '@/lib/admin';
import { SITE } from '@/lib/i18n';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function sendConfirmationEmail(email: string, token: string, locale: string) {
  const key = process.env.BREVO_API_KEY;
  if (!key) return; // sin key: queda registrada, se sincronizará después
  const es = locale !== 'en';
  const confirmUrl = `${SITE.url}/api/newsletter/confirm?token=${token}`;
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: 'FertiMind', email: 'soporte@fertimind.es' },
      to: [{ email }],
      subject: es ? 'Confirma tu suscripción a FertiMind 🌸' : 'Confirm your FertiMind subscription 🌸',
      textContent: es
        ? `Hola:\n\nAlguien (esperemos que tú) ha suscrito este email a la newsletter de FertiMind.\nConfirma aquí: ${confirmUrl}\n\nSi no fuiste tú, ignora este email y no volveremos a escribir.\n\nEl equipo de FertiMind · fertimind.es`
        : `Hi there:\n\nSomeone (hopefully you) subscribed this email to the FertiMind newsletter.\nConfirm here: ${confirmUrl}\n\nIf it wasn't you, just ignore this email.\n\nThe FertiMind team · fertimind.es`,
    }),
  });
  if (!res.ok) console.error('brevo confirmation send failed', res.status);
}

export async function POST(req: NextRequest) {
  try {
    const { email, locale = 'es' } = (await req.json().catch(() => ({}))) as {
      email?: string;
      locale?: string;
    };
    const clean = String(email ?? '').trim().toLowerCase();
    if (!EMAIL_RE.test(clean) || clean.length > 254) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    }

    const existing = await db()
      .collection('newsletter_subscribers')
      .where('email', '==', clean)
      .limit(1)
      .get();

    if (!existing.empty) {
      const doc = existing.docs[0];
      const data = doc.data();
      if (data['confirmed'] === true && !data['unsubscribed_at']) {
        return NextResponse.json({ ok: true, status: 'already_subscribed' });
      }
      // re-suscripción o re-envío de confirmación
      const token = randomBytes(24).toString('hex');
      await doc.ref.set({ token, unsubscribed_at: null, locale }, { merge: true });
      await sendConfirmationEmail(clean, token, locale);
      return NextResponse.json({ ok: true, status: 'confirmation_resent' });
    }

    const token = randomBytes(24).toString('hex');
    await db().collection('newsletter_subscribers').add({
      email: clean,
      locale: locale === 'en' ? 'en' : 'es',
      confirmed: false,
      unsubscribed_at: null,
      token,
      source: 'web',
      created_at: new Date().toISOString(),
    });
    await sendConfirmationEmail(clean, token, locale);
    return NextResponse.json({ ok: true, status: 'confirmation_sent' });
  } catch (err) {
    console.error('newsletter subscribe error', (err as Error).message);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
