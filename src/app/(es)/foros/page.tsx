import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { SITE, t } from '@/lib/i18n';
import { forumSections, sectionTitle } from '@/data/taxonomy';
import { getCategoryThreadCounts } from '@/lib/content';
import JsonLd from '@/components/JsonLd';

export const revalidate = 1800;

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/foros',
  title: 'Foros de fertilidad y reproducción asistida',
  description:
    '16 foros por etapa y tratamiento: estimulación, punción, betaespera, ovodonación, DGP, historias de éxito y más. Comunidad libre y de mujeres.',
});

export default async function ForumsPage() {
  const counts = await getCategoryThreadCounts().catch(() => ({}) as Record<string, number>);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd
        data={breadcrumbJsonLd([{ name: 'FertiMind', url: SITE.url }, { name: 'Foros', url: `${SITE.url}/foros` }])}
      />
      <h1 className="text-3xl font-bold text-plum">{t('forum_title', 'es')}</h1>
      <p className="mt-2 max-w-2xl text-ink/65">{t('forum_subtitle', 'es')}</p>

      <div className="mt-8 space-y-8">
        {forumSections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold text-plum/80">{sectionTitle(section, 'es')}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/foros/${c.id}`}
                  className="rounded-2xl border border-plum/10 bg-white p-4 transition hover:border-coral/40"
                >
                  <span className="text-xl">{c.emoji}</span>
                  {c.sensitive && (
                    <span className="ml-1.5 align-middle text-xs" title="Espacio privado: requiere sesión">
                      🔒
                    </span>
                  )}
                  <p className="mt-1.5 font-semibold text-plum">{c.name}</p>
                  <p className="mt-0.5 text-xs text-ink/55">{c.description}</p>
                  <p className="mt-1.5 text-xs font-semibold text-coralAction">
                    {counts[c.id] ?? 0} {counts[c.id] === 1 ? 'conversación' : 'conversaciones'}
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
