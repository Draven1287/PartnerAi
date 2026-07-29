#!/usr/bin/env node
/* ===========================================================================
   LearningAI invariant harness — the state machine and the cascade.

   HOW TO RUN
     node tools/check-invariants.mjs                # 1,800 cases, ~7 min
     node tools/check-invariants.mjs --quick        # ~950 cases, ~3.5 min
     node tools/check-invariants.mjs --only=routing,storage
     node tools/check-invariants.mjs --only=fresh-device   (starts a real backend)
     node tools/check-invariants.mjs --verbose      # print every passing case too
     CHROME_PATH=/path/to/chrome node tools/check-invariants.mjs

   Exit code 0 if every invariant holds, 1 otherwise. Each failure prints the
   case that failed and what it did instead.

   Suites: routing, storage, flows, cascade, hygiene, parse.

   WHY THIS EXISTS

   Seven gates already run on this repo — build-lessons --check,
   check-v2-launch-ready, audit-teen-course, audit-curriculum-principles,
   check-v3-preview, check-railway-package, check-frontend-public-surface —
   and every one of them passed while the site was unusable. They assert
   strings in v2/, v3/ and the lesson data. Not one of them had ever loaded a
   page from learning-ai-design-assets/, which is where all six of the last
   week's failures lived. This harness complements them; it duplicates none of
   them, and check-frontend-public-surface is the only overlap in spirit (it
   asserts the public surface answers 200; this asserts what happens after it
   loads).

   The six failures, and what catches each one:

     1  Preview blocked every learningai- write, including the account, so
        signing in persisted nothing and every page bounced to the sign-in
        form.                       -> storage/preview-allows, flow/sign-in-under-preview
     2  The route guard never checked preview, so "open any lesson" did
        nothing.                    -> routing/preview-unlocks-course
     3  Finishing the free lesson always went to the create-account form,
        even for someone who already had an account. Three fixes missed it
        because they all checked whether the lesson would OPEN.
                                    -> flow/free-lesson-end
     4  Dashboard badges were aria-pressed="true" in the markup; the page
        never read the award store.  -> cascade/state-from-data
     5  `.field{display:grid}` outranked `[hidden]{display:none}`, so every
        hidden form field stayed visible.  -> cascade/hidden-hides
     6  A grid rule keyed on :nth-child(odd) for an element that is always
        even never matched once.     -> cascade/structural-rules-match

   The shape of all six is the same: a statement about what the browser does,
   which no amount of reading the source will settle. So the harness reads
   nothing and measures everything, in headless Chrome, against a declared
   truth table in tools/invariants/spec.mjs.

   THE SPEC IS DATA. tools/invariants/spec.mjs holds the routes, the four
   state dimensions, the storage classification and the layout budgets.
   Adding a page or a storage key without classifying it there FAILS, so a new
   thing cannot quietly inherit a behaviour.

   PROVEN, NOT ASSERTED. Every one of the six was reproduced by running this
   harness against the commit immediately before its fix, in a throwaway git
   worktree, and watching it fail:

     1  a85ade9  flow/sign-in-under-preview persists the account
                 storage/preview-allows learningai-prototype-account
     2  946332e  routing/preview-unlocks-course (90 routing cases)
     3  a85ade9  flow/free-lesson-end ... never a sign-up form
     4  f450f64  cascade/state-from-data ... with an empty store
     5  dc49eb3  cascade/hidden-hides access.html
                 -> label#displayNameField.field -> display:grid
     6  27c05d5  cascade/structural-rules-match about.html
                 -> .about-sections > :nth-last-child(2):nth-child(2n+1)

   WHAT IT CANNOT SEE
     - Anything requiring the backend. Sign-in and sign-up post to the API;
       the harness asserts the storage write and the guard's reading of it,
       which is where both faults were, but it does not drive a real login.
     - Contrast where Chrome cannot resolve the backdrop to a single colour
       (backdrop-filter, the paper background image). Those runs are counted
       and reported as unmeasured, never passed silently.
     - A dead rule that is not structural. `.thing.is-open` matching nothing
       today is normal; only position rules are judged, because only those
       describe a shape the page either has or has not.
     - Whether a layout LOOKS right. Overflow, target size and contrast are
       measured; "the cards are ugly" is not a thing a harness can hold.
   =========================================================================== */
import { launchBrowser } from './invariants/cdp.mjs';
import { startSite } from './invariants/server.mjs';
import { runRouting } from './invariants/routing.mjs';
import { runStorage } from './invariants/storage.mjs';
import { runFlows } from './invariants/flows.mjs';
import { runCascade } from './invariants/cascade.mjs';
import { runHygiene, runParse } from './invariants/hygiene.mjs';
import { runFreshDevice } from './invariants/fresh-device.mjs';

