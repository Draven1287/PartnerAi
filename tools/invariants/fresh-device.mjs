/* The state nobody was testing: the account is on the server, and this browser
   has never seen it.

   Every other suite seeds localStorage, so every learner looks like a returning
   device. A real learner signed in on a second browser — or who cleared site
   data, or opened a private window — has a session and no local record, and for
   weeks that person was thrown back to lesson one from every page and then
   asked to sign in although he already was. A duplicate localStorage-only guard
   in lesson.html did it, and nothing here could see it.

   This suite needs the real backend, so it is skipped, loudly, without one. */
import { ROUTES, routeName, routePath } from './spec.mjs';

const PROTECTED = ['lessons.html','progress.html','focus.html','notes.html','projects.html',
  'gallery.html','settings.html','stage-1-navigation-proof.html'];
const LESSON = 'lesson.html?id=chapter-3';

const landedOn = async page => page.evaluate(
  `return location.pathname.split('/').pop() + (new URLSearchParams(location.search).get('id') ? '?id=' + new URLSearchParams(location.search).get('id') : '');`);

export async function runFreshDevice({ page, origin, report, site }) {
  if (!site?.hasBackend) {
    report.note('fresh-device: skipped — this suite needs the real backend, which was not started');
    return;
  }

  // A learner who has genuinely done the work, recorded only on the server.
  await page.goto(`${origin}/learning-ai-design-assets/index.html`);
  const built = await page.evaluate(`
    return (async () => {
      const api = window.LearningAIAPI;
      const up = await api.signup({ email: 'fresh-device@example.com', password: 'a-long-enough-password-1', displayName: 'Fresh' });
      if (!up.ok) return 'signup failed: ' + (up.error || up.status);
      /* The server enforces the real order: the free lesson, then the
         questionnaire, then everything else. Seeding it any other way is
         refused, which is worth knowing — it means this state can only be
         reached by a learner who genuinely did the work. */
      const first = await api.saveProgress({ lessonId: 'chapter-1', currentStep: 6, completed: true });
      if (!first.ok) return 'free lesson failed: ' + (first.error || first.status);
      const a = await api.saveAssessment({ ageRange: '50-plus',
        responses: ['definition','capability','limits','learning','impact','systems'].map(key => ({ key, value: '2', score: 2 })) });
      if (!a.ok) return 'assessment failed: ' + (a.error || a.status);
      for (const id of ['chapter-2','chapter-3']) {
        const saved = await api.saveProgress({ lessonId: id, currentStep: 6, completed: true });
        if (!saved.ok) return 'progress failed for ' + id + ': ' + (saved.error || saved.status);
      }
      return 'ok';
    })();`);
  if (!report.check('fresh-device/record-exists-on-the-server', built === 'ok', built)) return;

  /* Wipe only the browser's copy. The session cookie survives, so this is the
     same person, signed in, on a device that knows nothing about him. */
  const forgetDevice = async () => {
    await page.goto(`${origin}/robots.txt`);
    await page.evaluate(`localStorage.clear(); sessionStorage.clear(); return true;`);
  };

  /* Ask from a page that actually loads the client. robots.txt does not, so
     probing there proves nothing about the session. */
  await forgetDevice();
  await page.goto(`${origin}/learning-ai-design-assets/lesson-one.html`);
  const session = await page.evaluate(
    `return (async () => { const r = await window.LearningAIAPI.me(); return r.ok === true; })();`);
  report.check('fresh-device/still-signed-in-after-clearing-storage',
    session === true, 'the session did not survive clearing storage, so the rest of this suite proves nothing');

  for (const path of [LESSON, ...PROTECTED]) {
    await forgetDevice();
    await page.goto(`${origin}/learning-ai-design-assets/${path}`, { budget: 15_000 });
    // The guard asks the server and reloads, so give it room to finish.
    await new Promise(resolve => setTimeout(resolve, 2_500));
    const where = await landedOn(page);
    const asked = path.split('?')[0];
    report.check(
      `fresh-device/opens  ${path}`,
      where.split('?')[0] === asked,
      `asked for ${path} and landed on ${where} — a signed-in learner was sent backwards`
    );
  }

  /* And the other half: somebody with no account at all must still be kept out,
     or the fix that rescued the learner would have opened the course to
     everyone. */
  /* Sign out properly first. The session cookie is HttpOnly, so clearing
     document.cookie does nothing and the "stranger" would still be the same
     signed-in learner — which is how this check first passed for the wrong
     reason. */
  await page.goto(`${origin}/learning-ai-design-assets/lesson-one.html`);
  const signedOut = await page.evaluate(`
    return (async () => {
      try { await window.LearningAIAPI.logout(); } catch {}
      const r = await window.LearningAIAPI.me();
      return r.ok !== true;
    })();`);
  if (!report.check('fresh-device/can-sign-out', signedOut === true,
    'logout did not end the session, so the stranger cases below would test a signed-in learner')) return;

  for (const path of [LESSON, 'lessons.html', 'settings.html']) {
    await page.goto(`${origin}/robots.txt`);
    await page.evaluate(`localStorage.clear(); sessionStorage.clear(); return true;`);
    await page.goto(`${origin}/learning-ai-design-assets/${path}`, { budget: 15_000 });
    await new Promise(resolve => setTimeout(resolve, 2_000));
    const where = await landedOn(page);
    report.check(
      `fresh-device/stranger-still-kept-out  ${path}`,
      where === 'lesson-one.html',
      `a visitor with no account reached ${where}`
    );
  }
}
