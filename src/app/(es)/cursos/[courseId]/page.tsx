import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pageMetadata, breadcrumbJsonLd, courseJsonLd } from '@/lib/seo';
import { SITE, t } from '@/lib/i18n';
import { getCourse } from '@/lib/content';
import JsonLd from '@/components/JsonLd';

export const revalidate = 3600;

interface Props {
  params: { courseId: string };
}

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
    locale: 'es',
    path: `/cursos/${course.id}`,
    title: course.title,
    description: course.description.slice(0, 160),
  });
}

export default async function CourseDetailPage({ params }: Props) {
  const course = await getCourse(params.courseId);
  if (!course) notFound();
  const url = `${SITE.url}/cursos/${course.id}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'FertiMind', url: SITE.url },
            { name: 'Cursos', url: `${SITE.url}/cursos` },
            { name: course.title, url },
          ]),
          courseJsonLd({ url, name: course.title, description: course.description, provider: 'FertiMind' }),
        ]}
      />
      <Link href="/cursos" className="text-sm text-ink/50 hover:text-coralAction">
        ← {t('courses_title', 'es')}
      </Link>

      {course.thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="mt-4 aspect-video w-full rounded-3xl object-cover"
          width={1200}
          height={675}
        />
      )}

      <h1 className="mt-6 text-3xl font-bold text-plum">{course.title}</h1>
      <p className="mt-3 text-ink/70">{course.description}</p>

      <div className="mt-8 space-y-6">
        {course.modules.map((mod) => (
          <section key={mod.id} className="rounded-3xl border border-plum/10 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-plum">{mod.title}</h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  mod.isPremium ? 'bg-goldSoft text-gold' : 'bg-sageSoft text-sage'
                }`}
              >
                {mod.isPremium ? `★ ${t('courses_premium', 'es')}` : t('courses_free', 'es')}
              </span>
            </div>
            {mod.description && <p className="mt-1 text-sm text-ink/60">{mod.description}</p>}
            <ul className="mt-4 space-y-2">
              {mod.lessons.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/cursos/${course.id}/${l.id}`}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[15px] transition hover:bg-lilacSoft/60"
                  >
                    <span className="font-medium text-ink/85">
                      {l.isPremium ? '🔒 ' : '📖 '}
                      {l.title}
                    </span>
                    <span className="text-xs text-ink/45">
                      {l.durationMinutes} {t('courses_minutes', 'es')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