const argv = process.argv.slice(2);
const quick = argv.includes('--quick');
const verbose = argv.includes('--verbose');
const onlyArg = argv.find(a => a.startsWith('--only='));
const only = onlyArg ? new Set(onlyArg.slice(7).split(',').map(s => s.trim())) : null;
const wants = suite => !only || only.has(suite);

const GREEN = '[32m';
const RED = '[31m';
const DIM = '[2m';
const BOLD = '[1m';
const OFF = '[0m';

const report = {
  passed: 0,
  failures: [],
  notes: [],
  check(name, ok, detail = '') {
    if (ok) {
      report.passed += 1;
      if (verbose) console.log(`${GREEN}pass${OFF} ${DIM}${name}${OFF}`);
      return true;
    }
    report.failures.push({ name, detail });
    console.log(`${RED}FAIL${OFF} ${name}\n       ${detail}`);
    return false;
  },
  note(text) {
    report.notes.push(text);
    if (verbose) console.log(`${DIM}note ${text}${OFF}`);
  }
};

const started = Date.now();
let site;
let browser;
let page;

try {
  if (wants('parse')) {
    console.log(`${BOLD}parse${OFF}   inline scripts`);
    runParse({ report });
  }

  const needsBrowser = ['routing', 'storage', 'flows', 'cascade', 'hygiene', 'fresh-device'].some(wants);
  /* Only fresh-device needs a backend, and standing one up costs a couple of
     seconds, so the other suites do not pay for it. */
  const needsBackend = wants('fresh-device');
  if (needsBrowser) {
    site = await startSite({ withBackend: needsBackend });
    browser = await launchBrowser();
    page = await browser.newPage();
    await page.viewport(1280, 900);
    const context = { page, origin: site.origin, report, quick, site };

    if (wants('routing')) {
      console.log(`${BOLD}routing${OFF} truth table over account x free-lesson x questionnaire x preview`);
      await runRouting(context);
    }
    if (wants('storage')) {
      console.log(`${BOLD}storage${OFF} what preview blocks, and what it must not`);
      await runStorage(context);
    }
    if (wants('flows')) {
      console.log(`${BOLD}flows${OFF}   where a journey ends`);
      await runFlows(context);
    }
    if (wants('cascade')) {
      console.log(`${BOLD}cascade${OFF} hidden, data-driven state, one preview switch`);
      await runCascade(context);
    }
    if (wants('hygiene')) {
      console.log(`${BOLD}hygiene${OFF} console, resources, targets, contrast, overflow`);
      await runHygiene(context);
    }
    if (wants('fresh-device')) {
      console.log(`${BOLD}fresh${OFF}   signed in on the server, unknown to this browser`);
      await runFreshDevice(context);
    }
  }
} catch (error) {
  report.failures.push({ name: 'harness', detail: error.stack || String(error) });
  console.log(`${RED}FAIL${OFF} harness\n       ${error.stack || error}`);
} finally {
  if (page) await page.close().catch(() => {});
  if (browser) await browser.close().catch(() => {});
  if (site) site.stop();
}

const seconds = ((Date.now() - started) / 1000).toFixed(1);
const total = report.passed + report.failures.length;
console.log('');
if (report.notes.length && !verbose) {
  for (const note of report.notes) console.log(`${DIM}note ${note}${OFF}`);
  console.log('');
}
if (report.failures.length === 0) {
  console.log(`${GREEN}${BOLD}PASS${OFF} ${report.passed}/${total} invariants held${quick ? ' (quick mode)' : ''} in ${seconds}s`);
  process.exit(0);
}
console.log(`${RED}${BOLD}FAIL${OFF} ${report.failures.length} of ${total} invariants broke${quick ? ' (quick mode)' : ''} in ${seconds}s`);
const grouped = new Map();
for (const failure of report.failures) {
  const suite = failure.name.split('/')[0];
  grouped.set(suite, (grouped.get(suite) || 0) + 1);
}
for (const [suite, count] of [...grouped].sort((a, b) => b[1] - a[1])) {
  console.log(`     ${String(count).padStart(4)}  ${suite}`);
}
console.log('');
for (const failure of report.failures.slice(0, 25)) {
  console.log(`  ${RED}x${OFF} ${failure.name}\n      ${failure.detail}`);
}
if (report.failures.length > 25) console.log(`  ... and ${report.failures.length - 25} more`);
process.exit(1);
