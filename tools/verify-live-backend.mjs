import dns from 'node:dns/promises';
import net from 'node:net';

const DEFAULT_API_URL = 'https://api.learningai4you.com';
const apiUrl = new URL(process.env.LEARNING_AI_API_URL || DEFAULT_API_URL);
const timeoutMs = Number(process.env.VERIFY_TIMEOUT_MS || 10000);

function result(name, ok, detail) {
  const status = ok ? 'PASS' : 'FAIL';
  console.log(`${status} ${name}${detail ? ` - ${detail}` : ''}`);
  return ok;
}

async function checkDns(hostname) {
  try {
    const addresses = await dns.lookup(hostname, { all: true });
    const ips = addresses.map((entry) => entry.address).join(', ');
    return result('dns', addresses.length > 0, `${hostname} -> ${ips}`);
  } catch (error) {
    return result('dns', false, error.message);
  }
}

async function checkTcp(hostname, port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: hostname, port });
    const done = (ok, detail) => {
      socket.destroy();
      resolve(result(`tcp:${port}`, ok, detail));
    };
    socket.setTimeout(timeoutMs, () => done(false, `timed out after ${timeoutMs}ms`));
    socket.once('connect', () => done(true, `${hostname}:${port} reachable`));
    socket.once('error', (error) => done(false, error.message));
  });
}

async function request(path, options = {}) {
  const url = new URL(path, apiUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      signal: controller.signal
    });
    const text = await response.text();
    return { ok: true, response, text };
  } catch (error) {
    return { ok: false, error };
  } finally {
    clearTimeout(timeout);
  }
}

async function checkHttp(path, expectedStatuses, label) {
  const outcome = await request(path);
  if (!outcome.ok) {
    return result(label, false, outcome.error.name === 'AbortError' ? `timed out after ${timeoutMs}ms` : outcome.error.message);
  }

  const expected = expectedStatuses.includes(outcome.response.status);
  const detail = `HTTP ${outcome.response.status}`;
  if (path === '/health' && outcome.response.ok) {
    try {
      const health = JSON.parse(outcome.text);
      const marker = [
        health.buildSha ? `buildSha=${health.buildSha}` : null,
        health.buildTime ? `buildTime=${health.buildTime}` : null,
        health.dbStatus ? `dbStatus=${health.dbStatus}` : null,
        health.migrationVersion ? `migrationVersion=${health.migrationVersion}` : null
      ].filter(Boolean).join(' ');
      return result(label, expected, marker ? `${detail} ${marker}` : detail);
    } catch {
      return result(label, false, `${detail} non-JSON health response`);
    }
  }

  return result(label, expected, detail);
}

async function main() {
  console.log(`Checking ${apiUrl.origin}`);
  const checks = [];
  checks.push(await checkDns(apiUrl.hostname));
  checks.push(await checkTcp(apiUrl.hostname, 443));
  checks.push(await checkHttp('/health', [200], 'health'));
  checks.push(await checkHttp('/admin', [200], 'admin login page'));
  checks.push(await checkHttp('/api/auth/me', [401], 'learner auth guard'));
  checks.push(await checkHttp('/api/admin/learners', [401], 'admin api guard'));

  const failed = checks.filter((ok) => !ok).length;
  if (failed > 0) {
    console.error(`Live backend verification failed: ${failed} check(s) failed.`);
    process.exit(1);
  }
  console.log('Live backend verification passed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
