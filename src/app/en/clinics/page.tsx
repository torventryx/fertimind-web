import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { clinics } from '@/data/clinics-seed';

export const revalidate = 86400;

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/clinicas',
  title: 'Fertility clinics in Spain — directory',
  description: 'Assisted reproduction clinics in Spain with the FertiMind community experience.',
});

export default function ClinicsEn() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10" lang="en">
      <h1 className="text-3xl font-bold text-plum">Fertility clinic directory (Spain)</h1>
      <p className="mt-2 max-w-2xl text-ink/65">
        Assisted reproduction clinics, together with real community experiences.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clinics.map((c) => (
          <Link key={c.slug} href={`/en/clinics/${c.slug}`} className="rounded-3xl border border-plum/10 bg-white p-5 transition hover:border-coral/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-lilac">{c.cityEn}</p>
            <h2 className="mt-1 font-semibold text-plum">{c.nameEn}</h2>
            <p className="mt-1.5 line-clamp-3 text-sm text-ink/60">{c.aboutEn}</p>
          </Link>
        ))}
      </div>
      <p className="mt-8 rounded-2xl bg-goldSoft/60 p-4 text-xs leading-5 text-ink/60">
        This directory is informational and not a medical recommendation. Always check each clinic&apos;s
        registration and results in the SEF (Spanish Fertility Society) registry.
      </p>
    </div>
  );
}
