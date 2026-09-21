'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  applyActionCode,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { auth } from '@/lib/auth';
import { lp, type Locale } from '@/lib/i18n';

type Mode = 'resetPassword' | 'verifyEmail' | 'recoverEmail' | null;
type State = 'loading' | 'form' | 'done' | 'error';

/**
 * Manejador de las acciones de email de Firebase Auth
 * (/action?mode=…&oobCode=…): restablecer contraseña y verificar email.
 * Es la URL configurada en Auth → Plantillas → URL de acción del proyecto.
 */
export default function AuthAction({ locale }: { locale: Locale }) {
  const params = useSearchParams();
  const es = locale === 'es';
  const [state, setState] = useState<State>('loading');
  const [mode, setMode] = useState<Mode>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const m = params.get('mode') as Mode;
    const oob = params.get('oobCode');
    setMode(m);
    if (!m || !oob) {
      setErrorMsg(es ? 'Falta información en el enlace.' : 'The link is missing information.');
      setState('error');
      return;
    }
    if (m === 'resetPassword') {
      verifyPasswordResetCode(auth, oob)
        .then(() => setState('form'))
        .catch(() => setState('error'));
    } else if (m === 'verifyEmail') {
      applyActionCode(auth, oob)
        .then(() => setState('done'))
        .catch(() => setState('error'));
    } else if (m === 'recoverEmail') {
      setState('done');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const oob = params.get('oobCode');
    if (!oob) return;
    if (password.length < 6) {
      setErrorMsg(es ? 'La contraseña debe tener al menos 6 caracteres.' : 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setErrorMsg(es ? 'Las contraseñas no coinciden.' : 'Passwords do not match.');
      return;
    }
    setBusy(true);
    setErrorMsg(null);
    try {
      await confirmPasswordReset(auth, oob, password);
      setState('done');
    } catch {
      setState('error');
    } finally {
      setBusy(false);
    }
  }

  const base = lp(locale);

  const wrap = 'rounded-3xl border border-plum/10 bg-white p-8 fm-shadow-card';
  const title = 'text-xl font-bold text-plum';
  const body = 'mt-2 text-sm leading-6 text-ink/70';

  if (state === 'loading') {
    return <div className="mx-auto h-48 max-w-md animate-pulse rounded-3xl bg-lilacSoft" />;
  }

  if (state === 'error') {
    return (
      <div className={`${wrap} text-center`}>
        <p className="text-3xl">⏳</p>
        <h1 className={`${title} mt-3`}>{es ? 'El enlace ya no es válido' : 'This link is no longer valid'}</h1>
        <p className={body}>
          {es
            ? 'Los enlaces de email caducan por seguridad y solo pueden usarse una vez. Solicita uno nuevo y vuelve a intentarlo.'
            : 'Email links expire for security reasons and can only be used once. Please request a new one and try again.'}
        </p>
        <Link
          href={`${base}/login`}
          className="mt-5 inline-block rounded-full bg-plum px-6 py-2.5 text-sm font-semibold text-white"
        >
          {es ? 'Ir a iniciar sesión' : 'Go to sign in'}
        </Link>
        {errorMsg && <p className="mt-3 text-xs text-coralAction">{errorMsg}</p>}
      </div>
    );
  }

  if (mode === 'resetPassword' && state === 'form') {
    return (
      <div className={wrap}>
        <h1 className={title}>{es ? 'Elige tu nueva contraseña' : 'Choose a new password'}</h1>
        <p className={body}>
          {es
            ? 'Escribe la nueva contraseña de tu cuenta de FertiMind (mínimo 6 caracteres).'
            : 'Enter the new password for your FertiMind account (minimum 6 characters).'}
        </p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={es ? 'nueva contraseña' : 'new password'}
            className="w-full rounded-xl border border-plum/15 px-3.5 py-2.5 text-sm"
          />
          <input
            type="password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={es ? 'repite la contraseña' : 'repeat password'}
            className="w-full rounded-xl border border-plum/15 px-3.5 py-2.5 text-sm"
          />
          {errorMsg && <p className="text-xs text-coralAction">{errorMsg}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-coralAction px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? '…' : es ? 'Guardar contraseña' : 'Save password'}
          </button>
        </form>
      </div>
    );
  }

  // done (verifyEmail / resetPassword completado / recoverEmail informativo)
  return (
    <div className={`${wrap} text-center`}>
      <p className="text-4xl">{mode === 'verifyEmail' ? '✅' : '🔒'}</p>
      <h1 className={`${title} mt-3`}>
        {mode === 'verifyEmail'
          ? es
            ? '¡Email verificado!'
            : 'Email verified!'
          : es
            ? 'Contraseña actualizada'
            : 'Password updated'}
      </h1>
      <p className={body}>
        {mode === 'verifyEmail'
          ? es
            ? 'Tu cuenta de FertiMind ya está verificada. Ya puedes disfrutar de la comunidad y tus cursos.'
            : 'Your FertiMind account is now verified. Enjoy the community and your courses.'
          : es
            ? 'Tu contraseña se ha guardado correctamente. Ya puedes entrar con ella.'
            : 'Your password has been saved. You can now sign in with it.'}
      </p>
      <Link
        href={`${base}/login`}
        className="mt-5 inline-block rounded-full bg-plum px-6 py-2.5 text-sm font-semibold text-white"
      >
        {es ? 'Iniciar sesión' : 'Sign in'}
      </Link>
    </div>
  );
}
