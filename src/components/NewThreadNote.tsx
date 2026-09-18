'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/auth';
import { t, lp, type Locale } from '@/lib/i18n';

/**
 * Nota final de las páginas de foro, consciente de la sesión:
 *  - invitada → invita a entrar (podrá responder en los hilos)
 *  - con sesión → solo recuerda que los hilos NUEVOS se publican desde la app
 *    (nunca le vuelve a pedir "iniciar sesión" a quien ya la tiene).
 */
export default function NewThreadNote({ locale }: { locale: Locale }) {
  const [user, setUser] = useState<'loading' | null | 'in'>('loading');
  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u ? 'in' : null)), []);

  const base = lp(locale);

  if (user === 'loading') return null;

  if (user === null) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-plum/20 bg-white/60 p-5 text-sm text-ink/60">
        {locale === 'en' ? (
          <>
            <Link href={`${base}/login`} className="font-semibold text-coralAction">
              Sign in
            </Link>{' '}
            to reply to any thread. To start new threads, use the app.
          </>
        ) : (
          <>
            <Link href={`${base}/login`} className="font-semibold text-coralAction">
              Inicia sesión
            </Link>{' '}
            para responder en cualquier hilo. Para publicar hilos nuevos, entra desde la app.
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-2xl bg-lilacSoft/60 p-5 text-sm text-ink/60">
      {locale === 'en'
        ? 'You can reply to any thread right here. To start new threads, use the FertiMind app.'
        : 'Puedes responder en cualquier hilo directamente aquí. Para publicar hilos nuevos, usa la app de FertiMind.'}
    </div>
  );
}
