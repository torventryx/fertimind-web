import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import CookieConsent from '@/components/CookieConsent';
import JsonLd from '@/components/JsonLd';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/i18n';

export default function EnLayout({ children }: { children: React.ReactNode }) {
  const locale: Locale = 'en';
  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <SiteHeader locale={locale} />
      <main lang="en" className="min-h-[70vh]">{children}</main>
      <SiteFooter locale={locale} />
      <CookieConsent locale={locale} />
    </>
  );
}
