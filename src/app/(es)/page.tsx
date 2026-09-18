import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata, faqJsonLd } from '@/lib/seo';
import { SITE, t } from '@/lib/i18n';
import { recentThreads } from '@/lib/content';
import { forumSections } from '@/data/taxonomy';
import PostTeaser from '@/components/PostTeaser';
import { listCourses } from '@/lib/content';
import JsonLd from '@/components/JsonLd';

export const revalidate = 900;

const APP_STORE = 'https://apps.apple.com/us/app/fertimind/id6751907485';
const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.fertimind.fiv';

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/',
  title: 'FertiMind — fertilidad, comunidad y cursos de reproducción asistida',
  description:
    'Qué es FertiMind: la app y comunidad en español para tu camino de fertilidad. Foros por etapa (betaespera, FIV, ovodonación), cursos con base científica y modo embarazo. Gratis y sin anuncios.',
});

const FAQ = [
  {
    q: '¿Qué es FertiMind?',
    a: 'FertiMind es una app y una comunidad en español para mujeres y parejas que atraviesan un camino de fertilidad: búsqueda natural, inseminación artificial, FIV, ovodonación, preservación o embarazo tras reproducción asistida. Combina foros de apoyo por etapa, cursos divulgativos con base científica y herramientas de seguimiento de tu tratamiento.',
  },
  {
    q: '¿FertiMind es gratis?',
    a: 'Sí. La comunidad, los foros y el inicio de los cursos son gratis y sin anuncios. Los cursos completos se desbloquean con un único pago de 7,99 € (sin suscripción), que también te da acceso en la web.',
  },
  {
    q: '¿Quién escribe los cursos?',
    a: 'Los cursos están escritos y revisados con referencias de sociedades científicas reales: ESHRE (Europa), ASRM (EE. UU.), NICE (Reino Unido), SEF (España) y la OMS. No sustituyen a tu equipo médico: son divulgación de calidad para entender tu tratamiento.',
  },
  {
    q: '¿Mis conversaciones en el foro son privadas?',
    a: 'Los foros generales son públicos para que otras mujeres puedan encontrar ayuda buscando en Google. Los espacios íntimos (resultados de la beta, primer trimestre, interrupciones y pérdidas, historias de éxito) solo se leen con cuenta: no se indexan ni aparecen en buscadores.',
  },
  {
    q: '¿Necesito la app para participar?',
    a: 'Puedes leer y responder los foros abiertos desde la web iniciando sesión con tu cuenta. Para publicar hilos nuevos, el seguimiento de ciclo, el diario, el calendario de medicación y los recordatorios te recomendamos la app, disponible para iOS y Android.',
  },
  {
    q: '¿FertiMind ofrece consejos médicos?',
    a: 'No. FertiMind ofrece información contrastada y apoyo emocional, pero ninguna recomendación médica. Para decisiones de salud consulta siempre a tu equipo de fertilidad.',
  },
];

