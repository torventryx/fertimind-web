import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  locale: 'en', path: '/gracias', title: 'Thank you!', description: 'Your premium access is being activated.', noIndex: true,
});

import { Suspense } from 'react';
import VerifyPayment from '@/components/VerifyPayment';

export default function ThanksEn() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center" lang="en">
      <p className="text-5xl">🌸</p>
      <h1 className="mt-4 text-3xl font-bold text-plum">Thank you!</h1>
      <p className="mt-3 text-ink/70">
        Your premium access is being activated…{' '}
        <a href="/en/account" className="font-semibold text-coralAction underline">Check your account</a> or
        jump straight into your premium courses.
      </p>
      <Suspense><VerifyPayment locale="en" /></Suspense>
      <a href="/en/courses" className="mt-6 inline-block rounded-full bg-plum px-6 py-2.5 text-sm font-semibold text-white">
        Go to courses
      </a>
    </div>
  );
}
