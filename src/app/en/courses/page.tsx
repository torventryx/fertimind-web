import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { listCourses } from '@/lib/content';
import CoursesTabs from '@/components/CoursesTabs';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/cursos',
  title: 'Fertility & pregnancy courses (in Spanish)',
  description:
    'Science-based courses: your cycle, IVF, egg donation, endometriosis, birth, postpartum and breastfeeding. Free modules for everyone.',
});

export default async function CoursesEn() {
  const courses = await listCourses();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10" lang="en">
      <h1 className="text-3xl font-bold text-plum">Science-based courses</h1>
      <p className="mt-2 max-w-2xl text-ink/65">
        Written with real references (ESHRE, ASRM, NICE, SEF, WHO). Course content is in Spanish;
        free modules are open to everyone.
      </p>
      <CoursesTabs
        locale="en"
        courses={courses.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          thumbnailUrl: c.thumbnailUrl,
          level: c.level,
          category: c.category,
          track: c.track,
          moduleCount: c.modules.length,
          lessonCount: c.modules.reduce((n, m) => n + m.lessons.length, 0),
          hasPremium: c.modules.some((m) => m.isPremium),
        }))}
      />
    </div>
  );
}
