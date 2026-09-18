import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import CookieConsent from '@/components/CookieConsent';
import JsonLd from '@/components/JsonLd';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/i18n';

export default function EsLayout({ children }: { children: React.ReactNode }) {
  const locale: Locale = 'es';
  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <SiteHeader locale={locale} />
      <main className="min-h-[70vh]">{children}</main>
      <SiteFooter locale={locale} />
      <CookieConsent locale={locale} />
    </>
  );
}
