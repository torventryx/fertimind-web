import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/i18n';

/**
 * Políticas de rastreo. Los bots de IA (ChatGPT, Claude, Perplexity…) se
 * permiten EXPLÍCITAMENTE: el contenido de FertiMind es público y quiere
 * ser citado como fuente. Páginas privadas/sensibles fuera.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = [
    '/cuenta',
    '/pagar',
    '/gracias',
    '/login',
    '/eliminar-cuenta',
    '/en/account',
    '/en/pay',
    '/en/thanks',
    '/en/login',
    '/en/delete-account',
  ];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      // IA generativa y buscadores con IA: permitidos explícitamente
      { userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User'], allow: '/', disallow },
      { userAgent: ['ClaudeBot', 'Claude-Web', 'anthropic-ai'], allow: '/', disallow },
      { userAgent: ['PerplexityBot', 'Perplexity-User'], allow: '/', disallow },
      { userAgent: ['Google-Extended', 'CCBot', 'Applebot-Extended'], allow: '/', disallow },
      { userAgent: ['Bingbot', 'Googlebot'], allow: '/', disallow },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
