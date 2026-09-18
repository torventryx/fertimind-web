import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Suspense } from 'react';
import VerifyPayment from '@/components/VerifyPayment';

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/gracias',
  title: '¡Gracias!',
  description: 'Tu apoyo a FertiMind está en camino.',
  noIndex: true,
});

export default function ThanksPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-5xl">🌸</p>
      <h1 className="mt-4 text-3xl font-bold text-plum">¡Gracias!</h1>
      <p className="mt-3 text-ink/70">Estamos confirmando tu pago…</p>
      <Suspense><VerifyPayment locale="es" /></Suspense>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a href="/cursos" className="rounded-full bg-plum px-6 py-2.5 text-sm font-semibold text-white">
          Ir a los cursos
        </a>
        <a href="/apoyar" className="rounded-full border border-plum/25 px-6 py-2.5 text-sm font-semibold text-plum">
          🤍 Apoyar FertiMind
        </a>
      </div>
    </div>
  );
}
