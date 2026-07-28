/* Cascade and attribute invariants.

   Two failures live here, and neither is visible in the source.

   `hidden` is a user-agent rule, `[hidden]{display:none}`, which any page rule
   with a real selector outranks. `.field{display:grid}` did, so every
   `field.hidden = true` on the sign-in form was a no-op and the form demanded
   a username nobody had been asked for. The only way to know is to set the
   attribute in a browser and measure the box.

   The second is state written into markup that a script also manages. The
   dashboard shipped `aria-pressed="true"` on an award nobody had earned. The
   test is not "is it false in the file" — that passes forever after one edit —
   but "does it follow the store, in both directions". */
import { readdirSync, readFileSync } from 'node:fs';
import { ROUTES, QUICK_ROUTES, routePath, routeName, DATA_DRIVEN_STATE, PREVIEW_DERIVATION, PREVIEW_DERIVATION_ALLOWED, STRUCTURAL_EXEMPT } from './spec.mjs';
import { seedState } from './routing.mjs';

const assets = new URL('../../learning-ai-design-assets/', import.meta.url);
const OPEN_STATE = { account: true, freeLesson: true, questionnaire: true, preview: false };

/* Comments describe code that used to be there. This repo's comments are long
   and frequently quote the very bug they fixed, so scanning the raw text finds
   the note about the fault as readily as the fault. Blank the comments and
   keep the line numbering. */
function withoutComments(text) {
  const blank = match => match.replace(/[^\n]/g, ' ');
  return text
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[\s;{}()])\/\/[^\n]*/g, (whole, lead) => lead + blank(whole.slice(lead.length)));
}

