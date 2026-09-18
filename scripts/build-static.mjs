#!/usr/bin/env node
/**
 * Build estático de fertimind-web para Firebase Hosting.
 *
 * El sitio se publica en modo estático (510+ páginas prerenderizadas:
 * foros, cursos, clínicas, sitemap, robots y llms.txt). Los foros se
 * refrescan en cada deploy: programa `npm run deploy:static`
 * (p. ej. diario) o lánzalo tras publicar contenido destacado.
 *
 * ¿Qué NO funciona en estático? Las API routes (Stripe checkout y lectura
 * premium). El backend dinámico (Cloud Run `fertimind-web`) ya está
 * construido y desplegado: activa el modo dinámico concediendo
 * roles/cloudfunctions.admin a la service account de deploy y ejecutando
 * `npm run deploy:dynamic` (ver README).
 */
import { execSync } from 'node:child_process';
import { existsSync, renameSync, rmSync } from 'node:fs';

const API_DIR = 'src/app/api';
const API_BACKUP = '.api-backup-static-build';

function move(dir, to) {
  if (existsSync(dir)) renameSync(dir, to);
}

try {
  // 1) Las API routes no existen en export mode — se apartan y se restauran SIEMPRE
  move(API_DIR, API_BACKUP);
  console.log('→ API routes apartadas para el build estático');

  // 2) Build export → out/
  execSync(
    'GOOGLE_APPLICATION_CREDENTIALS="${GOOGLE_APPLICATION_CREDENTIALS:-}" BUILD_STATIC=1 npx next build',
    { stdio: 'inherit', env: process.env },
  );
} finally {
  move(API_BACKUP, API_DIR);
  console.log('→ API routes restauradas');
}
