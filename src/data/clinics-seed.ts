// Directorio de clínicas de reproducción asistida en España.
// SOLO datos públicos verificables (nombre, ciudad, web oficial verificada).
// Las valoraciones se enriquecen con Google Places API cuando esté
// configurada GOOGLE_PLACES_API_KEY (ver src/lib/places.ts).
// El listado no es un ranking: está ordenado alfabéticamente y crecerá
// con el tiempo. Fuentes de verificación de dominios: búsqueda directa
// de cada web oficial (2026-09).

export interface Clinic {
  slug: string;
  name: string;
  nameEn: string;
  city: string;
  cityEn: string;
  website: string;
  /** Texto descriptivo factual y neutro (sin promesas de resultados). */
  about: string;
  aboutEn: string;
  /** Categorías del foro más relacionadas (para cruzar con la comunidad). */
  tags: string[];
}

export const clinics: Clinic[] = [
  {
    slug: 'dexeus-mujer', name: 'Dexeus Mujer', nameEn: 'Dexeus Mujer',
    city: 'Barcelona', cityEn: 'Barcelona', website: 'https://www.dexeus.com',
    about: 'Centro de medicina de la reproducción con larga trayectoria en Barcelona, integrado en el grupo Quirónsalud. Ofrece el abanico completo de tratamientos de reproducción asistida.',
    aboutEn: 'Long-established reproduction medicine centre in Barcelona, part of the Quirónsalud group. Offers the full range of assisted reproduction treatments.',
    tags: ['general', 'ovodonacion', 'preservacion'],
  },
  {
    slug: 'eugin', name: 'Eugin', nameEn: 'Eugin',
    city: 'Barcelona', cityEn: 'Barcelona', website: 'https://www.eugin.es',
    about: 'Clínica de reproducción asistida con sede en Barcelona y presencia internacional, especialmente conocida por sus programas de ovodonación.',
    aboutEn: 'Assisted reproduction clinic headquartered in Barcelona with an international presence, especially known for its egg donation programmes.',
    tags: ['ovodonacion', 'general'],
  },
  {
    slug: 'ginefiv', name: 'Ginefiv', nameEn: 'Ginefiv',
    city: 'Madrid', cityEn: 'Madrid', website: 'https://www.ginefiv.com',
    about: 'Clínica de fertilidad madrileña fundada en los años 80, con amplio catálogo de tratamientos incluyendo FIV, ICSI y diagnóstico genético preimplantacional.',
    aboutEn: 'Madrid fertility clinic founded in the 1980s, with a broad treatment catalogue including IVF, ICSI and preimplantation genetic testing.',
    tags: ['dgp', 'general'],
  },
  {
    slug: 'ginemed', name: 'Ginemed', nameEn: 'Ginemed',
    city: 'Sevilla', cityEn: 'Seville', website: 'https://ginemed.es',
    about: 'Grupo andaluz de medicina de la reproducción con sede en Sevilla y clínicas en varias ciudades españolas.',
    aboutEn: 'Andalusian reproductive medicine group headquartered in Seville with clinics in several Spanish cities.',
    tags: ['general', 'ia'],
  },
  {
    slug: 'instituto-bernabeu', name: 'Instituto Bernabeu', nameEn: 'Instituto Bernabeu',
    city: 'Alicante', cityEn: 'Alicante', website: 'https://www.institutobernabeu.com',
    about: 'Instituto alicantino de reproducción asistida con proyección internacional y unidades en varias ciudades españolas. Destaca en medicina reproductiva y genética.',
    aboutEn: 'Alicante-based assisted reproduction institute with international reach and units in several Spanish cities. Noted for reproductive medicine and genetics.',
    tags: ['dgp', 'ovodonacion', 'general'],
  },
  {
    slug: 'ivi', name: 'IVI (IVI RMA)', nameEn: 'IVI (IVI RMA)',
    city: 'Madrid y toda España', cityEn: 'Madrid & all Spain', website: 'https://ivi.es',
    about: 'La mayor red de clínicas de fertilidad de España (más de 30 centros), parte del grupo internacional IVI RMA. Sede histórica en Alicante y clínicas por todo el país.',
    aboutEn: 'Spain\'s largest fertility clinic network (30+ centres), part of the international IVI RMA group. Historic HQ in Alicante and clinics across the country.',
    tags: ['general', 'ovodonacion', 'preservacion'],
  },
  {
    slug: 'quironsalud', name: 'Quirónsalud — Unidades de Reproducción', nameEn: 'Quirónsalud — Reproduction Units',
    city: 'Varias ciudades', cityEn: 'Several cities', website: 'https://www.quironsalud.es',
    about: 'El grupo hospitalario privado más grande de España opera unidades de reproducción asistida en sus hospitales de Madrid, Barcelona y otras ciudades.',
    aboutEn: 'Spain\'s largest private hospital group runs assisted reproduction units in its hospitals across Madrid, Barcelona and other cities.',
    tags: ['general'],
  },
  {
    slug: 'tambre', name: 'Clínica Tambre', nameEn: 'Clínica Tambre',
    city: 'Madrid', cityEn: 'Madrid', website: 'https://www.clinicatambre.com',
    about: 'Clínica de fertilidad del barrio de Chamartín (Madrid), una de las pioneras de la reproducción asistida en España, con fuerte orientación a pacientes internacionales.',
    aboutEn: 'Fertility clinic in Madrid\'s Chamartín district, one of Spain\'s assisted reproduction pioneers, with a strong focus on international patients.',
    tags: ['ovodonacion', 'general'],
  },
  {
    slug: 'ur-vistahermosa', name: 'UR Vistahermosa', nameEn: 'UR Vistahermosa',
    city: 'Alicante', cityEn: 'Alicante', website: 'https://urvistahermosa.com',
    about: 'Centro histórico del grupo UR en Alicante con más de 40 años de experiencia en reproducción asistida y unidad de medicina fetal propia.',
    aboutEn: 'Historic UR group centre in Alicante with over 40 years of experience in assisted reproduction and its own fetal medicine unit.',
    tags: ['general', 'ovodonacion'],
  },
  {
    slug: 'imfer-murcia', name: 'IMFER Murcia', nameEn: 'IMFER Murcia',
    city: 'Murcia', cityEn: 'Murcia', website: 'https://imfer.com',
    about: 'Instituto Murciano de Fertilidad, uno de los centros pioneros de la Región de Murcia, con laboratorio propio y más de 25 años de trayectoria.',
    aboutEn: 'The Murcian Fertility Institute, one of the pioneering centres in the Region of Murcia, with its own laboratory and over 25 years of history.',
    tags: ['general', 'preservacion'],
  },
  {
    slug: 'tahe-fertilidad', name: 'Tahe Fertilidad', nameEn: 'Tahe Fertilidad',
    city: 'Murcia', cityEn: 'Murcia', website: 'https://tahefertilidad.com',
    about: 'Unidad de reproducción asistida de la Fundación Tahe en Murcia, conocida por su trato cercano y su trabajo en infertilidad femenina y masculina.',
    aboutEn: 'Assisted reproduction unit of the Tahe Foundation in Murcia, known for its close care and work on female and male infertility.',
    tags: ['general', 'ovodonacion'],
  },
  {
    slug: 'vida-fertility', name: 'Vida Fertility Institute', nameEn: 'Vida Fertility Institute',
    city: 'Madrid', cityEn: 'Madrid', website: 'https://vidafertility.com',
    about: 'Clínica de fertilidad madrileña de reciente creación que se ha situado entre las mejor valoradas de España, con laboratorio propio y ciclos muy personalizados.',
    aboutEn: 'Recently founded Madrid fertility clinic that has become one of the best rated in Spain, with its own laboratory and highly personalised cycles.',
    tags: ['general', 'dgp'],
  },
  {
    slug: 'ivi-mallorca', name: 'IVI Mallorca', nameEn: 'IVI Mallorca',
    city: 'Palma de Mallorca', cityEn: 'Palma de Mallorca', website: 'https://ivi.es/clinicas/mallorca/',
    about: 'Centro del grupo IVI RMA en Palma con FIV, inseminación artificial, ovodonación y preservación de la fertilidad para las pacientes de Baleares.',
    aboutEn: 'IVI RMA group centre in Palma offering IVF, artificial insemination, egg donation and fertility preservation for patients in the Balearic Islands.',
    tags: ['general', 'ovodonacion'],
  },
  {
    slug: 'ivi-las-palmas', name: 'IVI Las Palmas', nameEn: 'IVI Las Palmas',
    city: 'Las Palmas de Gran Canaria', cityEn: 'Las Palmas de Gran Canaria', website: 'https://ivi.es/clinicas/las-palmas/',
    about: 'Clínica del grupo IVI RMA en Gran Canaria: diagnóstico de fertilidad, FIV y ovodonación sin salir de las islas.',
    aboutEn: 'IVI RMA group clinic in Gran Canaria: fertility diagnostics, IVF and egg donation without leaving the islands.',
    tags: ['general', 'ovodonacion'],
  },
  {
    slug: 'ivi-tenerife', name: 'IVI Tenerife', nameEn: 'IVI Tenerife',
    city: 'Santa Cruz de Tenerife', cityEn: 'Santa Cruz de Tenerife', website: 'https://ivi.es',
    about: 'Centro del grupo IVI RMA en Tenerife con tratamientos de reproducción asistida completa y equipo multidisciplinar.',
    aboutEn: 'IVI RMA group centre in Tenerife with full assisted reproduction treatments and a multidisciplinary team.',
    tags: ['general', 'ia'],
  },
  {
    slug: 'instituto-bernabeu-mallorca', name: 'Instituto Bernabeu Mallorca', nameEn: 'Instituto Bernabeu Mallorca',
    city: 'Palma de Mallorca', cityEn: 'Palma de Mallorca', website: 'https://www.institutobernabeu.com',
    about: 'Centro del Instituto Bernabeu en Palma: medicina reproductiva de alta complejidad, ovodonación y unidad de medicina fetal.',
    aboutEn: 'Instituto Bernabeu centre in Palma: high-complexity reproductive medicine, egg donation and a fetal medicine unit.',
    tags: ['general', 'ovodonacion'],
  },
];

export const clinicsBySlug: Record<string, Clinic> = Object.fromEntries(
  clinics.map((c) => [c.slug, c]),
);
