#!/usr/bin/env node
/**
 * Deploy del backend DINÁMICO (Cloud Run `fertimind-web`, europe-west1).
 *
 * Requisito único (una vez, project Owner):
 *   Conceder roles/cloudfunctions.admin (o roles/run.admin) a la service
 *   account de deploy en:
 *   https://console.cloud.google.com/iam-admin/iam?project=fivmind-c7897
 *   (la SA es master@fivmind-c7897.iam.gserviceaccount.com — Editor hoy)
 *
 * Tras conceder el rol, este script:
 *   1. next build (standalone, con credenciales para prerender)
 *   2. docker build + push (Artifact Registry)
 *   3. PATCH del servicio Cloud Run a la nueva imagen
 *   4. setIamPolicy público (allUsers → run.invoker)
 *   5. firebase.json cambia a modo rewrite (lo hace este script)
 *
 * Con el backend dinámico activo funcionan las API routes:
 *   /api/stripe/checkout · /api/stripe/webhook · /api/stripe/verify
 *   /api/lesson-content (lectura premium verificada server-side)
 */
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const REGION = 'europe-west1';
const PROJECT = 'fivmind-c7897';
const IMAGE_BASE = `${REGION}-docker.pkg.dev/${PROJECT}/fertimind/web`;
const TAG = `v${new Date().toISOString().slice(0, 10)}-${Date.now().toString(36)}`;

console.log(`→ Imagen: ${IMAGE_BASE}:${TAG}`);
execSync('npx next build', { stdio: 'inherit', env: process.env });
execSync(`docker build -t ${IMAGE_BASE}:${TAG} .`, { stdio: 'inherit' });

const token = execSync(
  `node -e "const {GoogleAuth}=require('google-auth-library');const k=require('/root/fertimind/deployer-key.json');new GoogleAuth({credentials:k,scopes:['https://www.googleapis.com/auth/cloud-platform']}).getClient().then(c=>c.getAccessToken().then(r=>process.stdout.write(r.token)))"`,
  { encoding: 'utf-8' },
).trim();
execSync(`echo ${JSON.stringify(token)} | docker login -u oauth2accesstoken --password-stdin ${REGION}-docker.pkg.dev`, { stdio: 'inherit', shell: '/bin/bash' });
execSync(`docker push ${IMAGE_BASE}:${TAG}`, { stdio: 'inherit' });

// PATCH servicio + IAM público
const script = `
const { GoogleAuth } = require('google-auth-library');
const key = require('/root/fertimind/deployer-key.json');
const IMAGE = '${IMAGE_BASE}:${TAG}';
(async () => {
  const auth = new GoogleAuth({ credentials: key, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  const client = await auth.getClient();
  const base = 'https://run.googleapis.com/v2/projects/${PROJECT}/locations/${REGION}/services/fertimind-web';
  const cur = (await client.request({ url: base })).data;
  const containers = cur.template.containers;
  containers[0].image = IMAGE;
  const op = await client.request({ method: 'PATCH', url: base, data: { template: { containers } } });
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 4000));
    const st = await client.request({ url: 'https://run.googleapis.com/v2/' + op.data.name });
    if (st.data.done) { if (st.data.error) throw new Error(JSON.stringify(st.data.error)); break; }
  }
  await client.request({ method: 'POST', url: base + ':setIamPolicy', data: { policy: { bindings: [{ role: 'roles/run.invoker', members: ['allUsers'] }] } } });
  console.log('✓ servicio actualizado y público');
})().catch(e => { console.error('FALLO', e.response?.status, (e.response?.data?.error?.message || e.message).slice(0, 300)); process.exit(1); });
`;
// Dentro del proyecto para que node resuelva google-auth-library de node_modules.
writeFileSync('scripts/.deploy-run-update.tmp.cjs', script);
execSync('node scripts/.deploy-run-update.tmp.cjs', { stdio: 'inherit' });

// hosting en modo rewrite
writeFileSync(
  'firebase.json',
  JSON.stringify(
    {
      hosting: {
        public: 'out',
        ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
        cleanUrls: true,
        rewrites: [{ source: '/api/**', run: { serviceId: 'fertimind-web', region: REGION } }],
      },
    },
    null,
    2,
  ) + '\n',
);
console.log('✓ hosting: /api/** → Cloud Run (el resto sigue estático desde out/)');
console.log('→ firebase deploy --only hosting  para aplicar el rewrite');
