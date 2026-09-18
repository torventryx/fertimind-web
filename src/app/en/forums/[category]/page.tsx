import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { forumCategoriesById } from '@/data/taxonomy';
import { threadsByCategory } from '@/lib/content';
import PostTeaser from '@/components/PostTeaser';
import NewThreadNote from '@/components/NewThreadNote';

export const revalidate = 300;

interface Props { params: { category: string } }

export function generateStaticParams() {
  return Object.keys(forumCategoriesById).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = forumCategoriesById[params.category];
  if (!cat) return {};
  return pageMetadata({
    locale: 'en',
    path: `/en/forums/${cat.id}`,
    title: `${cat.nameEn} — forum`,
    description: cat.descriptionEn,
    // Intimate categories stay out of indexing: privacy for those who share.
    noIndex: cat.sensitive === true,
  });
}

export default async function CategoryEn({ params }: Props) {
  const cat = forumCategoriesById[params.category];
  if (!cat) notFound();
  const threads = await threadsByCategory(cat.id);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10" lang="en">
      <Link href="/en/forums" className="text-sm text-ink/50 hover:text-coralAction">← All forums</Link>
      <h1 className="mt-3 text-3xl font-bold text-plum">
        <span className="mr-2">{cat.emoji}</span>{cat.nameEn}
        {cat.sensitive && (
          <span className="ml-3 align-middle rounded-full bg-goldSoft px-3 py-1 text-xs font-semibold text-gold">
            🔒 private space
          </span>
        )}
      </h1>
      <p className="mt-1.5 text-ink/65">{cat.descriptionEn}</p>
      <p className="mt-1 text-xs text-ink/45">Threads are mostly written in Spanish.</p>

      {cat.sensitive && (
        <div className="mt-5 rounded-2xl border border-gold/30 bg-goldSoft/60 p-4 text-sm leading-6 text-ink/75">
          This space talks about <strong>results, positives and intimate moments</strong>. To
          protect those who share, conversations are readable only when signed in (and never
          indexed). The rest of the forums stay open to everyone.
        </div>
      )}

      <div className="mt-8 space-y-4">
        {threads.length === 0 && <p className="rounded-2xl bg-lilacSoft p-6 text-center text-sm text-ink/60">No public threads here yet. Be the first!</p>}
        {threads.map((th) => (
          <PostTeaser key={th.id} locale="en" href={`/en/forums/${th.categoryId}/${th.id}`}
            title={th.title} excerpt={cat.sensitive ? undefined : th.excerpt} authorName={th.authorName} authorUsername={th.authorUsername}
            date={th.createdAt?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) || ''}
            commentCount={th.commentCount} pinned={th.isWeeklyThread} locked={cat.sensitive === true} />
        ))}
      </div>

      <NewThreadNote locale="en" />
    </div>
  );
}
