'use client';

import { useState } from 'react';

/**
 * Formulario de contacto: escribe en Firestore (contact_requests, colección con reglas
 * cliente si las reglas lo permiten; si falla, muestra el email de soporte.
 */
export default function ContactForm({ locale }: { locale: 'es' | 'en' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    try {
      const { getFirestore, collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const { firebaseClientApp } = await import('@/lib/client-firebase');
      const db = getFirestore(firebaseClientApp());
      await addDoc(collection(db, 'contact_requests'), {
        name,
        email,
        message,
        source: 'web',
        created_at: serverTimestamp(),
      });
      setState('sent');
    } catch {
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <div className="rounded-2xl bg-sageSoft p-6 text-center text-sm font-medium text-sage">
        {locale === 'en' ? 'Message sent. Thank you!' : '¡Mensaje enviado, gracias!'}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={locale === 'en' ? 'Name' : 'Nombre'}
        className="w-full rounded-xl border border-plum/15 bg-white px-3.5 py-2.5 text-sm"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full rounded-xl border border-plum/15 bg-white px-3.5 py-2.5 text-sm"
      />
      <textarea
        required
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={locale === 'en' ? 'Message' : 'Mensaje'}
        className="w-full rounded-xl border border-plum/15 bg-white px-3.5 py-2.5 text-sm"
      />
      {state === 'error' && (
        <p className="text-xs text-coralAction">
          {locale === 'en'
            ? 'Could not send. Please email us at soporte@fertimind.es'
            : 'No se pudo enviar. Escríbenos a soporte@fertimind.es'}
        </p>
      )}
      <button
        type="submit"
        disabled={state === 'sending'}
        className="rounded-full bg-plum px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {state === 'sending' ? '…' : locale === 'en' ? 'Send' : 'Enviar'}
      </button>
    </form>
  );
}
