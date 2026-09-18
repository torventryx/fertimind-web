import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/legal/terminos',
  title: 'Condiciones de Uso',
  description: 'Condiciones que regulan el acceso y uso de la app y la web de FertiMind.',
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Condiciones de Uso"
      updated="18 de septiembre de 2026"
      sections={[
        { h: 'Aceptación', p: ['Al utilizar FertiMind aceptas estas Condiciones. Si no estás de acuerdo, por favor no utilices el servicio.'] },
        { h: 'Uso permitido', p: ['Usar la app y la web de forma lícita y conforme a estas Condiciones.', 'No realizar ingeniería inversa, extracción automatizada o usos que perjudiquen el servicio.', 'Respetar los derechos de propiedad intelectual sobre contenidos, marcas y software.'] },
        { h: 'Cuenta y seguridad', p: ['Eres responsable de la confidencialidad de tus credenciales y de las actividades realizadas con tu cuenta.'] },
        { h: 'Contenido del usuario', p: ['Conservas la titularidad de tu contenido. Nos concedes una licencia limitada para alojarlo y mostrarlo con el fin de prestar el servicio, incluida la exhibición pública de las publicaciones de la comunidad en la web.'] },
        { h: 'Compras y pagos', p: [
          'Modelo freemium: el acceso de lectura y la comunidad son gratis. El acceso completo a los cursos premium se adquiere con un pago único (7,99 €, con ofertas puntuales posibles).',
          'App: la compra se realiza mediante compras integradas de Apple/Google; su facturación y reembolsos se rigen por las condiciones de cada tienda.',
          'Web: la compra se procesa mediante Stripe. El acceso queda vinculado a tu cuenta FertiMind y es válido en app y web.',
          'Restauración: puedes restaurar compras anteriores desde la app o iniciando sesión en la web con la misma cuenta.',
        ] },
        { h: 'Disponibilidad y cambios', p: ['Podemos mejorar, actualizar o interrumpir temporalmente el servicio para mantenimiento, notificando cambios relevantes.'] },
        { h: 'Responsabilidad', p: ['El servicio se proporciona «tal cual». FertiMind ofrece información y apoyo, no consejos médicos: para decisiones de salud consulta siempre a tu equipo médico. En la medida permitida por la ley, no seremos responsables por daños indirectos.'] },
        { h: 'Directorio de clínicas', p: ['El directorio tiene finalidad informativa y no implica recomendación ni relación comercial con las clínicas listadas, salvo indicación expresa.'] },
        { h: 'Enlaces y servicios de terceros', p: ['La app y la web pueden contener enlaces a terceros (clínicas, Google Sign-In, Stripe) bajo sus propios términos y políticas.'] },
        { h: 'Contacto', p: ['Para dudas sobre estas Condiciones: soporte@fertimind.es.'] },
      ]}
    />
  );
}
