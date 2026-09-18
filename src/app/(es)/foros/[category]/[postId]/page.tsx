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
  if (!cat) return {};
  // Categorías sensibles: ni el título del hilo se filtra al indexado.
  if (cat.sensitive) {
    return pageMetadata({
      locale: 'es',
      path: `/foros/${cat.id}`,
      title: `${cat.name} — espacio privado`,
      description: `Conversaciones privadas de ${cat.name.toLowerCase()}, solo para usuarias con sesión iniciada.`,
      noIndex: true,
    });
  }
  const data = await threadWithComments(params.postId);
  if (!data || data.thread.categoryId !== cat.id) return {};
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
  if (!cat) notFound();

  // ── Categoría sensible: nada de contenido en el HTML prerenderizado ──
  if (cat.sensitive) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-10">
        <Link href={`/foros/${cat.id}`} className="text-sm text-ink/50 hover:text-coralAction">
          ← {cat.name}
        </Link>
        <div className="mt-6">
          <SensitiveThreadLoader postId={params.postId} locale="es" />
        </div>
      </article>
    );
  }

  const data = await threadWithComments(params.postId);
  if (!data || data.thread.categoryId !== cat.id) notFound();

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

      <CommentSection
        postId={thread.id}
        categoryId={cat.id}
        locale="es"
        initialComments={comments.map((c) => {
          const cb = localizedText(c.content, c.translations, 'es');
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
        {t('forum_new_thread_app', 'es')}
      </p>
    </article>
  );
}
