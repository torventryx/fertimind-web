import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import Paywall from '@/components/Paywall';

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/pagar',
  title: 'Desbloquea FertiMind Premium',
  description: 'Pago único de 7,99 €: todos los cursos, para siempre. Sin suscripciones.',
  noIndex: true,
});

export default function PayPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-plum">FertiMind Premium</h1>
      <ul className="mx-auto mt-6 max-w-md space-y-2 text-left text-[15px] text-ink/75">
        <li>✓ Todos los módulos premium de todos los cursos</li>
        <li>✓ Pago único: 7,99 €, sin suscripción</li>
        <li>✓ Válido en la web y en la app</li>
        <li>✓ La comunidad sigue siendo gratis, siempre</li>
      </ul>
      <div className="mt-8">
        <Paywall locale="es" />
      </div>
    </div>
  );
}
