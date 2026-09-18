#!/usr/bin/env node
/**
 * Configura Stripe para FertiMind de una sola vez:
 *
 *   1. Valida STRIPE_SECRET_KEY (de .env)
 *   2. Producto "FertiMind Premium" + precio único 7,99 € → STRIPE_PRICE_ID
 *   3. Cupón 3,00 € + código promocional FERTI499 (campañas 4,99 €)
 *   4. Webhook https://fertimind.es/api/stripe/webhook → STRIPE_WEBHOOK_SECRET
 *   5. Inyecta las tres variables en el servicio Cloud Run fertimind-web
 *
 * Idempotente: reutiliza producto/precio/cupón/webhook si ya existen
 * (busca por metadata fertimind_managed=true y por URL).
 *
 * Uso:  node scripts/setup-stripe.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const envFile = readFileSync('.env', 'utf-8');
const env = Object.fromEntries(
  envFile
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);
const SK = env.STRIPE_SECRET_KEY;
if (!SK || !SK.startsWith('sk_')) {
  console.error('✗ Falta STRIPE_SECRET_KEY en .env');
  process.exit(1);
}
const SITE = env.NEXT_PUBLIC_SITE_URL || 'https://fertimind.es';

async function stripe(method, path, params) {
  const body = params ? new URLSearchParams(params).toString() : undefined;
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${SK}`,
      ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Stripe ${res.status}: ${json.error?.message}`);
  return json;
}

function setEnv(key, value) {
  const lines = readFileSync('.env', 'utf-8').split('\n');
  const i = lines.findIndex((l) => l.startsWith(`${key}=`));
  const newLine = `${key}=${value}`;
  if (i >= 0) lines[i] = newLine;
  else lines.push(newLine);
  writeFileSync('.env', lines.join('\n'));
}

async function main() {
  // 1) validar
  const account = await stripe('GET', '/account');
  console.log(`✓ Cuenta Stripe válida: ${account.id} (${account.country}, ${account.livemode ? 'LIVE' : 'TEST'})`);

  // 2) producto + precio único 7,99 €
  const products = await stripe('GET', '/products?limit=100');
  let product = products.data.find((p) => p.metadata?.fertimind_managed === 'true');
  if (!product) {
    product = await stripe('POST', '/products', {
      name: 'FertiMind Premium',
      description: 'Acceso completo a todos los cursos premium, para siempre. Web + app.',
      metadata: { fertimind_managed: 'true' },
    });
    console.log('✓ Producto creado:', product.id);
  } else {
    console.log('✓ Producto existente:', product.id);
  }

  const prices = await stripe('GET', `/prices?product=${product.id}&limit=100`);
  let price = prices.data.find(
    (p) => p.unit_amount === 799 && p.currency === 'eur' && p.type === 'one_time' && p.active,
  );
  if (!price) {
    price = await stripe('POST', '/prices', {
      product: product.id,
      unit_amount: '799',
      currency: 'eur',
      'recurring[interval]': '',
      nickname: 'Pago único 7,99 €',
    });
    console.log('✓ Precio creado:', price.id);
  } else {
    console.log('✓ Precio existente:', price.id);
  }
  setEnv('STRIPE_PRICE_ID', price.id);

  // 3) cupón 3,00 € + código FERTI499 (7,99 − 3,00 = 4,99)
  const coupons = await stripe('GET', '/coupons?limit=100');
  let coupon = coupons.data.find((c) => c.metadata?.fertimind_managed === 'true');
  if (!coupon) {
    coupon = await stripe('POST', '/coupons', {
      amount_off: '300',
      currency: 'eur',
      duration: 'once',
      name: 'Campaña FertiMind 4,99 €',
      metadata: { fertimind_managed: 'true' },
    });
    console.log('✓ Cupón creado:', coupon.id);
  } else {
    console.log('✓ Cupón existente:', coupon.id);
  }
  const promoCodes = await stripe('GET', '/promotion_codes?limit=100');
  let promo = promoCodes.data.find((p) => p.coupon === coupon.id && p.active);
  if (!promo) {
    promo = await stripe('POST', '/promotion_codes', {
      coupon: coupon.id,
      code: 'FERTI499',
      max_redemptions: '',
    });
    console.log('✓ Código promocional creado: FERTI499 (7,99 − 3,00 = 4,99 €)');
  } else {
    console.log('✓ Código promocional existente:', promo.code);
  }

  // 4) webhook
  const webhookUrl = `${SITE}/api/stripe/webhook`;
  const hooks = await stripe('GET', '/webhook_endpoints?limit=100');
  let hook = hooks.data.find((h) => h.url === webhookUrl);
  if (!hook) {
    hook = await stripe('POST', '/webhook_endpoints', {
      url: webhookUrl,
      'enabled_events[]': 'checkout.session.completed',
      description: 'FertiMind web — concede paid_access tras el checkout',
    });
    console.log('✓ Webhook creado:', webhookUrl);
  } else {
    console.log('✓ Webhook existente:', webhookUrl);
  }
  setEnv('STRIPE_WEBHOOK_SECRET', hook.secret);

  console.log('\n✓ .env actualizado (PRICE_ID + WEBHOOK_SECRET)');
  console.log('\n→ Siguiente paso: subir las variables al Cloud Run (si ya está público):');
  console.log('   npm run deploy:dynamic');
}

main().catch((e) => {
  console.error('✗', e.message);
  process.exit(1);
});
