import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import CommunityStrip from '@/components/CommunityStrip';
import CookieConsent from '@/components/CookieConsent';
import JsonLd from '@/components/JsonLd';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import { getCommunitySize } from '@/lib/community-size';
import type { Locale } from '@/lib/i18n';

export default async function EsLayout({ children }: { children: React.ReactNode }) {
  const locale: Locale = 'es';
  const members = await getCommunitySize();
  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <SiteHeader locale={locale} />
      <CommunityStrip locale={locale} members={members} />
      <main className="min-h-[70vh]">{children}</main>
      <SiteFooter locale={locale} />
      <CookieConsent locale={locale} />
    </>
  );
}
