import Link from 'next/link';
import { type Locale } from '@/lib/i18n';

export default function PostTeaser({
  locale,
  href,
  title,
  excerpt,
  authorName,
  date,
  commentCount,
  pinned,
}: {
  locale: Locale;
  href: string;
  title: string;
  excerpt: string;
  authorName: string;
  date: string;
  commentCount: number;
  pinned?: boolean;
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
      <h3 className="text-[17px] font-semibold leading-snug text-plum">{title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-ink/70">{excerpt}</p>
      <p className="mt-3 text-xs text-ink/50">
        {authorName} · {date} · 💬 {commentCount}
      </p>
    </Link>
  );
}
