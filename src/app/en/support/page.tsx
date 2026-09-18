import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import DonateCard from '@/components/DonateCard';

export const metadata: Metadata = pageMetadata({
  locale: 'en',
  path: '/en/support',
  title: 'Support FertiMind — keep the project alive',
  description:
    'FertiMind was born to support and give visibility to everyone going through fertility treatment. If the project has been there for you, you can help it continue: one-time support, no obligation.',
});

export default function SupportPageEn() {
  return (
    <div lang="en" className="mx-auto max-w-3xl px-4 py-12">
      <span className="inline-flex items-center gap-2 rounded-full bg-goldSoft px-3.5 py-1.5 text-xs font-semibold text-gold">
        🤍 Support the project
      </span>
      <h1 className="mt-4 text-3xl font-extrabold leading-tight text-plum sm:text-4xl">
        An invisible sector deserves a place that depends on no one else…{' '}
        <span className="fm-gradient-text">only on us.</span>
      </h1>

      <div className="mt-6 space-y-4 text-[16px] leading-7 text-ink/75">
        <p>
          FertiMind exists because the fertility journey is one of the few medical paths walked{' '}
          <strong>in silence</strong>: few people ask, less gets explained, and it is often faced
          without company. This project was born to change exactly that.
        </p>
        <p>
          We have no ads, we do not sell data, and the community is and will remain{' '}
          <strong>free forever</strong>. Courses unlock with a one-time payment to cover part of
          the costs, but the reality is simple: servers, development and maintenance run on a very
          thin margin.
        </p>
        <p>
          If FertiMind has been there for you at some point —a two-week-wait morning, a doubt at
          2 a.m., a thread that made you feel understood— you can support its upkeep with any
          amount you choose. <strong>No amount is small</strong> and none is required: if you
          cannot or prefer not to, you are still one of us.
        </p>
      </div>

      <div className="mt-8">
        <DonateCard locale="en" />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: '🌸', t: 'No ads, ever', d: 'Your support keeps us free from advertising or selling attention.' },
          { icon: '🔒', t: 'Private data', d: 'We do not share or sell user data. Period.' },
          { icon: '🤝', t: 'Free community', d: 'Forums and mutual support are not paid for: they are shared.' },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-plum/10 bg-white p-5 fm-shadow-card">
            <span className="text-xl">{c.icon}</span>
            <p className="mt-2 font-bold text-plum">{c.t}</p>
            <p className="mt-1 text-xs leading-5 text-ink/60">{c.d}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 rounded-2xl bg-lilacSoft/60 p-4 text-xs leading-5 text-ink/55">
        FertiMind offers information and support, not medical advice. Supporting does not grant
        premium content or advantages: it is a voluntary contribution to the project. Payments by
        Stripe. Questions?{' '}
        <Link href="/en/contact" className="font-semibold text-coralAction">
          Write to us
        </Link>
        .
      </p>
    </div>
  );
}
