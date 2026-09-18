import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import { listCourses } from '@/lib/content';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/cursos',
  title: 'Cursos de fertilidad con base científica',
  description:
    'Cursos claros sobre tu ciclo, la FIV paso a paso, la betaespera y el primer trimestre. Con referencias reales (ESHRE, ASRM, NICE, SEF). Empiezan gratis.',
});

export default async function CoursesPage() {
  const courses = await listCourses();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-plum">{t('courses_title', 'es')}</h1>
      <p className="mt-2 max-w-2xl text-ink/65">{t('courses_subtitle', 'es')}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <Link
            key={c.id}
            href={`/cursos/${c.id}`}
            className="overflow-hidden rounded-3xl border border-plum/10 bg-white transition hover:border-coral/40 hover:shadow-sm"
          >
            {c.thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.thumbnailUrl} alt={c.title} className="aspect-video w-full object-cover" width={800} height={450} />
            )}
            <div className="p-5">
              <h2 className="font-semibold text-plum">{c.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-ink/60">{c.description}</p>
              <p className="mt-3 text-xs text-ink/45">
                {c.modules.length} {t('courses_modules', 'es')} ·{' '}
                {c.modules.reduce((n, m) => n + m.lessons.length, 0)} {t('courses_lessons', 'es')}
                {c.modules.some((m) => m.isPremium) ? ' · ★ Premium' : ''}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
