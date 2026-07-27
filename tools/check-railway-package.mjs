import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import process from 'node:process';

const root = new URL('../', import.meta.url);
const required = [
  '.dockerignore',
  'Dockerfile.frontend',
  'railway.toml',
  'frontend-server.mjs',
  'tools/check-frontend-public-surface.mjs',
  'learning-ai-design-assets/index.html',
  'learning-ai-design-assets/stage-1-navigation-proof.html',
  'learning-ai-design-assets/lesson-one.html',
  'learning-ai-design-assets/access.html',
  'learning-ai-design-assets/onboarding.html',
  'learning-ai-design-assets/lessons.html',
  'learning-ai-design-assets/lesson.html',
  'learning-ai-design-assets/progress.html',
  'learning-ai-design-assets/focus.html',
  'learning-ai-design-assets/projects.html',
  'learning-ai-design-assets/gallery.html',
  'learning-ai-design-assets/notes.html',
  'learning-ai-design-assets/about.html',
  'learning-ai-design-assets/adults.html',
  'learning-ai-design-assets/settings.html',
  'learning-ai-design-assets/accounts.html',
  'learning-ai-design-assets/submission-policy.html',
  'learning-ai-design-assets/submit-project.html',
  'learning-ai-design-assets/learning-api.js',
  'learning-ai-design-assets/course-state.js',
  'learning-ai-design-assets/theme.js',
  'learning-ai-design-assets/theme.css',
  'learning-ai-design-assets/arc-rail.js',
  'learning-ai-design-assets/nav-behavior.js',
  'learning-ai-design-assets/glass-finish.css',
  'learning-ai-design-assets/dashboard.css',
  'learning-ai-design-assets/dashboard-panels.js',
  'learning-ai-design-assets/draggable-glass.js',
  'learning-ai-design-assets/learning-rhythm.js',
  'learning-ai-design-assets/focus-mini.css',
  'learning-ai-design-assets/focus-mini.js',
  'learning-ai-design-assets/focus-refinement.css',
  'learning-ai-design-assets/focus.css',
  'learning-ai-design-assets/focus.js',
  'learning-ai-design-assets/project-guides.js',
  'learning-ai-design-assets/achievement-vault.js',
  'learning-ai-design-assets/achievement-vault.css',
  'learning-ai-design-assets/learning-ai-paper-light-v1.png',
  'learning-ai-design-assets/badges/learningai-small-milestone-pins-concept-v1.png',
  'learning-ai-design-assets/badges/learningai-small-milestone-pin-backs-concept-v1.png',
  ...Array.from({ length: 10 }, (_, index) => `learning-ai-design-assets/badges/arc-${String(index + 1).padStart(2, '0')}-${[
    'first-signal',
    'pattern-seeker',
    'better-questions',
    'truth-check',
    'context-keeper',
    'human-judgment',
    'privacy-boundary',
    'workflow-builder',
    'agent-director',
    'control-remains-yours'
  ][index]}-front-back-v1.png`),
  'v3/index.html',
  'v3/v3.css',
  'v3/v3.js',
  'v2/index.html',
  'v2/app.js',
  'v2/lessons.js',
  'v2/v2-api.js',
  'coolify-backend/Dockerfile',
  'coolify-backend/package.json',
  'coolify-backend/package-lock.json',
  'coolify-backend/server.mjs',
  'coolify-backend/db.mjs',
  'coolify-backend/curriculum-seed.json',
  'coolify-backend/railway.toml',
  'lessons/_arcs.mjs',
  ...Array.from({ length: 50 }, (_, index) => `lessons/chapter-${index + 1}.mjs`)
];

function pathFor(path) {
  return new URL(path, root);
}

function read(path) {
  return readFileSync(pathFor(path), 'utf8');
}

for (const path of required) {
  assert.equal(existsSync(pathFor(path)), true, `${path} is missing from the Railway package`);
}

const tracked = new Set(execFileSync('git', ['ls-files', '-z'], {
  cwd: root,
  encoding: 'utf8'
}).split('\0').filter(Boolean));
for (const path of required) {
  assert.equal(tracked.has(path), true, `${path} is not Git-tracked and would be missing from Railway`);
}

if (process.env.RELEASE_REQUIRE_COMMITTED === '1') {
  const committed = new Set(execFileSync('git', ['ls-tree', '-r', '--name-only', 'HEAD'], {
    cwd: root,
    encoding: 'utf8'
  }).split('\n').filter(Boolean));
  for (const path of required) {
    assert.equal(committed.has(path), true, `${path} is not committed in HEAD and cannot be deployed by Railway`);
  }
}

const ignoreCheck = spawnSync('git', ['check-ignore', '--no-index', ...required], {
  cwd: root,
  encoding: 'utf8'
});
assert.ok([0, 1].includes(ignoreCheck.status), ignoreCheck.stderr || 'git check-ignore failed');
const ignored = ignoreCheck.stdout.trim();
assert.equal(ignored, '', `Required Railway files must not be ignored:\n${ignored}`);

