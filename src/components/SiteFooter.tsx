import Link from 'next/link';
import { t, type Locale } from '@/lib/i18n';

export default function SiteFooter({ locale }: { locale: Locale }) {
  const base = locale === 'en' ? '/en' : '';
  return (
    <footer className="mt-16 border-t border-plum/10 bg-lilacSoft/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-plum">FertiMind</p>
          <p className="mt-2 text-sm text-ink/70">
            {locale === 'en'
              ? 'The fertility path is a journey. Don\u2019t walk it alone.'
              : 'El camino de la fertilidad es un viaje. No lo recorras sola.'}
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold text-plum">{locale === 'en' ? 'Explore' : 'Explora'}</p>
          <ul className="space-y-1.5 text-ink/75">
            <li><Link href={`${base}${locale === 'en' ? '/forums' : '/foros'}`}>{t('nav_forum', locale)}</Link></li>
            <li><Link href={`${base}${locale === 'en' ? '/courses' : '/cursos'}`}>{t('nav_courses', locale)}</Link></li>
            <li><Link href={`${base}${locale === 'en' ? '/clinics' : '/clinicas'}`}>{t('nav_clinics', locale)}</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold text-plum">{locale === 'en' ? 'Legal' : 'Legal'}</p>
          <ul className="space-y-1.5 text-ink/75">
            <li><Link href={`${base}/legal/privacidad`}>{t('footer_legal_privacy', locale)}</Link></li>
            <li><Link href={`${base}/legal/terminos`}>{t('footer_legal_terms', locale)}</Link></li>
            <li><Link href={`${base}/legal/cookies`}>{t('footer_legal_cookies', locale)}</Link></li>
            <li><Link href={`${base}${locale === 'en' ? '/contact' : '/contacto'}`}>{t('footer_contact', locale)}</Link></li>
            <li><Link href={`${base}${locale === 'en' ? '/delete-account' : '/eliminar-cuenta'}`}>{t('footer_delete', locale)}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-plum/10 px-4 py-4">
        <p className="mx-auto max-w-6xl text-xs leading-5 text-ink/60">
          {t('footer_medical', locale)} · © {new Date().getFullYear()} FertiMind · soporte@fertimind.es
        </p>
      </div>
    </footer>
  );
}
