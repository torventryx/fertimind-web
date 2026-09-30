'use client';

import Link from 'next/link';
import { useState } from 'react';
import { t, type Locale } from '@/lib/i18n';

export type CourseCard = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  level: string | null;
  category: string | null;
  track: 'embarazo' | 'ra';
  moduleCount: number;
  lessonCount: number;
  hasPremium: boolean;
};

/**
 * Explorador de cursos con pestañas: Reproducción asistida / Embarazo.
 * Cliente puro sobre datos serializados desde el servidor (estático).
 */
export default function CoursesTabs({
  locale,
  courses,
}: {
  locale: Locale;
  courses: CourseCard[];
}) {
  const embarazo = courses.filter((c) => c.track === 'embarazo');
  const ra = courses.filter((c) => c.track === 'ra');
  const [tab, setTab] = useState<'ra' | 'embarazo'>(ra.length ? 'ra' : 'embarazo');
  const shown = tab === 'ra' ? ra : embarazo;

  const tabBtn = (key: 'ra' | 'embarazo', label: string, count: number) => (
    <button
      onClick={() => setTab(key)}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
        tab === key
          ? 'bg-plum text-white shadow-sm'
          : 'border border-plum/20 bg-white text-plum/70 hover:border-plum/40'
      }`}
      aria-pressed={tab === key}
    >
      {label}
      <span className={`ml-2 text-xs ${tab === key ? 'text-white/70' : 'text-plum/40'}`}>
        {count}
      </span>
    </button>
  );

  return (
    <div>
      <div className="mt-8 flex flex-wrap items-center gap-2" role="tablist">
        {tabBtn('ra', t('courses_tab_ra', locale), ra.length)}
        {tabBtn('embarazo', t('courses_tab_embarazo', locale), embarazo.length)}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="tabpanel">
        {shown.map((c) => (
          <Link
            key={c.id}
            href={locale === 'en' ? `/en/courses/${c.id}` : `/cursos/${c.id}`}
            className="overflow-hidden rounded-3xl border border-plum/10 bg-white transition hover:border-coral/40 hover:shadow-sm"
          >
            {c.thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.thumbnailUrl}
                alt={c.title}
                className="aspect-video w-full object-cover"
                width={800}
                height={450}
              />
            )}
            <div className="p-5">
              <h2 className="font-semibold text-plum">{c.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-ink/60">{c.description}</p>
              <p className="mt-3 text-xs text-ink/45">
                {c.moduleCount} {t('courses_modules', locale)} · {c.lessonCount}{' '}
                {t('courses_lessons', locale)}
                {c.hasPremium ? ' · ★ Premium' : ''}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
