import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { listCourses } from '@/lib/content';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/cursos',
  title: 'Fertility courses (in Spanish)',
  description: 'Science-based fertility courses: your cycle, IVF step by step, the two-week wait and the first trimester. Free modules for everyone.',
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
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <Link key={c.id} href={`/en/courses/${c.id}`} className="overflow-hidden rounded-3xl border border-plum/10 bg-white transition hover:border-coral/40">
            {c.thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.thumbnailUrl} alt={c.title} className="aspect-video w-full object-cover" width={800} height={450} />
            )}
            <div className="p-5">
              <h2 className="font-semibold text-plum">{c.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-ink/60">{c.description}</p>
              <p className="mt-3 text-xs text-ink/45">{c.modules.length} modules · {c.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
