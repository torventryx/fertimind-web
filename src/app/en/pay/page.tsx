import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Paywall from '@/components/Paywall';

export const metadata: Metadata = pageMetadata({
  locale: 'en', path: '/pagar', title: 'Unlock FertiMind Premium',
  description: 'One-time €7.99: every course, forever. No subscriptions.', noIndex: true,
});

export default function PayEn() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center" lang="en">
      <h1 className="text-3xl font-bold text-plum">FertiMind Premium</h1>
      <ul className="mx-auto mt-6 max-w-md space-y-2 text-left text-[15px] text-ink/75">
        <li>✓ Every premium module of every course</li>
        <li>✓ One-time payment: €7.99, no subscription</li>
        <li>✓ Works on web and in the app</li>
        <li>✓ The community stays free, forever</li>
      </ul>
      <div className="mt-8"><Paywall locale="en" /></div>
    </div>
  );
}
