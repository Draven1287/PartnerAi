/* Storage invariants.

   Preview must record nothing, and must not stop you being a signed-in
   person. Those two sentences are the whole of it, and getting the boundary
   between them wrong turned the site into a sign-in loop.

   So both halves are asserted key by key, and the classification is checked
   for completeness against the source: a learningai- key that appears in the
   pages but on neither list fails, rather than silently inheriting whichever
   behaviour its prefix happens to give it. */
import { readdirSync, readFileSync } from 'node:fs';
import { BLOCKED_KEYS, WRITABLE_KEYS, KEY_FRAGMENTS } from './spec.mjs';

const assets = new URL('../../learning-ai-design-assets/', import.meta.url);

const PREVIEW_PAGE = 'about.html'; // loads theme.js, opens in every state

async function openWithPreview(page, origin, on) {
  await page.goto(`${origin}/robots.txt`);
  await page.evaluate(`
    localStorage.clear(); sessionStorage.clear();
    ${on ? "localStorage.setItem('learningai-preview-lessons','on');" : ''}
    return true;
  `);
  await page.goto(`${origin}/learning-ai-design-assets/${PREVIEW_PAGE}`);
  return page.evaluate('return window.LearningAIReviewMode === true');
}

export async function runStorage({ page, origin, report }) {
  // ---- preview ON --------------------------------------------------------
  const previewOn = await openWithPreview(page, origin, true);
  report.check(
    'storage/preview-engages',
    previewOn,
    'the stored preview switch did not turn preview on — nothing below is meaningful'
  );

  for (const [key, why] of BLOCKED_KEYS) {
    const landed = await page.evaluate(`
      localStorage.setItem(${JSON.stringify(key)}, 'harness');
      return localStorage.getItem(${JSON.stringify(key)});
    `);
    report.check(
      `storage/preview-blocks  ${key}`,
      landed === null,
      `preview recorded ${why}`
    );
  }

  for (const [key, why] of WRITABLE_KEYS) {
    const landed = await page.evaluate(`
      localStorage.setItem(${JSON.stringify(key)}, 'harness');
      return localStorage.getItem(${JSON.stringify(key)});
    `);
    report.check(
      `storage/preview-allows  ${key}`,
      landed === 'harness',
      `preview refused to store ${why}`
    );
  }

  /* Preview must not erase the record either. Seed before the guard installs,
     then try to delete from inside preview. */
  await page.goto(`${origin}/robots.txt`);
  await page.evaluate(`
    localStorage.clear();
    localStorage.setItem('learningai-preview-lessons','on');
    const keys = ${JSON.stringify(BLOCKED_KEYS.map(([k]) => k))};
    for (const key of keys) localStorage.setItem(key, 'existing');
    return true;
  `);
  await page.goto(`${origin}/learning-ai-design-assets/${PREVIEW_PAGE}`);
  const survivors = await page.evaluate(`
    const keys = ${JSON.stringify(BLOCKED_KEYS.map(([k]) => k))};
    const lost = [];
    for (const key of keys) { localStorage.removeItem(key); if (localStorage.getItem(key) !== 'existing') lost.push(key); }
    return lost;
  `);
  report.check(
    'storage/preview-cannot-delete-the-record',
    survivors.length === 0,
    `preview deleted ${survivors.join(', ')}`
  );

  const clearedAway = await page.evaluate(`
    localStorage.clear();
    return localStorage.getItem('learningai-preview-lessons');
  `);
  report.check(
    'storage/preview-cannot-clear',
    clearedAway === 'on',
    'localStorage.clear() went through while preview was on'
  );

  /* The switch must stay removable from inside preview, or preview could be
     turned on and never off again. */
  const switchedOff = await page.evaluate(`
    window.LearningAIPreview.set(false);
    return localStorage.getItem('learningai-preview-lessons');
  `);
  report.check(
    'storage/preview-can-be-turned-off',
    switchedOff === null,
    'the preview switch could not be removed from inside preview'
  );

  // ---- preview OFF: everything writes ------------------------------------
  await openWithPreview(page, origin, false);
  const refused = await page.evaluate(`
    const keys = ${JSON.stringify([...BLOCKED_KEYS, ...WRITABLE_KEYS].map(([k]) => k))};
    const bad = [];
    for (const key of keys) { localStorage.setItem(key, 'harness'); if (localStorage.getItem(key) !== 'harness') bad.push(key); }
    return bad;
  `);
  report.check(
    'storage/without-preview-nothing-is-blocked',
    refused.length === 0,
    `refused outside preview: ${refused.join(', ')}`
  );

  // ---- completeness: every key in the source is classified ---------------
  const classified = new Set([...BLOCKED_KEYS, ...WRITABLE_KEYS].map(([k]) => k));
  const found = new Map();
  for (const file of readdirSync(assets).filter(name => /\.(html|js)$/.test(name))) {
    const text = readFileSync(new URL(file, assets), 'utf8');
    for (const match of text.matchAll(/learningai-[A-Za-z0-9_-]*/g)) {
      if (!found.has(match[0])) found.set(match[0], file);
    }
  }
  const unclassified = [...found]
    .filter(([key]) => !classified.has(key) && !KEY_FRAGMENTS.has(key))
    // a key used with a suffix, e.g. learningai-lesson-draft:chapter-7
    .filter(([key]) => ![...classified].some(known => known.startsWith(`${key}:`) || known.startsWith(`${key}-`)));
  report.check(
    'storage/every-key-is-classified',
    unclassified.length === 0,
    `not on either preview list: ${unclassified.map(([k, f]) => `${k} (${f})`).join(', ')}`
  );
}
