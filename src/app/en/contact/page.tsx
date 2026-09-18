import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = pageMetadata({
  locale: 'en', path: '/contacto', title: 'Contact', description: 'Questions, suggestions or collaboration.',
});

export default function ContactEn() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12" lang="en">
      <h1 className="text-3xl font-bold text-plum">Contact</h1>
      <p className="mt-2 text-ink/65">
        Write to <a href="mailto:soporte@fertimind.es" className="font-semibold text-coralAction">soporte@fertimind.es</a> or use the form:
      </p>
      <div className="mt-6"><ContactForm locale="en" /></div>
    </div>
  );
}
