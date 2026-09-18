import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import LoginCard from '@/components/LoginCard';

export const metadata: Metadata = {
  ...pageMetadata({
    locale: 'es',
    path: '/login',
    title: t('login_title', 'es'),
    description: t('login_body', 'es'),
    noIndex: true,
  }),
};

export default function LoginPage() {
  return (
    <div className="px-4 py-14">
      <LoginCard locale="es" />
    </div>
  );
}
