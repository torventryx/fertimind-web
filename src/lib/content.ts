// Capa de contenido: foros, cursos y cuentas.
//
// Decisión de arquitectura: TODAS las consultas usan solo filtros de
// igualdad (zigzag merge sobre índices de campo único, sin índices
// compuestos extra) y el ordenado se hace en memoria. El volumen es
// pequeño (≈150 hilos humanos vivos, ≈650 comentarios humanos) y así la
// web no obliga a mantener índices adicionales en producción.

import { db } from './admin';
import { forumCategories } from '@/data/taxonomy';

export interface ThreadSummary {
  id: string;
  categoryId: string;
  title: string;
  excerpt: string;
  authorName: string;
  authorUsername: string | null;
  createdAt: Date | null;
  commentCount: number;
  isPregnancyAnnouncement: boolean;
  isWeeklyThread: boolean;
}

export interface CommentSummary {
  id: string;
  content: string;
  authorName: string;
  authorUsername: string | null;
  createdAt: Date | null;
  originalLanguage: string | null;
  translations: Record<string, { text: string }> | null;
}

export interface ThreadDetail extends ThreadSummary {
  content: string;
  originalLanguage: string | null;
  translations: Record<string, { text: string }> | null;
}

const POSTS = 'community_posts';

function postDate(v: unknown): Date | null {
  if (v instanceof Date) return v;
  if (typeof v === 'string') {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function titleOf(data: Record<string, unknown>): string {
  const t = (data['title'] as string | undefined)?.trim();
  if (t && t.length > 1) return t;
  const text = (data['content_text'] as string | undefined) || '';
  const firstLine = text.split('\n').map((l) => l.trim()).find((l) => l.length > 0) || '';
  return firstLine.length > 90 ? `${firstLine.slice(0, 87)}…` : firstLine || '(sin título)';
}

function excerptOf(data: Record<string, unknown>): string {
  const text = (data['content_text'] as string | undefined) || '';
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > 180 ? `${flat.slice(0, 177)}…` : flat;
}

/**
 * Nombre PÚBLICO de una autora: si no hay @username se muestra solo el
 * primer nombre — nunca los apellidos (privacidad de la comunidad).
 * author_name completo se guarda en Firestore, aquí se recorta al mostrar.
 */
function publicAuthorName(name: unknown, username: unknown): string {
  const first = String(name ?? '').trim().split(/\s+/)[0];
  return first || 'Usuaria';
}

function summaryFrom(id: string, data: Record<string, unknown>): ThreadSummary {
  return {
    id,
    categoryId: (data['category_id'] as string) || 'general',
    title: titleOf(data),
    excerpt: excerptOf(data),
    authorName: publicAuthorName(data['author_name'], data['author_username']),
    authorUsername: (data['author_username'] as string) || null,
    createdAt: postDate(data['created_at']),
    commentCount: Number(data['comment_count'] ?? 0),
    isPregnancyAnnouncement: data['is_pregnancy_announcement'] === true,
    isWeeklyThread: data['is_weekly_thread'] === true,
  };
}

/** Hilos originales vivos y humanos de una categoría (orden: más recientes). */
export async function threadsByCategory(categoryId: string, limit = 40): Promise<ThreadSummary[]> {
  const snap = await db().collection(POSTS)
    .where('category_id', '==', categoryId)
    .where('parent_post_id', '==', null)
    .where('is_archive', '==', false)
    .where('is_deleted', '==', false)
    .get();
  const threads = snap.docs.map((d) => summaryFrom(d.id, d.data()));
  threads.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  return threads.slice(0, limit);
}

/** Hilos más recientes de todo el foro (portada). Excluye categorías
 *  sensibles: sus extractos no deben aparecer en páginas públicas. */
export async function recentThreads(limit = 8): Promise<ThreadSummary[]> {
  const snap = await db().collection(POSTS)
    .where('parent_post_id', '==', null)
    .where('is_archive', '==', false)
    .where('is_deleted', '==', false)
    .get();
  const threads = snap.docs
    .map((d) => summaryFrom(d.id, d.data()))
    .filter((t) => forumCategories.some((c) => c.id === t.categoryId && !c.sensitive));
  threads.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  return threads.slice(0, limit);
}

/** Hilo concreto + sus respuestas humanas. null si no existe, es archivo o está borrado. */
export async function threadWithComments(
  postId: string,
): Promise<{ thread: ThreadDetail; comments: CommentSummary[] } | null> {
  const doc = await db().collection(POSTS).doc(postId).get();
  if (!doc.exists) return null;
  const data = doc.data()!;
  if (data['is_archive'] === true || data['is_deleted'] === true) return null;
  if (data['parent_post_id'] != null) return null; // es un comentario, no un hilo

  const thread: ThreadDetail = {
    ...summaryFrom(doc.id, data),
    content: (data['content_text'] as string) || '',
    originalLanguage: (data['original_language'] as string) || null,
    translations: (data['translations'] as Record<string, { text: string }> | undefined) || null,
  };

  const commentsSnap = await db().collection(POSTS)
    .where('parent_post_id', '==', postId)
    .where('is_archive', '==', false)
    .where('is_deleted', '==', false)
    .get();
  const comments: CommentSummary[] = commentsSnap.docs.map((d) => {
    const c = d.data();
    return {
      id: d.id,
      content: (c['content_text'] as string) || '',
      authorName: publicAuthorName(c['author_name'], c['author_username']),
      authorUsername: (c['author_username'] as string) || null,
      createdAt: postDate(c['created_at']),
      originalLanguage: (c['original_language'] as string) || null,
      translations: (c['translations'] as Record<string, { text: string }> | undefined) || null,
    };
  });
  comments.sort((a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0));

  return { thread, comments };
}

/** Texto de un post en el locale solicitado si existe traducción almacenada. */
export function localizedText(
  text: string,
  translations: Record<string, { text: string }> | null | undefined,
  locale: string,
): { text: string; translated: boolean } {
  const translated = translations?.[locale]?.text;
  if (translated && translated.trim()) return { text: translated, translated: true };
  return { text, translated: false };
}

// ── Cursos ────────────────────────────────────────────────────────────────

export interface LessonRef {
  id: string;
  moduleId: string;
  moduleTitle: string;
  moduleIsPremium: boolean;
  title: string;
  isPremium: boolean;
  order: number;
  durationMinutes: number;
}

export interface CourseDetail {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  level: string | null;
  category: string | null;
  instructorName: string | null;
  modules: {
    id: string;
    title: string;
    description: string;
    isPremium: boolean;
    order: number;
    lessons: LessonRef[];
  }[];
}

export async function listCourses(): Promise<CourseDetail[]> {
  const coursesSnap = await db().collection('courses').get();
  const courses: CourseDetail[] = [];
  for (const courseDoc of coursesSnap.docs) {
    const c = courseDoc.data();
    const modulesSnap = await courseDoc.ref.collection('modules').get();
    const modules: CourseDetail['modules'] = [];
    for (const modDoc of modulesSnap.docs) {
      const m = modDoc.data();
      const lessonsSnap = await modDoc.ref.collection('lessons').get();
      const lessons: LessonRef[] = lessonsSnap.docs.map((l) => ({
        id: l.id,
        moduleId: modDoc.id,
        moduleTitle: m['title'] || '',
        moduleIsPremium: m['is_premium'] === true,
        title: (l.data()['title'] as string) || 'Lección',
        isPremium: l.data()['is_premium'] === true,
        order: Number(l.data()['order'] ?? 0),
        durationMinutes: Number(l.data()['duration_minutes'] ?? 0),
      }));
      lessons.sort((a, b) => a.order - b.order);
      modules.push({
        id: modDoc.id,
        title: (m['title'] as string) || 'Módulo',
        description: (m['description'] as string) || '',
        isPremium: m['is_premium'] === true,
        order: Number(m['order'] ?? 0),
        lessons,
      });
    }
    modules.sort((a, b) => a.order - b.order);
    courses.push({
      id: courseDoc.id,
      title: (c['title'] as string) || courseDoc.id,
      description: (c['description'] as string) || '',
      thumbnailUrl: (c['thumbnail_url'] as string) || null,
      level: (c['level'] as string) || null,
      category: (c['category'] as string) || null,
      instructorName: (c['instructor_name'] as string) || null,
      modules,
    });
  }
  return courses;
}

export async function getCourse(courseId: string): Promise<CourseDetail | null> {
  const all = await listCourses();
  return all.find((c) => c.id === courseId) ?? null;
}

export interface LessonDetail extends LessonRef {
  courseId: string;
  courseTitle: string;
  content: string | null;
}

/** Devuelve la lección SIN contenido si es premium (el contenido premium se
 *  sirve solo tras verificar el pago, vía función getLessonContent). */
export async function getLesson(courseId: string, lessonId: string): Promise<LessonDetail | null> {
  const course = await getCourse(courseId);
  if (!course) return null;
  for (const mod of course.modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (!lesson) continue;
    const doc = await db()
      .collection('courses').doc(courseId)
      .collection('modules').doc(mod.id)
      .collection('lessons').doc(lessonId)
      .get();
    const data = doc.data();
    return {
      ...lesson,
      courseId,
      courseTitle: course.title,
      content: lesson.isPremium ? null : ((data?.['article_content'] as string) || null),
    };
  }
  return null;
}

/** Todos los ids de hilos humanos vivos (para el sitemap). */
export async function allPublicThreadIds(): Promise<{ id: string; categoryId: string; createdAt: Date | null; isPregnancyAnnouncement: boolean }[]> {
  const snap = await db().collection(POSTS)
    .where('parent_post_id', '==', null)
    .where('is_archive', '==', false)
    .where('is_deleted', '==', false)
    .get();
  return snap.docs.map((d) => ({
    id: d.id,
    categoryId: (d.data()['category_id'] as string) || 'general',
    createdAt: postDate(d.data()['created_at']),
    isPregnancyAnnouncement: d.data()['is_pregnancy_announcement'] === true,
  }));
}

/** Busca hilos humanos que mencionan un texto (para cruzar clínica ↔ comunidad). */
export async function threadsMentioning(text: string, limit = 5): Promise<ThreadSummary[]> {
  const needle = text.toLowerCase().split(' ')[0]?.slice(0, 20);
  if (!needle) return [];
  const snap = await db().collection(POSTS)
    .where('parent_post_id', '==', null)
    .where('is_archive', '==', false)
    .where('is_deleted', '==', false)
    .get();
  const threads = snap.docs
    .map((d) => ({ raw: d.data(), s: summaryFrom(d.id, d.data()) }))
    .filter(({ raw }) => {
      const haystack = `${raw['title'] ?? ''} ${raw['content_text'] ?? ''}`.toLowerCase();
      return haystack.includes(needle);
    })
    .map(({ s }) => s);
  threads.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  return threads.slice(0, limit);
}

/** Conversaciones vivas por categoría (para los contadores del foro). */
export async function getCategoryThreadCounts(): Promise<Record<string, number>> {
  const snap = await db().collection(POSTS)
    .where('parent_post_id', '==', null)
    .where('is_archive', '==', false)
    .where('is_deleted', '==', false)
    .get();
  const counts: Record<string, number> = {};
  snap.docs.forEach((d) => {
    const cat = (d.data()['category_id'] as string) || 'general';
    counts[cat] = (counts[cat] ?? 0) + 1;
  });
  return counts;
}
