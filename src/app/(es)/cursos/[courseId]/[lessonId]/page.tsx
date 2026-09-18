import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { SITE, t } from '@/lib/i18n';
import { getLesson } from '@/lib/content';
import MarkdownLite from '@/components/MarkdownLite';
import PremiumLessonContent from '@/components/PremiumLessonContent';
import JsonLd from '@/components/JsonLd';

export const revalidate = 3600;

interface Props {
  params: { courseId: string; lessonId: string };
}

export async function generateStaticParams() {
  const { listCourses } = await import('@/lib/content');
  try {
    const courses = await listCourses();
    return courses.flatMap((c) =>
      c.modules.flatMap((m) => m.lessons.map((l) => ({ courseId: c.id, lessonId: l.id }))),
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lesson = await getLesson(params.courseId, params.lessonId);
  if (!lesson) return {};
  return pageMetadata({
    locale: 'es',
    path: `/cursos/${lesson.courseId}/${lesson.id}`,
    title: `${lesson.title} — ${lesson.courseTitle}`,
    description: lesson.isPremium
      ? `Lección premium del curso ${lesson.courseTitle} de FertiMind.`
      : `Lección del curso ${lesson.courseTitle}: guía clara con referencias científicas reales.`,
  });
}

export default async function LessonPage({ params }: Props) {
  const lesson = await getLesson(params.courseId, params.lessonId);
  if (!lesson) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'FertiMind', url: SITE.url },
          { name: 'Cursos', url: `${SITE.url}/cursos` },
          { name: lesson.courseTitle, url: `${SITE.url}/cursos/${lesson.courseId}` },
          { name: lesson.title, url: `${SITE.url}/cursos/${lesson.courseId}/${lesson.id}` },
        ])}
      />
      <Link
        href={`/cursos/${lesson.courseId}`}
        className="text-sm text-ink/50 hover:text-coralAction"
      >
        ← {lesson.courseTitle}
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink/50">
        <span className="rounded-full bg-lilacSoft px-2.5 py-0.5 font-medium text-plum/70">
          {lesson.moduleTitle}
        </span>
        <span>
          {lesson.durationMinutes} {t('courses_minutes', 'es')}
        </span>
        {lesson.isPremium && (
          <span className="rounded-full bg-goldSoft px-2.5 py-0.5 font-semibold text-gold">
            ★ {t('courses_premium', 'es')}
          </span>
        )}
      </div>

      <h1 className="mt-3 text-3xl font-bold leading-tight text-plum">{lesson.title}</h1>

      <div className="mt-8">
        {lesson.isPremium ? (
          <PremiumLessonContent locale="es" courseId={lesson.courseId} lessonId={lesson.id} />
        ) : (
          lesson.content && <MarkdownLite content={lesson.content} />
        )}
      </div>
    </div>
  );
}
