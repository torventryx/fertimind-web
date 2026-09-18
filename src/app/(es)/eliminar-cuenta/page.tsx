import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/eliminar-cuenta',
  title: 'Eliminar mi cuenta',
  description: 'Cómo eliminar tu cuenta y datos de FertiMind.',
  noIndex: true,
});

const steps = [
  {
    title: 'Desde la app (recomendado)',
    body: 'Abre FertiMind → Perfil → Ajustes → Eliminar cuenta. La eliminación es inmediata y borra tu perfil, tus ciclos y tu contenido de la comunidad de forma irreversible.',
  },
  {
    title: 'Desde la web',
    body: 'Escríbenos a soporte@fertimind.es desde el email de tu cuenta indicando "Eliminar cuenta". Verificamos tu identidad y procesamos la eliminación en un máximo de 30 días (RGPD).',
  },
  {
    title: '¿Qué se borra?',
    body: 'Perfil y datos personales, ciclos, diario y documentos. Tus posts y comentarios de la comunidad se anonimizan (se conservan sin datos identificativos) para no romper las conversaciones, tal y como se explica en la Política de Privacidad.',
  },
  {
    title: '¿Cambiaste de opinión?',
    body: 'Si solo quieres una pausa, no necesitas borrar tu cuenta: cierra sesión y descansa. Tu historial te seguirá esperando — muchas usuarias vuelven para un segundo ciclo.',
  },
];

export default function DeleteAccountPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-plum">Eliminar mi cuenta</h1>
      <p className="mt-2 text-ink/65">
        Sentimos que te vayas. Si el motivo es algo que podemos mejorar, cuéntanoslo en{' '}
        <a href="mailto:soporte@fertimind.es" className="font-semibold text-coralAction">
          soporte@fertimind.es
        </a>
        .
      </p>
      <div className="mt-8 space-y-4">
        {steps.map((s) => (
          <section key={s.title} className="rounded-2xl border border-plum/10 bg-white p-5">
            <h2 className="font-semibold text-plum">{s.title}</h2>
            <p className="mt-1.5 text-sm leading-6 text-ink/70">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
