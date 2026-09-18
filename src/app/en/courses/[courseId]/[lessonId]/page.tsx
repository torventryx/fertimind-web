import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { getLesson } from '@/lib/content';
import EsLesson from '../../../../(es)/cursos/[courseId]/[lessonId]/page';

export const revalidate = 3600;

interface Props { params: { courseId: string; lessonId: string } }

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
    locale: 'en',
    path: `/cursos/${lesson.courseId}/${lesson.id}`,
    title: `${lesson.title} — ${lesson.courseTitle}`,
    description: lesson.isPremium
      ? `Premium lesson of the FertiMind course ${lesson.courseTitle}.`
      : `Lesson from ${lesson.courseTitle}: a clear guide with real scientific references (in Spanish).`,
  });
}

export default function LessonEn(props: Props) {
  return (
    <div lang="en">
      <EsLesson {...props} />
    </div>
  );
}
