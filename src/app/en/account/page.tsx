import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import AccountCard from '@/components/AccountCard';

export const metadata: Metadata = pageMetadata({
  locale: 'en', path: '/cuenta', title: 'My account', description: 'Your FertiMind account.', noIndex: true,
});

export default function AccountEn() {
  return <div className="px-4 py-14"><AccountCard locale="en" /></div>;
}
