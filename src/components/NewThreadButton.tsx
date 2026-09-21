'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { auth } from '@/lib/auth';
import { db as clientDb } from '@/lib/auth-firestore';
import { lp, type Locale } from '@/lib/i18n';

const MAX_CONTENT = 280; // paridad con el creador de la app

/**
 * Crea una conversación nueva en la categoría abierta (heredada).
 * Publica directo en community_posts (rules: create si uid == author_uid).
 * Requiere sesión; invitada → login volviendo aquí.
 */
export default function NewThreadButton({
  categoryId,
  locale,
}: {
  categoryId: string;
  locale: Locale;
}) {
  const es = locale === 'es';
  const [user, setUser] = useState<'loading' | null | 'in'>('loading');
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u ? 'in' : null)), []);

  const base = lp(locale);
  const here = `${base}${locale === 'en' ? '/forums' : '/foros'}/${categoryId}`;

  if (user === 'loading') return null;

  if (!done && !open) {
    if (user === null) {
      return (
        <Link
          href={`${base}/login?from=${encodeURIComponent(here)}`}
          className="inline-flex items-center gap-2 rounded-full bg-plum px-5 py-2.5 text-sm font-semibold text-white"
        >
          ✍️ {es ? 'Nueva conversación' : 'New conversation'}
        </Link>
      );
    }
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-plum px-5 py-2.5 text-sm font-semibold text-white"
      >
        ✍️ {es ? 'Nueva conversación' : 'New conversation'}
      </button>
    );
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-sageSoft p-5 text-sm text-sage">
        ✓{' '}
        {es
          ? '¡Publicada! Aparecerá en el listado en cuanto se regenere la web (diario).'
          : 'Published! It will appear in the listing after the daily rebuild.'}
      </div>
    );
  }

  async function publish() {
    if (busy) return;
    const t = title.trim();
    const c = content.trim();
    if (!t || !c || c.length > MAX_CONTENT) return;
    setBusy(true);
    setError(null);
    try {
      const u = auth.currentUser;
      if (!u) throw new Error('no-user');
      const profile = await getDoc(doc(clientDb, 'users', u.uid));
      const p = profile.data() ?? {};
      const name =
        [p['firstName'], p['lastName']].filter(Boolean).join(' ').trim() ||
        u.displayName ||
        (u.email ? u.email.split('@')[0] : 'Usuaria');
      // Campos explícitos = misma forma que escribe la app (queries de igualdad)
      await addDoc(collection(clientDb, 'community_posts'), {
        parent_post_id: null,
        category_id: categoryId,
        author_uid: u.uid,
        author_name: name,
        author_username: (p['username'] as string) || u.displayName || null,
        title: t,
        content_text: c,
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
      setDone(true);
    } catch (e) {
      setError(es ? 'No se pudo publicar. Inténtalo de nuevo.' : 'Could not publish. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl border border-plum/10 bg-white p-6 fm-shadow-card">
      <h2 className="text-lg font-bold text-plum">
        {es ? 'Nueva conversación' : 'New conversation'}
      </h2>
      <p className="mt-1 text-xs text-ink/50">
        {es ? 'Se publicará en esta categoría.' : 'It will be published in this category.'}
      </p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={es ? 'Título' : 'Title'}
        maxLength={100}
        className="mt-4 w-full rounded-xl border border-plum/15 bg-cream/50 px-3.5 py-2.5 text-sm"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        maxLength={MAX_CONTENT}
        placeholder={es ? 'Cuéntanos… (máx. 280 caracteres)' : 'Tell us… (max 280 characters)'}
        className="mt-2.5 w-full resize-none rounded-xl border border-plum/15 bg-cream/50 px-3.5 py-2.5 text-[15px] leading-6"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-xs ${content.length > MAX_CONTENT - 30 ? 'text-coralAction' : 'text-ink/40'}`}>
          {content.length}/{MAX_CONTENT}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setOpen(false)}
            className="rounded-full border border-plum/25 px-4 py-2 text-sm font-semibold text-plum"
          >
            {es ? 'Cancelar' : 'Cancel'}
          </button>
          <button
            onClick={publish}
            disabled={busy || !title.trim() || !content.trim()}
            className="rounded-full bg-coralAction px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {busy ? '…' : es ? 'Publicar' : 'Publish'}
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-coralAction">{error}</p>}
      <p className="mt-3 text-[11px] leading-4 text-ink/45">
        {es
          ? 'Recuerda: nunca información médica personal identificable. Sé amable: al otro lado hay una persona.'
          : 'Remember: never identifiable personal medical info. Be kind: there is a person on the other side.'}
      </p>
    </div>
  );
}
