'use client';

import { useEffect, useState } from 'react';
import { t, type Locale } from '@/lib/i18n';

export default function CookieConsent({ locale }: { locale: Locale }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(!localStorage.getItem('fm-cookie-consent'));
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-plum/15 bg-white p-4 shadow-lg sm:inset-x-auto sm:right-4 sm:max-w-sm">
      <p className="text-sm text-ink/80">{t('cookie_text', locale)}</p>
      <button
        onClick={() => {
          localStorage.setItem('fm-cookie-consent', '1');
          setShow(false);
        }}
        className="mt-3 w-full rounded-full bg-plum px-4 py-2 text-sm font-semibold text-white"
      >
        {t('cookie_ok', locale)}
      </button>
    </div>
  );
}
