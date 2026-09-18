import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/legal/cookies',
  title: 'Política de Cookies',
  description: 'Qué cookies usa FertiMind y cómo gestionarlas.',
});

export default function CookiesPage() {
  return (
    <LegalPage
      title="Política de Cookies"
      updated="18 de septiembre de 2026"
      sections={[
        { h: 'Qué son', p: ['Pequeños archivos que se guardan en tu dispositivo al visitar la web para hacerla funcionar y entender su uso.'] },
        { h: 'Cookies que usamos', p: [
          'Esenciales: mantienen tu sesión iniciada y tus preferencias (consentimiento de cookies, idioma). Sin ellas la web no funciona correctamente.',
          'Analíticas anónimas: nos dicen agregadamente qué páginas se visitan para mejorar el contenido. No identifican personas.',
          'No usamos cookies publicitarias ni de perfilado.',
        ] },
        { h: 'Cómo gestionarlas', p: ['Puedes aceptar o rechazar desde el banner de la primera visita, y borrarlas en cualquier momento desde la configuración de tu navegador.'] },
        { h: 'Terceros', p: ['Al iniciar sesión con Google o pagar con Stripe, esas plataformas pueden establecer sus propias cookies conforme a sus políticas.'] },
      ]}
    />
  );
}
