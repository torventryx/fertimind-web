// Taxonomía canónica del foro — espejo de
// lib/features/community/data/forum_categories.dart (app) y de
// functions/scripts/migrate-community-to-forum.js (backend).
// Los ids son los document ids estables de community_categories.

export interface ForumCategory {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  emoji: string;
  /** Categorías donde puede haber anuncios de embarazo (velo opt-in). */
  mayContainPregnancyNews?: boolean;
}

export interface ForumSection {
  title: string;
  titleEn: string;
  categories: ForumCategory[];
}

export const forumSections: ForumSection[] = [
  {
    title: 'Tu viaje',
    titleEn: 'Your journey',
    categories: [
      { id: 'estimulacion', name: 'Estimulación y medicación', nameEn: 'Stimulation & medication',
        description: 'Hormonas, banderillas, folículos y protocolos',
        descriptionEn: 'Hormones, injections, follicles and protocols', emoji: '💧' },
      { id: 'puncion-transfer', name: 'Punción y transferencia', nameEn: 'Egg retrieval & transfer',
        description: 'Del quirófano a la espera del embrión',
        descriptionEn: 'From the operating room to the embryo wait', emoji: '🤍' },
      { id: 'betaespera', name: 'Betaespera', nameEn: 'The two-week wait',
        description: 'Los días más largos: síntomas, ansiedad y apoyo',
        descriptionEn: 'The longest days: symptoms, anxiety and support', emoji: '⏳' },
      { id: 'resultados', name: 'Resultados de la beta', nameEn: 'Beta results',
        description: 'El momento de la verdad, juntas',
        descriptionEn: 'The moment of truth, together', emoji: '🧪', mayContainPregnancyNews: true },
      { id: 'primer-trimestre', name: 'Primer trimestre', nameEn: 'First trimester',
        description: 'Positivo conseguido: progesterona, ecos y calma',
        descriptionEn: 'Positive achieved: progesterone, scans and calm', emoji: '👶', mayContainPregnancyNews: true },
    ],
  },
  {
    title: 'Tu tratamiento',
    titleEn: 'Your treatment',
    categories: [
      { id: 'ia', name: 'Inseminación Artificial', nameEn: 'Artificial insemination',
        description: 'IA en casa o en clínica',
        descriptionEn: 'IUI at home or at the clinic', emoji: '⚕️' },
      { id: 'ovodonacion', name: 'Ovodonación', nameEn: 'Egg donation',
        description: 'Donación de óvulos: esperando esa ilusión',
        descriptionEn: 'Egg donation: waiting for that dream', emoji: '🤝' },
      { id: 'ropa', name: 'Método ROPA', nameEn: 'ROPA method',
        description: 'Compartiendo la maternidad en pareja',
        descriptionEn: 'Sharing motherhood as a couple', emoji: '💛' },
      { id: 'dgp', name: 'DGP / PGT-A', nameEn: 'PGT-A / genetic testing',
        description: 'Diagnóstico genético preimplantacional',
        descriptionEn: 'Preimplantation genetic testing', emoji: '🧬' },
      { id: 'preservacion', name: 'Preservación de fertilidad', nameEn: 'Fertility preservation',
        description: 'Vitrificación de ovocitos y planificación',
        descriptionEn: 'Egg freezing and planning', emoji: '❄️' },
    ],
  },
  {
    title: 'Apoyo',
    titleEn: 'Support',
    categories: [
      { id: 'emocional', name: 'Bienestar emocional', nameEn: 'Emotional wellbeing',
        description: 'Ansiedad, pareja, trabajo y autocuidado',
        descriptionEn: 'Anxiety, partner, work and self-care', emoji: '🌿' },
      { id: 'diagnostico', name: 'Diagnósticos', nameEn: 'Diagnoses',
        description: 'Endometriosis, SOP, baja reserva, factor masculino…',
        descriptionEn: 'Endometriosis, PCOS, low reserve, male factor…', emoji: '📋' },
      { id: 'interrupciones', name: 'Interrupciones y pérdidas', nameEn: 'Interruptions & loss',
        description: 'Cuando el camino se detiene: cuidado y compañía',
        descriptionEn: 'When the journey pauses: care and company', emoji: '🕊️' },
      { id: 'historias-exito', name: 'Historias de éxito', nameEn: 'Success stories',
        description: 'Positivos reales de usuarias reales',
        descriptionEn: 'Real positives from real women', emoji: '☀️', mayContainPregnancyNews: true },
      { id: 'conectamos', name: '¿Conectamos?', nameEn: 'Let\'s connect?',
        description: 'Desahógate de lo que quieras: series, trabajo, vida… nos conocemos',
        descriptionEn: 'Vent about anything: shows, work, life… let\'s get to know each other', emoji: '☕' },
      { id: 'general', name: 'General', nameEn: 'General',
        description: 'Todo lo demás: charla, dudas y presentaciones',
        descriptionEn: 'Everything else: chat, questions and intros', emoji: '💬' },
    ],
  },
];

export const forumCategories: ForumCategory[] = forumSections.flatMap((s) => s.categories);

export const forumCategoriesById: Record<string, ForumCategory> = Object.fromEntries(
  forumCategories.map((c) => [c.id, c]),
);

export function categoryName(c: ForumCategory, locale: string): string {
  return locale === 'en' ? c.nameEn : c.name;
}

export function categoryDescription(c: ForumCategory, locale: string): string {
  return locale === 'en' ? c.descriptionEn : c.description;
}

export function sectionTitle(s: ForumSection, locale: string): string {
  return locale === 'en' ? s.titleEn : s.title;
}
