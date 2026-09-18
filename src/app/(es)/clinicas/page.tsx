import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import { clinics } from '@/data/clinics-seed';

export const revalidate = 86400;

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/clinicas',
  title: 'Directorio de clínicas de fertilidad en España',
  description:
    'Clínicas de reproducción asistida en España: IVI, Eugin, Instituto Bernabeu, Ginefiv, Tambre, Dexeus… con la experiencia de la comunidad FertiMind.',
});

export default function ClinicsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-plum">{t('clinics_title', 'es')}</h1>
      <p className="mt-2 max-w-2xl text-ink/65">{t('clinics_subtitle', 'es')}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clinics.map((c) => (
          <Link
            key={c.slug}
            href={`/clinicas/${c.slug}`}
            className="rounded-3xl border border-plum/10 bg-white p-5 transition hover:border-coral/40 hover:shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-lilac">{c.city}</p>
            <h2 className="mt-1 font-semibold text-plum">{c.name}</h2>
            <p className="mt-1.5 line-clamp-3 text-sm text-ink/60">{c.about}</p>
          </Link>
        ))}
      </div>

      <p className="mt-8 rounded-2xl bg-goldSoft/60 p-4 text-xs leading-5 text-ink/60">
        {t('clinics_disclaimer', 'es')}
      </p>
    </div>
  );
}
