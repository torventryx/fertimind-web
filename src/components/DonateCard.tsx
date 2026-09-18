'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/auth';
import { lp, t, type Locale } from '@/lib/i18n';

const PRESETS = [299, 499, 999]; // 2,99 € · 4,99 € · 9,99 €

/**
 * Tarjeta de apoyo económico: cantidades predefinidas o libre (1–200 €).
 * Pago único vía /api/stripe/donate; marca a la usuaria como supporter
 * (no concede premium). Requiere sesión (misma cuenta que la app).
 */
export default function DonateCard({ locale }: { locale: Locale }) {
  const es = locale === 'es';
  const [user, setUser] = useState<'loading' | null | 'in'>('loading');
  const [cents, setCents] = useState<number>(499);
  const [custom, setCustom] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u ? 'in' : null)), []);

  const customCents = custom ? Math.round(parseFloat(custom.replace(',', '.')) * 100) : NaN;
  const usingCustom = custom.trim() !== '' && !Number.isNaN(customCents) && customCents >= 100;
  const effective = usingCustom ? customCents : cents;

  async function donate() {
    if (user !== 'in' || busy) return;
    setBusy(true);
    setError(null);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('no token');
      const res = await fetch('/api/stripe/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ amountCents: effective, locale }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(es ? 'No hemos podido iniciar el apoyo. Inténtalo de nuevo.' : 'Could not start the support payment. Try again.');
    } catch {
      setError(es ? 'No hemos podido iniciar el apoyo. Inténtalo de nuevo.' : 'Could not start the support payment. Try again.');
    } finally {
      setBusy(false);
    }
  }

  const base = lp(locale);

  return (
    <div className="rounded-3xl border border-plum/10 bg-white p-6 fm-shadow-card sm:p-8">
      <p className="text-xs uppercase tracking-wide text-ink/40">
        {es ? 'Elige tu apoyo' : 'Choose your support'}
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => { setCents(p); setCustom(''); }}
            className={`rounded-2xl border-2 px-4 py-4 text-center transition ${
              !usingCustom && cents === p
                ? 'border-coralAction bg-goldSoft/60'
                : 'border-plum/10 bg-cream/50 hover:border-coral/40'
            }`}
          >
            <span className="block text-2xl font-extrabold text-plum">
              {(p / 100).toFixed(2).replace('.', ',')} €
            </span>
            <span className="mt-1 block text-[11px] text-ink/55">
              {p === 299 ? (es ? 'un café ☕' : 'a coffee ☕') : p === 499 ? (es ? 'una flor 🌸' : 'a flower 🌸') : es ? 'un ramo 💐' : 'a bouquet 💐'}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="text-xs font-medium text-ink/55" htmlFor="custom-amount">
          {es ? '…o la cantidad que quieras (1–200 €)' : '…or any amount (€1–200)'}
        </label>
        <div className="mt-1.5 flex items-center gap-2">
          <input
            id="custom-amount"
            type="text"
            inputMode="decimal"
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^0-9.,]/g, ''))}
            placeholder={es ? 'p. ej. 12' : 'e.g. 12'}
            className={`w-32 rounded-xl border px-3.5 py-2.5 text-sm ${
              usingCustom ? 'border-coralAction bg-goldSoft/40' : 'border-plum/15 bg-cream/50'
            }`}
          />
          <span className="text-sm text-ink/50">€ · {es ? 'pago único' : 'one-time'}</span>
        </div>
      </div>

      {user === 'loading' ? (
        <div className="mt-6 h-12 animate-pulse rounded-full bg-lilacSoft" />
      ) : user === 'in' ? (
        <button
          onClick={donate}
          disabled={busy}
          className="mt-6 w-full rounded-full bg-coralAction px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-coralAction/90 disabled:opacity-50"
        >
          {busy
            ? '…'
            : es
              ? `Apoyar con ${(effective / 100).toFixed(2).replace('.', ',')} €`
              : `Support with €${(effective / 100).toFixed(2)}`}
        </button>
      ) : (
        <a
          href={`${base}/login?from=${encodeURIComponent(locale === 'en' ? '/en/support' : '/apoyar')}`}
          className="mt-6 block w-full rounded-full bg-plum px-6 py-3 text-center text-base font-semibold text-white"
        >
          {es ? 'Inicia sesión para apoyar' : 'Sign in to support'}
        </a>
      )}

      {error && <p className="mt-3 text-xs text-coralAction">{error}</p>}
      <p className="mt-3 text-[11px] leading-4 text-ink/45">
        {es
          ? 'Pago único y seguro con Stripe. El apoyo no desbloquea cursos: es un gesto para sostener el proyecto. (Si aún no tienes premium, puedes conseguirlo en Cursos.)'
          : 'Secure one-time payment with Stripe. Supporting does not unlock courses: it is a gesture to sustain the project. (You can get premium in Courses.)'}
      </p>
    </div>
  );
}
