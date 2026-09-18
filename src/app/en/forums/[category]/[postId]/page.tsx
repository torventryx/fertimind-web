import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pageMetadata, breadcrumbJsonLd, discussionJsonLd } from '@/lib/seo';
import { SITE, t } from '@/lib/i18n';
import { forumCategoriesById } from '@/data/taxonomy';
import { threadWithComments, localizedText } from '@/lib/content';
import PregnancyGate from '@/components/PregnancyGate';
import SensitiveThreadLoader from '@/components/SensitiveThreadLoader';
import CommentSection from '@/components/CommentSection';
import JsonLd from '@/components/JsonLd';

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
  if (!cat) return {};
  // Sensitive categories: even the thread title stays out of indexing.
  if (cat.sensitive) {
    return pageMetadata({
      locale: 'en',
      path: '/en/forums',
      title: `${cat.nameEn} — private space`,
      description: `Private conversations in ${cat.nameEn}, only for signed-in members.`,
      noIndex: true,
    });
  }
  const data = await threadWithComments(params.postId);
  if (!data || data.thread.categoryId !== cat.id) return {};
  return pageMetadata({
    locale: 'en',
    path: `/en/forums/${cat.id}/${params.postId}`,
    title: `${data.thread.title} — ${cat.nameEn}`,
    description: data.thread.excerpt || `Conversation in the ${cat.nameEn} forum.`,
    type: 'article',
    publishedTime: data.thread.createdAt?.toISOString(),
    noIndex: data.thread.isPregnancyAnnouncement,
  });
}

export default async function ThreadEn({ params }: Props) {
  const cat = forumCategoriesById[params.category];
  if (!cat) notFound();

  // ── Sensitive category: zero content in prerendered HTML ──
  if (cat.sensitive) {
    return (
      <article lang="en" className="mx-auto max-w-3xl px-4 py-10">
        <Link href={`/en/forums/${cat.id}`} className="text-sm text-ink/50 hover:text-coralAction">
          ← {cat.nameEn}
        </Link>
        <div className="mt-6">
          <SensitiveThreadLoader postId={params.postId} locale="en" />
        </div>
      </article>
    );
  }

  const data = await threadWithComments(params.postId);
  if (!data || data.thread.categoryId !== cat.id) notFound();
  const { thread, comments } = data;
  const body = localizedText(thread.content, thread.translations, 'en');
  const url = `${SITE.url}/en/forums/${cat.id}/${thread.id}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10" lang="en">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'FertiMind', url: SITE.url },
            { name: 'Forums', url: `${SITE.url}/en/forums` },
            { name: cat.nameEn, url: `${SITE.url}/en/forums/${cat.id}` },
            { name: thread.title, url },
          ]),
          ...(thread.isPregnancyAnnouncement
            ? []
            : [
                discussionJsonLd({
                  url,
                  title: thread.title,
                  text: body.text,
                  authorName: thread.authorName,
                  datePublished: (thread.createdAt ?? new Date()).toISOString(),
                  commentCount: comments.length,
                  comments: comments.slice(0, 10).map((c) => ({
                    authorName: c.authorName,
                    text: localizedText(c.content, c.translations, 'en').text,
                    datePublished: (c.createdAt ?? new Date()).toISOString(),
                  })),
                }),
              ]),
        ]}
      />
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

      <CommentSection
        postId={thread.id}
        categoryId={cat.id}
        locale="en"
        initialComments={comments.map((c) => {
          const cb = localizedText(c.content, c.translations, 'en');
          return {
            id: c.id,
            content: cb.text,
            authorName: c.authorName,
            authorUsername: c.authorUsername,
            createdAt: c.createdAt?.toISOString() ?? null,
            translated: cb.translated,
          };
        })}
      />

      <p className="mt-8 rounded-2xl bg-lilacSoft/60 p-4 text-xs leading-5 text-ink/55">
        {t('forum_new_thread_app', 'en')}
      </p>
    </article>
  );
}
