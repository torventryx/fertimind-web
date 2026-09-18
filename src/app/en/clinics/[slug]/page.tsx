import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { clinicsBySlug } from '@/data/clinics-seed';
import EsClinic from '../../../(es)/clinicas/[slug]/page';

export const revalidate = 86400;

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return Object.keys(clinicsBySlug).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const clinic = clinicsBySlug[params.slug];
  if (!clinic) return {};
  return pageMetadata({
    locale: 'en',
    path: `/clinicas/${clinic.slug}`,
    title: `${clinic.nameEn} (${clinic.cityEn})`,
    description: clinic.aboutEn.slice(0, 160),
  });
}

/** La ficha completa (reseñas + comunidad) reutiliza la versión española. */
export default function ClinicEn(props: Props) {
  const clinic = clinicsBySlug[props.params.slug];
  if (!clinic) notFound();
  return (
    <div lang="en">
      <EsClinic {...props} />
    </div>
  );
}
