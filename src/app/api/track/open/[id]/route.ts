// GET /api/track/open/[id] — píxel de apertura 1x1 para campañas de email.
// Registra el evento en Firestore y devuelve un GIF transparente.
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/admin';

export const runtime = 'nodejs';

const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64',
);

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const rid = params.id ?? '';
  // Solo ids que generamos nosotros (hex, 12 chars).
  if (/^[a-f0-9]{8,16}$/.test(rid)) {
    try {
      await db()
        .collection('email_campaign_events')
        .add({
          campaign: 'v2_0_announcement',
          type: 'open',
          rid,
          ts: new Date(),
        });
    } catch {
      // El píxel debe devolverse siempre, aunque falle el registro.
    }
  }
  return new NextResponse(new Uint8Array(PIXEL), {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
