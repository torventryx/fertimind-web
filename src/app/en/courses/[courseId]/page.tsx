import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { getCourse } from '@/lib/content';
import EsCourse from '../../../(es)/cursos/[courseId]/page';

export const revalidate = 3600;

interface Props { params: { courseId: string } }

export async function generateStaticParams() {
  const { listCourses } = await import('@/lib/content');
  try {
    return (await listCourses()).map((c) => ({ courseId: c.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse(params.courseId);
  if (!course) return {};
  return pageMetadata({
    locale: 'en',
    path: `/cursos/${course.id}`,
    title: course.title,
    description: course.description.slice(0, 160),
  });
}

/** El contenido de los cursos está en español; la ficha se sirve igual con hreflang en. */
export default function CourseEn(props: Props) {
  return (
    <div lang="en">
      <EsCourse {...props} />
    </div>
  );
}
