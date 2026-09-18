'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/auth';
import { t, type Locale } from '@/lib/i18n';

export default function SiteHeader({ locale }: { locale: Locale }) {
  const [user, setUser] = useState<User | null | 'loading'>('loading');
  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u)), []);

  const links: { href: string; label: string }[] = [
    { href: locale === 'en' ? '/en/forums' : '/foros', label: t('nav_forum', locale) },
    { href: locale === 'en' ? '/en/courses' : '/cursos', label: t('nav_courses', locale) },
    { href: locale === 'en' ? '/en/clinics' : '/clinicas', label: t('nav_clinics', locale) },
    { href: locale === 'en' ? '/en#download' : '/#descargar', label: t('nav_download', locale) },
  ];
  const other = locale === 'en' ? { href: '/', label: 'ES' } : { href: '/en', label: 'EN' };

  return (
    <header className="sticky top-0 z-40 border-b border-plum/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href={locale === 'en' ? '/en' : '/'} className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/fertimind_logo_icon_light.png" alt="FertiMind" width={32} height={32} />
          <span className="text-lg font-bold text-plum">FertiMind</span>
        </Link>
        <nav className="hidden items-center gap-6 text-[15px] font-medium text-ink/80 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-coralAction">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href={other.href}
            className="rounded-full border border-plum/20 px-2.5 py-1 text-xs font-semibold text-plum/70"
            hrefLang={other.href === '/en' ? 'en' : 'es'}
          >
            {other.label}
          </Link>
          {user === 'loading' ? (
            <span className="h-9 w-20 animate-pulse rounded-full bg-lilacSoft" />
          ) : user ? (
            <Link
              href={locale === 'en' ? '/en/account' : '/cuenta'}
              className="rounded-full bg-plum px-4 py-2 text-sm font-semibold text-white"
            >
              {t('nav_account', locale)}
            </Link>
          ) : (
            <Link
              href={locale === 'en' ? '/en/login' : '/login'}
              className="rounded-full bg-plum px-4 py-2 text-sm font-semibold text-white"
            >
              {t('nav_login', locale)}
            </Link>
          )}
        </div>
      </div>
      <nav className="flex items-center justify-around border-t border-plum/10 px-4 py-2 text-sm font-medium text-ink/80 md:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
