# FertiMind Web

Web pública de FertiMind (`https://fertimind.es`): **foros, cursos con base
científica y directorio de clínicas**, construida para SEO y para motores de
IA conversacional (ChatGPT, Claude, Perplexity).

## Arquitectura

- **Next.js 14 (App Router, TypeScript, Tailwind)** — un único código base.
- **Modo estático (activo)**: 510+ páginas prerenderizadas al build
  (foros, hilos, cursos, lecciones, clínicas, sitemap, robots, llms.txt)
  servidas por Firebase Hosting CDN. Cero backend expuesto.
- **Modo dinámico (activo)**: backend SSR en Cloud Run
  (`fertimind-web`, europe-west1) desde imagen Docker standalone. Sirve
  las API routes de Stripe, newsletter y lectura premium.
- **Datos**: Firestore vía Firebase Admin SDK (SSR/build), consultas
  equality-only (sin índices compuestos extra), orden en memoria.
- **Idiomas**: español en la raíz (`/foros`, `/cursos`, `/clinicas`) e
  inglés bajo `/en` (`/forums`, `/courses`, `/clinics`) con `hreflang`.
  Los hilos usan las traducciones es/en almacenadas por la app.
- **Privacidad**: anuncios de embarazo tras velo opt-in + `noindex`;
  contenido bot excluido (`is_archive`); contenido premium NUNCA viaja en
  el HTML público; apellidos nunca visibles.

## Comandos

```bash
npm install
npm run dev              # desarrollo
npm run deploy:static    # build estático + deploy a Firebase Hosting
npm run deploy:dynamic   # backend SSR en Cloud Run (Stripe + premium)
```

Las variables de entorno necesarias están documentadas en `.env.example`.
Ningún secreto se versiona en el repo.

## Actualización de contenido

El modo estático congela el contenido en cada deploy. Hay una tarea
programada en el VPS que ejecuta `npm run deploy:static` a diario
(07:17). Para publicar algo inmediato: `npm run deploy:static`.

## Monetización (contrato de entitlement)

Fuente única de verdad: `users/{uid}.paid_access`.

- App (RevenueCat) → espeja el flag en el user doc (`revenuecat_service`).
- Web (Stripe) → `/api/stripe/webhook` y `/api/stripe/verify` lo conceden.

Una compra en cualquier superficie desbloquea en ambas (7,99 € pago único).
