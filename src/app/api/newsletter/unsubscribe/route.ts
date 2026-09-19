// GET /api/newsletter/unsubscribe?token=… — baja con un clic (RGPD).
// Marca el documento y saca el contacto de la lista de Brevo.
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/admin';
import { SITE } from '@/lib/i18n';

export const runtime = 'nodejs';

const BREVO_LIST_ID = 8;

async function removeFromBrevo(email: string) {
  const key = process.env.BREVO_API_KEY;
  if (!key) return;
  await fetch(
    `https://api.brevo.com/v3/contacts/lists/${BREVO_LIST_ID}/contacts/remove`,
    {
      method: 'POST',
      headers: { 'api-key': key, 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ emails: [email] }),
    },
  ).catch(() => {});
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
    if (!snap.empty) {
      const doc = snap.docs[0];
      const data = doc.data();
      await doc.ref.set(
        { unsubscribed_at: new Date().toISOString(), confirmed: false },
        { merge: true },
      );
      if (data['email']) await removeFromBrevo(data['email']);
    }
    return NextResponse.redirect(`${SITE.url}/?newsletter=removed#newsletter`, 302);
  } catch (err) {
    console.error('newsletter unsubscribe error', (err as Error).message);
    return NextResponse.redirect(`${SITE.url}/?newsletter=error`, 302);
  }
}
