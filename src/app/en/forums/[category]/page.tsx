import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { forumCategoriesById } from '@/data/taxonomy';
import { threadsByCategory } from '@/lib/content';
import PostTeaser from '@/components/PostTeaser';

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
    path: `/foros/${cat.id}`,
    title: `${cat.nameEn} — forum`,
    description: cat.descriptionEn,
  });
}

export default async function CategoryEn({ params }: Props) {
  const cat = forumCategoriesById[params.category];
  if (!cat) notFound();
  const threads = await threadsByCategory(cat.id);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10" lang="en">
      <Link href="/en/forums" className="text-sm text-ink/50 hover:text-coralAction">← All forums</Link>
      <h1 className="mt-3 text-3xl font-bold text-plum"><span className="mr-2">{cat.emoji}</span>{cat.nameEn}</h1>
      <p className="mt-1.5 text-ink/65">{cat.descriptionEn}</p>
      <p className="mt-1 text-xs text-ink/45">Threads are mostly written in Spanish.</p>
      <div className="mt-8 space-y-4">
        {threads.length === 0 && <p className="rounded-2xl bg-lilacSoft p-6 text-center text-sm text-ink/60">No public threads here yet. Be the first!</p>}
        {threads.map((th) => (
          <PostTeaser key={th.id} locale="en" href={`/en/forums/${th.categoryId}/${th.id}`}
            title={th.title} excerpt={th.excerpt} authorName={th.authorName}
            date={th.createdAt?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) || ''}
            commentCount={th.commentCount} pinned={th.isWeeklyThread} />
        ))}
      </div>
    </div>
  );
}
