// GET/POST /api/thread — sirve el contenido de un hilo SOLO a usuarios
// autenticados. Es la puerta de las categorías sensibles (resultados,
// pérdidas, positivos…): ese contenido nunca se prerenderiza en HTML.
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { threadWithComments } from '@/lib/content';
import { admin } from '@/lib/admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
  try {
    const decoded = await getAuth(admin()).verifyIdToken(token);
    const { postId } = (await req.json()) as { postId?: string };
    if (!postId || typeof postId !== 'string') {
      return NextResponse.json({ error: 'bad_request' }, { status: 400 });
    }
    const data = await threadWithComments(postId);
    if (!data) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    // Cualquier usuaria autenticada puede leer (mismo estándar que la app:
    // community_posts read: if request.auth != null).
    return NextResponse.json({
      uid: decoded.uid,
      thread: {
        id: data.thread.id,
        categoryId: data.thread.categoryId,
        title: data.thread.title,
        content: data.thread.content,
        authorName: data.thread.authorName,
        authorUsername: data.thread.authorUsername,
        createdAt: data.thread.createdAt?.toISOString() ?? null,
        isPregnancyAnnouncement: data.thread.isPregnancyAnnouncement,
      },
      comments: data.comments.map((c) => ({
        id: c.id,
        content: c.content,
        authorName: c.authorName,
        authorUsername: c.authorUsername,
        createdAt: c.createdAt?.toISOString() ?? null,
      })),
    });
  } catch {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
}

// Señalización útil para depurar en producción.
export async function GET() {
  return NextResponse.json({ ok: true, hint: 'POST {postId} with Bearer ID token' });
}
