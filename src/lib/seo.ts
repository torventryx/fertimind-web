// SEO + LLM-friendly helpers: metadata por página y JSON-LD estructurado.

import type { Metadata } from 'next';
import { SITE, type Locale } from './i18n';

export function pageMetadata(opts: {
  locale: Locale;
  path: string; // sin locale (p. ej. /foros/betaespera)
  title: string;
  description: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
}): Metadata {
  const esUrl = `${SITE.url}${opts.path}`;
  const enUrl = `${SITE.url}/en${pathEn(opts.path)}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical: opts.locale === 'en' ? enUrl : esUrl,
      languages: {
        es: esUrl,
        en: enUrl,
        'x-default': esUrl,
      },
    },
    robots: opts.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.locale === 'en' ? enUrl : esUrl,
      siteName: 'FertiMind',
      locale: opts.locale === 'en' ? 'en_ES→en' : 'es_ES',
      type: opts.type ?? 'website',
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
      images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: 'FertiMind' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
    },
  };
}

/** Rutas es→en (solo difieren en /foros → /forums). */
export function pathEn(path: string): string {
  if (path === '/foros') return '/forums';
  if (path.startsWith('/foros/')) return `/forums${path.slice('/foros'.length)}`;
  if (path === '/cursos') return '/courses';
  if (path.startsWith('/cursos/')) return `/courses${path.slice('/cursos'.length)}`;
  if (path === '/clinicas') return '/clinics';
  if (path.startsWith('/clinicas/')) return `/clinics${path.slice('/clinicas'.length)}`;
  return path;
}

// ── JSON-LD ───────────────────────────────────────────────────────────────

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FertiMind',
    url: SITE.url,
    logo: `${SITE.url}/icons/fertimind_logo_icon_light.png`,
    description: SITE.es.description,
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FertiMind',
    url: SITE.url,
    inLanguage: ['es', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.url}/foros?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function discussionJsonLd(opts: {
  url: string;
  title: string;
  text: string;
  authorName: string;
  datePublished: string;
  commentCount: number;
  comments: { authorName: string; text: string; datePublished: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: opts.title,
    articleBody: opts.text.slice(0, 500),
    url: opts.url,
    datePublished: opts.datePublished,
    inLanguage: 'es',
    author: { '@type': 'Person', name: opts.authorName },
    interactionStatistic: {
      '@type': 'InteractionCounter',
      userInteractionCount: opts.commentCount,
      interactionType: 'https://schema.org/CommentAction',
    },
    ...(opts.comments.length
      ? {
          comment: opts.comments.map((c) => ({
            '@type': 'Comment',
            text: c.text.slice(0, 300),
            author: { '@type': 'Person', name: c.authorName },
            datePublished: c.datePublished,
          })),
        }
      : {}),
  };
}

export function courseJsonLd(opts: {
  url: string;
  name: string;
  description: string;
  provider: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: 'es',
    provider: { '@type': 'Organization', name: opts.provider, url: SITE.url },
    isAccessibleForFree: true,
    educationalUse: 'self-study',
    offers: {
      '@type': 'Offer',
      category: 'Freemium',
      availability: 'https://schema.org/InStock',
    },
  };
}

export function clinicJsonLd(opts: {
  url: string;
  name: string;
  description: string;
  city: string;
  website: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    medicalSpecialty: 'https://schema.org/ReproductiveMedicine',
    address: { '@type': 'PostalAddress', addressLocality: opts.city, addressCountry: 'ES' },
    sameAs: opts.website,
  };
}
