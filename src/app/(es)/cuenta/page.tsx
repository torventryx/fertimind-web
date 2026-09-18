import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import AccountCard from '@/components/AccountCard';

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/cuenta',
  title: 'Mi cuenta',
  description: 'Tu cuenta FertiMind: acceso, cursos desbloqueados y comunidad.',
  noIndex: true,
});

export default function AccountPage() {
  return (
    <div className="px-4 py-14">
      <AccountCard locale="es" />
    </div>
  );
}
