import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata, faqJsonLd } from '@/lib/seo';
import { SITE } from '@/lib/i18n';
import { recentThreads, listCourses } from '@/lib/content';
import { forumSections } from '@/data/taxonomy';
import PostTeaser from '@/components/PostTeaser';
import JsonLd from '@/components/JsonLd';

export const revalidate = 900;

const APP_STORE = 'https://apps.apple.com/us/app/fertimind/id6751907485';
const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.fertimind.fiv';

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/',
  title: 'FertiMind — fertility community & science-based courses',
  description:
    'What FertiMind is: the app and community in Spanish & English for your fertility journey. Forums by stage (two-week wait, IVF, egg donation), science-based courses and pregnancy mode. Free, no ads.',
});

const FAQ = [
  {
    q: 'What is FertiMind?',
    a: 'FertiMind is an app and a community in Spanish (with English support) for women and couples going through a fertility journey: natural trying, IUI, IVF, egg donation, preservation or pregnancy after assisted reproduction. It brings together support forums by stage, science-based courses and treatment tracking tools.',
  },
  {
    q: 'Is FertiMind free?',
    a: 'Yes. The community, the forums and the start of every course are free with no ads. Full courses unlock with a single €7.99 payment (no subscription), which also grants access on the web.',
  },
  {
    q: 'Who writes the courses?',
    a: 'Courses are written and reviewed against real scientific societies: ESHRE (Europe), ASRM (US), NICE (UK), SEF (Spain) and WHO. They are quality information to understand your treatment — not a substitute for your medical team.',
  },
  {
    q: 'Are forum conversations private?',
    a: 'General forums are public so other women can find help through Google. Intimate spaces (beta results, first trimester, interruptions & loss, success stories) are members-only: they are never indexed or shown on search engines.',
  },
  {
    q: 'Do I need the app to participate?',
    a: 'You can read and reply in the open forums from the web by signing in. To start new threads, track your cycle, keep a diary, manage medication calendars and reminders we recommend the app, available on iOS and Android.',
  },
  {
    q: 'Does FertiMind give medical advice?',
    a: 'No. FertiMind offers vetted information and emotional support, never medical recommendations. For health decisions always consult your fertility team.',
  },
];

