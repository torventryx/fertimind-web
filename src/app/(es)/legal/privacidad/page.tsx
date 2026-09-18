import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/legal/privacidad',
  title: 'Política de Privacidad',
  description: 'Cómo FertiMind recopila, usa y protege tus datos personales (app y web).',
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Política de Privacidad"
      updated="18 de septiembre de 2026"
      sections={[
        {
          h: 'Responsable del tratamiento',
          p: ['FertiMind — Contacto: soporte@fertimind.es. Esta política describe cómo tratamos los datos personales en la app móvil y en este sitio web.'],
        },
        {
          h: '1. Datos que recopilamos',
          p: [
            'Datos de cuenta: nombre, correo electrónico y contraseña al crear tu cuenta.',
            'Datos de perfil: información que decides compartir (inicio de tratamiento, tipo de tratamiento…).',
            'Contenido del usuario: registros de ciclo, medicación, citas, notas, publicaciones de la comunidad y documentos que subes.',
            'Datos de contacto: lo que envías por el formulario de contacto.',
            'Google Sign-In: solo accedemos a nombre, email, foto de perfil e ID único para autenticarte. No accedemos a ningún otro dato de tu cuenta de Google.',
            'Datos técnicos y de uso: tipo de dispositivo, sistema operativo, páginas visitadas y estadísticas anónimas para mejorar el servicio.',
          ],
        },
        {
          h: '2. Cómo usamos tus datos',
          p: [
            'Los datos de Google se usan exclusivamente para autenticación, mostrar tu nombre/foto y comunicaciones de cuenta. Nunca para publicidad, venta a terceros o perfilado.',
            'En general: prestar el servicio (seguimiento de ciclo, comunidad, cursos), soporte técnico y mejora del servicio.',
          ],
        },
        {
          h: '3. Comunidad pública y web',
          p: [
            'Los foros son públicos en la web: todo lo que publiques en la comunidad es visible para cualquier visitante bajo el pseudónimo que elijas. No publiques datos personales (nombre completo, teléfono, clínica con historia clínica) que no quieras exponer.',
            'Los anuncios de embarazo quedan tras un aviso opcional y fuera de los buscadores.',
            'El contenido generado antiguamente de forma automatizada está etiquetado como archivo y desactivado.',
          ],
        },
        {
          h: '4. Pagos',
          p: [
            'App: los pagos se procesan íntegramente mediante Apple/Google (no vemos tus datos bancarios).',
            'Web: los pagos se procesan mediante Stripe Payments Europe. FertiMind no almacena datos de tarjeta; Stripe actúa como encargado del tratamiento según su propia política de privacidad.',
          ],
        },
        {
          h: '5. Base legal y conservación',
          p: [
            'Tratamos tus datos con base en la ejecución del contrato (prestarte el servicio), tu consentimiento (datos opcionales, cookies) y el interés legítimo (seguridad y mejora).',
            'Conservamos tus datos mientras tu cuenta esté activa. Al eliminarla, se borran perfil, ciclos y documentos; tus aportes a la comunidad se anonimizan.',
          ],
        },
        {
          h: '6. Tus derechos (RGPD)',
          p: [
            'Puedes acceder, rectificar, suprimir, portar y oponerte al tratamiento escribiendo a soporte@fertimind.es. También puedes reclamar ante la AEPD (aepd.es).',
          ],
        },
        {
          h: '7. Encargados y transferencias',
          p: [
            'Usamos Google Cloud (Firebase) como infraestructura y Stripe como procesador de pagos web, con garantías contractuales y cláusulas contractuales tipo cuando aplica.',
          ],
        },
        {
          h: '8. Cookies',
          p: [
            'Cookies esenciales para el funcionamiento (sesión, preferencias) y métricas anónimas. Gestiona tus preferencias desde el banner de la primera visita o en tu navegador. Detalle completo en la Política de Cookies.',
          ],
        },
      ]}
    />
  );
}
