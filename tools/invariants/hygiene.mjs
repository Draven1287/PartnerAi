/* Per-page hygiene, in one command with everything else.

   None of this duplicates the seven existing gates: those assert strings in
   v2/, v3/ and the lesson data. Nothing in tools/ had ever loaded a page in
   learning-ai-design-assets/, which is where all six failures lived. */
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import {
  ROUTES, QUICK_ROUTES, routePath, routeName, VIEWPORTS, TEXT_SIZES, QUICK_TEXT_SIZES,
  MIN_TARGET_PX, MIN_CONTRAST, MIN_CONTRAST_LARGE, ALLOWED_EXTERNAL, IGNORED_CONSOLE,
  stateWherePageIsItself
} from './spec.mjs';
import { seedState } from './routing.mjs';

const assets = new URL('../../learning-ai-design-assets/', import.meta.url);

// --- inline scripts parse (static; no browser needed) ------------------------
export function runParse({ report }) {
  for (const route of ROUTES) {
    const text = readFileSync(new URL(route.file, assets), 'utf8');
    const blocks = [...text.matchAll(/<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/gi)];
    const broken = [];
    blocks.forEach((block, index) => {
      const attributes = block[1] || '';
      if (/type\s*=\s*["'](?!text\/javascript|application\/javascript)/i.test(attributes)) return;
      try { new vm.Script(block[2], { filename: `${route.file}#${index}` }); }
      catch (error) { broken.push(`block ${index + 1}: ${error.message}`); }
    });
    report.check(
      `hygiene/inline-scripts-parse  ${route.file}`,
      broken.length === 0,
      broken.join(' | ')
    );
  }
}

/* Measured in the page, in one pass, rather than through the DevTools
   background-colour API — that API reports the ancestor's colour for an
   element with its own opaque background, which turned every white-on-dark
   button into a 1:1 failure. Compositing the layers here is both correct and
   an order of magnitude fewer round trips.

   Where the stack cannot be resolved to a colour — a backdrop-filter, a
   gradient, the paper photograph behind every page — the run is counted as
   unmeasured and reported. It is never quietly passed. */
const CONTRAST_PROBE = `
  const parse = value => {
    const match = String(value).match(/rgba?\\(([^)]+)\\)/);
    if (!match) return null;
    const parts = match[1].split(/[,\\s\\/]+/).filter(Boolean).map(Number);
    if (parts.length < 3 || parts.some(Number.isNaN)) return null;
    return { rgb: parts.slice(0, 3), a: parts.length > 3 ? parts[3] : 1 };
  };
  const over = (top, bottom) => top.rgb.map((c, i) => c * top.a + bottom.rgb[i] * (1 - top.a));
  const lum = rgb => {
    const f = v => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
  };
  const backdropOf = start => {
    const layers = [];
    for (let node = start; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.backdropFilter && style.backdropFilter !== 'none') return null;
      if (style.backgroundImage && style.backgroundImage !== 'none') return null;
      const colour = parse(style.backgroundColor);
      if (!colour || colour.a === 0) continue;
      layers.push(colour);
      if (colour.a === 1) {
        let base = layers.pop().rgb;
        while (layers.length) base = over(layers.pop(), { rgb: base, a: 1 });
        return base;
      }
    }
    return null;
  };
  const failures = [];
  let total = 0, unmeasured = 0;
  for (const el of document.querySelectorAll('body *')) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
    const hasOwnText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!hasOwnText) continue;
    const colour = parse(style.color);
    if (!colour || colour.a === 0) continue;
    total += 1;
    const backdrop = backdropOf(el);
    if (!backdrop) { unmeasured += 1; continue; }
    const text = colour.a === 1 ? colour.rgb : over(colour, { rgb: backdrop, a: 1 });
    const [hi, lo] = [lum(text), lum(backdrop)].sort((a, b) => b - a);
    const value = (hi + 0.05) / (lo + 0.05);
    const px = parseFloat(style.fontSize) || 16;
    const bold = parseInt(style.fontWeight, 10) >= 700;
    const floor = (px >= 24 || (px >= 18.66 && bold)) ? ${MIN_CONTRAST_LARGE} : ${MIN_CONTRAST};
    if (value + 0.005 < floor) {
      const id = el.id ? '#' + el.id : (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\\s+/)[0] : '');
      failures.push(el.tagName.toLowerCase() + id + ' ' + value.toFixed(2) + ':1 (' + style.color + ' on rgb(' + backdrop.map(Math.round).join(', ') + '), ' + Math.round(px) + 'px, needs ' + floor + ')');
    }
  }
  return { failures: [...new Set(failures)], total, unmeasured };
`;

export async function runHygiene({ page, origin, report, quick }) {
  const routes = (quick ? ROUTES.filter(r => QUICK_ROUTES.has(routeName(r))) : ROUTES)
    .map(route => ({ route, state: stateWherePageIsItself(route) }))
    // A route with no state of its own is an alias for another route and is
    // measured there; lesson.html?id=chapter-1 is the free lesson.
    .filter(entry => entry.state);
  const sizes = quick ? QUICK_TEXT_SIZES : TEXT_SIZES;

  for (const { route, state } of routes) {
    const name = routeName(route);
    const url = `${origin}/learning-ai-design-assets/${routePath(route)}`;

    await seedState(page, origin, state);
    await page.viewport(1280, 900);
    const landing = await page.goto(url);

    /* Measure the page that was asked for. Without this the dashboard is
       measured four times over, under four other pages' names. */
    const arrived = new URL(landing.url).pathname.split('/').pop();
    if (!report.check(
      `hygiene/measures-the-right-page  ${name}`,
      arrived === route.file,
      `asked for ${route.file} and landed on ${arrived}; every measurement below would be of the wrong page`
    )) continue;

    const noise = [...page.state.consoleErrors, ...page.state.pageErrors]
      .filter(line => !IGNORED_CONSOLE.some(pattern => pattern.test(line)));
    report.check(
      `hygiene/no-console-errors  ${name}`,
      noise.length === 0,
      noise.slice(0, 4).join(' | ')
    );

    const external = page.state.requests
      .map(request => request.url)
      .filter(href => !href.startsWith(origin))
      .filter(href => !ALLOWED_EXTERNAL.some(pattern => pattern.test(href)));
    report.check(
      `hygiene/no-external-resources  ${name}`,
      external.length === 0,
      `CSP is 'self'; these will be blocked in production: ${[...new Set(external)].slice(0, 4).join(', ')}`
    );

    // --- every interactive target is reachable by a finger -----------------
    for (const viewport of [VIEWPORTS[0], VIEWPORTS[2]]) {
      await page.viewport(viewport.width, viewport.height);
      const small = await page.evaluate(`
        const selector = 'a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=menuitem], [role=switch], [tabindex]:not([tabindex="-1"])';
        const bad = [];
        for (const el of document.querySelectorAll(selector)) {
          const style = getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
          /* A link inside a sentence is part of the sentence; it is not a
             target with a size of its own. Everything laid out as a block is. */
          if (el.tagName === 'A' && style.display.startsWith('inline') && el.closest('p,li,small,figcaption')) continue;
          const rect = el.getBoundingClientRect();
          if (!rect.width && !rect.height) continue;
          if (rect.width >= ${MIN_TARGET_PX} - 0.5 && rect.height >= ${MIN_TARGET_PX} - 0.5) continue;
          const id = el.id ? '#' + el.id : (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\\s+/)[0] : '');
          bad.push(el.tagName.toLowerCase() + id + ' ' + Math.round(rect.width) + 'x' + Math.round(rect.height));
        }
        return [...new Set(bad)].slice(0, 8);
      `);
      report.check(
        `hygiene/targets-44px  ${name} @${viewport.name}`,
        small.length === 0,
        small.join(', ')
      );
    }

    // --- contrast of text over glass ---------------------------------------
    await page.viewport(1280, 900);
    const contrast = await page.evaluate(CONTRAST_PROBE);
    report.check(
      `hygiene/contrast  ${name}`,
      contrast.failures.length === 0,
      contrast.failures.slice(0, 6).join(' | ')
    );
    if (contrast.unmeasured > 0) {
      report.note(`hygiene/contrast  ${name}: ${contrast.unmeasured} of ${contrast.total} text runs sit on glass or the paper photograph, where no single backdrop colour exists; not measured`);
    }

    // --- no horizontal overflow, at every width and text size --------------
    for (const size of sizes) {
      for (const viewport of VIEWPORTS) {
        await seedState(page, origin, state);
        await page.evaluate(`localStorage.setItem('learningai-font-scale', ${JSON.stringify(size)}); return true;`);
        await page.viewport(viewport.width, viewport.height);
        await page.goto(url);
        const overflow = await page.evaluate(`
          const scroller = document.scrollingElement || document.documentElement;
          const over = scroller.scrollWidth - scroller.clientWidth;
          if (over <= 1) return { over: 0, culprits: [] };
          const limit = scroller.clientWidth + 1;
          const culprits = [];
          for (const el of document.querySelectorAll('body *')) {
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.right <= limit) continue;
            if (getComputedStyle(el).position === 'fixed') continue;
            const id = el.id ? '#' + el.id : (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\\s+/)[0] : '');
            culprits.push(el.tagName.toLowerCase() + id + ' right:' + Math.round(rect.right));
          }
          return { over: Math.round(over), culprits: [...new Set(culprits)].slice(0, 5) };
        `);
        report.check(
          `hygiene/no-horizontal-overflow  ${name} @${viewport.name} text:${size}`,
          overflow.over === 0,
          `${overflow.over}px past the right edge — ${overflow.culprits.join(', ')}`
        );
      }
    }
  }
}
