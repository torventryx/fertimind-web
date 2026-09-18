import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { SITE } from '@/lib/i18n';
import { recentThreads, listCourses } from '@/lib/content';
import { forumSections } from '@/data/taxonomy';
import PostTeaser from '@/components/PostTeaser';

export const revalidate = 900;

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/',
  title: 'FertiMind — fertility community & courses',
  description: SITE.en.description,
});

export default async function HomeEn() {
  const [threads, courses] = await Promise.all([recentThreads(6), listCourses()]);
  return (
    <div lang="en">
      <section className="bg-gradient-to-b from-lilacSoft via-cream to-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <span className="inline-block rounded-full bg-sageSoft px-3 py-1 text-xs font-semibold text-sage">
            Free forever · es / en
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight text-plum sm:text-5xl">
            The fertility path is a journey.{' '}
            <span className="text-coralAction">Don&apos;t walk it alone.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink/70">
            Forums by stage and treatment, science-based courses and a pregnancy mode that stays
            with you after the positive test. The community is free — forever.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/en/forums" className="rounded-full bg-coralAction px-7 py-3 text-base font-semibold text-white">
              Join the community
            </Link>
            <Link href="/en/courses" className="rounded-full border border-plum/25 bg-white px-7 py-3 text-base font-semibold text-plum">
              Explore courses
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-plum">Forums for every stage</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {forumSections.flatMap((s) => s.categories)
            .filter((c) => ['betaespera', 'estimulacion', 'ovodonacion', 'emocional', 'historias-exito', 'conectamos', 'primer-trimestre', 'resultados'].includes(c.id))
            .map((c) => (
              <Link key={c.id} href={`/en/forums/${c.id}`} className="rounded-2xl border border-plum/10 bg-white p-4 transition hover:border-coral/40">
                <span className="text-xl">{c.emoji}</span>
                <p className="mt-1.5 text-[15px] font-semibold text-plum">{c.nameEn}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-ink/55">{c.descriptionEn}</p>
              </Link>
            ))}
        </div>
      </section>

      {threads.length > 0 && (
        <section className="bg-lilacSoft/40 py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-plum">Today&apos;s conversation</h2>
            <p className="mt-1 text-sm text-ink/55">Threads from the community (mostly in Spanish — auto-translated in-app).</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {threads.map((th) => (
                <PostTeaser key={th.id} locale="en" href={`/en/forums/${th.categoryId}/${th.id}`}
                  title={th.title} excerpt={th.excerpt} authorName={th.authorName}
                  date={th.createdAt?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) || ''}
                  commentCount={th.commentCount} pinned={th.isWeeklyThread} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-plum">Science-based courses</h2>
        <p className="mt-1 text-ink/60">Written with real references (ESHRE, ASRM, NICE, SEF). Courses are in Spanish; free modules open to everyone.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 6).map((c) => (
            <Link key={c.id} href={`/en/courses/${c.id}`} className="overflow-hidden rounded-3xl border border-plum/10 bg-white transition hover:border-coral/40">
              {c.thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.thumbnailUrl} alt={c.title} className="aspect-video w-full object-cover" width={800} height={450} />
              )}
              <div className="p-5">
                <h3 className="font-semibold text-plum">{c.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink/60">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
