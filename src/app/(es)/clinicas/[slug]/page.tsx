import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pageMetadata, breadcrumbJsonLd, clinicJsonLd } from '@/lib/seo';
import { SITE, t } from '@/lib/i18n';
import { clinicsBySlug } from '@/data/clinics-seed';
import { getClinicReviews, googleSearchUrl } from '@/lib/places';
import { threadsMentioning } from '@/lib/content';
import PostTeaser from '@/components/PostTeaser';
import JsonLd from '@/components/JsonLd';

export const revalidate = 86400;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return Object.keys(clinicsBySlug).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const clinic = clinicsBySlug[params.slug];
  if (!clinic) return {};
  return pageMetadata({
    locale: 'es',
    path: `/clinicas/${clinic.slug}`,
    title: `${clinic.name} (${clinic.city}) — opiniones y experiencias`,
    description: clinic.about.slice(0, 160),
  });
}

function fmtDate(d: Date | null) {
  if (!d) return '';
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export default async function ClinicPage({ params }: Props) {
  const clinic = clinicsBySlug[params.slug];
  if (!clinic) notFound();

  const [reviews, communityThreads] = await Promise.all([
    getClinicReviews(clinic.name, clinic.city),
    threadsMentioning(clinic.name.split(' ')[0]),
  ]);
  const url = `${SITE.url}/clinicas/${clinic.slug}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'FertiMind', url: SITE.url },
            { name: 'Clínicas', url: `${SITE.url}/clinicas` },
            { name: clinic.name, url },
          ]),
          clinicJsonLd({ url, name: clinic.name, description: clinic.about, city: clinic.city, website: clinic.website }),
        ]}
      />
      <Link href="/clinicas" className="text-sm text-ink/50 hover:text-coralAction">
        ← {t('clinics_title', 'es')}
      </Link>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-lilac">{clinic.city}</p>
      <h1 className="mt-1 text-3xl font-bold text-plum">{clinic.name}</h1>
      <p className="mt-3 text-ink/70">{clinic.about}</p>

      <a
        href={clinic.website}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="mt-5 inline-block rounded-full border border-plum/20 bg-white px-5 py-2 text-sm font-semibold text-plum"
      >
        {t('clinics_see_web', 'es')} ↗
      </a>

      {/* Valoraciones de Google (Places API, si está configurada) */}
      <section className="mt-8 rounded-3xl border border-plum/10 bg-white p-6">
        <h2 className="text-lg font-bold text-plum">
          {reviews ? 'Reseñas de Google' : 'Opiniones'}
        </h2>
        {reviews ? (
          <>
            <p className="mt-1 text-sm text-ink/60">
              ★ {reviews.rating?.toFixed(1)} ({reviews.userRatingsCount}{' '}
              {reviews.mapsUrl.includes('maps') ? 'valoraciones de Google' : ''})
            </p>
            <div className="mt-4 space-y-3">
              {reviews.reviews.map((r, i) => (
                <div key={i} className="rounded-xl bg-lilacSoft/50 p-3">
                  <p className="text-xs text-ink/50">
                    {r.author} · ★ {r.rating} {r.relativeTime && `· ${r.relativeTime}`}
                  </p>
                  <p className="mt-1 text-sm leading-6">{r.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-ink/40">
              Reseñas proporcionadas por Google ·{' '}
              <a href={reviews.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline">
                Ver en Google Maps
              </a>
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-ink/60">
            Estamos integrando las valoraciones de Google. Mientras tanto, puedes leer la opinión
            pública en{' '}
            <a
              href={googleSearchUrl(clinic.name, clinic.city)}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-semibold text-coralAction underline"
            >
              reseñas de {clinic.name} en Google ↗
            </a>
            .
          </p>
        )}
      </section>

      {/* Experiencias de la comunidad */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-plum">{t('clinics_community', 'es')}</h2>
        <div className="mt-4 space-y-3">
          {communityThreads.length === 0 ? (
            <p className="rounded-2xl bg-lilacSoft p-5 text-sm text-ink/60">
              Aún no hay conversaciones públicas sobre {clinic.name}. Puedes abrir la primera en el{' '}
              <Link href="/foros/general" className="font-semibold text-coralAction">
                foro general
              </Link>
              .
            </p>
          ) : (
            communityThreads.map((th) => (
              <PostTeaser
                key={th.id}
                locale="es"
                href={`/foros/${th.categoryId}/${th.id}`}
                title={th.title}
                excerpt={th.excerpt}
                authorName={th.authorName}
                date={fmtDate(th.createdAt)}
                commentCount={th.commentCount}
              />
            ))
          )}
        </div>
      </section>

      <p className="mt-8 rounded-2xl bg-goldSoft/60 p-4 text-xs leading-5 text-ink/60">
        {t('clinics_disclaimer', 'es')}
      </p>
    </div>
  );
}
