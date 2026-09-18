'use client';

import { useState } from 'react';
import { t, type Locale } from '@/lib/i18n';

/**
 * Paywall del pago único (7,99 €). Llama a la Cloud Function
 * createStripeCheckout; si Stripe aún no está configurado muestra un
 * aviso y remite a la app (RevenueCat sigue siendo el paywall nativo).
 */
export default function Paywall({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setBusy(true);
    setError(null);
    try {
      const idToken = await (await import('@/lib/auth')).auth.currentUser?.getIdToken();
      if (!idToken) {
        window.location.href = locale === 'en' ? '/en/login' : '/login';
        return;
      }
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ locale }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(res.status === 401 ? t('forum_new_thread_app', locale) : t('pay_stripe_soon', locale));
    } catch {
      setError(t('pay_stripe_soon', locale));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`rounded-3xl border border-gold/30 bg-goldSoft ${compact ? 'p-5' : 'p-8'} text-center`}>
      <p className="text-2xl">{compact ? '' : '🌟'}</p>
      <h3 className={`font-bold text-ink ${compact ? 'text-base' : 'text-xl'}`}>
        {t('courses_paywall_title', locale)}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">{t('courses_paywall_body', locale)}</p>
      <button
        onClick={startCheckout}
        disabled={busy}
        className="mt-4 rounded-full bg-coralAction px-6 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
      >
        {busy ? '…' : t('pay_once', locale)}
      </button>
      {error && <p className="mt-3 text-xs text-ink/60">{error}</p>}
    </div>
  );
}
