import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const exists = path => existsSync(new URL(path, root));

for (const path of ['v3/index.html', 'v3/v3.css', 'v3/v3.js', 'v2/app.js', 'v2/lessons.js', 'v2/v2-api.js']) {
  assert.equal(exists(path), true, `${path} is missing`);
}

const html = read('v3/index.html');
const css = read('v3/v3.css');
const js = read('v3/v3.js');
const app = read('v2/app.js');
const frontendServer = read('frontend-server.mjs');
const privacy = read('privacy.html');

assert.ok(html.includes('window.LEARNING_AI_PRODUCT_VERSION = \'V3\''), 'V3 must identify itself to the shared engine');
assert.ok(html.includes('window.LEARNING_AI_FULL_FREE_ACCESS = true'), 'V3 must explicitly enable full-free access');
assert.ok(html.includes('https://learningai4you.com/v3/'), 'V3 canonical URL must use the bare domain');
assert.ok(!html.includes('https://www.learningai4you.com'), 'V3 must not declare www as canonical');
assert.ok(html.includes('name="robots" content="noindex, nofollow"'), 'Preview must stay hidden from search until launch approval');
assert.ok(html.includes('../v2/v2-api.js') && html.includes('../v2/lessons.js') && html.includes('../v2/app.js'), 'V3 must use the proven V2 API, curriculum, and engine');

assert.ok(app.includes("h('h1', null, 'All 50 lessons. Free.')"), 'V3 free-access view is missing');
assert.ok(app.includes('No lesson is locked behind payment.'), 'V3 must state the free-access boundary clearly');
assert.ok(!app.includes('One fair purchase') && !app.includes('future subscription'), 'The obsolete payment-cycle branch must be removed, not hidden');
assert.ok(app.includes('PRODUCT_PATH + hash.replace'), 'Analytics must use the active product path');
assert.ok(app.includes("savePatch({ theme: 'sepia' })"), 'Settings must provide a functional sepia theme');
assert.ok(app.includes("savePatch({ theme: 'contrast' })"), 'Settings must provide a functional high-contrast theme');
assert.ok(app.includes("s.theme === 'sepia'") && app.includes("s.theme === 'contrast'"), 'Sepia and high-contrast themes need real palette behavior');
assert.ok(app.includes("savePatch({ reduceMotion: true })") && app.includes("b.dataset.motion = s.reduceMotion ? 'reduced' : 'full'"), 'Settings must provide a functional reduced-motion preference');
assert.ok(app.includes("'aria-pressed': settings.fontScale === 'xl' ? 'true' : 'false'"), 'Text-size controls must expose their selected state');
assert.ok(!app.includes("['under-13', 'Under 13']"), 'The 13+ product must not invite under-13 questionnaire participation');
assert.ok(app.includes('Learning AI is designed for ages 13+.'), 'The age-range control must state the 13+ scope');
assert.ok(privacy.includes('For learners ages 13–17'), 'Privacy guidance must address the intended minor audience');
assert.ok(privacy.includes('This course does not contain a live AI chatbot.'), 'Privacy guidance must distinguish this course from outside AI services');
const exitSuccessCall = "e.target.classList.add('right'); fb.textContent = '✓ ' + o.feedback; recordInteraction(s, { selected: o.text, correct: true, feedback: o.feedback }); ctx.unlock();";
assert.equal(app.split(exitSuccessCall).length - 1, 1, 'A correct exit check must be recorded exactly once');
assert.ok(frontendServer.includes("const CANONICAL_HOST = String(process.env.CANONICAL_HOST"), 'Frontend must accept an explicit canonical host');
assert.ok(frontendServer.includes('location: `https://${CANONICAL_HOST}${url.pathname}${url.search}`'), 'Non-canonical hosts must preserve path and query while redirecting');

assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'V3 needs reduced-motion behavior');
assert.ok(css.includes('body.v3-product[data-motion="reduced"]'), 'V3 needs an explicit in-product reduced-motion path');
assert.ok(css.includes('@media (forced-colors: active)'), 'V3 needs forced-colors behavior');
assert.ok(css.includes('@media (max-width: 560px)'), 'V3 needs a phone layout');
assert.ok(css.includes(':focus-visible'), 'V3 needs an explicit visible keyboard-focus treatment');
assert.ok(css.includes('.free-access-grid'), 'V3 needs a designed free-access surface');
assert.ok(js.includes('MutationObserver') && js.includes('prefers-reduced-motion') && js.includes("document.body.dataset.motion === 'reduced'"), 'V3 motion must be state-triggered and honor system and in-product preferences');
assert.ok(html.includes('class="v3-skip"') && html.includes('id="app" tabindex="-1"'), 'V3 must provide a focusable skip target');
assert.ok(js.includes("skipLink?.addEventListener('click'") && js.includes('event.preventDefault()') && js.includes("app.focus({ preventScroll: true })"), 'V3 skip link must preserve the SPA route and move focus into the course');
assert.ok(css.includes(':focus-visible') && css.includes('outline: 3px solid var(--accent) !important'), 'V3 must preserve a visible keyboard focus ring over inherited V2 styles');

const curriculumContext = { window: {} };
vm.runInNewContext(read('v2/lessons.js'), curriculumContext, { filename: 'v2/lessons.js' });
const lessons = curriculumContext.window.LESSONS;
assert.equal(Array.isArray(lessons), true, 'Lesson bundle did not load');
assert.equal(lessons.length, 50, 'V3 must expose all 50 lessons');
assert.equal(new Set(lessons.map(lesson => lesson.id)).size, 50, 'Lesson IDs must be unique');
lessons.forEach((lesson, index) => {
  assert.equal(lesson.id, `chapter-${index + 1}`, `Lesson ${index + 1} must preserve its stable chapter ID`);
  assert.ok(Array.isArray(lesson.steps) && lesson.steps.length >= 2, `${lesson.id} needs authored steps`);
  assert.ok(lesson.steps.some(step => step.kind === 'exitCheck'), `${lesson.id} needs an exit check`);
});

execFileSync(process.execPath, ['--check', fileURLToPath(new URL('v2/app.js', root))], { stdio: 'pipe' });
execFileSync(process.execPath, ['--check', fileURLToPath(new URL('v3/v3.js', root))], { stdio: 'pipe' });
execFileSync(process.execPath, [fileURLToPath(new URL('tools/build-lessons.mjs', root)), '--check'], { stdio: 'pipe' });
execFileSync(process.execPath, [fileURLToPath(new URL('tools/audit-curriculum-principles.mjs', root))], { stdio: 'pipe' });

console.log('Learning AI V3 preview checks passed');
console.log('50 lessons · stable chapter IDs · free access · shared V2 engine · responsive/accessibility contracts');
