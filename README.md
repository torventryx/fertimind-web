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

La SA de deploy (`master@fivmind-c7897.iam.gserviceaccount.com`) tiene
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
