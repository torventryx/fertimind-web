import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import { listCourses } from '@/lib/content';
import CoursesTabs from '@/components/CoursesTabs';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/cursos',
  title: 'Cursos de fertilidad y embarazo con base científica',
  description:
    'Cursos claros sobre tu ciclo, la FIV, la ovodonación, la endometriosis, el parto, el posparto y la lactancia. Con referencias reales (ESHRE, ASRM, NICE, SEF). Empiezan gratis.',
});

export default async function CoursesPage() {
  const courses = await listCourses();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-plum">{t('courses_title', 'es')}</h1>
      <p className="mt-2 max-w-2xl text-ink/65">{t('courses_subtitle', 'es')}</p>
      <CoursesTabs
        locale="es"
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
