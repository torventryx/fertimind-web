'use client';

import { useState } from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth } from '@/lib/auth';
import { db as clientDb } from '@/lib/auth-firestore';
import { t, type Locale } from '@/lib/i18n';

/** Redirige a ?from=<ruta misma origen> si venimos de un hilo/categoría,
 *  si no a Mi cuenta. Así desaparece el bug «inicia sesión otra vez». */
function redirectTarget(locale: Locale): string {
  try {
    const from = new URLSearchParams(window.location.search).get('from');
    if (from && from.startsWith('/') && !from.startsWith('//')) return from;
  } catch {
    /* noop */
  }
  return locale === 'en' ? '/en/account' : '/cuenta';
}

/**
 * Registro web (paridad con la app): crea la cuenta de Auth, el perfil
 * mínimo en users/{uid} (rules: create si uid coincide) y pide
 * verificación de email. Si el perfil ya existe (cuenta de la app), no
 * se toca nada.
 */
async function ensureProfile(uid: string, email: string, displayName?: string) {
  const ref = doc(clientDb, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;
  const name = (displayName || '').trim();
  const parts = name.split(/\s+/).filter(Boolean);
  await setDoc(ref, {
    uid,
    email,
    ...(parts.length ? { firstName: parts[0], ...(parts[1] ? { lastName: parts.slice(1).join(' ') } : {}) } : {}),
    role: 'user',
    email_verified: false,
    hasCompletedOnboarding: false,
    isProfileComplete: false,
    is_deleted: false,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
}

export default function LoginCard({ locale }: { locale: Locale }) {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const es = locale === 'en' ? false : true;

  function friendly(err: string): string {
    if (err.includes('email-already-in-use'))
      return es ? 'Ya existe una cuenta con este email. Prueba a entrar.' : 'An account already exists with this email. Try signing in.';
    if (err.includes('invalid-email')) return es ? 'Email no válido.' : 'Invalid email.';
    if (err.includes('weak-password'))
      return es ? 'La contraseña debe tener al menos 6 caracteres.' : 'Password must be at least 6 characters.';
    if (err.includes('wrong-password') || err.includes('invalid-credential'))
      return es ? 'Email o contraseña incorrectos.' : 'Incorrect email or password.';
    if (err.includes('too-many-requests'))
      return es ? 'Demasiados intentos. Espera un momento.' : 'Too many attempts. Please wait.';
    return err;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === 'up') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() });
        await ensureProfile(cred.user.uid, email, name);
        sendEmailVerification(cred.user).catch(() => {});
        window.location.href = redirectTarget(locale);
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = redirectTarget(locale);
    } catch (err) {
      setError(friendly((err as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    setError(null);
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      await ensureProfile(cred.user.uid, cred.user.email || '', cred.user.displayName || '');
      window.location.href = redirectTarget(locale);
    } catch (err) {
      setError(friendly((err as Error).message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-3xl border border-plum/10 bg-white p-6 fm-shadow-card">
      {/* Pestañas Entrar / Crear cuenta */}
      <div className="mb-4 grid grid-cols-2 rounded-full bg-lilacSoft p-1 text-sm font-semibold">
        <button
          onClick={() => setMode('in')}
          className={`rounded-full px-4 py-2 transition ${mode === 'in' ? 'bg-white text-plum shadow-sm' : 'text-plum/60'}`}
        >
          {t('nav_login', locale)}
        </button>
        <button
          onClick={() => setMode('up')}
          className={`rounded-full px-4 py-2 transition ${mode === 'up' ? 'bg-white text-plum shadow-sm' : 'text-plum/60'}`}
        >
          {es ? 'Crear cuenta' : 'Sign up'}
        </button>
      </div>

      <h1 className="text-xl font-bold text-plum">
        {mode === 'in' ? t('login_title', locale) : es ? 'Únete a FertiMind' : 'Join FertiMind'}
      </h1>
      <p className="mt-2 text-sm text-ink/70">
        {mode === 'in'
          ? t('login_body', locale)
          : es
            ? 'La misma cuenta que en la app: comunidad, cursos y foros privados. Gratis.'
            : 'The same account as in the app: community, courses and private forums. Free.'}
      </p>

      <button
        onClick={google}
        disabled={busy}
        className="mt-4 w-full rounded-full border border-plum/20 bg-white px-4 py-2.5 text-sm font-semibold text-plum disabled:opacity-50"
      >
        {t('login_google', locale)}
      </button>
      <div className="my-4 flex items-center gap-3 text-xs text-ink/40">
        <span className="h-px flex-1 bg-plum/10" /> {es ? 'o' : 'or'}{' '}
        <span className="h-px flex-1 bg-plum/10" />
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === 'up' && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={es ? 'Nombre y apellidos' : 'Full name'}
            className="w-full rounded-xl border border-plum/15 px-3.5 py-2.5 text-sm"
          />
        )}
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
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={es ? 'contraseña (mín. 6)' : 'password (min. 6)'}
          className="w-full rounded-xl border border-plum/15 px-3.5 py-2.5 text-sm"
        />
        {error && <p className="text-xs text-coralAction">{error}</p>}
        {info && <p className="text-xs text-sage">{info}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-plum px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? '…' : mode === 'in' ? t('nav_login', locale) : es ? 'Crear mi cuenta' : 'Create account'}
        </button>
      </form>

      {mode === 'up' && (
        <p className="mt-3 text-[11px] leading-4 text-ink/45">
          {es
            ? 'Al crear la cuenta aceptas la Política de privacidad y los Términos de uso. Te enviaremos un email de verificación.'
            : 'By creating an account you accept the Privacy policy and Terms of use. We will send you a verification email.'}
        </p>
      )}
    </div>
  );
}
