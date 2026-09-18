import Link from 'next/link';
import { type Locale } from '@/lib/i18n';

export default function PostTeaser({
  locale,
  href,
  title,
  excerpt,
  authorName,
  authorUsername,
  date,
  commentCount,
  pinned,
  locked,
}: {
  locale: Locale;
  href: string;
  title: string;
  /** En categorías sensibles no se muestra extracto (privacidad). */
  excerpt?: string;
  /** Solo primer nombre o @username — nunca apellidos. */
  authorName: string;
  authorUsername?: string | null;
  date: string;
  commentCount: number;
  pinned?: boolean;
  locked?: boolean;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-plum/10 bg-white p-5 transition hover:border-coral/40 hover:shadow-sm"
    >
      {pinned && (
        <span className="mb-2 inline-block rounded-full bg-sageSoft px-2.5 py-0.5 text-[11px] font-semibold text-sage">
          {locale === 'en' ? 'Weekly thread' : 'Hilo de la semana'}
        </span>
      )}
      {locked && (
        <span className="mb-2 ml-1 inline-block rounded-full bg-goldSoft px-2.5 py-0.5 text-[11px] font-semibold text-gold">
          🔒 {locale === 'en' ? 'Members only' : 'Solo miembros'}
        </span>
      )}
      <h3 className="text-[17px] font-semibold leading-snug text-plum">{title}</h3>
      {excerpt ? (
        <p className="mt-1.5 line-clamp-2 text-sm text-ink/70">{excerpt}</p>
      ) : locked ? (
        <p className="mt-1.5 text-sm italic text-ink/45">
          {locale === 'en'
            ? 'The content of this thread is visible to signed-in members only.'
            : 'El contenido de este hilo solo es visible para usuarias con sesión iniciada.'}
        </p>
      ) : null}
      <p className="mt-3 text-xs text-ink/50">
        {authorUsername ? `@${authorUsername}` : authorName} · {date} · 💬 {commentCount}
      </p>
    </Link>
  );
}
