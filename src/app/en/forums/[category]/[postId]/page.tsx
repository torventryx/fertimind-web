import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { SITE } from '@/lib/i18n';
import { forumCategoriesById } from '@/data/taxonomy';
import { threadWithComments, localizedText } from '@/lib/content';
import PregnancyGate from '@/components/PregnancyGate';

export const revalidate = 120;

interface Props { params: { category: string; postId: string } }

export async function generateStaticParams() {
  const { allPublicThreadIds } = await import('@/lib/content');
  try {
    const threads = await allPublicThreadIds();
    return threads.map((t) => ({ category: t.categoryId, postId: t.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = forumCategoriesById[params.category];
  const data = await threadWithComments(params.postId);
  if (!cat || !data || data.thread.categoryId !== cat.id) return {};
  return pageMetadata({
    locale: 'en',
    path: `/foros/${cat.id}/${params.postId}`,
    title: `${data.thread.title} — ${cat.nameEn}`,
    description: data.thread.excerpt,
    type: 'article',
    publishedTime: data.thread.createdAt?.toISOString(),
    noIndex: data.thread.isPregnancyAnnouncement,
  });
}

export default async function ThreadEn({ params }: Props) {
  const cat = forumCategoriesById[params.category];
  const data = await threadWithComments(params.postId);
  if (!cat || !data || data.thread.categoryId !== cat.id) notFound();
  const { thread, comments } = data;
  const body = localizedText(thread.content, thread.translations, 'en');

  return (
    <article className="mx-auto max-w-3xl px-4 py-10" lang="en">
      <Link href={`/en/forums/${cat.id}`} className="text-sm text-ink/50 hover:text-coralAction">← {cat.nameEn}</Link>
      <h1 className="mt-3 text-2xl font-bold leading-snug text-plum sm:text-3xl">{thread.title}</h1>
      <p className="mt-2 text-xs text-ink/50">
        {thread.authorUsername ? `@${thread.authorUsername}` : thread.authorName} ·{' '}
        {thread.createdAt?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      {thread.isPregnancyAnnouncement ? (
        <div className="mt-6">
          <PregnancyGate locale="en">
            <div className="whitespace-pre-wrap rounded-2xl border border-plum/10 bg-white p-5 text-[15px] leading-7">{body.text}</div>
          </PregnancyGate>
        </div>
      ) : (
        <div className="mt-6 whitespace-pre-wrap rounded-2xl border border-plum/10 bg-white p-5 text-[15px] leading-7">
          {body.text}
          {body.translated && <span className="ml-2 rounded bg-lilacSoft px-1.5 py-0.5 text-[10px] text-plum/60">Automatically translated</span>}
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-bold text-plum">Replies ({comments.length})</h2>
        <div className="mt-4 space-y-3">
          {comments.map((c) => {
            const cBody = localizedText(c.content, c.translations, 'en');
            return (
              <div key={c.id} className="rounded-2xl border border-plum/10 bg-white p-4">
                <p className="text-xs text-ink/50">
                  <span className="font-semibold text-plum/80">{c.authorUsername ? `@${c.authorUsername}` : c.authorName}</span>
                  {' · '}{c.createdAt?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  {cBody.translated && <span className="ml-1 rounded bg-lilacSoft px-1.5 py-0.5 text-[10px] text-plum/60">auto-translated</span>}
                </p>
                <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-7">{cBody.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
}
