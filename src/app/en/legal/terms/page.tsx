import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import EsTerms from '../../../(es)/legal/terminos/page';

export const metadata: Metadata = pageMetadata({
  locale: 'en', path: '/legal/terminos', title: 'Terms of Use',
  description: 'Terms governing the FertiMind app and website (binding Spanish version included).',
});

export default function TermsEn() {
  return (
    <div lang="en">
      <p className="mx-auto mt-8 max-w-2xl rounded-2xl bg-lilacSoft px-4 py-3 text-sm text-plum/70">
        The legally binding Terms are the Spanish version below.
      </p>
      <EsTerms />
    </div>
  );
}
