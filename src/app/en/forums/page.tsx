import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { forumSections } from '@/data/taxonomy';
import { getCategoryThreadCounts } from '@/lib/content';

export const revalidate = 1800;

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/foros',
  title: 'Fertility forums',
  description: '16 forums by stage and treatment: stimulation, two-week wait, egg donation, success stories and more.',
});

export default async function ForumsEn() {
  const counts = await getCategoryThreadCounts().catch(() => ({}) as Record<string, number>);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10" lang="en">
      <h1 className="text-3xl font-bold text-plum">Fertility forums</h1>
      <p className="mt-2 max-w-2xl text-ink/65">
        16 spaces by stage and treatment. Threads are mostly in Spanish; the app translates them live.
      </p>
      <div className="mt-8 space-y-8">
        {forumSections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold text-plum/80">{section.titleEn}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.categories.map((c) => (
                <Link key={c.id} href={`/en/forums/${c.id}`} className="rounded-2xl border border-plum/10 bg-white p-4 transition hover:border-coral/40">
                  <span className="text-xl">{c.emoji}</span>
                  {c.sensitive && (
                    <span className="ml-1.5 align-middle text-xs" title="Private space: sign-in required">
                      🔒
                    </span>
                  )}
                  <p className="mt-1.5 font-semibold text-plum">{c.nameEn}</p>
                  <p className="mt-0.5 text-xs text-ink/55">{c.descriptionEn}</p>
                  <p className="mt-1.5 text-xs font-semibold text-coralAction">
                    {counts[c.id] ?? 0} {counts[c.id] === 1 ? 'conversation' : 'conversations'}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
