import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/contacto',
  title: 'Contacto',
  description: 'Escríbenos: dudas, sugerencias o colaboración con FertiMind.',
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold text-plum">Contacto</h1>
      <p className="mt-2 text-ink/65">
        ¿Tienes dudas o sugerencias? Escríbenos a{' '}
        <a href="mailto:soporte@fertimind.es" className="font-semibold text-coralAction">
          soporte@fertimind.es
        </a>{' '}
        o usa el formulario:
      </p>
      <div className="mt-6">
        <ContactForm locale="es" />
      </div>
    </div>
  );
}
