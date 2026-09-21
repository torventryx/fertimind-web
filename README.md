# FertiMind Web

Web pública de FertiMind (`https://fertimind.es`): **foros, cursos con base
científica y directorio de clínicas**, construida para SEO y para motores de
IA conversacional (ChatGPT, Claude, Perplexity).

## Arquitectura

- **Next.js 14 (App Router, TypeScript, Tailwind)** — un único código base.
- **Modo estático (activo)**: 510+ páginas prerenderizadas al build
  (foros, hilos, cursos, lecciones, clínicas, sitemap, robots, llms.txt)
  servidas por Firebase Hosting CDN. Cero backend expuesto.
- **Modo dinámico (preparado)**: backend SSR en Cloud Run
  (`fertimind-web`, europe-west1) desde imagen Docker standalone. Activa
  las API routes de Stripe y lectura premium.
- **Datos**: Firestore vía Firebase Admin SDK (SSR/build), consultas
  equality-only (sin índices compuestos extra), orden en memoria.
- **Idiomas**: español en la raíz (`/foros`, `/cursos`, `/clinicas`) e
  inglés bajo `/en` (`/forums`, `/courses`, `/clinics`) con `hreflang`.
  Los hilos usan las traducciones es/en almacenadas por la app.
- **Privacidad**: anuncios de embarazo tras velo opt-in + `noindex`;
  contenido bot excluido (`is_archive`); contenido premium NUNCA viaja en
  el HTML público.

## Comandos

```bash
npm install
npm run dev              # desarrollo
npm run deploy:static    # build estático + deploy a Firebase Hosting
npm run deploy:dynamic   # (requiere rol, ver abajo) backend SSR + Stripe
```

Variables en `.env` (ver `.env.example`): `NEXT_PUBLIC_SITE_URL`,
`GOOGLE_APPLICATION_CREDENTIALS_JSON` (o `GOOGLE_APPLICATION_CREDENTIALS`),
`GOOGLE_PLACES_API_KEY` (reseñas de clínicas), `STRIPE_SECRET_KEY`,
`STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`.

## Activar el backend dinámico (Stripe + premium en web)

La SA de deploy (`master@<proyecto>.iam.gserviceaccount.com`, ver IAM en
GCP Console) tiene
`roles/editor`, que no permite publicar endpoints (setIamPolicy). Un
Owner del proyecto debe concederle una vez
**`roles/cloudfunctions.admin`** en
<https://console.cloud.google.com/iam-admin/iam?project=fivmind-c7897>.
Después: `npm run deploy:dynamic`.

Mientras tanto el checkout web muestra aviso y remite a la app
(RevenueCat sigue siendo el paywall nativo).

## Actualización de contenido

El modo estático congela el contenido en cada deploy. Hay una tarea
programada en el VPS que ejecuta `npm run deploy:static` a diario
(07:17). Para publicar algo inmediato: `npm run deploy:static`.

## Monetización (contrato de entitlement)

Fuente única de verdad: `users/{uid}.paid_access`.

- App (RevenueCat) → espeja el flag en el user doc (`revenuecat_service`).
- Web (Stripe) → `/api/stripe/webhook` y `/api/stripe/verify` lo conceden.

Una compra en cualquier superficie desbloquea en ambas.

## Stripe (production, live)

- Cuenta `acct_1S8jlF3cnTSQSxEm` · producto `prod_VHebAukuBcLh1Ty`
  · price `price_1UH5IL3cnTSQSxEmT9Pjtn72` (7,99 € **pago único**, EUR).
- Promotion code `FERTI499` (−3,00 € → 4,99 €, 500 canjes).
- Webhook `https://fertimind.es/api/stripe/webhook` →
  `checkout.session.completed` (activa `paid_access`).

### Reglas de seguridad (no negociables)

1. La `sk_live_` y el `whsec_` viven SOLO como **variables de runtime de
   Cloud Run** (PATCH del template). NUNCA en `.env`: Next las hornea
   dentro de la imagen en el build.
2. El archivo `.stripe-runtime.json` (chmod 600) es la copia local para
   operar; está gitignored.
3. Ver estado sin exponer valores:
   `node scripts/configure-stripe.mjs` (idempotente: valida cuenta/price,
   recrea webhook si falta, reutiliza FERTI499).

### Rotación de la sk

1. Dashboard → API keys → "Roll key" (invalida la anterior).
2. Actualizar `sk` en `.stripe-runtime.json`.
3. `node scripts/configure-stripe.mjs` (webhook ya existe → solo valida).
4. Re-PATCHear el env de Cloud Run (ver historial de comandos del repo).
