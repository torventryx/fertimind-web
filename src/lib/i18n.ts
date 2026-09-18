// Diccionario es/en de la web. El español es el locale por defecto (raíz /),
// el inglés vive bajo /en. Solo dos locales: coincide con la app.

export type Locale = 'es' | 'en';

export const SITE = {
  name: 'FertiMind',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://fertimind.es',
  es: {
    tagline: 'El camino de la fertilidad es un viaje. No lo recorras sola.',
    description:
      'Comunidad, cursos con base científica y herramientas para tu tratamiento de reproducción asistida: betaespera, FIV, ovodonación y más. Gratis y en español.',
  },
  en: {
    tagline: 'The fertility path is a journey. Don\'t walk it alone.',
    description:
      'Community, science-based courses and tools for your assisted reproduction journey: two-week wait, IVF, egg donation and more. Free and in Spanish & English.',
  },
} as const;

type Dict = Record<string, { es: string; en: string }>;

const dict: Dict = {
  nav_forum: { es: 'Foros', en: 'Forums' },
  nav_courses: { es: 'Cursos', en: 'Courses' },
  nav_clinics: { es: 'Clínicas', en: 'Clinics' },
  nav_login: { es: 'Entrar', en: 'Sign in' },
  nav_account: { es: 'Mi cuenta', en: 'My account' },
  nav_download: { es: 'Descargar la app', en: 'Get the app' },

  home_hero_cta_forum: { es: 'Entra a la comunidad', en: 'Join the community' },
  home_hero_cta_courses: { es: 'Explora los cursos', en: 'Explore courses' },
  home_free_badge: { es: 'Gratis para siempre', en: 'Free forever' },

  forum_title: { es: 'Foros de fertilidad', en: 'Fertility forums' },
  forum_subtitle: {
    es: '16 espacios por etapa y tratamiento, con mujeres que están viviendo lo mismo que tú.',
    en: '16 spaces by stage and treatment, with women living what you are living.',
  },
  forum_threads: { es: 'hilos', en: 'threads' },
  forum_empty: { es: 'Aún no hay hilos públicos en esta categoría. ¡Sé la primera!', en: 'No public threads here yet. Be the first!' },
  forum_back: { es: '← Todos los foros', en: '← All forums' },
  forum_new_thread_app: {
    es: 'Para publicar, responde o dar apoyo entra desde la app o inicia sesión.',
    en: 'To post, reply or show support, come in from the app or sign in.',
  },

  comments_title: { es: 'Respuestas', en: 'Replies' },
  comments_empty: { es: 'Sin respuestas todavía.', en: 'No replies yet.' },

  pregnancy_gate_title: { es: 'Anuncio de embarazo', en: 'Pregnancy announcement' },
  pregnancy_gate_body: {
    es: 'Este hilo contiene un anuncio de embarazo. Si estás en plena búsqueda puede doler: lee solo cuando te sientas preparada.',
    en: 'This thread contains a pregnancy announcement. If you are still trying, it may hurt: read only when you feel ready.',
  },
  pregnancy_gate_show: { es: 'Quiero leerlo', en: 'I want to read it' },

  courses_title: { es: 'Cursos con base científica', en: 'Science-based courses' },
  courses_subtitle: {
    es: 'Manuales claros con referencias reales (ESHRE, ASRM, NICE, SEF…). Los primeros módulos son gratis.',
    en: 'Clear guides with real references (ESHRE, ASRM, NICE, SEF…). The first modules are free.',
  },
  courses_premium: { es: 'Premium', en: 'Premium' },
  courses_free: { es: 'Gratis', en: 'Free' },
  courses_modules: { es: 'módulos', en: 'modules' },
  courses_lessons: { es: 'lecciones', en: 'lessons' },
  courses_minutes: { es: 'min', en: 'min' },
  courses_unlock: { es: 'Desbloquear todo por 7,99 € (pago único)', en: 'Unlock everything for €7.99 (one-time)' },
  courses_paywall_title: { es: 'Esta lección es premium', en: 'This lesson is premium' },
  courses_paywall_body: {
    es: 'Desbloquea todos los cursos con un único pago de 7,99 €. Sin suscripciones: tuyo para siempre.',
    en: 'Unlock every course with a single €7.99 payment. No subscriptions: yours forever.',
  },
  courses_locked: { es: 'Lección bloqueada', en: 'Locked lesson' },

  clinics_title: { es: 'Directorio de clínicas de fertilidad', en: 'Fertility clinic directory' },
  clinics_subtitle: {
    es: 'Clínicas de reproducción asistida en España, con la experiencia de la comunidad FertiMind.',
    en: 'Assisted reproduction clinics in Spain, together with the FertiMind community experience.',
  },
  clinics_disclaimer: {
    es: 'Este directorio es informativo y no implica recomendación médica. Verifica siempre la situación registral y los resultados de cada clínica en el registro de la SEF (Sociedad Española de Fertilidad).',
    en: 'This directory is informational and is not a medical recommendation. Always check each clinic\'s registration and results in the SEF (Spanish Fertility Society) registry.',
  },
  clinics_see_web: { es: 'Web oficial', en: 'Official website' },
  clinics_community: { es: 'Conversaciones relacionadas', en: 'Related conversations' },

  login_title: { es: 'Entra a FertiMind', en: 'Sign in to FertiMind' },
  login_body: {
    es: 'Usa la misma cuenta que en la app. El progreso, la comunidad y tus cursos te esperan también aquí.',
    en: 'Use the same account as in the app. Your progress, community and courses are waiting here too.',
  },
  login_google: { es: 'Continuar con Google', en: 'Continue with Google' },

  pay_once: { es: 'Pago único 7,99 €', en: 'One-time payment €7.99' },
  pay_error_generic: {
    es: 'No hemos podido iniciar el pago. Inténtalo de nuevo en unos segundos.',
    en: 'We could not start the payment. Please try again in a few seconds.',
  },
  pay_error_session: {
    es: 'Tu sesión ha caducado. Inicia sesión de nuevo y vuelve a intentarlo.',
    en: 'Your session has expired. Please sign in again and retry.',
  },

  footer_legal_privacy: { es: 'Política de privacidad', en: 'Privacy policy' },
  footer_legal_terms: { es: 'Términos de uso', en: 'Terms of use' },
  footer_legal_cookies: { es: 'Política de cookies', en: 'Cookie policy' },
  footer_contact: { es: 'Contacto', en: 'Contact' },
  footer_delete: { es: 'Eliminar cuenta', en: 'Delete account' },
  footer_medical: {
    es: 'FertiMind ofrece información y apoyo, no consejos médicos. Para decisiones de salud, consulta siempre a tu equipo médico.',
    en: 'FertiMind provides information and support, not medical advice. For health decisions, always consult your medical team.',
  },

  cookie_text: {
    es: 'Usamos cookies propias mínimas para que la web funcione y métricas anónimas para mejorarla. ¿Te parece bien?',
    en: 'We use minimal first-party cookies to run the site and anonymous metrics to improve it. Is that OK?',
  },
  cookie_ok: { es: 'Aceptar', en: 'Accept' },

  translated_note: { es: 'Traducido automáticamente', en: 'Automatically translated' },
};

export function t(key: string, locale: Locale = 'es'): string {
  const entry = dict[key];
  if (!entry) return key;
  return entry[locale];
}

/** Prefijo de ruta para el locale (vacío para es, /en para en). */
export function lp(locale: Locale): string {
  return locale === 'en' ? '/en' : '';
}
