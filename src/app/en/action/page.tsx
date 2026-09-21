import { Suspense } from 'react';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import AuthAction from '@/components/AuthAction';

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/en/action',
  title: 'Email action — FertiMind',
  description: 'Reset your password or verify your FertiMind email.',
  noIndex: true,
});

export default function ActionPageEn() {
  return (
    <div lang="en" className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4 py-16">
      <Suspense fallback={<div className="mx-auto h-48 w-full max-w-md animate-pulse rounded-3xl bg-lilacSoft" />}>
        <AuthAction locale="en" />
      </Suspense>
    </div>
  );
}
