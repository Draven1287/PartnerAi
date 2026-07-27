/* Preview mode: opening any lesson without finishing the ones before it.

   It used to be `?review=1` and nothing else, restricted to localhost. The
   restriction is right — a query string travels in a shared link, so anyone
   handed one could skip the whole course — but it meant the "Open lesson
   preview" button in Settings did nothing at all on the live site: it linked
   to lessons.html?review=1, review never switched on, and the route guard
   bounced the visitor exactly as if they had never asked. A control that
   silently does nothing in production is worse than no control.

   So preview is now a switch stored on this device, set from Settings, and it
   works wherever the site runs. It cannot be handed to someone else in a URL,
   which was the thing worth preventing. The query string still works on a
   local preview host, for development.

   Preview still records nothing: the storage guard below drops every
   learningai- write for as long as it is on. */
(() => {
  const PREVIEW_KEY = 'learningai-preview-lessons';
  const previewHost = ['127.0.0.1', 'localhost', '::1', '[::1]'].includes(location.hostname.toLowerCase());
  const fromQuery = new URLSearchParams(location.search).get('review') === '1';
  let stored = false;
  try { stored = localStorage.getItem(PREVIEW_KEY) === 'on'; } catch {}
  const review = stored || (previewHost && fromQuery);

  window.LearningAIReviewMode = review;
  window.LearningAIPreview = {
    key: PREVIEW_KEY,
    isOn: () => review,
    /* Written before the guard installs, so turning preview ON is recorded and
       turning it OFF can still reach storage while the guard is active. */
    set(on) {
      try {
        if (on) localStorage.setItem(PREVIEW_KEY, 'on');
        else {
          const remove = Storage.prototype.removeItem;
          remove.call(localStorage, PREVIEW_KEY);
        }
      } catch {}
      return Boolean(on);
    }
  };
  if (!review || window.__learningAIReviewStorageGuard) return;
  window.__learningAIReviewStorageGuard = true;

  /* Preview must stop the COURSE RECORD being written — progress, notes,
     answers, minutes. It must not stop you being a signed-in person.

     Blocking every learningai- key did exactly that: signing in could not
     store the account, so the route guard saw no account and sent every page
     back to the sign-in form. Preview turned the site into a loop.

     So the block is a list of what preview is actually protecting, and
     everything else — identity, the account roster, the preview switch
     itself, and the appearance settings — stays writable. */
  const RECORD_PREFIXES = [
    'learningai-lesson-',        // progress, drafts, evidence
    'learningai-diagnostic-',    // questionnaire answers
    'learningai-toolkit',        // saved notes
    'learningai-note',
    'learningai-learning-rhythm',// focus minutes
    'learningai-earned',         // awards (older key)
    'learningai-achievements',   // awards (current key, -v2)
    'learningai-first-lesson-',
    'learningai-site-unlocked',
    'learningai-progress'
  ];
  const isCourseRecord = key => {
    const name = String(key);
    return name !== PREVIEW_KEY && RECORD_PREFIXES.some(prefix => name.startsWith(prefix));
  };

  const setItem = Storage.prototype.setItem;
  const removeItem = Storage.prototype.removeItem;
  const clear = Storage.prototype.clear;
  Storage.prototype.setItem = function (key, value) {
    if (this === window.localStorage && isCourseRecord(key)) return;
    return setItem.call(this, key, value);
  };
  Storage.prototype.removeItem = function (key) {
    if (this === window.localStorage && isCourseRecord(key)) return;
    return removeItem.call(this, key);
  };
  Storage.prototype.clear = function () {
    if (this === window.localStorage) return;
    return clear.call(this);
  };
})();
/* Layout zoom and viewport units disagree, and that disagreement broke every
   page at Large and Extra large.

   The text-size setting scales the interface with `body{zoom:var(--ui-zoom)}`
   (see theme.css), which puts the whole document into a coordinate space
   var(--ui-zoom) times smaller than the screen. `vw` and `vh` do not follow: they
   keep resolving against the unzoomed viewport. So a container written the way
   nearly every page here writes it —

       width: min(1120px, calc(100vw - 36px))

   — asked for the full 1280px viewport, then got painted 1.5x larger still, and
   the page ran ~500px off the right edge. Measured before this fix: every page
   overflowed at "xl" and all but two at "large", at 1280, 874 and 375.

   The rule is simple: a length that sizes or positions a box lives in the zoomed
   coordinate space and has to be divided by the zoom factor. A length that sets
   type does not — growing with the setting is the whole point of the setting.

   The same formula is inlined in more than a dozen page stylesheets, several of
   which this change is not allowed to edit, so it is corrected here, once, for
   whatever stylesheets the page actually loaded. Rewriting to a `var(--ui-zoom)`
   expression rather than a fixed number means the correction keeps tracking the
   setting when it changes on the Settings page — no re-sweep needed.

   This lives beside the zoom it corrects on purpose: the zoom is applied by this
   script, so a page without this script has no zoom and needs no correction.
   The two can never get out of step. */
