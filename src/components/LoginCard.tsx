'use client';

import { useState } from 'react';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/auth';
import { t, type Locale } from '@/lib/i18n';

export default function LoginCard({ locale }: { locale: Locale }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = locale === 'en' ? '/en/account' : '/cuenta';
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    setError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      window.location.href = locale === 'en' ? '/en/account' : '/cuenta';
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-3xl border border-plum/10 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold text-plum">{t('login_title', locale)}</h1>
      <p className="mt-2 text-sm text-ink/70">{t('login_body', locale)}</p>
      <button
        onClick={google}
        disabled={busy}
        className="mt-4 w-full rounded-full border border-plum/20 bg-white px-4 py-2.5 text-sm font-semibold text-plum disabled:opacity-50"
      >
        {t('login_google', locale)}
      </button>
      <div className="my-4 flex items-center gap-3 text-xs text-ink/40">
        <span className="h-px flex-1 bg-plum/10" /> {locale === 'en' ? 'or' : 'o'}{' '}
        <span className="h-px flex-1 bg-plum/10" />
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          className="w-full rounded-xl border border-plum/15 px-3.5 py-2.5 text-sm"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={locale === 'en' ? 'password' : 'contraseña'}
          className="w-full rounded-xl border border-plum/15 px-3.5 py-2.5 text-sm"
        />
        {error && <p className="text-xs text-coralAction">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-plum px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {t('nav_login', locale)}
        </button>
      </form>
    </div>
  );
}
