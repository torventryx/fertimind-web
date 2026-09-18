'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { auth, db as clientDb } from '@/lib/auth-firestore';
import { t, type Locale } from '@/lib/i18n';

export default function AccountCard({ locale }: { locale: Locale }) {
  const [user, setUser] = useState<User | null>(null);
  const [paid, setPaid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(clientDb, 'users', u.uid));
        setPaid(snap.exists() && snap.data().paid_access === true);
      } else {
        setPaid(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return <div className="mx-auto h-48 max-w-md animate-pulse rounded-3xl bg-lilacSoft" />;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-plum/10 bg-white p-6 text-center">
        <p className="text-sm text-ink/70">{t('login_body', locale)}</p>
        <a
          href={locale === 'en' ? '/en/login' : '/login'}
          className="mt-4 inline-block rounded-full bg-plum px-5 py-2 text-sm font-semibold text-white"
        >
          {t('nav_login', locale)}
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="rounded-3xl border border-plum/10 bg-white p-6">
        <p className="text-xs uppercase tracking-wide text-ink/40">
          {locale === 'en' ? 'Signed in as' : 'Sesión iniciada'}
        </p>
        <p className="mt-1 truncate text-lg font-semibold text-plum">{user.email}</p>
        <div className="mt-4 rounded-2xl bg-lilacSoft p-4">
          {paid === null ? (
            <p className="text-sm text-ink/70">{t('pay_stripe_soon', locale)}</p>
          ) : paid ? (
            <p className="text-sm font-semibold text-sage">
              ✓ {locale === 'en' ? 'Full access — thank you!' : 'Acceso completo — ¡gracias!'}
            </p>
          ) : (
            <div>
              <p className="text-sm text-ink/70">{t('courses_paywall_body', locale)}</p>
              <a
                href={locale === 'en' ? '/en/pay' : '/pagar'}
                className="mt-3 inline-block rounded-full bg-coralAction px-5 py-2 text-sm font-semibold text-white"
              >
                {t('courses_unlock', locale)}
              </a>
            </div>
          )}
        </div>
        <button
          onClick={() => signOut(auth)}
          className="mt-4 text-sm font-medium text-ink/50 underline"
        >
          {locale === 'en' ? 'Sign out' : 'Cerrar sesión'}
        </button>
      </div>
    </div>
  );
}
