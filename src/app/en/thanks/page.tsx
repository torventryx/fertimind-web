import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Suspense } from 'react';
import VerifyPayment from '@/components/VerifyPayment';

export const metadata: Metadata = pageMetadata({
  locale: 'en', path: '/thanks', title: 'Thank you!', description: 'We are confirming your payment.', noIndex: true,
});

export default function ThanksEn() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center" lang="en">
      <p className="text-5xl">🌸</p>
      <h1 className="mt-4 text-3xl font-bold text-plum">Thank you!</h1>
      <p className="mt-3 text-ink/70">We are confirming your payment…</p>
      <Suspense><VerifyPayment locale="en" /></Suspense>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a href="/en/courses" className="rounded-full bg-plum px-6 py-2.5 text-sm font-semibold text-white">
          Go to courses
        </a>
        <a href="/en/support" className="rounded-full border border-plum/25 px-6 py-2.5 text-sm font-semibold text-plum">
          🤍 Support FertiMind
        </a>
      </div>
    </div>
  );
}