export async function runCascade({ page, origin, report, quick }) {
  // -------------------------------------------------------------------------
  // `hidden` must actually hide — wherever the page uses it
  // -------------------------------------------------------------------------
  /* `[hidden]{display:none}` is a user-agent rule with the specificity of a
     single attribute selector, so almost any authored rule outranks it.
     Asserting that over every element on the page would fail everywhere and
     mean nothing. What matters is the elements this page actually hides, and
     the only way to know which those are is to watch it hide them.

     So a recorder is installed ahead of the page's own scripts and every
     element that ever wears the attribute — in the markup, through
     `el.hidden = true`, or through setAttribute — is collected. Each one is
     then held hidden and measured. This is exactly the case that shipped:
     `.field{display:grid}` beat the user agent, `displayNameField.hidden`
     became a no-op, and sign-in asked for a username nobody was offered. */
  const stopRecording = await page.beforeEachLoad(`
    (() => {
      window.__hiddenTouched = new Set();
      const watch = () => new MutationObserver(records => {
        for (const record of records) window.__hiddenTouched.add(record.target);
      }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
      if (document.documentElement) watch();
      else document.addEventListener('readystatechange', watch, { once: true });
    })();
  `);

  const routes = quick ? ROUTES.filter(r => QUICK_ROUTES.has(routeName(r))) : ROUTES;
  for (const route of routes) {
    await seedState(page, origin, OPEN_STATE);
    await page.goto(`${origin}/learning-ai-design-assets/${routePath(route)}`);

    const seen = await page.evaluate(`
      const touched = [...(window.__hiddenTouched || [])].filter(el => el.isConnected);
      const marked = [...document.querySelectorAll('[hidden]')];
      const all = [...new Set([...touched, ...marked])];
      const beaten = [];
      for (const el of all) {
        const had = el.hasAttribute('hidden');
        if (!had) el.setAttribute('hidden', '');
        const display = getComputedStyle(el).display;
        if (display !== 'none') {
          const id = el.id ? '#' + el.id : '';
          const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).join('.') : '';
          beaten.push(el.tagName.toLowerCase() + id + cls + ' -> display:' + display);
        }
        if (!had) el.removeAttribute('hidden');
      }
      return { count: all.length, beaten: [...new Set(beaten)].slice(0, 12) };
    `);
    report.check(
      `cascade/hidden-hides  ${routeName(route)}`,
      seen.beaten.length === 0,
      `a page rule outranks [hidden]{display:none} on: ${seen.beaten.join(' | ')}`
    );
    report.note(`cascade/hidden-hides  ${routeName(route)}: ${seen.count} elements wear or receive [hidden]`);
  }
  await stopRecording();

  // -------------------------------------------------------------------------
  // A rule about position must match something
  // -------------------------------------------------------------------------
  /* `.about-sections>*:nth-last-child(2):nth-child(odd)` was written to pull a
     trailing card across both columns. The element it names is always even, so
     the rule never matched once, and an empty cell survived two rounds of
     "fixed". Nothing about the source says so — the selector is well formed and
     reads exactly like the intention.

     Only structural selectors are checked. `:hover`, `.is-open` and the rest
     describe a state the page may not be in; `:nth-child` describes a shape it
     either has or does not, so a structural selector matching nothing anywhere
     is a rule that has never once applied. */
  const STATE_PSEUDO = /::?(?:hover|focus|focus-visible|focus-within|active|visited|target|checked|disabled|enabled|indeterminate|placeholder-shown|user-invalid|invalid|valid|autofill|before|after|marker|placeholder|backdrop|selection|file-selector-button|-webkit-[a-z-]+|-moz-[a-z-]+)\b/g;
  for (const route of routes) {
    await seedState(page, origin, OPEN_STATE);
    await page.goto(`${origin}/learning-ai-design-assets/${routePath(route)}`);
    const dead = await page.evaluate(`
      const STRUCTURAL = /:(nth-child|nth-last-child|nth-of-type|nth-last-of-type|first-child|last-child|only-child|first-of-type|last-of-type|only-of-type|empty)\\b/;
      const STATE = ${STATE_PSEUDO.toString()};
      /* A CSSStyleRule carries its own (usually empty) cssRules list now that
         nesting has shipped, so "has cssRules" no longer means "is a group".
         Take the selector wherever there is one, and descend regardless. */
      const walk = (rules, out) => {
        for (const rule of rules) {
          if (rule.selectorText) out.push(rule.selectorText);
          if (rule.cssRules && rule.cssRules.length) walk(rule.cssRules, out);
        }
        return out;
      };
      const selectors = [];
      for (const sheet of document.styleSheets) {
        // The page's own <style>. A shared stylesheet carries rules for pages
        // this one is not, and a miss there means nothing.
        if (!sheet.ownerNode || sheet.ownerNode.tagName !== 'STYLE') continue;
        try { walk(sheet.cssRules, selectors); } catch {}
      }
      /* Strip the position test and you have the family the rule is about.
         If the family is not on the page at all, the rule is for a list this
         page fills in later and its missing today means nothing. If the
         family IS here and not one member is in the named position, the rule
         has never once applied — which is the whole of failure six. */
      const POSITION = /:(?:nth-child|nth-last-child|nth-of-type|nth-last-of-type)\\([^)]*\\)|:(?:first-child|last-child|only-child|first-of-type|last-of-type|only-of-type|empty)\\b/g;
      const dead = [];
      for (const selectorText of selectors) {
        for (const part of selectorText.split(',')) {
          const selector = part.trim();
          if (!STRUCTURAL.test(selector)) continue;
          // Functional pseudo-classes nest selectors; stripping inside them
          // produces something that no longer parses.
          if (/:(?:not|has|is|where)\\(/.test(selector)) continue;
          const probe = selector.replace(STATE, '').trim();
          if (!probe || !STRUCTURAL.test(probe)) continue;
          let family = probe.replace(POSITION, '').trim();
          if (!family || /[>+~]$/.test(family)) family += ' *';
          try {
            if (document.querySelectorAll(family).length === 0) continue;
            if (document.querySelectorAll(probe).length === 0) dead.push(selector);
          } catch {}
        }
      }
      return [...new Set(dead)];
    `);
    /* A rule can be unmatched here and still be right — one the page builds at
       runtime, or one guarding a shape the page does not have yet. Those are
       listed in the spec with a stated reason. Anything else is a failure. */
    const exempt = STRUCTURAL_EXEMPT[route.file] || {};
    const real = dead.filter(selector => !(selector in exempt));
    const stale = Object.keys(exempt).filter(selector => !dead.includes(selector));
    report.check(
      `cascade/structural-rules-match  ${routeName(route)}`,
      real.length === 0,
      `written to place an element, matches nothing on this page: ${real.join(' | ')}`
    );
    /* An exemption that no longer describes anything has outlived its rule, and
       left in place it would silently cover whatever takes that selector next. */
    report.check(
      `cascade/exemptions-still-apply  ${routeName(route)}`,
      stale.length === 0,
      `exempted in spec.mjs but no longer unmatched — delete the exemption: ${stale.join(' | ')}`
    );
  }

  // -------------------------------------------------------------------------
  // State a script manages must follow the store, in both directions
  // -------------------------------------------------------------------------
  for (const rule of DATA_DRIVEN_STATE) {
    const url = `${origin}/learning-ai-design-assets/${rule.page}`;

    await seedState(page, origin, OPEN_STATE);
    await page.goto(url);
    const empty = await page.evaluate(`
      return [...document.querySelectorAll(${JSON.stringify(rule.selector)})]
        .map(el => [el.dataset.badge || el.id || el.textContent.trim().slice(0, 24), el.getAttribute(${JSON.stringify(rule.attribute)})]);
    `);
    report.check(
      `cascade/state-from-data  ${rule.page} ${rule.attribute} with an empty store`,
      empty.length > 0 && empty.every(([, value]) => value === 'false'),
      `${rule.why}; with nothing earned these still read true: ${empty.filter(([, v]) => v !== 'false').map(([n]) => n).join(', ')}`
    );

    const first = empty[0]?.[0];
    if (first) {
      await seedState(page, origin, OPEN_STATE);
      await page.evaluate(`localStorage.setItem(${JSON.stringify(rule.store)}, JSON.stringify({ ${JSON.stringify(first)}: { earnedAt: '2026-07-01T00:00:00.000Z' } })); return true;`);
      await page.goto(url);
      const seeded = await page.evaluate(`
        const el = document.querySelector(${JSON.stringify(rule.selector)});
        return el && el.getAttribute(${JSON.stringify(rule.attribute)});
      `);
      report.check(
        `cascade/state-from-data  ${rule.page} ${rule.attribute} with a real award`,
        seeded === 'true',
        `${rule.why}; the store said earned and the page said ${seeded}`
      );
    }
  }

  // -------------------------------------------------------------------------
  // One switch, one source of truth
  // -------------------------------------------------------------------------
  /* Preview is a stored switch. Any page that re-derives it from ?review=1 is
     a second switch that disagrees with the first whenever the visitor did not
     arrive through an in-site link — which is precisely how "preview every
     lesson" came to do nothing on the live site. */
  const strays = [];
  for (const file of readdirSync(assets).filter(name => /\.(html|js)$/.test(name))) {
    if (PREVIEW_DERIVATION_ALLOWED.has(file)) continue;
    const text = withoutComments(readFileSync(new URL(file, assets), 'utf8'));
    text.split('\n').forEach((line, index) => {
      if (PREVIEW_DERIVATION.test(line)) strays.push(`${file}:${index + 1}`);
    });
  }
  report.check(
    'cascade/one-preview-switch',
    strays.length === 0,
    `preview re-derived from the query string, so the stored switch is ignored here: ${strays.join(', ')}`
  );
}
