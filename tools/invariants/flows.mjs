/* Flow invariants: where a journey ENDS.

   The routing table only ever asks "where does opening this page put me". Two
   of the six failures were at the other end of a journey, and that is exactly
   why three separate fixes missed the third one: they all checked whether the
   free lesson would open, and the redirect was on the last click.

   So these drive the real controls and record where the visitor is left. */
import { seedState } from './routing.mjs';

const file = href => (href ? new URL(href).pathname.split('/').pop() : '(nowhere)');
const withMode = href => {
  if (!href) return '(nowhere)';
  const url = new URL(href);
  const mode = url.searchParams.get('mode');
  return mode ? `${file(href)}?mode=${mode}` : file(href);
};

/* The draft the free lesson restores itself from. Seeding it puts the harness
   on the last step without clicking through seven of them. */
const AT_THE_END = JSON.stringify({
  current: 7,
  decisions: { q1: 'privacy', q2: 'privacy', q3: 'verify', q4: 'intent' },
  verifyState: { first: 'good', second: 'good' },
  verifySelections: { first: 0, second: 0 },
  decisionIndex: 3,
  verifyIndex: 1,
  lessonMode: 'quick',
  updatedAt: '2026-07-01T00:00:00.000Z'
});

export async function runFlows({ page, origin, report }) {
  const asset = name => `${origin}/learning-ai-design-assets/${name}`;

  // -------------------------------------------------------------------------
  // Signing in while preview is on must leave you signed in.
  //
  // The sign-in loop, end to end. Preview blocked every learningai- write,
  // so the account never persisted, so the guard saw no account and sent
  // every page back to the form. Nothing about that is visible without
  // performing the write and then asking for a page.
  // -------------------------------------------------------------------------
  await seedState(page, origin, { account: false, freeLesson: false, questionnaire: false, preview: true });
  await page.goto(asset('about.html'));
  const stored = await page.evaluate(`
    /* The write access.html makes on a successful sign-in, verbatim in shape. */
    localStorage.setItem('learningai-prototype-account', JSON.stringify({
      id: 'flow-1', email: 'flow@example.test', displayName: 'Flow', username: 'flow'
    }));
    localStorage.setItem('learningai-browser-accounts', JSON.stringify([{ id: 'flow-1', email: 'flow@example.test' }]));
    return localStorage.getItem('learningai-prototype-account');
  `);
  report.check(
    'flow/sign-in-under-preview persists the account',
    Boolean(stored),
    'preview swallowed the sign-in write; the site is a loop from here'
  );
  const afterSignIn = await page.goto(asset('stage-1-navigation-proof.html'));
  report.check(
    'flow/sign-in-under-preview reaches the dashboard',
    file(afterSignIn.url) === 'stage-1-navigation-proof.html',
    `signed in with preview on and the dashboard still sent us to ${withMode(afterSignIn.url)}`
  );

  // -------------------------------------------------------------------------
  // Finishing the free lesson.
  // -------------------------------------------------------------------------
  const finishAs = async (state, expected, label) => {
    await seedState(page, origin, state);
    await page.evaluate(`localStorage.setItem('learningai-lesson-one-draft-v2', ${JSON.stringify(AT_THE_END)}); return true;`);
    await page.goto(asset('lesson-one.html'));

    const ready = await page.evaluate(`
      const next = document.querySelector('#next');
      return next ? { text: next.textContent.trim(), hidden: next.hidden, disabled: next.disabled, step: document.querySelector('#stepCount').textContent } : null;
    `);
    report.check(
      `flow/free-lesson-end  ${label}: reached the last step`,
      Boolean(ready) && !ready.hidden && !ready.disabled && /Step 7 of 7/.test(ready.step || ''),
      `could not reach the finish control: ${JSON.stringify(ready)}`
    );
    if (!ready || ready.hidden || ready.disabled) return;

    /* The label is part of the promise. Offering to "create an account" to
       someone who has one is the same mistake as sending them to the form. */
    if (state.account) {
      report.check(
        `flow/free-lesson-end  ${label}: the finish button does not offer a sign-up`,
        !/create account/i.test(ready.text),
        `the button reads "${ready.text}" to a learner who already has an account`
      );
    }

    await page.evaluate('document.querySelector("#next").click(); return true;');
    const landing = await page.settle({ from: 0 });
    report.check(
      `flow/free-lesson-end  ${label}: lands on ${expected}`,
      withMode(landing.url) === expected,
      `finishing the free lesson left the learner on ${withMode(landing.url)}`
    );
    if (state.account) {
      report.check(
        `flow/free-lesson-end  ${label}: never a sign-up form`,
        withMode(landing.url) !== 'access.html?mode=create',
        'a learner who already had an account was sent to the create-account form after five minutes of work'
      );
    }
  };

  await finishAs(
    { account: true, freeLesson: false, questionnaire: false, preview: false },
    'onboarding.html',
    'with an account, questionnaire still to answer'
  );
  await finishAs(
    { account: true, freeLesson: false, questionnaire: true, preview: false },
    'stage-1-navigation-proof.html',
    'with an account and the questionnaire answered'
  );
  await finishAs(
    { account: false, freeLesson: false, questionnaire: false, preview: false },
    'access.html?mode=create',
    'with no account'
  );
}
