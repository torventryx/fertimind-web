// GET /api/newsletter/confirm?token=… — confirma la suscripción (doble
// opt-in) y sincroniza el contacto con la lista "Newsletter Web" de Brevo.
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/admin';
import { SITE } from '@/lib/i18n';

export const runtime = 'nodejs';

const BREVO_LIST_ID = 8; // "Newsletter Web (fertimind.es)"

async function syncToBrevo(email: string, locale: string) {
  const key = process.env.BREVO_API_KEY;
  if (!key) return;
  await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      email,
      attributes: { NEWSLETTER: true, IDIOMA: locale },
      listIds: [BREVO_LIST_ID],
      updateEnabled: true,
    }),
  }).catch(() => {});
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.redirect(`${SITE.url}/`, 302);
  try {
    const snap = await db()
      .collection('newsletter_subscribers')
      .where('token', '==', token)
      .limit(1)
      .get();
    if (snap.empty) {
      return NextResponse.redirect(`${SITE.url}/?newsletter=invalid`, 302);
    }
    const doc = snap.docs[0];
    const data = doc.data();
    if (!data['unsubscribed_at']) {
      await doc.ref.set({ confirmed: true, confirmed_at: new Date().toISOString() }, { merge: true });
      await syncToBrevo(data['email'], data['locale'] || 'es');
    }
    const locale = data['locale'] === 'en' ? 'en' : 'es';
    return NextResponse.redirect(
      `${SITE.url}${locale === 'en' ? '/en' : ''}/?newsletter=ok#newsletter`,
      302,
    );
  } catch (err) {
    console.error('newsletter confirm error', (err as Error).message);
    return NextResponse.redirect(`${SITE.url}/?newsletter=error`, 302);
  }
}
