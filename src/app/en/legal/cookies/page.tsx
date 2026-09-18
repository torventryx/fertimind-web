import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import EsCookies from '../../../(es)/legal/cookies/page';

export const metadata: Metadata = pageMetadata({
  locale: 'en', path: '/legal/cookies', title: 'Cookie Policy',
  description: 'Cookies used by FertiMind and how to manage them.',
});

export default function CookiesEn() {
  return (
    <div lang="en">
      <p className="mx-auto mt-8 max-w-2xl rounded-2xl bg-lilacSoft px-4 py-3 text-sm text-plum/70">
        In short: essential cookies to run the site and anonymous metrics. No advertising cookies.
        Manage them from the banner or your browser.
      </p>
      <EsCookies />
    </div>
  );
}
