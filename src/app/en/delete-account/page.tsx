import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import EsDelete from '../../(es)/eliminar-cuenta/page';

export const metadata: Metadata = pageMetadata({
  locale: 'en', path: '/eliminar-cuenta', title: 'Delete my account',
  description: 'How to delete your FertiMind account and data.', noIndex: true,
});

export default function DeleteEn() {
  return (
    <div lang="en">
      <p className="mx-auto mt-8 max-w-2xl rounded-2xl bg-lilacSoft px-4 py-3 text-sm text-plum/70">
        The legally binding version of this page is in Spanish below.
      </p>
      <EsDelete />
    </div>
  );
}
