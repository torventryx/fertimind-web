import Link from 'next/link';
import { t, type Locale } from '@/lib/i18n';
import { COMMUNITY_SIZE_FLOOR } from '@/lib/community-size';

/**
 * Franja de comunidad bajo el header: prueba social visual (avatares +
 * número real de cuentas) con agradecimiento a las apoyadoras y dos CTAs:
 * apoyar (donación) y desbloquear el premium del web.
 */
export default function CommunityStrip({
  locale,
  members,
}: {
  locale: Locale;
  members: number | null;
}) {
  const number = members ?? COMMUNITY_SIZE_FLOOR;
  const suffix = members === null ? '+' : '';
  const formatted = number.toLocaleString(locale === 'es' ? 'es-ES' : 'en-US');

  const avatars = [
    { emoji: '🌸', bg: 'bg-lilacSoft' },
    { emoji: '💜', bg: 'bg-goldSoft' },
    { emoji: '🌿', bg: 'bg-sageSoft' },
    { emoji: '🤰', bg: 'bg-cream' },
  ];

  return (
    <div className="border-b border-plum/10 bg-lilacSoft/50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-4 py-2">
        <span className="flex -space-x-2" aria-hidden>
          {avatars.map((a) => (
            <span
              key={a.emoji}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] ring-2 ring-cream ${a.bg}`}
            >
              {a.emoji}
            </span>
          ))}
        </span>
        <p className="text-[13.5px] leading-tight text-ink/75">
          <strong className="text-base font-extrabold text-plum">
            {formatted}
            {suffix}
          </strong>{' '}
          {t('strip_members_label', locale)}
          <span className="mx-2 text-plum/25">·</span>
          {t('strip_thanks', locale)}
        </p>
        <span className="flex items-center gap-2">
          <Link
            href={locale === 'en' ? '/en/support' : '/apoyar'}
            className="rounded-full bg-coralAction px-3.5 py-1.5 text-[13px] font-semibold text-white transition hover:opacity-90"
          >
            {t('strip_support_btn', locale)}
          </Link>
          <Link
            href={locale === 'en' ? '/en/pay' : '/pagar'}
            className="rounded-full border border-plum/25 px-3.5 py-1.5 text-[13px] font-semibold text-plum transition hover:border-plum/50"
          >
            {t('strip_premium_btn', locale)}
          </Link>
        </span>
      </div>
    </div>
  );
}
