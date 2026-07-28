/* THE SPECIFICATION.

   Everything the harness enforces is declared here as data. The suites in the
   sibling files contain no product knowledge — they only compare what the
   browser did against what this file says should happen.

   Two consequences, both deliberate:

   1. Adding a page or a storage key without classifying it here FAILS. A new
      thing cannot quietly inherit a behaviour; someone has to say which one it
      is. That is the difference between a test that documents intent and a
      test that documents whatever the code happened to do last Tuesday.

   2. Changing intent means editing this file, in a diff a reviewer can read,
      rather than editing an assertion buried in a loop. */

// ---------------------------------------------------------------------------
// 1. State dimensions
// ---------------------------------------------------------------------------

/* The four things that decide where a visitor lands. Every combination is
   exercised: 2^4 = 16 states, against every route. */
export const DIMENSIONS = {
  account: [false, true],
  freeLesson: [false, true],
  questionnaire: [false, true],
  preview: [false, true]
};

export function everyState() {
  const states = [];
  for (const account of DIMENSIONS.account)
    for (const freeLesson of DIMENSIONS.freeLesson)
      for (const questionnaire of DIMENSIONS.questionnaire)
        for (const preview of DIMENSIONS.preview)
          states.push({ account, freeLesson, questionnaire, preview });
  return states;
}

export function stateName(state) {
  return [
    state.account ? 'account' : 'no-account',
    state.freeLesson ? 'lesson1-done' : 'lesson1-todo',
    state.questionnaire ? 'questions-done' : 'questions-todo',
    state.preview ? 'PREVIEW-on' : 'preview-off'
  ].join('/');
}

/* What each dimension actually is in localStorage. The harness seeds these
   directly — it is testing the guard's reading of the record, not the writing
   of it; the writing is covered by the storage suite and the sign-in flow. */
export function seedFor(state) {
  const seed = {};
  if (state.account) {
    seed['learningai-prototype-account'] = JSON.stringify({
      id: 'harness-1', email: 'harness@example.test', displayName: 'Harness', username: 'harness'
    });
    seed['learningai-browser-accounts'] = JSON.stringify([
      { id: 'harness-1', email: 'harness@example.test', displayName: 'Harness' }
    ]);
    seed['learningai-browser-session-id'] = 'harness-1';
  }
  if (state.freeLesson) {
    seed['learningai-first-lesson-complete'] = JSON.stringify({
      lessonId: 'chapter-1', lessonNumber: 1, title: 'Use AI Safely Once',
      completedAt: '2026-07-01T00:00:00.000Z', controlSignal: 'verify'
    });
  }
  if (state.questionnaire) {
    seed['learningai-diagnostic-prototype'] = JSON.stringify({
      ageRange: '25-34', answers: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1 },
      completedAt: '2026-07-01T00:00:00.000Z'
    });
    seed['learningai-age-range-prototype'] = '25-34';
  }
  if (state.preview) seed['learningai-preview-lessons'] = 'on';
  return seed;
}

// ---------------------------------------------------------------------------
// 2. Routes and where a visitor should land
// ---------------------------------------------------------------------------

/* Access classes:
     open      a page anyone may read, signed in or not
     free      the free first lesson; must open in every state, no exceptions
     course    the paid/earned course; opens only once all three milestones are
               met, or preview is on
     onboard   the starting questionnaire; needs the lesson and an account
               before it can be answered, nothing after
     entry     the site root, whose only job is to route to the resume point
     gateway   the sign-in / create-account page  */
export const ROUTES = [
  { file: 'index.html', access: 'entry' },
  { file: 'about.html', access: 'open' },
  { file: 'access.html', access: 'gateway' },
  { file: 'accounts.html', access: 'open' },
  { file: 'console.html', access: 'open' },
  { file: 'submission-policy.html', access: 'open' },
  { file: 'submit-project.html', access: 'open' },
  { file: 'onboarding.html', access: 'onboard' },

  { file: 'lesson-one.html', access: 'free' },
  { file: 'lesson.html', query: '?id=chapter-1', access: 'free', name: 'lesson.html?id=chapter-1' },

  { file: 'lesson.html', query: '?id=chapter-7', access: 'course', name: 'lesson.html?id=chapter-7' },
  { file: 'lessons.html', access: 'course' },
  { file: 'stage-1-navigation-proof.html', access: 'course' },
  { file: 'progress.html', access: 'course' },
  { file: 'focus.html', access: 'course' },
  { file: 'notes.html', access: 'course' },
  { file: 'projects.html', access: 'course' },
  { file: 'gallery.html', access: 'course' },
  { file: 'adults.html', access: 'course' },
  { file: 'settings.html', access: 'course' }
];

export const routeName = route => route.name || route.file;
export const routePath = route => `${route.file}${route.query || ''}`;

/* Pages that exist but are not visitor routes. Listed so the "every page is
   classified" check stays honest: a real new page must be added to ROUTES. */
export const NON_ROUTE_PAGES = new Set([]);

/* The create-account form. "A signed-in learner is never sent to a sign-up
   form" is checked against this. */
export const SIGNUP = 'access.html?mode=create';

