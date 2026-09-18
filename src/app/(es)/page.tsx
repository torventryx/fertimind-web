import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { SITE, t } from '@/lib/i18n';
import { recentThreads } from '@/lib/content';
import { forumSections } from '@/data/taxonomy';
import PostTeaser from '@/components/PostTeaser';
import { listCourses } from '@/lib/content';

export const revalidate = 900;

export const metadata: Metadata = pageMetadata({
  locale: 'es',
  path: '/',
  title: 'FertiMind — comunidad, cursos y apoyo en reproducción asistida',
  description: SITE.es.description,
});

function fmtDate(d: Date | null) {
  if (!d) return '';
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function HomePage() {
  const [threads, courses] = await Promise.all([recentThreads(6), listCourses()]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-lilacSoft via-cream to-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <span className="inline-block rounded-full bg-sageSoft px-3 py-1 text-xs font-semibold text-sage">
            {t('home_free_badge', 'es')} · es / en
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight text-plum sm:text-5xl">
            El camino de la fertilidad es un viaje.{' '}
            <span className="text-coralAction">No lo recorras sola.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink/70">
            Foros por etapa y tratamiento, cursos con base científica y el modo embarazo que te
            acompaña después de la beta positiva. La comunidad es gratis y siempre lo será.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/foros"
              className="rounded-full bg-coralAction px-7 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-coralAction/90"
            >
              {t('home_hero_cta_forum', 'es')}
            </Link>
            <Link
              href="/cursos"
              className="rounded-full border border-plum/25 bg-white px-7 py-3 text-base font-semibold text-plum transition hover:border-plum/50"
            >
              {t('home_hero_cta_courses', 'es')}
            </Link>
          </div>
        </div>
      </section>

      {/* Foros */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-plum">Foros por donde vas</h2>
            <p className="mt-1 text-ink/60">Del estimulación a la betaespera: tu etapa tiene nombre.</p>
          </div>
          <Link href="/foros" className="text-sm font-semibold text-coralAction">
            Ver los 16 →
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {forumSections
            .flatMap((s) => s.categories)
            .filter((c) =>
              ['betaespera', 'estimulacion', 'ovodonacion', 'emocional', 'historias-exito', 'conectamos', 'primer-trimestre', 'resultados'].includes(c.id),
            )
            .map((c) => (
              <Link
                key={c.id}
                href={`/foros/${c.id}`}
                className="rounded-2xl border border-plum/10 bg-white p-4 transition hover:border-coral/40"
              >
                <span className="text-xl">{c.emoji}</span>
                <p className="mt-1.5 text-[15px] font-semibold text-plum">{c.name}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-ink/55">{c.description}</p>
              </Link>
            ))}
        </div>
      </section>

      {/* Conversación reciente */}
      {threads.length > 0 && (
        <section className="bg-lilacSoft/40 py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-plum">La conversación de hoy</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {threads.map((th) => (
                <PostTeaser
                  key={th.id}
                  locale="es"
                  href={`/foros/${th.categoryId}/${th.id}`}
                  title={th.title}
                  excerpt={th.excerpt}
                  authorName={th.authorName}
                  date={fmtDate(th.createdAt)}
                  commentCount={th.commentCount}
                  pinned={th.isWeeklyThread}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cursos */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-plum">Cursos con base científica</h2>
            <p className="mt-1 text-ink/60">
              Escritos con referencias reales: ESHRE, ASRM, NICE, SEF, OMS. Empiezan gratis.
            </p>
          </div>
          <Link href="/cursos" className="text-sm font-semibold text-coralAction">
            Ver todos →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              href={`/cursos/${c.id}`}
              className="overflow-hidden rounded-3xl border border-plum/10 bg-white transition hover:border-coral/40 hover:shadow-sm"
            >
              {c.thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.thumbnailUrl} alt={c.title} className="aspect-video w-full object-cover" width={800} height={450} />
              )}
              <div className="p-5">
                <h3 className="font-semibold text-plum">{c.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink/60">{c.description}</p>
                <p className="mt-3 text-xs text-ink/45">
                  {c.modules.length} {t('courses_modules', 'es')} ·{' '}
                  {c.modules.reduce((n, m) => n + m.lessons.length, 0)} {t('courses_lessons', 'es')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* App CTA */}
      <section className="bg-plum py-14 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold">Lleva FertiMind contigo</h2>
          <p className="mx-auto mt-2 max-w-xl text-white/70">
            La app completa incluye tu seguimiento de ciclo, diario, calendario de medicación y
            recordatorios: todo tu tratamiento en el bolsillo.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://apps.apple.com/us/app/fertimind/id6751907485"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-plum"
            >
               App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.fertimind.fiv"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-plum"
            >
              ▶ Google Play
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
