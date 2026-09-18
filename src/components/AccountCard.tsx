'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '@/lib/auth';
import { db as clientDb } from '@/lib/auth-firestore';
import { t, lp, type Locale } from '@/lib/i18n';

interface Profile {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  createdAt?: string | null;
  emailVerified?: boolean;
  paidAccess?: boolean | null;
  paidSource?: string | null;
  paidUpdatedAt?: string | null;
  countryName?: string | null;
  memberNumber?: string | null;
  supporter?: boolean | null;
}

function fmtDate(iso: string | null, locale: Locale) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-GB' : 'es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="text-xs uppercase tracking-wide text-ink/40">{label}</span>
      <span className="text-right text-sm font-medium text-ink/85">{value}</span>
    </div>
  );
}

export default function AccountCard({ locale }: { locale: Locale }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(clientDb, 'users', u.uid));
        const d = snap.data() ?? {};
        const country = d['country'] as { name?: string } | null | undefined;
        setProfile({
          firstName: (d['firstName'] as string) || undefined,
          lastName: (d['lastName'] as string) || undefined,
          username: (d['username'] as string) || undefined,
          email: (d['email'] as string) || u.email || undefined,
          createdAt: d['created_at']?.toDate?.().toISOString() ?? null,
          emailVerified: d['email_verified'] === true || u.emailVerified,
          paidAccess:
            d['paid_access'] === true ? true : d['paid_access'] === false ? false : null,
          paidSource: (d['paid_access_source'] as string) || null,
          paidUpdatedAt: d['paid_access_updated_at']?.toDate?.().toISOString() ?? null,
          countryName: country?.name ?? null,
          memberNumber: u.uid.slice(0, 8).toUpperCase(),
          supporter: d['supporter'] === true ? true : null,
        });
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const base = lp(locale);
  const es = locale === 'es';

  if (loading) {
    return <div className="mx-auto h-64 max-w-lg animate-pulse rounded-3xl bg-lilacSoft" />;
  }

  if (!user || !profile) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-plum/10 bg-white p-6 text-center fm-shadow-card">
        <p className="text-sm text-ink/70">{t('login_body', locale)}</p>
        <Link
          href={`${base}/login`}
          className="mt-4 inline-block rounded-full bg-plum px-5 py-2 text-sm font-semibold text-white"
        >
          {t('nav_login', locale)}
        </Link>
      </div>
    );
  }

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || null;
  const initial = (profile.firstName || profile.email || 'F').charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {/* Perfil */}
      <div className="rounded-3xl border border-plum/10 bg-white p-6 fm-shadow-card">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-plum text-xl font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0">
            {profile.username ? (
              <p className="truncate text-lg font-bold text-plum">@{profile.username}</p>
            ) : (
              <p className="truncate text-lg font-bold text-plum">{fullName ?? 'Usuaria'}</p>
            )}
            {profile.username && fullName && (
              <p className="truncate text-sm text-ink/60">{fullName}</p>
            )}
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-ink/50">
              {profile.email}
              {profile.emailVerified && <span className="text-sage">✓</span>}
            </p>
          </div>
        </div>

        <div className="mt-5 divide-y divide-plum/5">
          <Row label={es ? 'Email' : 'Email'} value={profile.email ?? '—'} />
          <Row
            label={es ? 'Usuario' : 'Username'}
            value={profile.username ? `@${profile.username}` : es ? '—' : '—'}
          />
          <Row
            label={es ? 'Miembro desde' : 'Member since'}
            value={fmtDate(profile.createdAt ?? null, locale) || '—'}
          />
          {profile.countryName && (
            <Row label={es ? 'País' : 'Country'} value={profile.countryName} />
          )}
          <Row label={es ? 'Cuenta' : 'Account'} value={`FertiMind · #${profile.memberNumber}`} />
        </div>
      </div>

      {/* Acceso premium */}
      <div className="rounded-3xl border border-plum/10 bg-white p-6 fm-shadow-card">
        <p className="text-xs uppercase tracking-wide text-ink/40">
          {es ? 'Acceso' : 'Access'}
        </p>
        {profile.supporter && (
          <div className="mt-2 rounded-2xl bg-goldSoft p-4">
            <p className="font-semibold text-gold">
              🤍 {es ? 'Apoyadora de FertiMind' : 'FertiMind supporter'}
            </p>
            <p className="mt-1 text-xs leading-5 text-ink/60">
              {es
                ? 'Gracias por sostener este proyecto para un sector sin visibilidad.'
                : 'Thank you for sustaining this project for an invisible sector.'}
            </p>
          </div>
        )}
        <div className={profile.supporter ? 'mt-3' : 'mt-2'}>
        {profile.paidAccess === true ? (
          <div className="mt-2 rounded-2xl bg-sageSoft p-4">
            <p className="font-semibold text-sage">
              ✦ {es ? 'FertiMind Premium — acceso completo' : 'FertiMind Premium — full access'}
            </p>
            <p className="mt-1 text-xs leading-5 text-ink/60">
              {es ? 'Todos los cursos desbloqueados' : 'All courses unlocked'}
              {profile.paidSource === 'stripe' ? ' · web' : profile.paidSource === 'revenuecat' ? ' · app' : ''}
              {profile.paidUpdatedAt
                ? ` · ${es ? 'desde' : 'since'} ${fmtDate(profile.paidUpdatedAt, locale)}`
                : ''}
            </p>
          </div>
        ) : (
          // Sin paid_access (campo ausente) también es "sin premium": misma
          // tarjeta de mejora. Nunca más el aviso "se activará en breve".
          <div className="mt-2 rounded-2xl bg-lilacSoft p-4">
            <p className="text-sm text-ink/70">{t('courses_paywall_body', locale)}</p>
            <Link
              href={`${base}${es ? '/pagar' : '/pay'}`}
              className="mt-3 inline-block rounded-full bg-coralAction px-5 py-2 text-sm font-semibold text-white"
            >
              {t('courses_unlock', locale)}
            </Link>
          </div>
        )}
        </div>
        {profile.paidAccess !== true && (
          <p className="mt-3 text-xs text-ink/45">
            {es ? '¿Solo quieres apoyar el proyecto? ' : 'Just want to support the project? '}
            <Link href={`${base}${es ? '/apoyar' : '/support'}`} className="font-semibold text-gold hover:underline">
              🤍 {es ? 'Apoya FertiMind' : 'Support FertiMind'}
            </Link>
          </p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-plum/10 bg-white p-5 fm-shadow-card">
        <button
          onClick={() => signOut(auth)}
          className="text-sm font-medium text-ink/60 underline hover:text-coralAction"
        >
          {es ? 'Cerrar sesión' : 'Sign out'}
        </button>
        <div className="flex gap-4 text-sm">
          <Link href={`${base}${es ? '/cursos' : '/courses'}`} className="text-coralAction hover:underline">
            {es ? 'Mis cursos' : 'My courses'}
          </Link>
          <Link href={`${base}${es ? '/contacto' : '/contact'}`} className="text-coralAction hover:underline">
            {t('footer_contact', locale)}
          </Link>
          <Link
            href={`${base}${es ? '/eliminar-cuenta' : '/delete-account'}`}
            className="text-ink/40 hover:underline"
          >
            {t('footer_delete', locale)}
          </Link>
        </div>
      </div>
    </div>
  );
}
