/* Routing invariants — the truth table.

   Every combination of the four state dimensions, against every route, in a
   real browser. Seed localStorage, load the page, let the redirects settle,
   and record where the visitor is actually standing.

   The four cross-cutting properties are checked separately from the table on
   purpose. The table catches a change; the properties catch a bug the table
   was also wrong about — they are statements about the product that hold no
   matter what the table says. */
import {
  everyState, stateName, seedFor, ROUTES, QUICK_ROUTES,
  routeName, routePath, expectedLanding, SIGNUP
} from './spec.mjs';

/* Where the visitor is standing, named the way the spec names it: the file,
   plus ?mode= where the page uses it to say which form it is showing. */
const relative = href => {
  if (!href) return '(nowhere)';
  const url = new URL(href);
  const file = url.pathname.split('/').pop() || 'index.html';
  const mode = url.searchParams.get('mode');
  return mode ? `${file}?mode=${mode}` : file;
};

export async function seedState(page, origin, state) {
  await page.goto(`${origin}/robots.txt`);
  await page.evaluate(`
    localStorage.clear(); sessionStorage.clear();
    const seed = ${JSON.stringify(seedFor(state))};
    for (const [key, value] of Object.entries(seed)) localStorage.setItem(key, value);
    return true;
  `);
}

export async function runRouting({ page, origin, report, quick }) {
  const routes = quick ? ROUTES.filter(r => QUICK_ROUTES.has(routeName(r))) : ROUTES;
  const states = everyState();

  for (const state of states) {
    for (const route of routes) {
      const label = `${routeName(route)} @ ${stateName(state)}`;
      await seedState(page, origin, state);
      const landing = await page.goto(`${origin}/learning-ai-design-assets/${routePath(route)}`);
      const where = relative(landing.url);
      const want = expectedLanding(route, state);

      // --- the table -----------------------------------------------------
      report.check(
        `routing/table  ${label}`,
        where === want,
        `landed on ${where}, the spec says ${want}`
      );

      // --- property: no loop, no chain, no page that redirects again ------
      report.check(
        `routing/settles  ${label}`,
        landing.settled,
        `never settled — ${landing.hops} redirects and still moving (a loop)`
      );
      report.check(
        `routing/hops  ${label}`,
        landing.hops <= 2,
        `${landing.hops} redirects to reach ${where}; the gate ladder is chaining`
      );

      // --- property: lesson one is free, in every state -------------------
      if (route.access === 'free') {
        report.check(
          `routing/free-lesson-opens  ${label}`,
          where === 'lesson-one.html',
          `the free lesson sent the visitor to ${where}`
        );
      }

      /* --- property: preview opens everything ----------------------------
         Stated without reference to the table, so it survives the table
         being edited: with preview on, a page that is a destination is where
         you end up. */
      if (state.preview && ['open', 'free', 'course'].includes(route.access)) {
        report.check(
          `routing/preview-opens  ${label}`,
          where === (route.access === 'free' ? 'lesson-one.html' : route.file),
          `preview was on and the page still redirected to ${where}`
        );
      }
      if (state.preview && route.access === 'course') {
        report.check(
          `routing/preview-unlocks-course  ${label}`,
          where === route.file,
          `preview must open every course page; this one went to ${where}`
        );
      }

      // --- property: a signed-in learner never sees a sign-up form --------
      if (state.account) {
        report.check(
          `routing/no-signup-when-signed-in  ${label}`,
          where !== SIGNUP,
          'a learner with an account was sent to the create-account form'
        );
      }
    }
  }
}
