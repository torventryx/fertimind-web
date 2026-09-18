'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Tras el retorno de Stripe verifica la sesión (?session_id=…) contra
 * /api/stripe/verify, que concede paid_access (compra) o marca supporter
 * (apoyo) según el tipo de sesión.
 */
export default function VerifyPayment({ locale }: { locale: 'es' | 'en' }) {
  const params = useSearchParams();
  const [state, setState] = useState<'checking' | 'paid' | 'donation' | 'pending' | 'none'>('checking');

  useEffect(() => {
    const sessionId = params.get('session_id');
    if (!sessionId) {
      setState('none');
      return;
    }
    fetch(`/api/stripe/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.paid === true && d.donation === true) setState('donation');
        else if (d.paid === true) setState('paid');
        else setState('pending');
      })
      .catch(() => setState('pending'));
  }, [params]);

  if (state === 'none' || state === 'checking') return null;

  const box =
    'mx-auto mt-4 max-w-md rounded-2xl px-4 py-3 text-sm font-medium';

  if (state === 'donation') {
    return (
      <div className={`${box} bg-sageSoft text-sage`}>
        {locale === 'en'
          ? '✓ Support received — thank you for keeping FertiMind alive! 🤍'
          : '✓ Apoyo recibido — ¡gracias por mantener FertiMind vivo! 🤍'}
      </div>
    );
  }

  return (
    <div
      className={`${box} ${
        state === 'paid' ? 'bg-sageSoft text-sage' : 'bg-goldSoft text-gold'
      }`}
    >
      {state === 'paid'
        ? locale === 'en'
          ? '✓ Premium active — enjoy your courses!'
          : '✓ Premium activo — ¡a disfrutar de tus cursos!'
        : locale === 'en'
          ? 'Your payment is being confirmed; refresh your account in a few seconds.'
          : 'Tu pago se está confirmando; revisa tu cuenta en unos segundos.'}
    </div>
  );
}