function fmtDate(d: Date | null) {
  if (!d) return '';
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function HomePage() {
  const [threads, courses] = await Promise.all([recentThreads(3), listCourses()]);

  return (
    <div>
      <JsonLd
        data={[
          faqJsonLd(FAQ),
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'FertiMind',
            applicationCategory: 'HealthApplication',
            operatingSystem: 'iOS, Android',
            url: SITE.url,
            description: SITE.es.description,
            inLanguage: 'es',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
          },
        ]}
      />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="fm-hero-blob">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-sageSoft px-3.5 py-1.5 text-xs font-semibold text-sage">
              ✦ {t('home_free_badge', 'es')} · sin anuncios · es / en
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-plum sm:text-5xl">
              El camino de la fertilidad es un viaje.{' '}
              <span className="fm-gradient-text">No lo recorras sola.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink/70">
              FertiMind es la app y la comunidad en español para tu tratamiento de reproducción
              asistida: foros por etapa, cursos con base científica y un modo embarazo que te
              acompaña después del positivo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={APP_STORE}
                className="rounded-full bg-plum px-7 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-plumDeep"
              >
                 Descargar para iOS
              </a>
              <a
                href={PLAY_STORE}
                className="rounded-full bg-night px-7 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-night/85"
              >
                ▶ Descargar para Android
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/60">
              <Link href="/foros" className="font-semibold text-coralAction hover:underline">
                O explora la comunidad desde el navegador →
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] fm-shadow-lift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/hero.jpg"
                alt="Mujer tomando un café en casa, en un momento de calma y autocuidado"
                width={960}
                height={480}
                className="aspect-[2/1] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-6 hidden rounded-2xl border border-plum/10 bg-white/95 px-5 py-3 fm-shadow-card sm:block">
              <p className="text-xs font-semibold text-plum">16 foros por etapa</p>
              <p className="text-xs text-ink/55">de la estimulación al primer trimestre</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUÉ ES ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16" id="que-es">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-plum">¿Qué es FertiMind?</h2>
            <div className="mt-4 space-y-4 text-[16px] leading-7 text-ink/75">
              <p>
                FertiMind nació de una idea sencilla: nadie debería enfrentarse a un tratamiento de
                fertilidad sintiéndose perdida ni sola. Es una app móvil y una web que reúnen, en
                español, todo lo que de verdad ayuda durante el proceso: <strong>personas que te
                entienden</strong>, <strong>información fiable</strong> y <strong>herramientas
                pensadas para cada etapa</strong>.
              </p>
              <p>
                La comunidad se organiza en <strong>16 foros por etapa y tratamiento</strong> —
                estimulación, punción y transferencia, betaespera, ovodonación, ROPA, DGP,
                preservación, bienestar emocional… — para que encuentres conversaciones que se
                ajusten exactamente a tu momento, no un tablón genérico.
              </p>
              <p>
                Los <strong>cursos</strong> explican cada paso con base científica y referencias
                reales (ESHRE, ASRM, NICE, SEF, OMS), sin jerga innecesaria ni promesas falsas. Y
                cuando llega el positivo, el <strong>modo embarazo</strong> acompaña las primeras
                semanas con la misma delicadeza.
              </p>
            </div>
          </div>
          <div className="grid content-start gap-4 sm:grid-cols-2">
            {[
              { n: '16', l: 'foros por etapa y tratamiento' },
              { n: '7,99 €', l: 'pago único por todos los cursos: sin suscripción, tuyos para siempre' },
              { n: '5', l: 'cursos con referencias científicas' },
              { n: '2', l: 'idiomas: español e inglés' },
            ].map((s) => (
              <div key={s.l} className="rounded-3xl border border-plum/10 bg-white p-6 fm-shadow-card">
                <p className="text-3xl font-extrabold text-coralAction">{s.n}</p>
                <p className="mt-1.5 text-sm leading-5 text-ink/65">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA QUIÉN ───────────────────────────────────────────────── */}
      <section className="bg-lilacSoft/40 py-16" id="para-quien">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-plum">¿Para quién es?</h2>
          <p className="mt-2 max-w-2xl text-ink/65">
            Sea cual sea tu punto de partida, hay un sitio para ti. FertiMind acompaña todos los
            caminos de la fertilidad, sin juzgar el ritmo ni la decisión de cada una.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '🌱',
                title: 'Estás buscando o pensando en buscar',
                body: 'Quieres entender tu ciclo, detectar tu ventana fértil y aclarar dudas antes de dar el paso.',
              },
              {
                icon: '💉',
                title: 'Estás en tratamiento',
                body: 'IA, FIV, ovodonación, ROPA, DGP o preservación: foros específicos y cursos paso a paso de cada fase.',
              },
              {
                icon: '⏳',
                title: 'Estás en la betaespera',
                body: 'Los días más largos: síntomas, ansiedad y apoyo real de mujeres que los están viviendo contigo.',
              },
              {
                icon: '🤍',
                title: 'Has vivido una pérdida',
                body: 'Un espacio cuidado para interrupciones y pérdidas, con compañía y sin plazos impuestos.',
              },
              {
                icon: '👶',
                title: 'Estás embarazada tras RA',
                body: 'Modo embarazo y foro de primer trimestre: progesterona, ecos y calma, con la comunidad que te vio llegar.',
              },
              {
                icon: '🤝',
                title: 'Eres pareja, familia o aliada',
                body: 'También hay sitio para quienes acompañan: entender el proceso es la mejor forma de sostener.',
              },
            ].map((c) => (
              <div key={c.title} className="rounded-3xl border border-plum/10 bg-white p-6 fm-shadow-card">
                <span className="text-2xl">{c.icon}</span>
                <h3 className="mt-3 font-bold text-plum">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-ink/65">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16" id="como-funciona">
        <h2 className="text-3xl font-bold text-plum">Cómo funciona</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              n: '1',
              t: 'Descarga la app (o entra en la web)',
              d: 'Gratis, sin anuncios y en español. Crea tu cuenta en menos de un minuto.',
            },
            {
              n: '2',
              t: 'Elige tu etapa y tratamiento',
              d: 'La comunidad se organiza en 16 foros: de la estimulación al primer trimestre. Cambias de foro cuando cambia tu momento.',
            },
            {
              n: '3',
              t: 'Comunidad + cursos + seguimiento',
              d: 'Conversa con mujeres en tu misma fase, aprende con base científica y registra tu ciclo, medicación y síntomas.',
            },
          ].map((s) => (
            <div key={s.n} className="relative rounded-3xl border border-plum/10 bg-white p-6 fm-shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-plum text-lg font-bold text-white">
                {s.n}
              </span>
              <h3 className="mt-4 font-bold text-plum">{s.t}</h3>
              <p className="mt-1.5 text-sm leading-6 text-ink/65">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOROS (secundario) ───────────────────────────────────────── */}
      <section className="bg-plum py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Foros por donde vas</h2>
              <p className="mt-2 max-w-xl text-white/70">
                Del estimulación a la betaespera: tu etapa tiene nombre y tiene gente. Los espacios
                íntimos (resultados, pérdidas) son privados para miembros.
              </p>
            </div>
            <Link
              href="/foros"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-plum"
            >
              Ver los 16 foros →
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {forumSections
              .flatMap((s) => s.categories)
              .filter((c) =>
                ['estimulacion', 'betaespera', 'ovodonacion', 'emocional', 'puncion-transfer', 'conectamos'].includes(
                  c.id,
                ),
              )
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/foros/${c.id}`}
                  className="rounded-2xl border border-white/15 bg-white/5 p-4 transition hover:border-white/40 hover:bg-white/10"
                >
                  <span className="text-xl">{c.emoji}</span>
                  <p className="mt-1.5 text-[15px] font-semibold">{c.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-white/60">{c.description}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ── CONVERSACIÓN RECIENTE ────────────────────────────────────── */}
      {threads.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-plum">La conversación de hoy</h2>
              <p className="mt-1 text-ink/60">Hilos recientes de la comunidad (foros abiertos).</p>
            </div>
            <Link href="/foros" className="text-sm font-semibold text-coralAction">
              Ver más →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {threads.map((th) => (
              <PostTeaser
                key={th.id}
                locale="es"
                href={`/foros/${th.categoryId}/${th.id}`}
                title={th.title}
                excerpt={th.excerpt}
                authorName={th.authorName}
                authorUsername={th.authorUsername}
                date={fmtDate(th.createdAt)}
                commentCount={th.commentCount}
                pinned={th.isWeeklyThread}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── CURSOS ───────────────────────────────────────────────────── */}
      <section className="bg-lilacSoft/40 py-16" id="cursos">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-plum">Cursos con base científica</h2>
              <p className="mt-2 max-w-2xl text-ink/65">
                Escritos con referencias reales: ESHRE, ASRM, NICE, SEF, OMS. Los primeros módulos
                son gratis; todo el catálogo se desbloquea con un único pago de 7,99 €.
              </p>
            </div>
            <Link href="/cursos" className="text-sm font-semibold text-coralAction">
              Ver todos →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((c) => (
              <Link
                key={c.id}
                href={`/cursos/${c.id}`}
                className="group overflow-hidden rounded-3xl border border-plum/10 bg-white transition hover:border-coral/40 hover:shadow-lg fm-shadow-card"
              >
                {c.thumbnailUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.thumbnailUrl}
                    alt={c.title}
                    className="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    width={800}
                    height={450}
                  />
                )}
                <div className="p-5">
                  <h3 className="font-bold text-plum">{c.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-ink/60">{c.description}</p>
                  <p className="mt-3 text-xs text-ink/45">
                    {c.modules.length} {t('courses_modules', 'es')} ·{' '}
                    {c.modules.reduce((n, m) => n + m.lessons.length, 0)}{' '}
                    {t('courses_lessons', 'es')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESCARGA ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16" id="descargar">
        <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-plum via-plum to-plumDeep p-8 text-white sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-bold">Lleva FertiMind contigo</h2>
              <p className="mt-3 max-w-xl text-white/75">
                La app completa incluye tu seguimiento de ciclo, diario, calendario de medicación,
                recordatorios y la comunidad al completo. Gratis y sin anuncios.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={APP_STORE}
                  className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-plum transition hover:bg-white/90"
                >
                   Descargar en App Store
                </a>
                <a
                  href={PLAY_STORE}
                  className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-plum transition hover:bg-white/90"
                >
                  ▶ Consíguela en Google Play
                </a>
              </div>
            </div>
            <ul className="space-y-2.5 text-sm text-white/80">
              {[
                'Foros por etapa y tratamiento',
                'Cursos con base científica (es/en)',
                'Diario y seguimiento de ciclo',
                'Calendario de medicación y recordatorios',
                'Modo embarazo tras el positivo',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-sageSoft">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-16" id="faq">
        <h2 className="text-3xl font-bold text-plum">Preguntas frecuentes</h2>
        <div className="mt-6 space-y-3">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-plum/10 bg-white p-5"
            >
              <summary className="cursor-pointer list-none font-semibold text-plum marker:hidden">
                <span className="mr-2 text-coralAction transition group-open:rotate-90 inline-block">▸</span>
                {f.q}
              </summary>
              <p className="mt-3 text-sm leading-6 text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
