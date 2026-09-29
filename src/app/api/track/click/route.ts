// GET /api/track/click?r=<rid>&to=<url> — registra el clic de una campaña
// de email y redirige al destino. Solo acepta destinos de la allowlist
// para evitar redirects abiertos.
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/admin';
import { SITE } from '@/lib/i18n';

export const runtime = 'nodejs';

const ALLOWED_PREFIXES = [
  'https://fertimind.es',
  'https://play.google.com',
  'https://apps.apple.com',
];

export async function GET(req: NextRequest) {
  const rid = req.nextUrl.searchParams.get('r') ?? '';
  const to = req.nextUrl.searchParams.get('to') ?? '';
  const safe = ALLOWED_PREFIXES.some((p) => to.startsWith(p))
    ? to
    : `${SITE.url}/`;

  if (/^[a-f0-9]{8,16}$/.test(rid)) {
    try {
      await db()
        .collection('email_campaign_events')
        .add({
          campaign: 'v2_0_announcement',
          type: 'click',
          rid,
          to: safe,
          ts: new Date(),
        });
    } catch {
      // Redirigir igualmente aunque falle el registro.
    }
  }
  return NextResponse.redirect(safe, 302);
}
