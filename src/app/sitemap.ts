import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/i18n';
import { forumCategories } from '@/data/taxonomy';
import { clinics } from '@/data/clinics-seed';
import { allPublicThreadIds, listCourses } from '@/lib/content';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const staticEs = [
    '', '/foros', '/cursos', '/clinicas', '/contacto',
    '/legal/privacidad', '/legal/terminos', '/legal/cookies',
  ].map((p) => ({ url: `${base}${p || '/'}`, changeFrequency: 'daily' as const, priority: p === '' ? 1 : 0.8 }));
  const staticEn = ['', '/forums', '/courses', '/clinics'].map((p) => ({
    url: `${base}/en${p || ''}`,
    changeFrequency: 'daily' as const,
    priority: p === '' ? 0.9 : 0.6,
  }));

  const [threads, courses] = await Promise.all([allPublicThreadIds(), listCourses()]);

  const categoryUrls = forumCategories.flatMap((c) => [
    { url: `${base}/foros/${c.id}`, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${base}/en/forums/${c.id}`, changeFrequency: 'daily' as const, priority: 0.4 },
  ]);

  // Anuncios de embarazo excluidos (contenido sensible)
  const threadUrls = threads
    .filter((t) => !t.isPregnancyAnnouncement)
    .flatMap((t) => [
      { url: `${base}/foros/${t.categoryId}/${t.id}`, lastModified: t.createdAt ?? undefined, changeFrequency: 'weekly' as const, priority: 0.6 },
    ]);

  const courseUrls = courses.flatMap((c) => [
    { url: `${base}/cursos/${c.id}`, changeFrequency: 'weekly' as const, priority: 0.7 },
    ...c.modules.flatMap((m) =>
      m.lessons.map((l) => ({
        url: `${base}/cursos/${c.id}/${l.id}`,
        changeFrequency: 'monthly' as const,
        priority: l.isPremium ? 0.3 : 0.6,
      })),
    ),
  ]);

  const clinicUrls = clinics.flatMap((c) => [
    { url: `${base}/clinicas/${c.slug}`, changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${base}/en/clinics/${c.slug}`, changeFrequency: 'weekly' as const, priority: 0.3 },
  ]);

  return [...staticEs, ...staticEn, ...categoryUrls, ...threadUrls, ...courseUrls, ...clinicUrls];
}
