import { Suspense } from 'react';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import AuthAction from '@/components/AuthAction';

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/action',
  title: 'Acción de email — FertiMind',
  description: 'Restablece tu contraseña o verifica tu email de FertiMind.',
  noIndex: true,
});

export default function ActionPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4 py-16">
      <Suspense fallback={<div className="mx-auto h-48 w-full max-w-md animate-pulse rounded-3xl bg-lilacSoft" />}>
        <AuthAction locale="es" />
      </Suspense>
    </div>
  );
}
