'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/auth';
import MarkdownLite from './MarkdownLite';
import Paywall from './Paywall';
import { type Locale } from '@/lib/i18n';

/**
 * Sirve el contenido premium SOLO tras verificación server-side:
 * la Cloud Function getLessonContent comprueba sesión + paid_access.
 * El markdown premium nunca viaja en el HTML inicial (SSR seguro).
 */
export default function PremiumLessonContent({ locale, courseId, lessonId }: {
  locale: Locale; courseId: string; lessonId: string;
}) {
  const [state, setState] = useState<'checking' | 'locked' | 'signed-out' | 'error'>('checking');
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (!cancelled) setState('signed-out');
        return;
      }
      try {
        const idToken = await user.getIdToken();
        const res = await fetch('/api/lesson-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ courseId, lessonId }),
        });
        if (res.status === 401 || res.status === 404) {
          if (!cancelled) setState('error');
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        if (data.content) {
          setContent(data.content);
        } else {
          setState('locked');
        }
      } catch {
        if (!cancelled) setState('error');
      }
    });
    return () => { cancelled = true; unsub(); };
  }, [courseId, lessonId]);

  if (state === 'checking') {
    return <div className="h-40 animate-pulse rounded-2xl bg-lilacSoft" />;
  }

  if (content) {
    return (
      <div>
        <div className="mb-4 rounded-xl bg-sageSoft px-4 py-2 text-sm text-sage">
          {locale === 'en' ? '✓ Unlocked with your purchase' : '✓ Desbloqueado con tu compra'}
        </div>
        <MarkdownLite content={content} />
      </div>
    );
  }

  if (state === 'signed-out' || state === 'error') {
    return (
      <div>
        <p className="mb-4 text-sm text-ink/60">{t('forum_new_thread_app', locale)}</p>
        <Paywall locale={locale} />
      </div>
    );
  }

  return <Paywall locale={locale} />;
}

function t(key: string, locale: Locale) {
  // import circular evitado: mensaje inline
  if (key === 'forum_new_thread_app') {
    return locale === 'en'
      ? 'Sign in with the same account you use in the app to read your unlocked lessons.'
      : 'Inicia sesión con la misma cuenta que usas en la app para leer tus lecciones desbloqueadas.';
  }
  return '';
}