const unlocked = s => s.freeLesson && s.account && s.questionnaire;

/* The gate ladder: the first unmet milestone is where a refused visitor is
   sent. Order matters and is the product's, not an accident of the code. */
const gate = s => !s.freeLesson ? 'lesson-one.html'
  : !s.account ? SIGNUP
    : 'onboarding.html';

/* Where a returning visitor should be resumed to from the site root. */
const resume = s => (!s.freeLesson && !s.account) ? 'index.html'
  : !s.freeLesson ? 'lesson-one.html'
    : !s.account ? SIGNUP
      : !s.questionnaire ? 'onboarding.html'
        : 'stage-1-navigation-proof.html';

/* The truth table, as a function. Returns the file (plus meaningful query) the
   visitor must actually be looking at once every redirect has settled. */
export function expectedLanding(route, state) {
  const self = route.file === 'lesson.html' && route.query === '?id=chapter-1'
    /* lesson.html forwards chapter-1 to the dedicated free-lesson page. The
       invariant is that the free lesson opens, not which file serves it. */
    ? 'lesson-one.html'
    : route.file;

  /* Preview opens the course. It is not a licence to skip the two places
     whose redirect is about having something to work with rather than about
     permission: the site root still resumes you, and the account form still
     sends you to the free lesson when there is nothing yet to save. */
  if (state.preview && (route.access === 'open' || route.access === 'free' || route.access === 'course')) {
    return self;
  }

  switch (route.access) {
    case 'open': return self;
    case 'free': return self;
    case 'entry': return resume(state);
    case 'gateway':
      /* The page normalises its own address to the mode it opened in, so the
         mode is part of the landing. Arriving with an account means signing
         in and must never be bounced — that was half of an earlier lockout.
         Arriving to create an account before finishing the free lesson goes
         back to the lesson, because there is nothing yet to save. */
      if (state.account) return 'access.html?mode=signin';
      return state.freeLesson ? SIGNUP : 'lesson-one.html';
    case 'onboard':
      /* Without preview the milestones before the questionnaire come first;
         with preview they do not. Either way, a questionnaire that has
         already been answered forwards rather than asking again. */
      if (!state.preview) {
        if (!state.freeLesson) return 'lesson-one.html';
        if (!state.account) return SIGNUP;
      }
      return state.questionnaire ? 'stage-1-navigation-proof.html' : self;
    case 'course':
      return unlocked(state) ? self : gate(state);
    default:
      throw new Error(`Route ${routeName(route)} has no access class`);
  }
}

/* Measuring a page means being ON it. Every route has at least one state in
   which it is its own landing, and hygiene uses that state — otherwise the
   dashboard gets measured four times under four other pages' names, which is
   a way of testing nothing while appearing thorough. */
export function stateWherePageIsItself(route) {
  /* Prefer the ordinary learner: preview off, as far through the course as
     the page needs. Preview would also open every course page, but measuring
     the site in a mode almost nobody is in is measuring the wrong site. */
  const ranked = everyState().sort((a, b) =>
    (a.preview ? 1 : 0) - (b.preview ? 1 : 0)
    || (b.account + b.freeLesson + b.questionnaire) - (a.account + a.freeLesson + a.questionnaire));
  for (const state of ranked) {
    if (expectedLanding(route, state).split('?')[0] === route.file) return state;
  }
  return null;
}

/* Quick mode: one route per access class plus the two routes that carry the
   most history. Same 16 states, ~1/3 of the wall clock. */
export const QUICK_ROUTES = new Set([
  'index.html', 'access.html', 'onboarding.html', 'lesson-one.html',
  'lesson.html?id=chapter-1', 'lesson.html?id=chapter-7', 'lessons.html',
  'stage-1-navigation-proof.html', 'about.html', 'settings.html',
  // Carries a second guard of its own, on top of the shared one.
  'adults.html'
]);

// ---------------------------------------------------------------------------
// 3. Storage: exactly what preview blocks, and what it must not
// ---------------------------------------------------------------------------

/* Preview exists so someone can look at any lesson without finishing the ones
   before it. It must leave no trace in the course record — and it must not
   stop you being a signed-in person, which is the fault that made the site a
   sign-in loop.

   Every learningai- key used anywhere in learning-ai-design-assets is listed
   on exactly one side. A key on neither side fails the suite: a new key must
   be given a behaviour on purpose. */