export default async function HomeEn() {
  const [threads, courses] = await Promise.all([recentThreads(3), listCourses()]);
  return (
    <div lang="en">
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
            description: SITE.en.description,
            inLanguage: 'en',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
          },
        ]}
      />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="fm-hero-blob">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-sageSoft px-3.5 py-1.5 text-xs font-semibold text-sage">
              ✦ Free forever · no ads · es / en
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-plum sm:text-5xl">
              The fertility path is a journey.{' '}
              <span className="fm-gradient-text">Don&apos;t walk it alone.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink/70">
              FertiMind is the app and community in Spanish for your assisted reproduction
              treatment: forums by stage, science-based courses and a pregnancy mode that stays
              with you after the positive test.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={APP_STORE} className="rounded-full bg-plum px-7 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-plumDeep">
                 Download for iOS
              </a>
              <a href={PLAY_STORE} className="rounded-full bg-night px-7 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-night/85">
                ▶ Download for Android
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/60">
              <Link href="/en/forums" className="font-semibold text-coralAction hover:underline">
                Or explore the community from your browser →
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] fm-shadow-lift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/hero.jpg"
                alt="Woman having coffee at home, a calm self-care moment"
                width={960}
                height={480}
                className="aspect-[2/1] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-6 hidden rounded-2xl border border-plum/10 bg-white/95 px-5 py-3 fm-shadow-card sm:block">
              <p className="text-xs font-semibold text-plum">16 forums by stage</p>
              <p className="text-xs text-ink/55">from stimulation to the first trimester</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IT IS ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16" id="what-is">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-plum">What is FertiMind?</h2>
            <div className="mt-4 space-y-4 text-[16px] leading-7 text-ink/75">
              <p>
                FertiMind was born from a simple idea: no one should go through fertility treatment
                feeling lost or alone. It is a mobile app and a website that gather, in Spanish,
                what actually helps during the process: <strong>people who understand you</strong>,{' '}
                <strong>reliable information</strong> and <strong>tools designed for each
                stage</strong>.
              </p>
              <p>
                The community is organized into <strong>16 forums by stage and treatment</strong> —
                stimulation, retrieval &amp; transfer, two-week wait, egg donation, ROPA, PGT-A,
                preservation, emotional wellbeing… — so you find conversations that match your
                exact moment, not a generic board.
              </p>
              <p>
                The <strong>courses</strong> explain every step with a scientific basis and real
                references (ESHRE, ASRM, NICE, SEF, WHO), without jargon or false promises. And
                when the positive arrives, <strong>pregnancy mode</strong> supports the first weeks
                with the same care.
              </p>
            </div>
          </div>
          <div className="grid content-start gap-4 sm:grid-cols-2">
            {[
              { n: '16', l: 'forums by stage and treatment' },
              { n: '€7.99', l: 'one-time payment for every course: no subscription, yours forever' },
              { n: '5', l: 'courses with scientific references' },
              { n: '2', l: 'languages: Spanish and English' },
            ].map((s) => (
              <div key={s.l} className="rounded-3xl border border-plum/10 bg-white p-6 fm-shadow-card">
                <p className="text-3xl font-extrabold text-coralAction">{s.n}</p>
                <p className="mt-1.5 text-sm leading-5 text-ink/65">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────────────── */}
      <section className="bg-lilacSoft/40 py-16" id="who-for">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-plum">Who is it for?</h2>
          <p className="mt-2 max-w-2xl text-ink/65">
            Whatever your starting point, there is a place for you. FertiMind accompanies every
            fertility path, without judging anyone&apos;s pace or decisions.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '🌱',
                title: 'Trying or thinking about it',
                body: 'You want to understand your cycle, spot your fertile window and clear questions before taking the step.',
              },
              {
                icon: '💉',
                title: 'You are in treatment',
                body: 'IUI, IVF, egg donation, ROPA, PGT-A or preservation: specific forums and step-by-step courses.',
              },
              {
                icon: '⏳',
                title: 'You are in the two-week wait',
                body: 'The longest days: symptoms, anxiety and real support from women living it with you.',
              },
              {
                icon: '🤍',
                title: 'You have experienced loss',
                body: 'A cared-for space for interruptions and loss, with company and no imposed timelines.',
              },
              {
                icon: '👶',
                title: 'Pregnant after ART',
                body: 'Pregnancy mode and a first-trimester forum: progesterone, scans and calm.',
              },
              {
                icon: '🤝',
                title: 'Partner, family or ally',
                body: 'There is room for those who accompany too: understanding the process is the best way to support.',
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

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16" id="how-it-works">
        <h2 className="text-3xl font-bold text-plum">How it works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              n: '1',
              t: 'Download the app (or use the web)',
              d: 'Free, no ads, in Spanish with English support. Create your account in under a minute.',
            },
            {
              n: '2',
              t: 'Pick your stage and treatment',
              d: 'The community is organized in 16 forums: from stimulation to the first trimester. You switch forums as your moment changes.',
            },
            {
              n: '3',
              t: 'Community + courses + tracking',
              d: 'Talk with women in your same phase, learn with a scientific basis and log your cycle, medication and symptoms.',
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

      {/* ── FORUMS (secondary) ───────────────────────────────────────── */}
      <section className="bg-plum py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Forums for where you are</h2>
              <p className="mt-2 max-w-xl text-white/70">
                From stimulation to the two-week wait: your stage has a name and has people.
                Intimate spaces (results, loss) are private for members.
              </p>
            </div>
            <Link href="/en/forums" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-plum">
              See all 16 forums →
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {forumSections
              .flatMap((s) => s.categories)
              .filter((c) => ['estimulacion', 'betaespera', 'ovodonacion', 'emocional', 'puncion-transfer', 'conectamos'].includes(c.id))
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/en/forums/${c.id}`}
                  className="rounded-2xl border border-white/15 bg-white/5 p-4 transition hover:border-white/40 hover:bg-white/10"
                >
                  <span className="text-xl">{c.emoji}</span>
                  <p className="mt-1.5 text-[15px] font-semibold">{c.nameEn}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-white/60">{c.descriptionEn}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ── RECENT THREADS ───────────────────────────────────────────── */}
      {threads.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-plum">Today&apos;s conversation</h2>
              <p className="mt-1 text-ink/60">Recent threads from the community (mostly in Spanish).</p>
            </div>
            <Link href="/en/forums" className="text-sm font-semibold text-coralAction">
              See more →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {threads.map((th) => (
              <PostTeaser
                key={th.id}
                locale="en"
                href={`/en/forums/${th.categoryId}/${th.id}`}
                title={th.title}
                excerpt={th.excerpt}
                authorName={th.authorName}
                date={th.createdAt?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) || ''}
                commentCount={th.commentCount}
                pinned={th.isWeeklyThread}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── COURSES ──────────────────────────────────────────────────── */}
      <section className="bg-lilacSoft/40 py-16" id="courses">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-plum">Science-based courses</h2>
              <p className="mt-2 max-w-2xl text-ink/65">
                Written with real references (ESHRE, ASRM, NICE, SEF, WHO). First modules are free;
                the full catalogue unlocks with a single €7.99 payment. Courses are in Spanish.
              </p>
            </div>
            <Link href="/en/courses" className="text-sm font-semibold text-coralAction">
              See all →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((c) => (
              <Link
                key={c.id}
                href={`/en/courses/${c.id}`}
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16" id="download">
        <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-plum via-plum to-plumDeep p-8 text-white sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-bold">Take FertiMind with you</h2>
              <p className="mt-3 max-w-xl text-white/75">
                The full app includes cycle tracking, a diary, medication calendar, reminders and
                the whole community. Free and without ads.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={APP_STORE} className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-plum transition hover:bg-white/90">
                   Download on the App Store
                </a>
                <a href={PLAY_STORE} className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-plum transition hover:bg-white/90">
                  ▶ Get it on Google Play
                </a>
              </div>
            </div>
            <ul className="space-y-2.5 text-sm text-white/80">
              {[
                'Forums by stage and treatment',
                'Science-based courses (es/en)',
                'Diary and cycle tracking',
                'Medication calendar and reminders',
                'Pregnancy mode after the positive',
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
        <h2 className="text-3xl font-bold text-plum">Frequently asked questions</h2>
        <div className="mt-6 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-plum/10 bg-white p-5">
              <summary className="cursor-pointer list-none font-semibold text-plum marker:hidden">
                <span className="mr-2 inline-block text-coralAction transition group-open:rotate-90">▸</span>
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
