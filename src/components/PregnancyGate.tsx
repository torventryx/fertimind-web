'use client';

import { useState } from 'react';
import { t, type Locale } from '@/lib/i18n';

/** Velo opt-in para anuncios de embarazo (mismo estándar que la app). */
export default function PregnancyGate({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  if (revealed) return <>{children}</>;
  return (
    <div className="rounded-2xl border border-gold/30 bg-goldSoft p-6 text-center">
      <p className="text-lg font-semibold text-ink">{t('pregnancy_gate_title', locale)}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">{t('pregnancy_gate_body', locale)}</p>
      <button
        onClick={() => setRevealed(true)}
        className="mt-4 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-white"
      >
        {t('pregnancy_gate_show', locale)}
      </button>
    </div>
  );
}
