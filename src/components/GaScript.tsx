'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Google Analytics 4 para la web.
 *
 * - Solo carga si el visitante aceptó el banner de cookies
 *   (localStorage `fm-cookie-consent`; CookieConsent emite `fm-consent`).
 * - Sin NEXT_PUBLIC_GA_ID configurado no renderiza nada (no-op).
 * - config envía el page_view inicial al cargar; el efecto de pathname
 *   cubre la navegación client-side entre páginas estáticas.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export default function GaScript() {
  const [consent, setConsent] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const check = () => {
      if (localStorage.getItem('fm-cookie-consent')) setConsent(true);
    };
    check();
    window.addEventListener('fm-consent', check);
    return () => window.removeEventListener('fm-consent', check);
  }, []);

  useEffect(() => {
    if (consent && GA_ID && window.gtag) {
      window.gtag('event', 'page_view', { page_path: pathname });
    }
  }, [pathname, consent]);

  if (!GA_ID || !consent) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
