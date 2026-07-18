import assert from 'node:assert/strict';

const canonical = String(process.env.LEARNING_AI_PRODUCTION_ORIGIN || 'https://learningai4you.com').replace(/\/$/, '');
const legacy = String(process.env.LEARNING_AI_LEGACY_ORIGIN || 'https://www.learningai4you.com').replace(/\/$/, '');
const email = String(process.env.LEARNING_AI_PRODUCTION_EMAIL || '');
const password = String(process.env.LEARNING_AI_PRODUCTION_PASSWORD || '');

const results = [];
const failures = [];

function record(name, ok, detail = '') {
  const row = { name, ok: Boolean(ok), detail: String(detail || '') };
  results.push(row);
  if (!row.ok) failures.push(row);
}

async function request(url, options = {}) {
  try {
    const response = await fetch(url, {
      redirect: options.redirect || 'follow',
      signal: AbortSignal.timeout(options.timeoutMs || 15_000),
      ...options
    });
    const text = await response.text();
    return { ok: true, response, text };
  } catch (error) {
    return { ok: false, error: error?.message || String(error), cause: error?.cause?.message || '' };
  }
}

async function publicChecks() {
  const health = await request(`${canonical}/health`);
  record('canonical TLS and frontend health', health.ok && health.response.status === 200, health.ok ? `HTTP ${health.response.status}` : `${health.error} ${health.cause}`);

  const apiHealth = await request(`${canonical}/api/health`);
  let apiBody = {};
  if (apiHealth.ok) {
    try { apiBody = JSON.parse(apiHealth.text); } catch {}
  }
  record('same-origin API health', apiHealth.ok && apiHealth.response.status === 200 && apiBody.ok === true, apiHealth.ok ? `HTTP ${apiHealth.response.status}; db=${apiBody.database || apiBody.db || 'unknown'}` : `${apiHealth.error} ${apiHealth.cause}`);

  const preview = await request(`${canonical}/v3/`);
  record('hidden V3 preview route', preview.ok && preview.response.status === 200, preview.ok ? `HTTP ${preview.response.status}` : `${preview.error} ${preview.cause}`);
  if (preview.ok && preview.response.status === 200) {
    record('V3 remains noindex before cutover', /name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(preview.text), 'Expected robots noindex on the preview');
    record('V3 canonical uses the bare domain', preview.text.includes('<link rel="canonical" href="https://learningai4you.com/v3/">'), 'Expected the bare-domain canonical URL');
    record('V3 explicitly enables full-free access', preview.text.includes("window.LEARNING_AI_FULL_FREE_ACCESS = true"), 'Expected the full-free access flag');
    record('V3 loads the shared real product engine', preview.text.includes('../v2/lessons.js') && preview.text.includes('../v2/app.js') && preview.text.includes('../v2/v2-api.js'), 'Expected V2 curriculum, application, and API assets');

    const assetPaths = [...preview.text.matchAll(/(?:src|href)=["']([^"']+\.(?:css|js)(?:\?[^"']*)?)["']/g)]
      .map(match => new URL(match[1], `${canonical}/v3/`).href);
    const assetResults = await Promise.all([...new Set(assetPaths)].map(async url => ({ url, response: await request(url) })));
    const failedAssets = assetResults.filter(item => !item.response.ok || item.response.response.status !== 200);
    record('V3 versioned assets load', failedAssets.length === 0 && assetResults.length >= 5, failedAssets.length ? failedAssets.map(item => `${item.url}: ${item.response.ok ? item.response.response.status : item.response.error}`).join('; ') : `${assetResults.length} assets`);
  }

  const wwwRedirect = await request(`${legacy}/v3/?production-check=1`, { redirect: 'manual' });
  const location = wwwRedirect.ok ? wwwRedirect.response.headers.get('location') || '' : '';
  record('www permanently redirects to bare domain', wwwRedirect.ok && [301, 308].includes(wwwRedirect.response.status) && location === `${canonical}/v3/?production-check=1`, wwwRedirect.ok ? `HTTP ${wwwRedirect.response.status}; location=${location || 'missing'}` : `${wwwRedirect.error} ${wwwRedirect.cause}`);
}

function cookieFrom(response) {
  return response.headers.get('set-cookie')?.split(';')[0] || '';
}

async function authenticatedChecks() {
  if (!email && !password) {
    results.push({ name: 'production-authenticated QA', ok: null, detail: 'Skipped: set LEARNING_AI_PRODUCTION_EMAIL and LEARNING_AI_PRODUCTION_PASSWORD to use an existing test account' });
    return;
  }
  assert.ok(email && password, 'Set both LEARNING_AI_PRODUCTION_EMAIL and LEARNING_AI_PRODUCTION_PASSWORD');

  const login = await request(`${canonical}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: canonical },
    body: JSON.stringify({ email, password })
  });
  let loginBody = {};
  if (login.ok) {
    try { loginBody = JSON.parse(login.text); } catch {}
  }
  const cookie = login.ok ? cookieFrom(login.response) : '';
  record('production login', login.ok && login.response.status === 200 && loginBody.ok === true && cookie, login.ok ? `HTTP ${login.response.status}` : `${login.error} ${login.cause}`);
  if (!cookie) return;

  const authHeaders = { cookie, origin: canonical };
  const endpoints = [
    ['/api/auth/me', 'authenticated identity'],
    ['/api/v2/curriculum', 'authenticated curriculum'],
    ['/api/v2/dashboard', 'authenticated dashboard'],
    ['/api/v2/access', 'authenticated free-access state']
  ];
  for (const [path, name] of endpoints) {
    const result = await request(`${canonical}${path}`, { headers: authHeaders });
    let body = {};
    if (result.ok) {
      try { body = JSON.parse(result.text); } catch {}
    }
    record(name, result.ok && result.response.status === 200 && body.ok !== false, result.ok ? `HTTP ${result.response.status}` : `${result.error} ${result.cause}`);
  }
}

await publicChecks();
await authenticatedChecks();

for (const result of results) {
  const label = result.ok === null ? 'SKIP' : result.ok ? 'PASS' : 'FAIL';
  console.log(`${label} ${result.name}${result.detail ? ` — ${result.detail}` : ''}`);
}

console.log(`\nProduction V3 readiness: ${results.filter(result => result.ok === true).length} pass, ${failures.length} fail, ${results.filter(result => result.ok === null).length} skipped.`);
if (failures.length) process.exitCode = 1;
