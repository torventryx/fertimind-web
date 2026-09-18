#!/usr/bin/env node
/**
 * Configura Stripe en FertiMind (idempotente — se puede reejecutar):
 *   1. Valida la secret key contra la cuenta.
 *   2. Verifica el STRIPE_PRICE_ID (7,99 € one-time).
 *   3. Crea (si no existe) el webhook → {SITE}/api/stripe/webhook
 *      con checkout.session.completed.
 *   4. Crea (si no existe) el cupón −3,00 € + promotion code FERTI499
 *      (precio final de campaña 4,99 €).
 *
 * NO escribe secretos en .env (Next los hornea en el build): el resultado
 * se guarda en .stripe-runtime.json (chmod 600, gitignored) para inyectar
 * como variables de RUNTIME en Cloud Run.
 *
 * Uso: node scripts/configure-stripe.mjs
 */
import Stripe from 'stripe';
import { readFileSync, writeFileSync, chmodSync } from 'node:fs';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://fertimind.es';
const PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_1UH5IL3cnTSQSxEmT9Pjtn72';
const PROMO_CODE = 'FERTI499';

const runtime = JSON.parse(readFileSync('.stripe-runtime.json', 'utf8'));
const stripe = new Stripe(runtime.sk);

const mask = (s) => (s ? `${s.slice(0, 8)}…${s.slice(-4)}` : '—');

async function main() {
  // 1. Cuenta
  const account = await stripe.accounts.retrieve();
  console.log(`✓ cuenta: ${account.id} (${account.business_profile?.name || 'sin nombre'})`);
  console.log(`  charges_enabled: ${account.charges_enabled} · payouts_enabled: ${account.payouts_enabled}`);

  // 2. Price
  const price = await stripe.prices.retrieve(PRICE_ID);
  if (price.type !== 'one_time' || price.currency !== 'eur') {
    throw new Error(`price inesperado: ${price.type}/${price.currency}`);
  }
  console.log(`✓ price ${PRICE_ID}: ${(price.unit_amount / 100).toFixed(2)} € one_time → product ${price.product}`);

  // 3. Webhook (idempotente por URL)
  const WEBHOOK_URL = `${SITE}/api/stripe/webhook`;
  const hooks = await stripe.webhookEndpoints.list({ limit: 100 });
  let hook = hooks.data.find((h) => h.url === WEBHOOK_URL);
  if (!hook) {
    hook = await stripe.webhookEndpoints.create({
      url: WEBHOOK_URL,
      enabled_events: ['checkout.session.completed'],
      description: 'FertiMind web — activa paid_access tras el pago',
    });
    console.log(`✓ webhook creado: ${WEBHOOK_URL}`);
  } else {
    console.log(`✓ webhook ya existía: ${WEBHOOK_URL} (events: ${hook.enabled_events.join(',')})`);
  }
  if (!hook.status || hook.status !== 'enabled') {
    console.log(`  estado: ${hook.status}`);
  }

  // 4. Cupón + promotion code FERTI499 (idempotente por código)
  const promos = await stripe.promotionCodes.list({ limit: 100 });
  let promo = promos.data.find((p) => p.code === PROMO_CODE);
  if (!promo) {
    const coupons = await stripe.coupons.list({ limit: 100 });
    let coupon = coupons.data.find(
      (c) => c['amount_off'] === 300 && c.currency === 'eur' && c.duration === 'once' && c.valid,
    );
    if (!coupon) {
      coupon = await stripe.coupons.create({
        amount_off: 300,
        currency: 'eur',
        duration: 'once',
        name: 'Campaña FertiMind (7,99 → 4,99 €)',
      });
      console.log(`✓ cupón creado: −3,00 € (${coupon.id})`);
    } else {
      console.log(`✓ cupón reutilizado: ${coupon.id}`);
    }
    promo = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: PROMO_CODE,
      max_redemptions: 500,
      active: true,
    });
    console.log(`✓ promotion code creado: ${PROMO_CODE} (max 500 canjes)`);
  } else {
    console.log(`✓ promotion code ya existía: ${PROMO_CODE} (activo: ${promo.active})`);
  }

  // 5. Persistir runtime (nunca en .env: el build lo hornea)
  writeFileSync(
    '.stripe-runtime.json',
    JSON.stringify(
      { ...runtime, whsec: hook.secret, priceId: PRICE_ID },
      null,
      2,
    ) + '\n',
  );
  chmodSync('.stripe-runtime.json', 0o600);
  console.log(`\n✓ .stripe-runtime.json actualizado (600, gitignored):`);
  console.log(`  sk    ${mask(runtime.sk)}`);
  console.log(`  whsec ${mask(hook.secret)}`);
  console.log(`  price ${PRICE_ID}`);
}

main().catch((e) => {
  console.error('FALLO:', e.message);
  process.exit(1);
});
