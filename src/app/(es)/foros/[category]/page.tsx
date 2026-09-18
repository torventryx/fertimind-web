import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { SITE, t } from '@/lib/i18n';
import { forumCategoriesById } from '@/data/taxonomy';
import { threadsByCategory } from '@/lib/content';
import PostTeaser from '@/components/PostTeaser';
import JsonLd from '@/components/JsonLd';

export const revalidate = 300;

interface Props {
  params: { category: string };
}

export function generateStaticParams() {
  return forumCategoriesById ? Object.keys(forumCategoriesById).map((category) => ({ category })) : [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = forumCategoriesById[params.category];
  if (!cat) return {};
  return pageMetadata({
    locale: 'es',
    path: `/foros/${cat.id}`,
    title: `${cat.name} — foro`,
    description: `Foro de ${cat.name.toLowerCase()}: ${cat.description.toLowerCase()}. Conversaciones reales de mujeres en tratamiento de reproducción asistida.`,
  });
}

function fmtDate(d: Date | null) {
  if (!d) return '';
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export default async function CategoryPage({ params }: Props) {
  const cat = forumCategoriesById[params.category];
  if (!cat) notFound();

  const threads = await threadsByCategory(cat.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'FertiMind', url: SITE.url },
          { name: 'Foros', url: `${SITE.url}/foros` },
          { name: cat.name, url: `${SITE.url}/foros/${cat.id}` },
        ])}
      />
      <Link href="/foros" className="text-sm text-ink/50 hover:text-coralAction">
        {t('forum_back', 'es')}
      </Link>
      <h1 className="mt-3 text-3xl font-bold text-plum">
        <span className="mr-2">{cat.emoji}</span>
        {cat.name}
      </h1>
      <p className="mt-1.5 text-ink/65">{cat.description}</p>

      <div className="mt-8 space-y-4">
        {threads.length === 0 && (
          <p className="rounded-2xl bg-lilacSoft p-6 text-center text-sm text-ink/60">
            {t('forum_empty', 'es')}
          </p>
        )}
        {threads.map((th) => (
          <PostTeaser
            key={th.id}
            locale="es"
            href={`/foros/${th.categoryId}/${th.id}`}
            title={th.title}
            excerpt={th.excerpt}
            authorName={th.authorName}
            date={fmtDate(th.createdAt)}
            commentCount={th.commentCount}
            pinned={th.isWeeklyThread}
          />
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-plum/20 bg-white/60 p-5 text-sm text-ink/60">
        {t('forum_new_thread_app', 'es')}{' '}
        <Link href="/login" className="font-semibold text-coralAction">
          {t('nav_login', 'es')}
        </Link>
      </div>
    </div>
  );
}
