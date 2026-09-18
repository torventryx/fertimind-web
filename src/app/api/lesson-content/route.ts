import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { db } from '@/lib/admin';

export const runtime = 'nodejs';

/**
 * Entrega el contenido premium de una lección tras verificar:
 * 1) Firebase ID token del llamador
 * 2) users/{uid}.paid_access === true (fuente única de entitlement)
 * El markdown premium nunca viaja en el HTML inicial.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

    const decoded = await getAuth().verifyIdToken(token);
    const { courseId, lessonId } = await req.json();
    if (typeof courseId !== 'string' || typeof lessonId !== 'string') {
      return NextResponse.json({ error: 'invalid-argument' }, { status: 400 });
    }

    const modules = await db().collection('courses').doc(courseId).collection('modules').get();
    for (const mod of modules.docs) {
      const lessonSnap = await mod.ref.collection('lessons').doc(lessonId).get();
      if (!lessonSnap.exists) continue;
      const lesson = lessonSnap.data()!;
      if (lesson.is_premium === true) {
        const userSnap = await db().collection('users').doc(decoded.uid).get();
        if (!(userSnap.exists && userSnap.data()?.paid_access === true)) {
          return NextResponse.json({ content: null, reason: 'payment_required' });
        }
      }
      return NextResponse.json({ content: lesson.article_content || null });
    }
    return NextResponse.json({ error: 'not-found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