// Written while preview is on: the write must be dropped.
export const BLOCKED_KEYS = [
  ['learningai-lesson-draft:chapter-7', 'lesson draft'],
  ['learningai-lesson-evidence:chapter-7', 'lesson evidence'],
  ['learningai-lesson-one-draft-v2', 'free-lesson draft'],
  ['learningai-progress', 'course progress'],
  ['learningai-progress-sync-queue', 'queued progress for the server'],
  ['learningai-first-lesson-complete', 'free-lesson completion'],
  ['learningai-first-lesson-pending', 'free-lesson completion awaiting an account'],
  ['learningai-diagnostic-prototype', 'questionnaire answers'],
  ['learningai-diagnostic-draft-prototype', 'questionnaire draft'],
  ['learningai-toolkit', 'saved notes'],
  ['learningai-note', 'a saved note'],
  ['learningai-v2-lesson-notes:chapter-7', 'lesson notebook'],
  ['learningai-learning-rhythm', 'focus minutes (older key)'],
  ['learningai-learning-rhythm-v1', 'focus minutes'],
  ['learningai-minute-sync-queue', 'queued focus minutes for the server'],
  ['learningai-earned', 'awards (older key)'],
  ['learningai-achievements', 'awards (older key)'],
  ['learningai-achievements-v2', 'awards'],
  ['learningai-site-unlocked', 'the cached unlock flag'],
  ['learningai-projects', 'project work'],
  ['learningai-project-completions', 'finished projects'],
  ['learningai-completed-projects', 'finished projects (older key)'],
  ['learningai-project-submission-draft', 'a project submission in progress'],
  ['learningai-project-submission-records', 'submitted project work'],
  ['learningai-age-range-prototype', 'the saved age range, which selects the audience']
];

// Written while preview is on: the write must land.
export const WRITABLE_KEYS = [
  ['learningai-prototype-account', 'who is signed in — blocking this was the sign-in loop'],
  ['learningai-browser-accounts', 'the account roster on this device'],
  ['learningai-browser-session-id', 'the active session'],
  ['learningai-preview-lessons', 'the preview switch itself, or it could never be turned off'],
  ['learningai-surface', 'appearance'],
  ['learningai-light', 'appearance'],
  ['learningai-glass', 'appearance'],
  ['learningai-motion', 'appearance'],
  ['learningai-accent', 'appearance'],
  ['learningai-appearance', 'appearance'],
  ['learningai-font-scale', 'text size'],
  ['learningai-glass-nav-position-v1', 'where the nav was dragged'],
  ['learningai-api-origin', 'which backend this device talks to'],
  ['learningai-csrf', 'request credential, not a record']
];

/* Keys that appear in the source only as a prefix or a fragment, and are
   covered by a concrete instance above. */
export const KEY_FRAGMENTS = new Set([
  'learningai-', 'learningai-lesson-', 'learningai-first-lesson-', 'learningai-diagnostic-',
  'learningai-switch-to-email' // sessionStorage, not localStorage; preview does not govern it
]);

// ---------------------------------------------------------------------------
// 4. Cascade and attribute invariants
// ---------------------------------------------------------------------------

/* Attributes the JavaScript toggles at runtime. If a page rule outranks the
   user agent's `[hidden]{display:none}` — which `.field{display:grid}` did on
   the sign-in form — the attribute stops meaning anything and the toggle is a
   no-op that nobody can see in the source. */
export const TOGGLED_ATTRIBUTES = ['hidden'];

/* Elements whose pressed/current state a script also manages. Authoring a
   truthy state into the markup is a claim the page has not checked — the
   dashboard shipped `aria-pressed="true"` on an award nobody had earned. */
export const DATA_DRIVEN_STATE = [
  {
    page: 'stage-1-navigation-proof.html',
    selector: '.learning-badge[data-badge]',
    attribute: 'aria-pressed',
    store: 'learningai-achievements-v2',
    why: 'the dashboard badges must come from the award store, not the markup'
  }
];

/* The single source of truth for preview. Any other derivation is a second
   switch that can disagree with the first — which is exactly how "preview
   every lesson" came to do nothing. */
export const PREVIEW_SOURCE_OF_TRUTH = 'window.LearningAIReviewMode';
export const PREVIEW_DERIVATION = /\.get\(\s*(['"])review\1\s*\)/;
/* theme.js owns the switch and is allowed to read the query string; its link
   rewriter propagates ?review=1 and must keep reading it. */
export const PREVIEW_DERIVATION_ALLOWED = new Set(['theme.js']);

// ---------------------------------------------------------------------------
// 5. Per-page hygiene
// ---------------------------------------------------------------------------

export const VIEWPORTS = [
  { name: '1280', width: 1280, height: 900 },
  { name: '874', width: 874, height: 900 },
  { name: '375', width: 375, height: 812 }
];

/* The text-size setting is the one that broke every page's layout once.
   These are the names theme.js maps to 16px, 20px and 24px. */
export const TEXT_SIZES = ['normal', 'large', 'xl'];
export const QUICK_TEXT_SIZES = ['normal', 'xl'];

export const MIN_TARGET_PX = 44;

/* Text over glass. WCAG AA for body text. */
export const MIN_CONTRAST = 4.5;
export const MIN_CONTRAST_LARGE = 3;

/* Requests to anywhere but this origin. CSP is 'self' only for scripts,
   styles, fonts and connections, so anything else is a resource that will be
   blocked in production and is therefore already broken. */
export const ALLOWED_EXTERNAL = [
  /^https:\/\/www\.googletagmanager\.com\//,
  /^data:/,
  /^blob:/,
  /^about:/
];

/* No backend runs under the harness, so the site's own API calls 404. Those
   are the harness's doing, not the page's. */
export const IGNORED_CONSOLE = [
  /\/api\//,
  /favicon\.ico/,
  /Failed to load resource.*40[34]/
];
