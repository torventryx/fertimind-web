'use client';

import { useState } from 'react';
import { t, type Locale } from '@/lib/i18n';

/**
 * Alta de newsletter (doble opt-in): guarda vía /api/newsletter y pide
 * confirmar por email. No usa cookies de terceros.
 */
export default function NewsletterForm({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'already' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) setState(d.status === 'already_subscribed' ? 'already' : 'sent');
      else setState('error');
    } catch {
      setState('error');
    }
  }

  return (
    <div id="newsletter">
      <p className="mb-2 font-semibold text-plum">
        {es ? 'Novedades FertiMind' : 'FertiMind updates'}
      </p>
      <p className="mb-3 text-xs leading-5 text-ink/60">
        {es
          ? 'Una carta de producto de vez en cuando: mejoras, nuevos cursos y cómo sigue la comunidad. Sin spam.'
          : 'An occasional product letter: improvements, new courses and how the community is doing. No spam.'}
      </p>
      {state === 'sent' || state === 'already' ? (
        <p className="rounded-xl bg-sageSoft px-3 py-2 text-xs font-medium text-sage">
          {state === 'already'
            ? es
              ? '✓ Ya estabas suscrita. ¡Gracias!'
              : '✓ You were already subscribed. Thank you!'
            : es
              ? '✓ Revisa tu email: te hemos enviado un enlace de confirmación.'
              : '✓ Check your inbox: we sent you a confirmation link.'}
        </p>
      ) : (
        <form onSubmit={submit} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={es ? 'tu@email.com' : 'your@email.com'}
            className="min-w-0 flex-1 rounded-xl border border-plum/15 bg-white px-3 py-2 text-sm"
            aria-label={es ? 'Email para la newsletter' : 'Email for the newsletter'}
          />
          <button
            type="submit"
            disabled={state === 'sending'}
            className="rounded-full bg-plum px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {state === 'sending' ? '…' : es ? 'Suscribirme' : 'Subscribe'}
          </button>
        </form>
      )}
      {state === 'error' && (
        <p className="mt-2 text-xs text-coralAction">
          {es ? 'Email no válido o error temporal; prueba en unos segundos.' : 'Invalid email or temporary error; try again shortly.'}
        </p>
      )}
    </div>
  );
}
