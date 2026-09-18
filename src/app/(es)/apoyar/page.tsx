import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import DonateCard from '@/components/DonateCard';

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/apoyar',
  title: 'Apoya FertiMind — sostenimiento del proyecto',
  description:
    'FertiMind nació para dar apoyo y visibilidad a quienes atraviesan la fertilidad. Si el proyecto te ha acompañado, puedes ayudarlo a seguir: apoyo económico único, sin obligación.',
});

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <span className="inline-flex items-center gap-2 rounded-full bg-goldSoft px-3.5 py-1.5 text-xs font-semibold text-gold">
        🤍 Apoya el proyecto
      </span>
      <h1 className="mt-4 text-3xl font-extrabold leading-tight text-plum sm:text-4xl">
        Un sector sin visibilidad merece un lugar que no dependa de nadie más…{' '}
        <span className="fm-gradient-text">solo de nosotras.</span>
      </h1>

      <div className="mt-6 space-y-4 text-[16px] leading-7 text-ink/75">
        <p>
          FertiMind existe porque el camino de la fertilidad es de los pocos trayectos médicos que
          se recorren <strong>en silencio</strong>: se pregunta poco, se explica menos y se
          atraviesa muchas veces sin compañía. Este proyecto nació para cambiar exactamente eso.
        </p>
        <p>
          No tenemos anuncios, no vendemos datos y la comunidad es y será{' '}
          <strong>gratis para siempre</strong>. Los cursos se desbloquean con un único pago para
          cubrir parte de los costes, pero la realidad es sencilla: servidores, desarrollo y
          mantenimiento se sostienen con muy poco margen.
        </p>
        <p>
          Si FertiMind te ha acompañado en algún momento —una madrugada de betaespera, una duda a
          las 2 a.m., un hilo que te hizo sentir comprendida— puedes apoyar su mantenimiento con
          la cantidad que quieras. <strong>Ninguna cantidad es pequeña</strong> y ninguna es
          obligatoria: si no puedes o no quieres, aquí sigues siendo de las nuestras.
        </p>
      </div>

      <div className="mt-8">
        <DonateCard locale="es" />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: '🌸', t: 'Sin anuncios, siempre', d: 'Tu apoyo evita que dependamos de publicidad o de vender atención.' },
          { icon: '🔒', t: 'Datos privados', d: 'No compartimos ni vendemos datos de las usuarias. Punto.' },
          { icon: '🤝', t: 'Comunidad libre', d: 'Los foros y el apoyo mutuo no se pagan: se comparten.' },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-plum/10 bg-white p-5 fm-shadow-card">
            <span className="text-xl">{c.icon}</span>
            <p className="mt-2 font-bold text-plum">{c.t}</p>
            <p className="mt-1 text-xs leading-5 text-ink/60">{c.d}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 rounded-2xl bg-lilacSoft/60 p-4 text-xs leading-5 text-ink/55">
        FertiMind ofrece información y apoyo, no consejos médicos. El apoyo económico no da acceso
        a contenidos premium ni a ventajas: es una contribución voluntaria al mantenimiento del
        proyecto. Gestión de pagos: Stripe. ¿Dudas?{' '}
        <Link href="/contacto" className="font-semibold text-coralAction">
          Escríbenos
        </Link>
        .
      </p>
    </div>
  );
}
