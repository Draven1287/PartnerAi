import http from 'node:http';
import https from 'node:https';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT || 8080);
const API_ORIGIN = String(process.env.API_INTERNAL_URL || '').replace(/\/$/, '');
const CANONICAL_HOST = String(process.env.CANONICAL_HOST || '').trim().toLowerCase();
const PUBLIC_PREFIXES = ['/learning-ai-design-assets/', '/v2/', '/v3/'];
const PUBLIC_EXACT = new Set(['/backend-config.js', '/privacy.html', '/robots.txt', '/styles.css']);
const PUBLIC_EXTENSIONS = new Set(['.css', '.gif', '.html', '.ico', '.jpeg', '.jpg', '.js', '.png', '.svg', '.txt', '.webp', '.woff', '.woff2']);
const MIME = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2']
]);

function headers(pathname, stat) {
  const asset = /\.(?:css|js|mjs|png|jpe?g|gif|svg|webp|woff2?)$/i.test(pathname);
  // Assets were cached for an hour with no ETag and no Last-Modified, so a
  // browser could not revalidate and kept running superseded JavaScript after a
  // deploy. Keep them cacheable, but require a revalidation round-trip; with an
  // ETag that costs one 304, not a re-download.
  return {
    ...(stat ? {
      etag: `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`,
      'last-modified': new Date(stat.mtimeMs).toUTCString()
    } : {}),
    'cache-control': asset ? 'public, max-age=0, must-revalidate, stale-while-revalidate=86400' : 'no-cache',
    'content-security-policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.learningai4you.com https://www.google-analytics.com http://127.0.0.1:* http://localhost:*; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    'cross-origin-opener-policy': 'same-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=()',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'x-robots-tag': 'noindex, nofollow, noarchive, nosnippet',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY'
  };
}

function safeFile(pathname) {
  if (pathname.includes('\0')) return null;
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const publicPath = `/${normalize(decoded).replace(/^[/\\]+/, '')}`;
  const extension = extname(publicPath).toLowerCase();
  if (!PUBLIC_EXACT.has(publicPath) && !PUBLIC_PREFIXES.some(prefix => publicPath.startsWith(prefix))) return null;
  if (!PUBLIC_EXTENSIONS.has(extension)) return null;
  const relative = publicPath.replace(/^[/\\]+/, '');
  const absolute = resolve(join(ROOT, relative));
  if (!absolute.startsWith(resolve(ROOT) + '/')) return null;
  return absolute;
}

const server = http.createServer((request, response) => {
  let url;
  try {
    url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  } catch {
    response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8', ...headers('/') });
    response.end('Bad request');
    return;
  }
  const requestHost = String(request.headers.host || '').split(':')[0].toLowerCase();
  if (url.pathname === '/health') {
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8', ...headers(url.pathname) });
    response.end(JSON.stringify({ ok: true, service: 'learning-ai-frontend', apiProxyConfigured: Boolean(API_ORIGIN) }));
    return;
  }
  if (CANONICAL_HOST && requestHost && requestHost !== CANONICAL_HOST) {
    response.writeHead(308, { location: `https://${CANONICAL_HOST}${url.pathname}${url.search}`, ...headers(url.pathname) });
    response.end();
    return;
  }
  if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
    if (!API_ORIGIN) {
      response.writeHead(503, { 'content-type': 'application/json; charset=utf-8', ...headers(url.pathname) });
      response.end(JSON.stringify({ ok: false, error: 'api_proxy_not_configured' }));
      return;
    }
    const target = new URL(`${url.pathname}${url.search}`, API_ORIGIN);
    const transport = target.protocol === 'https:' ? https : http;
    const upstream = transport.request(target, {
      method: request.method,
      headers: {
        ...request.headers,
        host: target.host,
        // Append, never replace. Overwriting discarded the real client address
        // the platform edge had already recorded, so every learner shared one
        // rate-limit bucket and one bad actor could lock out the whole site.
        'x-forwarded-for': [request.headers['x-forwarded-for'], String(request.socket.remoteAddress || '')]
          .map(part => String(part || '').trim())
          .filter(Boolean)
          .join(', '),
        'x-forwarded-host': request.headers.host || '',
        'x-forwarded-proto': 'https'
      }
    }, upstreamResponse => {
      response.writeHead(upstreamResponse.statusCode || 502, upstreamResponse.headers);
      upstreamResponse.pipe(response);
    });
    upstream.on('error', error => {
      if (response.headersSent) return response.destroy(error);
      response.writeHead(502, { 'content-type': 'application/json; charset=utf-8', ...headers(url.pathname) });
      response.end(JSON.stringify({ ok: false, error: 'api_proxy_unavailable' }));
    });
    request.pipe(upstream);
    return;
  }
  if (!['GET', 'HEAD'].includes(request.method || 'GET')) {
    response.writeHead(405, { allow: 'GET, HEAD', ...headers(url.pathname) });
    response.end('Method not allowed');
    return;
  }

  if (url.pathname === '/learning-ai-design-assets') {
    response.writeHead(308, { location: `/learning-ai-design-assets/${url.search}`, ...headers(url.pathname) });
    response.end();
    return;
  }

  let pathname = url.pathname === '/' ? '/learning-ai-design-assets/index.html' : url.pathname;
  if (pathname.endsWith('/')) pathname += 'index.html';
  let file = null;
  if (!pathname.startsWith('/learning-ai-design-assets/') && !pathname.startsWith('/v2/') && !pathname.startsWith('/v3/')) {
    const designPath = `/learning-ai-design-assets${pathname}`;
    const designFile = safeFile(designPath);
    if (designFile && existsSync(designFile) && statSync(designFile).isFile()) {
      pathname = designPath;
      file = designFile;
    }
  }
  if (!file) file = safeFile(pathname);
  if (!file || !existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8', ...headers(pathname) });
    response.end('Not found');
    return;
  }

  const stat = statSync(file);
  const head = { 'content-type': MIME.get(extname(file).toLowerCase()) || 'application/octet-stream', ...headers(pathname, stat) };
  const inm = request.headers['if-none-match'];
  const ims = request.headers['if-modified-since'];
  const fresh = (inm && inm === head.etag)
    || (!inm && ims && Date.parse(ims) >= Math.floor(stat.mtimeMs / 1000) * 1000);
  if (fresh) {
    response.writeHead(304, head);
    return response.end();
  }
  response.writeHead(200, head);
  if (request.method === 'HEAD') response.end();
  else createReadStream(file).pipe(response);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Learning AI frontend listening on 0.0.0.0:${PORT}`);
});
