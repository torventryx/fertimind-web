import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pageMetadata, breadcrumbJsonLd, discussionJsonLd } from '@/lib/seo';
import { SITE, t } from '@/lib/i18n';
import { forumCategoriesById } from '@/data/taxonomy';
import { threadWithComments, localizedText } from '@/lib/content';
import PregnancyGate from '@/components/PregnancyGate';
import JsonLd from '@/components/JsonLd';

export const revalidate = 120;

interface Props {
  params: { category: string; postId: string };
}

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
    locale: 'es',
    path: `/foros/${cat.id}/${params.postId}`,
    title: `${data.thread.title} — ${cat.name}`,
    description: data.thread.excerpt || `Conversación en el foro de ${cat.name}.`,
    type: 'article',
    publishedTime: data.thread.createdAt?.toISOString(),
    // Los anuncios de embarazo son contenido sensible: fuera del índice.
    noIndex: data.thread.isPregnancyAnnouncement,
  });
}

function fmtDate(d: Date | null) {
  if (!d) return '';
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function ThreadPage({ params }: Props) {
  const cat = forumCategoriesById[params.category];
  const data = await threadWithComments(params.postId);
  if (!cat || !data || data.thread.categoryId !== cat.id) notFound();

  const { thread, comments } = data;
  const body = localizedText(thread.content, thread.translations, 'es');
  const url = `${SITE.url}/foros/${cat.id}/${thread.id}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'FertiMind', url: SITE.url },
            { name: 'Foros', url: `${SITE.url}/foros` },
            { name: cat.name, url: `${SITE.url}/foros/${cat.id}` },
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
                    text: localizedText(c.content, c.translations, 'es').text,
                    datePublished: (c.createdAt ?? new Date()).toISOString(),
                  })),
                }),
              ]),
        ]}
      />
      <Link href={`/foros/${cat.id}`} className="text-sm text-ink/50 hover:text-coralAction">
        ← {cat.name}
      </Link>

      <h1 className="mt-3 text-2xl font-bold leading-snug text-plum sm:text-3xl">{thread.title}</h1>
      <p className="mt-2 text-xs text-ink/50">
        {thread.authorUsername ? `@${thread.authorUsername}` : thread.authorName} ·{' '}
        {fmtDate(thread.createdAt)}
      </p>

      {thread.isPregnancyAnnouncement ? (
        <div className="mt-6">
          <PregnancyGate locale="es">
            <div className="whitespace-pre-wrap rounded-2xl border border-plum/10 bg-white p-5 text-[15px] leading-7">
              {body.text}
            </div>
          </PregnancyGate>
        </div>
      ) : (
        <div className="mt-6 whitespace-pre-wrap rounded-2xl border border-plum/10 bg-white p-5 text-[15px] leading-7">
          {body.text}
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-bold text-plum">
          {t('comments_title', 'es')} ({comments.length})
        </h2>
        <div className="mt-4 space-y-3">
          {comments.length === 0 && (
            <p className="rounded-2xl bg-lilacSoft p-5 text-sm text-ink/60">{t('comments_empty', 'es')}</p>
          )}
          {comments.map((c) => {
            const cBody = localizedText(c.content, c.translations, 'es');
            return (
              <div key={c.id} className="rounded-2xl border border-plum/10 bg-white p-4">
                <p className="text-xs text-ink/50">
                  <span className="font-semibold text-plum/80">
                    {c.authorUsername ? `@${c.authorUsername}` : c.authorName}
                  </span>{' '}
                  · {fmtDate(c.createdAt)}{' '}
                  {cBody.translated && (
                    <span className="ml-1 rounded bg-lilacSoft px-1.5 py-0.5 text-[10px] text-plum/60">
                      {t('translated_note', 'es')}
                    </span>
                  )}
                </p>
                <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-7">{cBody.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-10 rounded-2xl border border-dashed border-plum/20 bg-white/60 p-5 text-sm text-ink/60">
        {t('forum_new_thread_app', 'es')}{' '}
        <Link href="/login" className="font-semibold text-coralAction">
          {t('nav_login', 'es')}
        </Link>
      </div>
    </article>
  );
}
