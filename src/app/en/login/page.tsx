import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import LoginCard from '@/components/LoginCard';

export const metadata: Metadata = pageMetadata({
  locale: 'en', path: '/login', title: 'Sign in to FertiMind',
  description: 'Use the same account as in the app.', noIndex: true,
});

export default function LoginEn() {
  return <div className="px-4 py-14"><LoginCard locale="en" /></div>;
}
