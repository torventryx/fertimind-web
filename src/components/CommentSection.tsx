'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  increment,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth } from '@/lib/auth';
import { db as clientDb } from '@/lib/auth-firestore';
import { t, lp, type Locale } from '@/lib/i18n';

export interface SerializedComment {
  id: string;
  content: string;
  authorName: string;
  authorUsername: string | null;
  createdAt: string | null;
  translated?: boolean;
}

function fmtDate(iso: string | null, locale: Locale) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-GB' : 'es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Sección de respuestas con estado de autenticación REAL:
 *  - invitada → CTA a /login?from=<hilo actual> (y vuelve tras entrar)
 *  - con sesión → composer que publica en community_posts (rules: create si
 *    uid == author_uid) + incrementa comment_count del hilo (permitido a
 *    no-autoras) + respuestas en vivo vía onSnapshot.
 */
export default function CommentSection({
  postId,
  categoryId,
  locale,
  initialComments,
}: {
  postId: string;
  categoryId: string;
  locale: Locale;
  initialComments: SerializedComment[];
}) {
  const [user, setUser] = useState<User | null | 'loading'>('loading');
  const [comments, setComments] = useState<SerializedComment[]>(initialComments);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  // Auth en vivo: si la usuaria entra desde /login, el composer aparece sin recargar.
  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u)), []);

  // Respuestas en vivo. DESC + reverse: reutiliza el índice compuesto
  // (parent_post_id, is_archive, is_deleted, created_at DESC) que ya usa la app.
  useEffect(() => {
    const q = query(
      collection(clientDb, 'community_posts'),
      where('parent_post_id', '==', postId),
      where('is_archive', '==', false),
      where('is_deleted', '==', false),
      orderBy('created_at', 'desc'),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const live: SerializedComment[] = snap.docs
          .map((d) => {
            const c = d.data();
            return {
              id: d.id,
              content: (c['content_text'] as string) || '',
              authorName: (c['author_name'] as string) || 'Usuaria',
              authorUsername: (c['author_username'] as string) || null,
              createdAt: c['created_at']?.toDate?.().toISOString() ?? null,
            };
          })
          .reverse();
        setComments(live);
      },
      () => setComments(initialComments), // sin permiso/índice → nos quedamos con el SSR
    );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const threadHref = useMemo(
    () =>
      typeof window === 'undefined'
        ? ''
        : `${lp(locale)}${locale === 'en' ? '/forums' : '/foros'}/${categoryId}/${postId}`,
    [categoryId, postId, locale],
  );

  async function publish() {
    const text = draft.trim();
    const u = user === 'loading' ? null : user;
    if (!text || !u || sending) return;
    setSending(true);
    setError(null);
    try {
      const profile = await getDoc(doc(clientDb, 'users', u.uid));
      const p = profile.data() ?? {};
      const name =
        [p['firstName'], p['lastName']].filter(Boolean).join(' ').trim() ||
        u.displayName ||
        (u.email ? u.email.split('@')[0] : 'Usuaria');
      const username = (p['username'] as string) || u.displayName || null;

      // Campos explícitos para que las queries de igualdad de la app y la web
      // encuentren siempre el comentario (missing ≠ null en Firestore).
      await addDoc(collection(clientDb, 'community_posts'), {
        parent_post_id: postId,
        category_id: categoryId,
        author_uid: u.uid,
        author_name: name,
        author_username: username,
        title: '',
        content_text: text,
        content_source: 'web',
        is_bot_generated: false,
        is_archive: false,
        is_deleted: false,
        is_weekly_thread: false,
        is_pregnancy_announcement: false,
        likes: 0,
        comment_count: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      // Regla 3 de community_posts: una no-autora puede tocar solo comment_count.
      await updateDoc(doc(clientDb, 'community_posts', postId), {
        comment_count: increment(1),
      }).catch(() => {});
      setDraft('');
      setOk(true);
      setTimeout(() => setOk(false), 2500);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  const base = lp(locale);

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-plum">
        {t('comments_title', locale)} ({comments.length})
      </h2>

      {/* Composer / CTA de sesión */}
      {user === 'loading' ? (
        <div className="mt-4 h-24 animate-pulse rounded-2xl bg-lilacSoft" />
      ) : user ? (
        <div className="mt-4 rounded-2xl border border-plum/10 bg-white p-4 fm-shadow-card">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder={
              locale === 'en'
                ? 'Write a supportive reply…'
                : 'Escribe una respuesta con cariño…'
            }
            className="w-full resize-none rounded-xl border border-plum/15 bg-cream/50 px-3.5 py-2.5 text-[15px] leading-6 focus:border-coral/50 focus:outline-none"
          />
          <div className="mt-2.5 flex items-center justify-between gap-3">
            <p className="text-xs text-ink/45">
              {locale === 'en'
                ? 'Be kind: there is a person on the other side.'
                : 'Sé amable: al otro lado hay una persona.'}
            </p>
            <div className="flex items-center gap-2">
              {ok && (
                <span className="text-xs font-semibold text-sage">
                  ✓ {locale === 'en' ? 'Published' : 'Publicado'}
                </span>
              )}
              <button
                onClick={publish}
                disabled={sending || draft.trim().length === 0}
                className="rounded-full bg-coralAction px-5 py-2 text-sm font-semibold text-white transition hover:bg-coralAction/90 disabled:opacity-40"
              >
                {sending
                  ? locale === 'en'
                    ? 'Publishing…'
                    : 'Publicando…'
                  : locale === 'en'
                    ? 'Reply'
                    : 'Responder'}
              </button>
            </div>
          </div>
          {error && <p className="mt-2 text-xs text-coralAction">{error}</p>}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-plum/25 bg-white/70 p-5">
          <p className="text-sm text-ink/70">
            {locale === 'en'
              ? 'Sign in with your FertiMind account to reply and support other women.'
              : 'Inicia sesión con tu cuenta de FertiMind para responder y apoyar a otras mujeres.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <Link
              href={`${base}/login?from=${encodeURIComponent(threadHref)}`}
              className="rounded-full bg-plum px-5 py-2 text-sm font-semibold text-white"
            >
              {t('nav_login', locale)}
            </Link>
            <a
              href="https://play.google.com/store/apps/details?id=com.fertimind.fiv"
              className="rounded-full border border-plum/25 px-5 py-2 text-sm font-semibold text-plum"
            >
              {locale === 'en' ? 'Get the app' : 'Descargar la app'}
            </a>
          </div>
        </div>
      )}

      {/* Lista de respuestas */}
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
              {c.translated && (
                <span className="ml-1 rounded bg-lilacSoft px-1.5 py-0.5 text-[10px] text-plum/60">
                  {t('translated_note', locale)}
                </span>
              )}
            </p>
            <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-7">{c.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