(() => {
  const SCALED_BY_ZOOM = new Set([
    'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
    'inline-size', 'min-inline-size', 'max-inline-size',
    'block-size', 'min-block-size', 'max-block-size',
    'top', 'right', 'bottom', 'left',
    'inset', 'inset-block-start', 'inset-block-end', 'inset-inline-start', 'inset-inline-end',
    'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'margin-block-start', 'margin-block-end', 'margin-inline-start', 'margin-inline-end',
    'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'padding-block-start', 'padding-block-end', 'padding-inline-start', 'padding-inline-end',
    'row-gap', 'column-gap', 'flex-basis'
  ]);
  /* Every viewport-percentage unit, including the small/large/dynamic variants,
     because all of them resolve against the viewport rather than the zoomed box. */
  const VIEWPORT_LENGTH = /(-?\d*\.?\d+)((?:[dsl]?v)(?:w|h|i|b|min|max))\b/gi;

  const zoomAware = value => value.replace(VIEWPORT_LENGTH, (whole, number, unit) => `calc(${number}${unit} / var(--ui-zoom))`);

  /* The second thing that pushes a page sideways, and the reason the first fix
     was not enough on its own.

     `repeat(auto-fit, minmax(250px, 1fr))` is the idiom this site reaches for
     whenever a row of cards should reflow. It does reflow — down to 250px, and
     then it stops, because a minmax floor is a floor. Give the grid less room
     than the floor and the track keeps its 250px and the content leaves the
     screen. Measured on Saved Notes at 375 with the text at 20.5px and above:
     the rule prompts inside every rule card ran to 452px against a 375px
     viewport, twelve elements over the edge.

     `min(250px, 100%)` is the standard repair and this codebase already uses it
     by hand in three places — it means "250px, unless the container is smaller
     than that, in which case the container". Applying it everywhere is safe in
     a way most sweeping rewrites are not: whenever the container is at least as
     wide as the floor the two expressions are the same value, so nothing that
     currently fits can move. It only differs in the case that was already
     broken.

     Columns only. In a row track a percentage resolves against a height that is
     usually indefinite, where it would be treated as auto and would genuinely
     change a layout rather than rescue one. */
  const FLEXIBLE_TRACKS = new Set(['grid-template-columns', 'grid-auto-columns']);
  const TRACK_FLOOR = /minmax\(\s*(\d*\.?\d+(?:px|rem|em|ch|ex|pt))\s*,/gi;
  const shrinkable = value => value.replace(TRACK_FLOOR, (whole, length) => `minmax(min(${length},100%),`);

  function correctDeclarations(style) {
    for (let index = 0; index < style.length; index += 1) {
      const property = style[index];
      if (FLEXIBLE_TRACKS.has(property)) {
        const value = style.getPropertyValue(property);
        // Already written with min(), by an earlier pass or by hand.
        if (value && !value.includes('min(')) {
          TRACK_FLOOR.lastIndex = 0;
          if (TRACK_FLOOR.test(value)) {
            try { style.setProperty(property, shrinkable(value), style.getPropertyPriority(property)); } catch {}
          }
        }
      }
      if (!SCALED_BY_ZOOM.has(property)) continue;
      const value = style.getPropertyValue(property);
      // Already corrected — by an earlier pass, or by hand in the stylesheet.
      if (!value || value.includes('--ui-zoom')) continue;
      VIEWPORT_LENGTH.lastIndex = 0;
      if (!VIEWPORT_LENGTH.test(value)) continue;
      try { style.setProperty(property, zoomAware(value), style.getPropertyPriority(property)); } catch {}
    }
  }

  function correctRules(rules) {
    for (const rule of rules) {
      if (rule.style) correctDeclarations(rule.style);
      // @media, @supports and @layer bodies hold the same formulas.
      if (rule.cssRules) correctRules(rule.cssRules);
    }
  }

  function correctLoadedStyleSheets() {
    for (const sheet of document.styleSheets) {
      // A stylesheet still in flight, or one the document cannot read, throws
      // here. A later pass picks it up.
      try { correctRules(sheet.cssRules); } catch {}
    }
  }

  /* Three passes, because pages disagree about where they put their own
     <style>: some before this script, most after it, and stylesheets linked in
     the head may still be arriving. Each pass skips what is already corrected,
     so the later ones are close to free. */
  correctLoadedStyleSheets();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', correctLoadedStyleSheets, { once: true });
  }
  window.addEventListener('load', correctLoadedStyleSheets, { once: true });
  window.LearningAIZoomSafeStyles = correctLoadedStyleSheets;
})();
(function () {
  const theme = 'light';
  /* One appearance choice that is real everywhere, rather than several that are
     real on the pages somebody remembered to restyle.

     The dark "onyx" palette is still in theme.css and still unexposed. It was
     measured again for this change: forced on, the selected Motion card's own
     name drops to 1.02:1, the four "…is set to" sentences on Settings to
     1.02:1, and the reset buttons to 1.31:1, because the palette repaints a
     named list of components and every page has controls that are not on it.
     Building it properly meant repainting light fills across eighteen pages —
     an inventory of 325 separate rules — and the decision was taken not to
     ship it rather than ship half of it.

     Surface is what is offered instead. It moves values theme.css owns for
     every page at once — whether the photograph is behind the glass, and
     whether the panels are translucent at all — so no page can be left behind,
     and none of its values leaves the light palette.

     Declared up here rather than beside its function: the boot sequence below
     runs before the rest of this closure is evaluated, and a `const` in the
     temporal dead zone throws where a hoisted `function` does not. */
  const SURFACES = ['landscape', 'plain', 'contrast'];
  /* The accent-colour setting has been removed, and with it its storage key.
     Four values for --mineral all worked and none of them was noticeable: that
     colour is a 2px underline under the current route, a progress fill and the
     border of a chosen answer, so choosing between them changed almost nothing
     a learner would see. A stored value is cleared rather than ignored, so the
     key does not sit in a browser forever meaning nothing. */
  try { localStorage.removeItem('learningai-accent'); } catch {}
  document.documentElement.removeAttribute('data-accent');
  /* Text size is one continuous range, not three named steps.
     Three buttons meant the smallest increase available was +25% — a jump big
     enough that people who wanted "slightly bigger" got "much bigger" or
     nothing. The control is now a slider measured in the unit it produces:
     interface pixels, one pixel at a time. 16 is what every page is authored
     at, so the scale is simply px / 16 and the default is exactly 1x. The old
     ends are still reachable and land on the same numbers they always did —
     large was 1.25 (20px) and xl was 1.5 (24px) — so a stored name migrates to
     the identical rendering rather than to an approximation.

     The range starts below the default rather than at it. With a floor of 16
     there was no such thing as decreasing the size: the control only ever went
     one way from where it started, which is indistinguishable from a control
     that does nothing when you drag it left. 14 and 15 are 87.5% and 93.75%,
     so the smallest move in either direction is a 4-6% change — above the
     threshold at which a change in type size is noticed at all, and each step
     visibly reflows a paragraph.

     The cost is stated rather than hidden: below 16 the whole interface zooms
     out with the type, so a control authored at 44px renders at 38.5px at the
     smallest setting. That is still well clear of the 24px WCAG minimum, and
     it is the same trade a learner makes by zooming their browser out — but it
     is why the range stops at 14 rather than going lower. */
  const TEXT_SIZE_BASE = 16;
  const TEXT_SIZE_MIN = 14;
  const TEXT_SIZE_MAX = 24;
  /* Half a pixel, not a whole one. A whole pixel is 6.3% at the small end and
     4.3% at the large one, so the control was coarsest exactly where the type
     is smallest and a step matters most. Half-pixel steps put every step
     between 2.1% and 3.6%, which is fine enough to drag through without the
     page jumping, and 21 positions is still few enough that each one is
     reachable with a single arrow key. */
  const TEXT_SIZE_STEP = 0.5;
  const LEGACY_TEXT_SIZES = { normal: 16, large: 20, xl: 24 };
  const savedMotion = localStorage.getItem('learningai-motion');
  const systemPrefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const defaultMotion = systemPrefersReducedMotion ? 'reduced' : 'standard';
  const motion = ['standard', 'reduced', 'none'].includes(savedMotion) ? savedMotion : defaultMotion;
  const savedLight = Number(localStorage.getItem('learningai-light') || 88);
  const savedGlass = Number(localStorage.getItem('learningai-glass') || 90);
  const savedTextSize = localStorage.getItem('learningai-font-scale');
  const light = Math.min(100, Math.max(25, Number.isFinite(savedLight) ? savedLight : 88));
  const glass = Math.min(100, Math.max(25, Number.isFinite(savedGlass) ? savedGlass : 90));
  document.documentElement.dataset.theme = theme;
  applyMotion(motion);
  document.documentElement.style.setProperty('--light-through', String(light / 100));
  document.documentElement.style.setProperty('--light-dim', String((100 - light) / 100 * .36));
  applyGlass(glass);
  applyPop(light);
  const bootTextSize = applyTextSize(readTextSize(savedTextSize));
  /* Migrate in place. Reading the old names is what stops a setting being lost;
     writing the new value back is what stops the key holding 'large' forever
     and needing the translation on every page load from here on. Only when a
     value was actually stored, so this never creates the key by itself. */
  if (savedTextSize !== null && savedTextSize !== String(bootTextSize)) {
    try { localStorage.setItem('learningai-font-scale', String(bootTextSize)); } catch {}
  }
  /* Both of these are attributes rather than inline styles so they are visible
     in the DOM, and both are written here — in a synchronous head script —
     so the page never paints in one appearance and then flips to another. */
  applySurface(localStorage.getItem('learningai-surface'));

  try {
    const prototypeAccount = JSON.parse(localStorage.getItem('learningai-prototype-account') || 'null');
    if (prototypeAccount && typeof prototypeAccount === 'object') {
      window.LearningAIUser = {
        email: String(prototypeAccount.email || ''),
        displayName: String(prototypeAccount.displayName || '').trim() || 'Learner'
      };
    }
  } catch {}

  function applyGlass(value) {
    const t = value / 100;
    const opacity = Math.min(.75, Math.max(.02, 1 - t));
    document.documentElement.dataset.glassTransparency = String(value);
    document.documentElement.style.setProperty('--glass-transparency', t.toFixed(3));
    document.documentElement.style.setProperty('--glass-opacity', opacity.toFixed(3));
    document.documentElement.style.setProperty('--glass-hi', Math.min(.92, opacity + .10).toFixed(3));
    document.documentElement.style.setProperty('--glass-lo', Math.max(.018, opacity * .35).toFixed(3));
    document.documentElement.style.setProperty('--glass-tail', Math.max(.035, opacity * .75).toFixed(3));
    document.documentElement.style.setProperty('--glass-blur', `${Math.round(12 + opacity * 20)}px`);
    document.documentElement.style.setProperty('--glass-saturate', (1.62 - opacity * .60).toFixed(3));
    document.documentElement.style.setProperty('--glass-border', Math.min(.90, .80 + opacity * .20).toFixed(3));
    const scrollOpacity = Math.min(.32, opacity + .10);
    document.documentElement.style.setProperty('--glass-scroll-hi', Math.min(.95, scrollOpacity + .12).toFixed(3));
    document.documentElement.style.setProperty('--glass-scroll-lo', Math.max(.03, scrollOpacity * .45).toFixed(3));
    document.documentElement.style.setProperty('--glass-scroll-tail', Math.max(.06, scrollOpacity * .85).toFixed(3));
    document.documentElement.style.setProperty('--glass-scroll-blur', `${Math.round(15 + scrollOpacity * 20)}px`);
  }

  function applyPop(value) {
    const shade = (100 - value) / 100;
    document.documentElement.style.setProperty('--pop-dark', `rgba(24,27,26,${(.14 + shade * .28).toFixed(3)})`);
    document.documentElement.style.setProperty('--pop-deep', `rgba(24,27,26,${(.06 + shade * .18).toFixed(3)})`);
  }

  function applyMotion(next) {
    const value = ['standard', 'reduced', 'none'].includes(next) ? next : 'standard';
    document.documentElement.dataset.motion = value;
    if (value === 'none') {
      document.querySelectorAll('.is-passing,.is-scrolling,.is-dragging,.is-resetting').forEach(element => {
        element.classList.remove('is-passing', 'is-scrolling', 'is-dragging', 'is-resetting');
      });
    }
    return value;
  }

  function clampTextSize(value) {
    const raw = Number(value);
    if (!Number.isFinite(raw)) return TEXT_SIZE_BASE;
    // Rounded to two places as well as to the step: 0.5 divides exactly in
    // binary, but a value that arrived as 16.499999 should still land on 16.5.
    const stepped = Math.round(Math.round(raw / TEXT_SIZE_STEP) * TEXT_SIZE_STEP * 100) / 100;
    return Math.min(TEXT_SIZE_MAX, Math.max(TEXT_SIZE_MIN, stepped));
  }

  /* The stored key held a name ('normal' | 'large' | 'xl') and now holds a pixel
     size. Both are read, so an existing setting survives the change instead of
     silently reverting to default. A bare multiplier is accepted too, because
     that is the other shape this value could plausibly have been written in. */
  function readTextSize(raw) {
    if (raw === null || raw === undefined || raw === '') return TEXT_SIZE_BASE;
    const named = LEGACY_TEXT_SIZES[String(raw).trim()];
    if (named) return named;
    const number = Number(raw);
    if (!Number.isFinite(number)) return TEXT_SIZE_BASE;
    return clampTextSize(number > 0 && number <= 4 ? number * TEXT_SIZE_BASE : number);
  }

  function applyTextSize(next) {
    const px = clampTextSize(next);
    const scale = px / TEXT_SIZE_BASE;
    // Most prototype screens still contain fixed-pixel type. Scaling only the
    // root font therefore made the setting appear to work while leaving much
    // of the interface unchanged. Use layout zoom where supported so every
    // label, control, lesson, and hit target scales together; retain a root
    // font-size fallback for engines without CSS zoom.
    document.documentElement.dataset.textSize = String(px);
    /* Three states rather than a per-step attribute: every rule that used to be
       written twice, once for "large" and once for "xl", now has to hold at
       every value in between. "in" and "out" are distinguished because the two
       rules that depend on this want different answers — the zoom fallback
       applies to any scale that is not 1, while the small-screen reflow is only
       needed when the layout has less room than it was authored with. */
    document.documentElement.dataset.textZoom = scale > 1 ? 'in' : scale < 1 ? 'out' : 'off';
    document.documentElement.style.setProperty('--ui-zoom', String(scale));
    document.documentElement.style.fontSize = '100%';
    return px;
  }

  function applySurface(next) {
    const value = SURFACES.includes(next) ? next : 'landscape';
    document.documentElement.dataset.surface = value;
    return value;
  }

  window.LearningAITheme = {
    surfaces: () => SURFACES.slice(),
    setSurface(next) {
      const value = applySurface(next);
      localStorage.setItem('learningai-surface', value);
      window.dispatchEvent(new CustomEvent('learningai:surface', {detail: value}));
      return value;
    },
    setLight(next) {
      const value = Math.min(100, Math.max(25, Number(next)));
      localStorage.setItem('learningai-light', String(value));
      document.documentElement.style.setProperty('--light-through', String(value / 100));
      document.documentElement.style.setProperty('--light-dim', String((100 - value) / 100 * .36));
      applyPop(value);
      window.dispatchEvent(new CustomEvent('learningai:light', {detail: value}));
    },
    setGlass(next) {
      const value = Math.min(100, Math.max(25, Number(next)));
      localStorage.setItem('learningai-glass', String(value));
      applyGlass(value);
      window.dispatchEvent(new CustomEvent('learningai:glass', {detail: value}));
    },
    setMotion(next) {
      const value = applyMotion(next);
      localStorage.setItem('learningai-motion', value);
      window.dispatchEvent(new CustomEvent('learningai:motion', {detail: value}));
    },
    textSize: () => clampTextSize(readTextSize(localStorage.getItem('learningai-font-scale'))),
    textSizeRange: () => ({ min: TEXT_SIZE_MIN, max: TEXT_SIZE_MAX, step: TEXT_SIZE_STEP, base: TEXT_SIZE_BASE }),
    /* Called on every input event while the slider is dragged, so it has to be
       cheap. It is: the only work is one custom property, one attribute and one
       localStorage write.

       Deliberately absent is a re-run of the viewport-unit sweep. That sweep
       rewrites `100vw` to `calc(100vw / var(--ui-zoom))` once, at load, over
       every rule in every loaded stylesheet — about 1.3ms across 900 rules,
       which is far too much to repeat sixty times a second. It does not need
       repeating: the rewritten values name the variable rather than a number,
       so they re-resolve on their own the instant --ui-zoom changes. Measured
       dragging 14 → 24 continuously: no page exceeded its viewport width at
       any step. */
    setTextSize(next) {
      const value = applyTextSize(next);
      localStorage.setItem('learningai-font-scale', String(value));
      window.dispatchEvent(new CustomEvent('learningai:text-size', {detail: value}));
      window.dispatchEvent(new CustomEvent('learningai:font-scale', {detail: value}));
      return value;
    },
    // Kept so an older caller, or a page not rebuilt yet, still works: it takes
    // the old names as readily as it takes a pixel size.
    setFontScale(next) { return window.LearningAITheme.setTextSize(readTextSize(next)); }
  };

  function revealCurrentNavRoute() {
    const rail = document.querySelector('.nav-glass nav');
    const current = rail && rail.querySelector('[aria-current="page"]');
    if (!rail || !current || rail.scrollWidth <= rail.clientWidth) return;
    const centered = current.offsetLeft - (rail.clientWidth - current.offsetWidth) / 2;
    rail.scrollLeft = Math.max(0, Math.min(centered, rail.scrollWidth - rail.clientWidth));
  }

  function scheduleCurrentNavRoute() {
    requestAnimationFrame(revealCurrentNavRoute);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleCurrentNavRoute, {once: true});
  } else {
    scheduleCurrentNavRoute();
  }
  window.addEventListener('resize', scheduleCurrentNavRoute, {passive: true});
})();

