import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import EsPrivacy from '../../../(es)/legal/privacidad/page';

export const metadata: Metadata = pageMetadata({
  locale: 'en', path: '/legal/privacidad', title: 'Privacy Policy',
  description: 'How FertiMind handles your personal data (binding Spanish version included).',
});

export default function PrivacyEn() {
  return (
    <div lang="en">
      <p className="mx-auto mt-8 max-w-2xl rounded-2xl bg-lilacSoft px-4 py-3 text-sm text-plum/70">
        The legally binding Privacy Policy is the Spanish version below. In short: we only collect
        what the service needs, community posts are public, we never sell data, and you can exercise
        your GDPR rights at soporte@fertimind.es.
      </p>
      <EsPrivacy />
    </div>
  );
}
