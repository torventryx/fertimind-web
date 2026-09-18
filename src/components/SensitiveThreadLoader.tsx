'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/auth';
import { t, lp, type Locale } from '@/lib/i18n';

interface ApiComment {
  id: string;
  content: string;
  authorName: string;
  authorUsername: string | null;
  createdAt: string | null;
}

interface ApiThread {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  authorName: string;
  authorUsername: string | null;
  createdAt: string | null;
  isPregnancyAnnouncement: boolean;
}

function fmtDate(iso: string | null, locale: Locale) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-GB' : 'es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Carga un hilo de categoría sensible solo con sesión iniciada.
 * El contenido NUNCA está en el HTML prerenderizado: se pide a /api/thread
 * con el ID token de Firebase. Sin sesión → invitación a entrar.
 */
export default function SensitiveThreadLoader({
  postId,
  locale,
}: {
  postId: string;
  locale: Locale;
}) {
  const [state, setState] = useState<'loading' | 'guest' | 'error' | 'ready'>('loading');
  const [data, setData] = useState<{ thread: ApiThread; comments: ApiComment[] } | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState('guest');
        return;
      }
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/thread', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ postId }),
        });
        if (!res.ok) throw new Error(String(res.status));
        setData(await res.json());
        setState('ready');
      } catch {
        setState('error');
      }
    });
    return unsub;
  }, [postId]);

  const base = lp(locale);

  if (state === 'loading') {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="h-8 w-2/3 animate-pulse rounded-xl bg-lilacSoft" />
        <div className="h-28 animate-pulse rounded-2xl bg-white" />
        <div className="h-28 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (state === 'guest') {
    return (
      <div className="rounded-3xl border border-plum/10 bg-white p-8 text-center fm-shadow-card">
        <span className="text-3xl">🔒</span>
        <h2 className="mt-3 text-xl font-bold text-plum">
          {locale === 'en' ? 'A space just for members' : 'Un espacio solo para la comunidad'}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/70">
          {locale === 'en'
            ? 'This forum talks about results, positives and loss — intimate moments. To protect everyone who shares here, you need to be signed in to read it.'
            : 'Este foro habla de resultados, positivos y pérdidas — momentos íntimos. Para proteger a quien comparte aquí, hace falta iniciar sesión para leerlo.'}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href={`${base}${locale === 'en' ? '/login' : '/login'}`}
            className="rounded-full bg-coralAction px-6 py-2.5 text-sm font-semibold text-white"
          >
            {t('nav_login', locale)}
          </Link>
          <Link
            href={`${base}${locale === 'en' ? '/forums' : '/foros'}`}
            className="rounded-full border border-plum/25 px-6 py-2.5 text-sm font-semibold text-plum"
          >
            {t('forum_back', locale)}
          </Link>
        </div>
        <p className="mt-4 text-xs text-ink/45">
          {locale === 'en'
            ? 'The rest of the forums are open to everyone.'
            : 'El resto de foros queda abierto a todo el mundo.'}
        </p>
      </div>
    );
  }

  if (state === 'error' || !data) {
    return (
      <div className="rounded-3xl border border-coral/30 bg-white p-8 text-center">
        <p className="text-sm text-ink/70">
          {locale === 'en' ? 'We could not load this thread.' : 'No hemos podido cargar este hilo.'}
        </p>
        <button
          onClick={() => location.reload()}
          className="mt-3 rounded-full border border-plum/25 px-5 py-2 text-sm font-semibold text-plum"
        >
          {locale === 'en' ? 'Retry' : 'Reintentar'}
        </button>
      </div>
    );
  }

  const { thread, comments } = data;

  return (
    <div>
      <h1 className="text-2xl font-bold leading-snug text-plum sm:text-3xl">{thread.title}</h1>
      <p className="mt-2 text-xs text-ink/50">
        {thread.authorUsername ? `@${thread.authorUsername}` : thread.authorName} ·{' '}
        {fmtDate(thread.createdAt, locale)}
      </p>
      <div className="mt-6 whitespace-pre-wrap rounded-2xl border border-plum/10 bg-white p-5 text-[15px] leading-7">
        {thread.content}
      </div>
      <section className="mt-10">
        <h2 className="text-lg font-bold text-plum">
          {t('comments_title', locale)} ({comments.length})
        </h2>
        <div className="mt-4 space-y-3">
          {comments.length === 0 && (
            <p className="rounded-2xl bg-lilacSoft p-5 text-sm text-ink/60">
              {t('comments_empty', locale)}
            </p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="rounded-2xl border border-plum/10 bg-white p-4">
              <p className="text-xs text-ink/50">
                <span className="font-semibold text-plum/80">
                  {c.authorUsername ? `@${c.authorUsername}` : c.authorName}
                </span>{' '}
                · {fmtDate(c.createdAt, locale)}
              </p>
              <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-7">{c.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