/* Press-and-drag on a glass surface used to leave the browser's own artefact
   behind: a blue selection smear across the navigation labels, or the ghost
   image the browser drags when you grab a link or a badge. CSS user-select
   handles the smear (see theme.css); this handles the ghost, because
   -webkit-user-drag is not implemented everywhere and setting draggable="false"
   on every element in twelve pages would not survive the next page that is
   added. Only surfaces that are grabbed on purpose are listed — text in a
   lesson stays selectable, and links elsewhere stay draggable to a bookmark
   bar. */
(() => {
  const GRAB_SURFACES = '.nav-glass,.arc-rail,.panel-handle,.medal,.achievement-object,.minute-dial,.unit-rail';
  document.addEventListener('dragstart', event => {
    const origin = event.target instanceof Element ? event.target : event.target?.parentElement;
    if (origin?.closest(GRAB_SURFACES)) event.preventDefault();
  });
})();

/* One browser can hold more than one LearningAI account over time, but only one
   server session at a time. learningai-prototype-account holds whoever is signed
   in now; this roster remembers which accounts this browser has seen, so they can
   be listed, switched and forgotten on accounts.html — and so that a brand-new
   account is not greeted with "Welcome back" on the session it was created in. */
(() => {
  const ROSTER_KEY = 'learningai-browser-accounts';
  const SESSION_KEY = 'learningai-browser-session-id';
  const ACCOUNT_KEY = 'learningai-prototype-account';
  const MAX_ACCOUNTS = 8;

  const readJson = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value === null || value === undefined ? fallback : value;
    } catch {
      return fallback;
    }
  };
  const writeJson = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  };

  /* sessionStorage is per tab-session, so it is the only honest "is this the same
     visit?" signal available without a server round trip. */
  function sessionId() {
    try {
      let value = sessionStorage.getItem(SESSION_KEY) || '';
      if (!value) {
        value = `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
        sessionStorage.setItem(SESSION_KEY, value);
      }
      return value;
    } catch {
      return 'no-session-storage';
    }
  }

  const keyFor = account => String(account?.id || account?.email || '').trim().toLowerCase();
  const activeAccount = () => {
    const value = readJson(ACCOUNT_KEY, null);
    return value && typeof value === 'object' ? value : null;
  };
  const roster = () => {
    const value = readJson(ROSTER_KEY, []);
    return Array.isArray(value) ? value.filter(entry => entry && typeof entry === 'object' && entry.key) : [];
  };
  const activeKey = () => keyFor(activeAccount());

  function remember(account, via = 'restored') {
    const key = keyFor(account);
    if (!key) return null;
    const list = roster();
    const now = new Date().toISOString();
    const current = sessionId();
    /* keyFor prefers the account id, so the same person keyed by email before
       their id was known and by id afterwards would open two rows on the
       accounts page — one of them permanently "signed out". Match on either
       identifier, then migrate the row onto the current key. */
    const email = String(account.email || '').trim().toLowerCase();
    let entry = list.find(item => item.key === key)
      || (email ? list.find(item => String(item.email || '').trim().toLowerCase() === email) : null)
      || (account.id ? list.find(item => String(item.id || '') === String(account.id)) : null);
    if (entry) entry.key = key;
    if (!entry) {
      entry = {
        key,
        id: String(account.id || ''),
        email: String(account.email || ''),
        displayName: String(account.displayName || '').trim() || 'Learner',
        accountCreatedAt: String(account.createdAt || ''),
        addedAt: now,
        addedVia: via,
        firstSessionId: current,
        lastSessionId: current,
        sessionCount: 1,
        lastSeenAt: now
      };
      list.push(entry);
    } else {
      if (account.id) entry.id = String(account.id);
      if (account.email) entry.email = String(account.email);
      if (account.displayName) entry.displayName = String(account.displayName).trim() || entry.displayName;
      if (account.createdAt) entry.accountCreatedAt = String(account.createdAt);
      // An explicit sign-up/sign-in is evidence; a passive page load is not.
      if (via !== 'restored') entry.addedVia = via;
      if (entry.lastSessionId !== current) {
        entry.sessionCount = (Number(entry.sessionCount) || 1) + 1;
        entry.lastSessionId = current;
      }
      entry.lastSeenAt = now;
    }
    writeJson(ROSTER_KEY, list.slice(-MAX_ACCOUNTS));
    return entry;
  }

  function forget(key) {
    const wanted = String(key || '').trim().toLowerCase();
    if (!wanted) return false;
    const list = roster();
    const next = list.filter(entry => entry.key !== wanted);
    if (next.length === list.length) return false;
    writeJson(ROSTER_KEY, next);
    return true;
  }

  /* Fallback for an account this browser has no record of (roster cleared, or
     written directly by an account-state hydration). A genuinely new account was
     created recently and has at most the free sample lesson behind it. */
  function looksBrandNew(account) {
    const created = Date.parse(String(account?.createdAt || ''));
    if (!Number.isFinite(created) || Date.now() - created > 86_400_000) return false;
    let completed = 0;
    try {
      const progress = JSON.parse(localStorage.getItem('learningai-progress') || 'null');
      completed = progress && progress.completed && typeof progress.completed === 'object'
        ? Object.keys(progress.completed).length
        : 0;
    } catch {}
    return completed <= 1;
  }

  function isReturning() {
    const account = activeAccount();
    const key = keyFor(account);
    if (!key) return false;
    const entry = roster().find(item => item.key === key);
    if (!entry) return !looksBrandNew(account);
    if (entry.addedVia === 'signin') return true;
    if ((Number(entry.sessionCount) || 1) > 1) return true;
    if (entry.lastSessionId !== sessionId()) return true;
    return entry.addedVia === 'signup' ? false : !looksBrandNew(account);
  }

  const list = () => roster()
    .map(entry => ({ ...entry, active: entry.key === activeKey() }))
    .sort((a, b) => String(b.lastSeenAt || '').localeCompare(String(a.lastSeenAt || '')));

  window.LearningAIAccounts = { list, remember, forget, activeKey, sessionId, isReturning };
  window.LearningAIGreeting = {
    isReturning,
    isFirstSession: () => !isReturning(),
    navText: name => (isReturning() ? `Welcome back, ${name}` : `Welcome, ${name}`),
    pageText: name => (isReturning() ? `Welcome back, ${name}.` : `Welcome to LearningAI, ${name}.`)
  };

  // Record this visit so the next one is correctly recognised as a return.
  remember(activeAccount(), 'restored');
})();

/* Prototype V2 starting questions. They follow account creation, establish a
   starting point, and unlock the full prototype. Age controls the Adults route. */
(() => {
  const AGE_KEY = 'learningai-age-range-prototype';
  const ASSESSMENT_KEY = 'learningai-diagnostic-prototype';
  const DRAFT_KEY = 'learningai-diagnostic-draft-prototype';
  const ADULT_RANGES = new Set(['19-24','25-34','35-49','50-plus']);
  /* The empty first entry is kept so setAge('') stays a recognised no-op for any
     stored draft written by the old <select>. It is never offered as a choice. */
  const AGE_OPTIONS = [
    ['', 'Choose age range'], ['13-15', '13–15'], ['16-18', '16–18'],
    ['19-24', '19–24'], ['25-34', '25–34'], ['35-49', '35–49'],
    ['50-plus', '50+'], ['prefer-not', 'Prefer not to say']
  ];
  const AGE_CHOICES = AGE_OPTIONS.filter(([value]) => value);
  /* Every option in a question is written to the same length, within one
     character and one word. The previous set was ordered by sophistication and
     the top-scoring answer was always the wordiest, so the instrument measured
     "can you spot the long one" rather than what a learner actually believes.
     Wording targets ages 13–18 and matches the plain-language pass applied to
     the fifty lessons: no jargon, no clause stacking, one idea per option. */
  const QUESTIONS = [
    { key:'definition', label:'What AI is', title:'When people say “AI”, what do they mean?', copy:'Pick the answer closest to how you would explain it right now.', options:[
      ['0','A website you type a question into, and it types an answer.'],
      ['1','A program that copies the way people write and talk online.'],
      ['2','A model trained on data to spot patterns and predict things.'],
      ['3','A family of systems that can read, write, see, plan and act.'] ] },
    { key:'capability', label:'What it can do', title:'Is AI just a faster search engine?', copy:'A friend says that to you. Pick the reply closest to yours.', options:[
      ['0','Yes, more or less. It just finds information a bit quicker.'],
      ['1','Not really. It also writes drafts and shortens long pieces.'],
      ['2','No. It can explain, code, translate, plan and read images.'],
      ['3','No. It can use tools, run code and finish multi-step jobs.'] ] },
    { key:'limits', label:'Checking', title:'An AI answers, and sounds sure. What next?', copy:'Say it was a health, law, history or science question.', options:[
      ['0','Go with it, if the answer is detailed and sounds very sure.'],
      ['1','Ask the same question again and see if the answer matches.'],
      ['2','Ask it for its sources, then read those sources for myself.'],
      ['3','Treat it as a draft and look for anything proving it wrong.'] ] },
    { key:'learning', label:'Staying in control', title:'You are learning something new. How do you use AI?', copy:'Pick what you would really do, not what sounds best.', options:[
      ['0','Let it do the hard thinking so the work is finished faster.'],
      ['1','Ask it to say the same thing in simpler and shorter words.'],
      ['2','Ask for a hint and an example, then do the thinking myself.'],
      ['3','Get it to quiz me and argue back, so the skill stays mine.'] ] },
    { key:'impact', label:'Real costs', title:'Does AI cost anything, beyond money?', copy:'A friend says it has costs for people and the planet. You say…', options:[
      ['0','They are wrong. New technology always works out in the end.'],
      ['1','They are right. The safest thing is to avoid AI altogether.'],
      ['2','Costs are real, so weigh them against what the tool gives.'],
      ['3','Ask which model, which job, how much energy, and who pays.'] ] },
    { key:'systems', label:'Beyond chatbots', title:'What is there, apart from chatbots?', copy:'Pick the answer closest to what you already know about.', options:[
      ['0','Mostly the same thing: chatbots that keep getting better.'],
      ['1','Tools that write, shorten and search faster than I could.'],
      ['2','Tutors, coding helpers, study helpers, and tools for art.'],
      ['3','Software that runs whole jobs, plus robots and lab work.'] ] }
  ];
  /* One row per question, read as "display slot n shows options[row[n]]". Every
     score sits in every slot at least once across the six questions and never
     more than twice, so neither the first nor the last position is worth
     guessing. Fixed rather than random: it must survive Back, Next and a reload
     without moving under someone mid-answer. */
  const OPTION_ORDERS = [[3,1,0,2],[0,3,2,1],[1,0,3,2],[2,0,1,3],[1,3,2,0],[0,2,3,1]];

  const read = (key, fallback = '') => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
  const readJson = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; } catch { return fallback; } };
  const savedAge = () => read(AGE_KEY);
  const isAdult = value => ADULT_RANGES.has(value);
  /* Age is asked once and then fixed. Everything that writes it goes through
     here, so "answered once" is a property of the one function rather than a
     rule three callers have to remember. An empty answer is not an answer: it
     leaves the question open so it can be offered again, which is what makes
     skipping it safe. */
  const ageIsSettled = () => Boolean(savedAge());
  function commitAge(value) {
    if (!value || ageIsSettled()) return false;
    if (!AGE_OPTIONS.some(([option]) => option === value)) return false;
    try { localStorage.setItem(AGE_KEY, value); } catch { return false; }
    syncAdultsNavigation(value);
    return true;
  }
  const ageLabelFor = value => AGE_OPTIONS.find(([option]) => option === value)?.[1] || value;
  const ROUTES = new Map([
    ['Dashboard', './stage-1-navigation-proof.html'],
    ['Lessons', './lessons.html'],
    ['Progress', './progress.html'],
    ['Focus', './focus.html'],
    ['Notes', './notes.html'],
    ['Projects', './projects.html'],
    ['Gallery', './gallery.html'],
    ['About', './about.html'],
    ['Settings', './settings.html']
  ]);
  /* Projects was the destination people gave up looking for, so it is now one of
     the five always-visible routes rather than something you had to open a menu
     called "More" to discover. The menu beside them is the full site index — it
     repeats the visible five so that "All pages" is literally true and nobody
     has to guess which half of the site a page lives in.

     What was wrong with it was never the length: it was that ten destinations
     were rendered as ten identical rows four pixels apart, with no way to tell
     a lesson route from an account route without reading every label. Named
     groups fix that, and they are also the answer to "do we need all of these
     here?" — yes, because the button says All pages, but they now arrive
     sorted. Settings is included for the same reason: it is a real page, and a
     gear icon was the only way to reach it. */
  const PRIMARY_ROUTES = ['Dashboard', 'Lessons', 'Progress', 'Focus', 'Projects'];
  const MENU_GROUPS = [
    { key: 'course', label: 'Your course', routes: ['Dashboard', 'Lessons', 'Progress', 'Focus'] },
    { key: 'work', label: 'Your work', routes: ['Projects', 'Gallery', 'Notes'] },
    { key: 'about', label: 'About and account', routes: ['About', 'Settings'] }
  ];
  /* Routes with no capsule of their own in the top bar. The "All pages" button
     wears the current-page marker on their behalf. Settings is deliberately not
     in this list: it has its own always-visible control, which is already
     marked, and two current-page markers in one capsule read as a bug. */
  const MENU_ONLY_ROUTES = ['Gallery', 'Notes', 'About'];
  const CURRENT_ROUTE = new Map([
    ['stage-1-navigation-proof.html', 'Dashboard'],
    ['progress.html', 'Progress'],
    ['lessons.html', 'Lessons'],
    ['lesson.html', 'Lessons'],
    ['focus.html', 'Focus'],
    ['notes.html', 'Notes'],
    ['projects.html', 'Projects'],
    ['gallery.html', 'Gallery'],
    ['about.html', 'About'],
    ['settings.html', 'Settings'],
    ['adults.html', 'Adults']
  ]);
  const PROTECTED_ROUTES = new Set([
    // about.html carries the teaching method and the privacy commitment. A
    // teacher evaluating this for a class, or anyone deciding whether to hand
    // over an email, must be able to read them before creating an account.
    'stage-1-navigation-proof.html','progress.html','lessons.html','lesson.html','focus.html',
    'notes.html','projects.html','gallery.html','adults.html','settings.html'
  ]);

  function prototypeName() {
    const fromQuery = new URLSearchParams(location.search).get('name');
    return String(fromQuery || window.LearningAIUser?.displayName || 'Learner').trim() || 'Learner';
  }

  /* "Welcome back" is only true on a return visit. A learner who created their
     account minutes ago, and anyone not signed in at all, is greeted as new. */
  function syncGreeting() {
    const name = prototypeName();
    const greeting = window.LearningAIGreeting;
    const navText = greeting ? greeting.navText(name) : `Welcome, ${name}`;
    document.querySelectorAll('.greeting').forEach(element => {
      element.textContent = navText;
    });
    const dashboardGreeting = document.querySelector('#dashboardGreeting');
    if (dashboardGreeting) dashboardGreeting.textContent = greeting ? greeting.pageText(name) : `Welcome, ${name}.`;
  }

  function currentRouteLabel() {
    return CURRENT_ROUTE.get(location.pathname.split('/').pop() || '');
  }

  function syncCanonicalNavigation() {
    const currentLabel = currentRouteLabel();
    document.querySelectorAll('.nav-glass nav').forEach(nav => {
      nav.setAttribute('aria-label', 'Primary');
      nav.replaceChildren(...PRIMARY_ROUTES.map(label => {
        const link = document.createElement('a');
        link.href = ROUTES.get(label);
        link.textContent = label;
        if (label === currentLabel) link.setAttribute('aria-current', 'page');
        return link;
      }));
    });
  }

  function guardPrototypeRoute() {
    const params = new URLSearchParams(location.search);
    const reviewMode = window.LearningAIReviewMode === true;
    if (reviewMode) {
      document.querySelectorAll('a[href^="./"]').forEach(link => {
        const url = new URL(link.href, location.href);
        if (url.origin === location.origin && url.pathname.includes('/learning-ai-design-assets/')) {
          url.searchParams.set('review', '1');
          link.href = `${url.pathname.split('/').pop()}${url.search}${url.hash}`;
        }
      });
      return true;
    }
    const file = location.pathname.split('/').pop() || '';

    /* Lesson 1 is the free lesson and never needs an account. lesson.html
       carries that exemption too, but this guard runs from the head and
       redirects before the page's own script ever executes — which is why
       picking Lesson 1 out of the catalogue landed on the sign-in page for
       anyone who had not finished the questionnaire. */
    if (file === 'lesson.html'
        && new URLSearchParams(location.search).get('id') === 'chapter-1') return true;

    const firstComplete = Boolean(read('learningai-first-lesson-complete'));
    const accountReady = Boolean(read('learningai-prototype-account'));
    const questionsReady = Boolean(read(ASSESSMENT_KEY));
    /* Preview opens every page. This guard never checked it, which is why
       "preview every lesson" did nothing at all — the setting switched on, the
       storage guard installed, and then this sent the visitor straight back.
       Preview is deliberate and device-local, so it is allowed to unlock;
       nothing it does is recorded. */
    if (window.LearningAIReviewMode) return true;

    // Otherwise unlock is derived from the three required milestones. The
    // cached flag is only a convenience for older previews and must never
    // bypass a missing lesson, learner record, or questionnaire.
    const unlocked = firstComplete && accountReady && questionsReady;
    if (unlocked && !read('learningai-site-unlocked')) localStorage.setItem('learningai-site-unlocked', 'true');
    if (!unlocked && read('learningai-site-unlocked')) localStorage.removeItem('learningai-site-unlocked');
    if (file === 'onboarding.html') {
      if (!firstComplete) { location.replace('./lesson-one.html'); return false; }
      if (!accountReady) { location.replace('./access.html?mode=create'); return false; }
    }
    if (!PROTECTED_ROUTES.has(file) || unlocked) return true;
    const destination = !firstComplete ? './lesson-one.html' : !accountReady ? './access.html?mode=create' : './onboarding.html';
    location.replace(destination);
    return false;
  }

  /* Adults is still conditional on a saved adult age range, and still added and
     removed at runtime rather than authored into any page. It now lands inside
     the "About and account" group, above Settings, instead of after the last
     row of a flat list — an ungrouped append would have left it stranded below
     the group boxes. */
  function syncAdultsNavigation(age = savedAge()) {
    document.querySelectorAll('.mobile-nav-menu').forEach(menu => {
      menu.querySelector('[data-adults-link]')?.remove();
      if (!isAdult(age)) return;
      const link = document.createElement('a');
      link.href = './adults.html';
      link.dataset.adultsLink = '';
      link.dataset.menuRoute = 'Adults';
      link.setAttribute('role', 'menuitem');
      link.textContent = 'Adults';
      if (location.pathname.endsWith('/adults.html')) link.setAttribute('aria-current', 'page');
      const host = menu.querySelector('[data-menu-group="about"]') || menu;
      /* Matched on the data attribute, not the href: review mode rewrites every
         href to carry ?review=1, so an href selector stops matching. */
      const settingsLink = host.querySelector('[data-menu-route="Settings"]');
      if (settingsLink) settingsLink.before(link);
      else host.append(link);
    });
  }

  function syncCoreNavigation() {}

  function setupMobileNavigationMenu() {
    document.querySelectorAll('.nav-glass').forEach(glass => {
      const primary = glass.querySelector('nav[aria-label="Primary"]');
      const settings = glass.querySelector('.settings');
      if (!primary || !settings || glass.querySelector('.mobile-nav-more')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mobile-nav-more';
      button.setAttribute('aria-haspopup', 'menu');
      button.setAttribute('aria-expanded', 'false');
      const menu = document.createElement('div');
      menu.className = 'mobile-nav-menu';
      menu.hidden = true;
      menu.setAttribute('role', 'menu');
      menu.setAttribute('aria-label', 'All LearningAI pages');
      const currentLabel = currentRouteLabel();
      /* The capsule names the page you are on rather than the generic "All
         pages", so it reads as a position as well as a way out of it. It stays
         one control: same menu, same contents, same behaviour.

         The visible text changes, so the accessible name has to change with it.
         A screen reader announcing "All LearningAI pages" over a button reading
         "Progress" is the failure WCAG 2.5.3 (Label in Name) describes, and it
         also breaks voice control — "click Progress" would match nothing. The
         name therefore starts with the visible text and then says what the
         button does, which satisfies both, and the menu keeps its own separate
         name so the popup is still announced as the site index.

         A page outside the route map — sign-in, accounts, the first lesson —
         has no name to show, so it keeps the generic label. */
      if (currentLabel) {
        button.textContent = currentLabel;
        button.setAttribute('aria-label', `${currentLabel} — open all LearningAI pages`);
      } else {
        button.textContent = 'All pages';
        button.setAttribute('aria-label', 'All LearningAI pages');
      }
      if (MENU_ONLY_ROUTES.includes(currentLabel) || currentLabel === 'Adults') {
        // Underline the button only when the page you are on has no visible
        // route of its own, so there is never a second current-page marker in
        // the same capsule.
        button.classList.add('is-current');
      }
      MENU_GROUPS.forEach(group => {
        const section = document.createElement('div');
        section.className = 'mobile-nav-group';
        section.dataset.menuGroup = group.key;
        /* role="group" is the only container a role="menu" accepts, and its
           accessible name comes from aria-label. The visible caption is hidden
           from assistive technology so the group is announced once, not twice,
           and so a bare <span> never appears as an unexpected menu child. */
        section.setAttribute('role', 'group');
        section.setAttribute('aria-label', group.label);
        const caption = document.createElement('span');
        caption.className = 'mobile-nav-group-label';
        caption.setAttribute('aria-hidden', 'true');
        caption.textContent = group.label;
        section.append(caption);
        group.routes.forEach(label => {
          const link = document.createElement('a');
          link.href = ROUTES.get(label);
          link.textContent = label;
          link.dataset.menuRoute = label;
          link.setAttribute('role', 'menuitem');
          if (label === currentLabel) link.setAttribute('aria-current', 'page');
          section.append(link);
        });
        menu.append(section);
      });
      const menuItems = () => [...menu.querySelectorAll('[role="menuitem"],a[data-adults-link]')];
      const closeMenu = ({ focusButton = false } = {}) => {
        if (menu.hidden) return;
        menu.hidden = true;
        button.setAttribute('aria-expanded', 'false');
        if (focusButton) button.focus();
      };
      const openMenu = () => {
        menu.hidden = false;
        button.setAttribute('aria-expanded', 'true');
        (menu.querySelector('[aria-current="page"]') || menuItems()[0])?.focus();
      };
      button.addEventListener('click', event => {
        event.stopPropagation();
        if (menu.hidden) openMenu();
        else closeMenu();
      });
      button.addEventListener('keydown', event => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          openMenu();
        }
      });
      menu.addEventListener('click', event => event.stopPropagation());
      menu.addEventListener('keydown', event => {
        const items = menuItems();
        const index = items.indexOf(document.activeElement);
        let next = -1;
        if (event.key === 'ArrowDown') next = index < 0 ? 0 : (index + 1) % items.length;
        if (event.key === 'ArrowUp') next = index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = items.length - 1;
        if (next >= 0) {
          event.preventDefault();
          items[next]?.focus();
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          closeMenu({ focusButton:true });
        }
      });
      document.addEventListener('click', () => closeMenu());
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !menu.hidden) {
          event.preventDefault();
          closeMenu({ focusButton:true });
        }
      });
      settings.before(button);
      glass.append(menu);
    });
    syncAdultsNavigation();
  }

  function propagateReviewMode() {
    if (new URLSearchParams(location.search).get('review') !== '1') return;
    const preserve = root => (root.matches?.('a[href^="./"]') ? [root] : [...root.querySelectorAll?.('a[href^="./"]') || []]).forEach(link => {
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !url.pathname.includes('/learning-ai-design-assets/')) return;
      url.searchParams.set('review', '1');
      link.href = `${url.pathname.split('/').pop()}${url.search}${url.hash}`;
    });
    preserve(document);
    if (!window.__learningAIReviewObserver) {
      window.__learningAIReviewObserver = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) preserve(node);
      })));
      window.__learningAIReviewObserver.observe(document.documentElement, { childList:true, subtree:true });
    }
  }

  function buildQuestionnaire(forcePreview = false) {
    if (!location.pathname.endsWith('/onboarding.html')) return;
    if (!forcePreview && read(ASSESSMENT_KEY)) {
      location.replace('./stage-1-navigation-proof.html');
      return;
    }
    const draft = readJson(DRAFT_KEY,{index:0,age:savedAge(),answers:{}});
    draft.answers ||= {};
    const dialog = document.createElement('dialog');
    dialog.className = 'audience-dialog diagnostic-dialog'; dialog.id = 'audienceDialog'; dialog.setAttribute('aria-labelledby','audienceTitle');
    document.body.append(dialog);

    function persistDraft(){ localStorage.setItem(DRAFT_KEY,JSON.stringify(draft)); }
    /* Age is the one answer here that does real work — it is what decides
       whether the Adults route exists — so the question stays. What has gone is
       its power to stop anyone: it is optional, it never holds up a lesson, and
       "Prefer not to say" and no answer at all are both allowed.

       It is also asked exactly once. Once a range is stored the question is
       replaced by a statement of what was chosen, so re-answering the six
       questions cannot quietly become a way to re-answer this one. */
    function ageField(){
      const settled=savedAge();
      if(settled) return `<fieldset class="age-field" data-age-settled=""><legend>Your age</legend><p class="age-note">You chose <b>${ageLabelFor(settled)}</b>. Age is asked once and kept, so it is not asked again. It decides only whether adult-only guidance appears.</p></fieldset>`;
      return `<fieldset class="age-field"><legend>Your age <i>optional</i></legend><p class="age-note">LearningAI is built first for ages 13–18 and is open to everyone. This answer only decides whether adult-only guidance appears — it never locks a lesson. You can leave it blank and carry on. If you do answer, it is kept as it is and cannot be changed later.</p><div class="age-choices">${AGE_CHOICES.map(([value,label])=>`<label><input type="radio" name="ageRange" value="${value}" ${draft.age===value?'checked':''}><span>${label}</span></label>`).join('')}</div></fieldset>`;
    }
    function renderQuestion(){
      const index = Math.max(0,Math.min(Number(draft.index)||0,QUESTIONS.length-1));
      const question = QUESTIONS[index];
      const answer = draft.answers[question.key] || '';
      /* The four graded options are authored weakest-to-strongest in QUESTIONS,
         so without this the highest-scoring answer would always be the fourth
         one. The stored value keeps its score regardless of where it is shown.
         "Not sure" stays last: it is an escape hatch, not a graded choice. */
      const order = OPTION_ORDERS[index % OPTION_ORDERS.length];
      const gradedOptions = order.map(position => question.options[position]).filter(Boolean);
      const questionOptions = [...gradedOptions, ['unsure', 'I’m not sure yet.']];
      dialog.innerHTML = `<form method="dialog" class="audience-card diagnostic-card-prototype">
        <div class="diagnostic-meta"><p class="audience-eyebrow">Starting placement · not graded</p><span>Question ${index+1} of ${QUESTIONS.length}</span></div>
        <div class="diagnostic-progress-prototype" role="progressbar" aria-label="Starting questions" aria-valuemin="1" aria-valuemax="${QUESTIONS.length}" aria-valuenow="${index+1}" aria-valuetext="Question ${index+1} of ${QUESTIONS.length}"><i style="width:${((index+1)/QUESTIONS.length)*100}%"></i></div>
        <p class="diagnostic-promise">About 2 minutes. Your answers record your starting point so the course can be improved. They are not a grade, and they never lock or unlock a lesson.</p>
        <p class="diagnostic-topic">${question.label}</p>
        <h2 id="audienceTitle" tabindex="-1">${question.title}</h2>
        <p class="audience-copy">${question.copy}</p>
        ${index===0 ? ageField() : ''}
        <fieldset class="diagnostic-options-prototype"><legend>Choose the closest answer</legend>${questionOptions.map(([value,label],optionIndex)=>`<label><input type="radio" name="${question.key}" value="${value}" ${answer===value?'checked':''}><span><b>${optionIndex+1}</b>${label}</span></label>`).join('')}</fieldset>
        <p class="audience-result" id="audienceResult" aria-live="polite">Choose the answer closest to what you understand today. You can change your starting point later.</p>
        <div class="audience-actions diagnostic-actions"><button class="audience-skip" id="audienceBack" type="button" ${index===0?'disabled':''}>Back</button><button class="audience-primary" id="audienceNext" type="button">${index===QUESTIONS.length-1?'Finish and unlock LearningAI':'Next question'}</button></div>
      </form>`;
      const result = dialog.querySelector('#audienceResult');
      const ageInputs = [...dialog.querySelectorAll('input[name="ageRange"]')];
      ageInputs.forEach(input=>input.addEventListener('change',event=>{ draft.age=event.target.value; persistDraft(); }));
      dialog.querySelectorAll(`input[name="${question.key}"]`).forEach(input=>input.addEventListener('change',event=>{ draft.answers[question.key]=event.target.value; persistDraft(); }));
            dialog.querySelector('#audienceBack').addEventListener('click',()=>{ draft.index=Math.max(0,index-1); persistDraft(); renderQuestion(); });
      dialog.querySelector('#audienceNext').addEventListener('click',async()=>{
        const chosen = dialog.querySelector(`input[name="${question.key}"]:checked`);
        if(!chosen){ result.textContent='Choose one answer before continuing.'; dialog.querySelector(`input[name="${question.key}"]`)?.focus(); return; }
        draft.answers[question.key]=chosen.value;
        // No guard on age: an unanswered age is a valid state, so leaving this
        // question with one chosen is the same as leaving it without.
        if(index===0) commitAge(draft.age);
        if(index<QUESTIONS.length-1){ draft.index=index+1; persistDraft(); renderQuestion(); return; }
        /* "I'm not sure yet" is an escape hatch, not a wrong answer. Scoring it
           as 0 made honesty indistinguishable from a misconception. Score only
           the graded answers and rescale. */
        const gradedAnswers=QUESTIONS.filter(item=>draft.answers[item.key]!=='unsure'&&draft.answers[item.key]!=null);
        const score=gradedAnswers.reduce((sum,item)=>sum+(Number(draft.answers[item.key])||0),0);
        const percent=gradedAnswers.length?Math.round(score/(gradedAnswers.length*3)*100):0;
        const level=percent<45?'Foundation':percent<75?'Explorer':'Builder';
        const completedAt=new Date().toISOString();
        const assessment={ageRange:savedAge(),answers:draft.answers,responses:QUESTIONS.map(item=>{const value=String(draft.answers[item.key]||''),label=item.options.find(([optionValue])=>optionValue===draft.answers[item.key])?.[1]||'I’m not sure yet.';return{questionKey:item.key,value,label,answer:value,answerLabel:label}}),scorePercent:percent,level,placementMethod:'self-report',completedAt};
        const account=readJson('learningai-prototype-account',null);
        if(account?.mode==='postgres'&&!window.LearningAIReviewMode){
          const button=dialog.querySelector('#audienceNext');
          button.disabled=true;
          button.textContent='Saving your starting point…';
          const saved=await window.LearningAIAPI?.saveAssessment(assessment);
          if(!saved?.ok){
            button.disabled=false;
            button.textContent='Finish and unlock LearningAI';
            result.textContent=window.LearningAIAPI?.friendlyError(saved)||'Your answers could not be saved. Try again.';
            return;
          }
        }
        localStorage.setItem(ASSESSMENT_KEY,JSON.stringify(assessment));
        localStorage.setItem('learningai-site-unlocked','true');
        localStorage.removeItem(DRAFT_KEY); dialog.close(); location.href='./stage-1-navigation-proof.html';
      });
      document.querySelector('.onboarding-context')?.setAttribute('aria-busy','false');
      requestAnimationFrame(()=>dialog.querySelector('#audienceTitle')?.focus());
    }
    dialog.addEventListener('cancel',event=>event.preventDefault()); renderQuestion(); dialog.showModal();
  }

  function initializeAudience() {
    const previewParams = new URLSearchParams(location.search);
    const forceQuestionnairePreview = previewParams.get('audience') === 'reset';
    if (forceQuestionnairePreview) {
      /* AGE_KEY is deliberately absent from this list. ?audience=reset exists to
         re-run the six questions; age is not one of the things it may undo, or
         a URL would be the exception to "asked once". A settled age renders as
         a statement in the rebuilt questionnaire, which is the state worth
         previewing anyway. */
      [ASSESSMENT_KEY,DRAFT_KEY,'learningai-site-unlocked'].forEach(key=>localStorage.removeItem(key));
      previewParams.delete('audience'); const cleanQuery = previewParams.toString();
      history.replaceState(null,'',`${location.pathname}${cleanQuery?`?${cleanQuery}`:''}${location.hash}`);
    }
    if (!guardPrototypeRoute()) return;
    syncCanonicalNavigation(); syncCoreNavigation(); syncAdultsNavigation(); setupMobileNavigationMenu(); propagateReviewMode(); syncGreeting();
    if (location.pathname.endsWith('/adults.html') && !isAdult(savedAge())) {
      /* Only send someone to the questionnaire if the questionnaire is still
         owed. Someone who finished it and skipped the age question is not owed
         anything — onboarding.html would bounce them straight back out, and two
         redirects to reach one notice reads as a fault. */
      const destination = read(ASSESSMENT_KEY) || savedAge()
        ? './stage-1-navigation-proof.html?notice=adults'
        : './onboarding.html?notice=adults';
      location.replace(destination);
      return;
    }
    buildQuestionnaire(forceQuestionnairePreview);
    window.LearningAIAudience = { age:savedAge, isAdult:()=>isAdult(savedAge()), options:()=>AGE_OPTIONS.slice(),
    /* Asked once, then fixed. This used to be the API behind a "Change age
       answer" button; the button is gone and so is the capability, because a
       writable setter is the same thing as an editable age no matter which
       screen calls it. It still accepts a first answer, so a learner who
       skipped the question is not locked out of ever giving one. */
    isSettled:ageIsSettled,
    setAge(value){ return commitAge(value); },
    /* Re-asks the six questions. It does not clear the age: re-answering the
       starting questions is not a route to a second age answer. */
    reset(){ if(window.LearningAIReviewMode){ location.href='./onboarding.html?review=1'; return; } [ASSESSMENT_KEY,DRAFT_KEY,'learningai-site-unlocked'].forEach(key=>localStorage.removeItem(key)); location.href='./onboarding.html'; } };
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initializeAudience,{once:true}); else initializeAudience();
})();
