
const { GoogleAuth } = require('google-auth-library');
const key = require('/root/fertimind/deployer-key.json');
const IMAGE = 'europe-west1-docker.pkg.dev/fivmind-c7897/fertimind/web:v2026-09-18-mu7arh5y';
(async () => {
  const auth = new GoogleAuth({ credentials: key, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  const client = await auth.getClient();
  const base = 'https://run.googleapis.com/v2/projects/fivmind-c7897/locations/europe-west1/services/fertimind-web';
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