const dockerignore = read('.dockerignore');
for (const entry of ['.git', 'node_modules', '**/.env', '*.pem', '*.key']) {
  assert.ok(dockerignore.includes(entry), `.dockerignore must exclude ${entry}`);
}

assert.ok(read('Dockerfile.frontend').includes('CMD ["node", "frontend-server.mjs"]'));
assert.ok(read('railway.toml').includes('dockerfilePath = "Dockerfile.frontend"'));
assert.ok(read('railway.toml').includes('healthcheckPath = "/health"'));
assert.ok(read('coolify-backend/railway.toml').includes('dockerfilePath = "Dockerfile"'));
assert.ok(read('coolify-backend/railway.toml').includes('healthcheckPath = "/health"'));

const frontend = read('frontend-server.mjs');
assert.ok(frontend.includes("process.env.API_INTERNAL_URL"), 'Frontend must proxy to the Railway private backend');
assert.ok(frontend.includes("process.env.CANONICAL_HOST"), 'Frontend must support the bare-domain canonical redirect');
assert.ok(frontend.includes("const PUBLIC_PREFIXES = ['/learning-ai-design-assets/', '/v2/', '/v3/']"), 'Frontend must use an explicit public-root allowlist');
assert.ok(frontend.includes('PUBLIC_EXTENSIONS.has(extension)'), 'Frontend must reject non-public file types');
assert.ok(frontend.includes("url.pathname === '/api' || url.pathname.startsWith('/api/')"));
assert.ok(
  frontend.includes("url.pathname === '/' ? '/learning-ai-design-assets/index.html'"),
  'The approved LearningAI redesign must be served at the public root'
);
assert.ok(
  frontend.includes("`/learning-ai-design-assets${pathname}`"),
  'Root-relative redesign routes must resolve inside the deployable design package'
);
assert.ok(frontend.includes('response.writeHead(308'), 'Canonical-host redirect must be permanent and path-preserving');
const gallery = read('learning-ai-design-assets/gallery.html');
const submissionPolicy = read('learning-ai-design-assets/submission-policy.html');
for (const [label, source] of [['Gallery', gallery], ['submission policy', submissionPolicy]]) {
  assert.ok(source.includes('non-identifying pseudonym'), `${label} must require a non-identifying pseudonym for under-18 publication`);
  assert.ok(source.includes('guardian'), `${label} must retain a separate guardian-approval safeguard`);
}
assert.ok(submissionPolicy.includes('A guardian cannot approve a real name or other personal identifier'), 'Guardian approval must not override the under-18 identity boundary');

// The submission page may only promise what the deployed backend actually does.
// There is no outbound mail behind /api/v2/project-review, so a success screen
// that implies one would be a lie, and a typed recipient field would let the
// site address strangers on a learner's behalf.
const submitProject = read('learning-ai-design-assets/submit-project.html');
assert.ok(submitProject.includes('window.LearningAIAPI.submitProjectReview('), 'Project submission must reach the account service, not a mail client');
assert.ok(submitProject.includes('No email has been sent.'), 'A recorded submission must state plainly that no email went out');
assert.ok(submissionPolicy.includes('LearningAI does not send email on your behalf'), 'The policy must agree that the site does not send email');
assert.ok(!/<input[^>]*type=["']email["']/i.test(submitProject), 'The submission page must never offer an editable recipient address');
assert.ok(
  submitProject.includes('id="confirmPanel"') && submitProject.includes("sendButton.addEventListener('click'"),
  'Sending must be behind an explicit confirm step, never automatic'
);

for (const path of [
  'frontend-server.mjs',
  'v3/v3.js',
  'v2/app.js',
  'v2/lessons.js',
  'v2/v2-api.js',
  'coolify-backend/server.mjs',
  'coolify-backend/db.mjs'
  ,...required.filter(path => path.startsWith('learning-ai-design-assets/') && path.endsWith('.js'))
]) {
  execFileSync(process.execPath, ['--check', path], { cwd: root, stdio: 'pipe' });
}

for (const path of required.filter(path => path.endsWith('.html'))) {
  const html = read(path);
  for (const match of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attributes = match[1] || '';
    const type = attributes.match(/\btype=["']([^"']+)["']/i)?.[1] || 'text/javascript';
    if (!['text/javascript', 'application/javascript', 'module'].includes(type)) continue;
    try {
      Function(match[2]);
    } catch (error) {
      throw new Error(`${path} contains invalid inline JavaScript: ${error.message}`);
    }
  }
}

console.log(`Railway release-package checks passed: ${required.length} required files`);
console.log('The approved LearningAI redesign is the root route; V2 remains available at /v2/ as a rollback path.');
