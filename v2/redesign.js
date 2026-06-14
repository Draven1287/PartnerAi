/* ============================================================
   Learning AI V2 — Redesign engine (framework-free port)

   Faithful vanilla-JS recreation of the Claude Design handoff
   "Learning AI V2 - Redesign.dc.html". The original prototype was
   authored with React.createElement on a proprietary design runtime;
   this port keeps the same state model and render logic but ships
   dependency-free to match the rest of the static site.

   Flow: account -> questionnaire -> dashboard (mosaic on top) ->
   lessons -> lesson (gated steps + step rail) -> done.
   Plus Settings, My Notes, About, Projects, Teaching AI.
   ============================================================ */
(function () {
  'use strict';

  // ---------- tiny hyperscript (replaces React.createElement) ----------
  const NS = 'http://www.w3.org/2000/svg';
  const SVG = new Set(['svg', 'path', 'rect', 'g', 'circle', 'line', 'polyline', 'polygon', 'ellipse']);
  const UNITLESS = new Set(['opacity', 'zIndex', 'fontWeight', 'lineHeight', 'flex', 'flexGrow', 'flexShrink', 'order', 'zoom', 'fillOpacity', 'strokeOpacity', 'tabSize', 'columnCount', 'animationIterationCount']);
  const ATTR_MAP = { autoComplete: 'autocomplete', tabIndex: 'tabindex', strokeWidth: 'stroke-width', strokeLinecap: 'stroke-linecap', strokeLinejoin: 'stroke-linejoin', htmlFor: 'for' };

  function applyStyle(el, style) {
    for (const k in style) {
      let v = style[k];
      if (v == null) continue;
      if (k.charAt(0) === '-' && k.charAt(1) === '-') { el.style.setProperty(k, v); continue; }
      if (typeof v === 'number' && !UNITLESS.has(k)) v = v + 'px';
      el.style[k] = v;
    }
  }

  function applyProps(el, props, isSvg) {
    for (const k in props) {
      const v = props[k];
      if (v == null || k === 'key') continue;
      if (k === 'style') { if (typeof v === 'object') applyStyle(el, v); continue; }
      if (k === 'className') { if (isSvg) el.setAttribute('class', v); else el.className = v; continue; }
      if (k.length > 2 && k.slice(0, 2) === 'on' && typeof v === 'function') {
        let evt;
        if (k === 'onClick') evt = 'click';
        else if (k === 'onChange') evt = (el.tagName === 'SELECT') ? 'change' : 'input';
        else evt = k.slice(2).toLowerCase();
        el.addEventListener(evt, v);
        continue;
      }
      if (k === 'value' || k === 'checked') { el[k] = v; continue; }
      if (k === 'disabled') { el.disabled = !!v; if (!v) el.removeAttribute('disabled'); continue; }
      el.setAttribute(ATTR_MAP[k] || k, v);
    }
  }

  function appendChildren(el, children) {
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      if (c == null || c === false || c === true) continue;
      if (Array.isArray(c)) { appendChildren(el, c); continue; }
      if (c instanceof Node) { el.appendChild(c); continue; }
      el.appendChild(document.createTextNode(String(c)));
    }
  }

  function h(tag, props) {
    const isSvg = SVG.has(tag);
    const el = isSvg ? document.createElementNS(NS, tag) : document.createElement(tag);
    const children = Array.prototype.slice.call(arguments, 2);
    appendChildren(el, children);
    if (props) applyProps(el, props, isSvg);
    return el;
  }

  // ---------- state ----------
  let state = {
    theme: 'light',
    fontScale: 'normal',     // normal | large | xl
    variant: 'arc',          // mosaic style: reveal | arc | hybrid
    reduceMotion: false,
    onboarded: false,
    email: '',
    name: '',
    view: 'account',         // account | questionnaire | dashboard | lessons | lesson | done | settings | about | projects | teaching | notes
    qIndex: 0, qAnswers: {}, qAge: '', qNote: {},
    completed: {},           // lessonNum -> true
    justFilled: null,
    savedNotes: [],          // [{ id, lesson, title, cardType, fields, ts }]
    idx: 0, sel: {}, passed: {}, note: '', pop: false
  };

  function setState(patch) {
    const next = (typeof patch === 'function') ? patch(state) : patch;
    state = Object.assign({}, state, next);
    render();
  }
  function go(view, extra) { setState(Object.assign({ view: view }, extra || {})); window.scrollTo(0, 0); }

  // ---------- data ----------
  const ARCS = [
    { name: 'Orientation', color: '#4257c9' },
    { name: 'Understanding', color: '#0e8fa0' },
    { name: 'Conversation', color: '#7c52cf' },
    { name: 'Judgment & Safety', color: '#cf5340' },
    { name: 'Applying', color: '#d57e22' },
    { name: 'Building', color: '#2f9c6a' }
  ];
  const IMG = 'sunrise-progress.png';
  const GATED = { classify: 1, workflowChain: 1, exitCheck: 1 };

  const AGES = [['', 'Choose age range'], ['under-13', 'Under 13'], ['13-15', '13-15'], ['16-18', '16-18'], ['19-24', '19-24'], ['25-34', '25-34'], ['35-49', '35-49'], ['50-plus', '50+'], ['prefer-not', 'Prefer not to say']];

  // display order per question so the strongest answer (orig index 3) is NOT always last.
  // values are original option indices; scoring uses the original index, not the slot.
  const QORDER = [[3, 1, 0, 2], [0, 3, 2, 1], [2, 0, 3, 1], [1, 2, 0, 3], [0, 3, 1, 2], [3, 0, 2, 1]];

  const QUESTIONS = [
    { key: 'definition', cat: 'Category 1', title: 'When someone says "AI," what do they mean?', copy: 'Pick the answer you could explain and use reliably right now.',
      options: ['A website that gives answers when you type questions.', 'A computer program that can copy human writing and conversation.', 'A trained model that finds patterns in data and uses those patterns to make predictions or decisions.', 'A family of systems: language models, image models, recommendation systems, robots, agents, and tools that can act across software.'] },
    { key: 'capability', cat: 'Category 2', title: 'What can modern AI systems actually do?', copy: 'Someone says, "AI is just a smarter search engine." What do you think?',
      options: ['That sounds right. It mostly finds information faster.', 'It can answer questions, write drafts, and summarize text.', 'It can explain, code, plan, translate, analyze images, simulate conversations, and help build tools.', 'It can become part of a workflow: using tools, calling APIs, checking files, running code, and coordinating multi-step work.'] },
    { key: 'limits', cat: 'Category 3', title: 'When should you slow down and check?', copy: 'An AI gives a confident answer about a medical, legal, or scientific fact. What would you actually do next?',
      options: ['Trust it if the answer sounds detailed.', 'Ask it again and see if it says the same thing.', 'Ask for sources, then check reliable sources yourself.', 'Treat it as a starting point, verify outside the model, and ask what evidence would change the answer.'] },
    { key: 'learning', cat: 'Category 4', title: 'How should you use AI without losing control?', copy: 'Pick what you would actually do when you are learning something new.',
      options: ['Let it do the main thinking so you can move faster.', 'Ask it to explain the answer in easier words.', 'Ask for hints, examples, and a check so you still do the important thinking.', 'Use it as a tutor, critic, and practice partner while protecting the skill you are building.'] },
    { key: 'impact', cat: 'Category 5', title: "How do you think about AI's real-world costs?", copy: 'Someone says, "AI has real environmental and social costs." What would you say back?',
      options: ['They are wrong. New technology always wins.', 'They are right. AI should probably be avoided.', 'The costs are real, but we should compare them with benefits and better infrastructure.', 'We should ask: which model, what task, how much energy, what alternative, what benefit, and who pays the cost?'] },
    { key: 'systems', cat: 'Category 6', title: 'What do you know beyond chatbots?', copy: 'What comes after typing questions into a chatbot?',
      options: ['Mostly better chatbots.', 'Tools that write, summarize, and search faster.', 'Personal tutors, coding helpers, research assistants, creative tools, and agents that use software.', 'AI systems connected to data, tools, robots, labs, simulations, businesses, and scientific workflows.'] }
  ];

  const LESSON = {
    arc: 'Orientation', arcIndex: 0, num: 1,
    title: 'Why AI matters — and why you stay in charge',
    coreQuestion: 'When should I use AI, and what do I keep deciding myself?',
    steps: [
      { kind: 'coldOpen', title: 'You see this every week',
        scenario: 'One friend uses AI and their grades go up. Another says AI is dangerous and refuses to touch it. A third uses it for literally everything. They are all talking at once.',
        prompt: 'Before reading on: in one sentence, what would YOUR rule be?' },
      { kind: 'classify', title: 'Sort these uses', prompt: 'Which of these keep you learning, and which quietly replace your thinking?',
        buckets: ['Keeps me thinking', 'Replaces my thinking'],
        items: [
          { text: 'Ask AI to explain a concept, then re-explain it back in your own words', answer: 0 },
          { text: 'Paste the homework question and copy the answer', answer: 1 },
          { text: 'Ask for 3 angles on an essay, then pick and argue one yourself', answer: 0 },
          { text: 'Let AI write the whole essay and submit it', answer: 1 }
        ],
        reveal: 'The line is not "AI or no AI." It is "did I still do the thinking that matters?"' },
      { kind: 'reveal', title: 'Agency is the real skill',
        body: 'AI is useful when a human keeps the goal, the method, and the verification. Speed is not the same as understanding.',
        mistake: 'Trusting a fluent answer because it sounds confident.',
        good: 'Use AI to improve your reasoning, and skip it when it tempts you to stop thinking.' },
      { kind: 'watch', title: 'Agency in 90 seconds', source: 'Explainer · 1:30',
        caption: 'A short visual: who keeps the goal, who does the middle, and who verifies before trusting.',
        takeaway: 'You start, AI helps in the middle, you verify and finish.' },
      { kind: 'tryLive', title: 'Try it for real',
        prompt: 'I am deciding when AI helps me without replacing my thinking. Give me 5 useful use cases and 5 risky shortcuts for someone like me. For each risky shortcut, add one question I should ask myself before using it.',
        note: 'Run this in any free AI tool, then keep the 5 risky ones near your desk.' },
      { kind: 'workflowChain', title: 'Build the stay-in-charge routine',
        goal: 'You are stuck on a hard homework problem and want AI help without handing over your thinking.',
        correct: ['Try the problem yourself first, even badly', 'Ask AI to explain only the part you are stuck on', 'Re-explain the idea back in your own words', 'Check the answer against your notes or textbook', 'Write the final answer yourself'],
        note: 'Notice who starts and who finishes: you do. AI only helps in the middle, and you verify before you trust.' },
      { kind: 'toolkitSave', title: 'Save your agency rule', cardType: 'Agency rule',
        fields: [
          { key: 'help', label: 'I want AI to help me…', placeholder: 'draft, explain, brainstorm…' },
          { key: 'never', label: 'I will not let AI decide…', placeholder: 'what I actually believe' },
          { key: 'check', label: 'Before I trust it, I will check…', placeholder: 'one source / my own attempt' }
        ] },
      { kind: 'exitCheck', title: 'Quick check', question: 'Which is the strongest reason to keep a human in charge?',
        options: [
          { text: 'AI handles routine stuff fine, so a human mostly needs to step in on the genuinely hard questions', ok: false, feedback: "You often can't tell in advance which question is the hard one." },
          { text: 'A fluent answer can still be wrong or low-value', ok: true, feedback: 'Exactly. Confidence is not proof.' },
          { text: 'Teachers and parents are still uncomfortable with AI, so it is safer to keep a person visibly involved', ok: false, feedback: "That's about how it looks to other people, not about quality." }
        ] }
    ]
  };

  const KIND = {
    coldOpen: { label: 'Cold open', icon: 'msg' }, classify: { label: 'Sort it', icon: 'cols' },
    reveal: { label: 'Key idea', icon: 'bulb' }, watch: { label: 'Watch', icon: 'play' },
    tryLive: { label: 'Try it for real', icon: 'spark' }, workflowChain: { label: 'Build a workflow', icon: 'flow' },
    toolkitSave: { label: 'Save it · optional', icon: 'save' }, exitCheck: { label: 'Quick check', icon: 'check' }
  };

  // ---------- helpers ----------
  function arc() { return ARCS[LESSON.arcIndex].color; }
  function ix(i) { return state.sel[i] || {}; }
  function setIx(i, patch) { setState(s => ({ sel: Object.assign({}, s.sel, { [i]: Object.assign({}, s.sel[i] || {}, patch) }) })); }
  function doneCount() { return Object.values(state.completed).filter(Boolean).length; }

  function icon(name) {
    const P = {
      msg: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
      cols: 'M4 5h6v14H4zM14 5h6v14h-6z',
      bulb: 'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.5.6 1 1.5 1 3h6c0-1.5.5-2.4 1-3a7 7 0 0 0-4-12z',
      play: 'M6 4l13 8-13 8z',
      spark: 'M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4zM19 14l.9 2.3L22 17l-2.1.7L19 20l-.9-2.3L16 17l2.1-.7z',
      flow: 'M4 6h.01M4 12h.01M4 18h.01M9 6h11M9 12h11M9 18h11',
      save: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
      check: 'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3',
      copy: 'M9 9h10v10H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1',
      arrow: 'M5 12h14M13 5l7 7-7 7', back: 'M19 12H5M11 19l-7-7 7-7',
      lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
      sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
      shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'
    };
    return h('svg', { viewBox: '0 0 24 24', width: 18, height: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', style: { display: 'block' } }, h('path', { d: P[name] || '' }));
  }

  // ---------- mosaic ----------
  function tileStyle(i, filled, variant) {
    const col = i % 6, row = Math.floor(i / 6), arcCol = ARCS[Math.floor(i / 5)].color;
    if (filled && (variant === 'reveal' || variant === 'hybrid')) return { backgroundImage: `url("${IMG}")`, backgroundSize: '600% 500%', backgroundPosition: `calc(${col} * 20%) calc(${row} * 25%)`, borderColor: 'rgba(20,16,8,.28)' };
    if (filled && variant === 'arc') return { background: arcCol, borderColor: `color-mix(in srgb, ${arcCol} 60%, #000)`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${arcCol} 30%, transparent)` };
    if (variant === 'hybrid') return { background: `color-mix(in srgb, ${arcCol} 14%, var(--surface-2))`, borderColor: `color-mix(in srgb, ${arcCol} 22%, var(--border))` };
    return { background: 'var(--surface-2)', borderColor: `color-mix(in srgb, ${arcCol} 26%, var(--border))` };
  }
  function mosaic(fillCount, variant, justIdx, cls) {
    const tiles = [];
    for (let i = 0; i < 30; i++) {
      const filled = i < fillCount;
      tiles.push(h('div', { key: i, className: 'mtile' + (filled ? ' filled' : '') + (i === justIdx ? ' justfill' : ''), style: tileStyle(i, filled, variant),
        title: `Lesson ${i + 1} · ${ARCS[Math.floor(i / 5)].name}${filled ? ' ✓' : ''}` }, h('span', { className: 'n' }, String(i + 1))));
    }
    return h('div', { className: 'mos' + (cls ? ' ' + cls : '') }, tiles);
  }

  // ---------- top nav ----------
  function brandMark() {
    const cells = [
      [0, 0, 'a'], [1, 0, 'g'], [2, 0, 'f'],
      [0, 1, 'g'], [1, 1, 'a'], [2, 1, 'a'],
      [0, 2, 'f'], [1, 2, 'a'], [2, 2, 'g']
    ];
    const fill = { a: 'currentColor', g: '#e7a44d', f: 'rgba(255,255,255,.35)' };
    const s = 6.4, gap = 1.4, o = 2.2;
    return h('svg', { viewBox: '0 0 24 24', width: 18, height: 18, style: { display: 'block', color: '#2b2350' } },
      cells.map(([cx, cy, t], k) => h('rect', { key: k, x: o + cx * (s + gap), y: o + cy * (s + gap), width: s, height: s, rx: 1.7, fill: fill[t] })));
  }

  function nav() {
    const tabs = [['dashboard', 'Dashboard'], ['lessons', 'Lessons'], ['notes', 'My Notes'], ['settings', 'Settings'], ['about', 'About'], ['projects', 'Projects'], ['teaching', 'Teaching AI']];
    const v = state.view;
    const inApp = state.onboarded;
    const isActive = (k) => v === k || (k === 'lessons' && (v === 'lesson' || v === 'done'));
    return h('div', { className: 'topnav' }, h('div', { className: 'topnav-in' },
      h('button', { className: 'brand', style: { border: 0, background: 'transparent', cursor: 'pointer', font: 'inherit', padding: 0, color: 'var(--text)' }, onClick: () => inApp && go('dashboard') },
        h('span', { className: 'spark' }, brandMark()),
        h('span', null, 'Learning ', h('b', null, 'AI'))),
      inApp ? h('nav', { className: 'tabs' }, tabs.map(([k, l]) => h('button', { key: k, className: 'tab' + (isActive(k) ? ' on' : ''), onClick: () => go(k, k === 'lessons' || k === 'dashboard' ? {} : null) }, l))) : null,
      h('div', { className: 'nav-spacer' }),
      h('div', { className: 'ctrl' },
        h('label', null, 'Theme'),
        h('div', { className: 'seg' }, [['light', 'Light'], ['dark', 'Dark'], ['sepia', 'Sepia'], ['contrast', 'Contrast']].map(([val, l]) =>
          h('button', { key: val, className: state.theme === val ? 'on' : '', onClick: () => setState({ theme: val }) }, l)))),
      inApp ? h('button', { className: 'linkbtn', onClick: () => go('account', { onboarded: false, completed: {}, qAnswers: {}, qIndex: 0, qAge: '', savedNotes: [] }) }, 'Restart') : null
    ));
  }

  // ---------- onboarding: account ----------
  function accountView() {
    return h('div', { className: 'lp-canvas', 'data-screen-label': 'Account' }, h('div', { className: 'onb' },
      h('div', { className: 'onb-card' },
        h('div', { className: 'kicker' }, 'Learning AI · Step 1 of 2'),
        h('h1', null, 'Sign in to save your progress'),
        h('p', { className: 'lead' }, 'We use your email only to sign you in and save your progress. We will not send ads. We will not ask you for money. We will not sell your information.'),
        h('div', { className: 'fields' },
          h('label', { className: 'field' }, h('span', null, 'Email'), h('input', { type: 'email', 'data-fkey': 'acc-email', placeholder: 'you@school.edu', autoComplete: 'email', value: state.email, onChange: (e) => setState({ email: e.target.value }) })),
          h('label', { className: 'field' }, h('span', null, 'Password'), h('input', { type: 'password', 'data-fkey': 'acc-pass', placeholder: 'At least 8 characters', autoComplete: 'current-password' })),
          h('label', { className: 'field' }, h('span', null, 'Display name'), h('input', { type: 'text', 'data-fkey': 'acc-name', placeholder: 'Required when creating an account', value: state.name || '', onChange: (e) => setState({ name: e.target.value }) }))),
        h('div', { className: 'onb-actions' },
          h('button', { className: 'btn btn-primary', onClick: () => go('questionnaire', { email: state.email || 'you@school.edu' }) }, 'Create account'),
          h('button', { className: 'btn btn-ghost', onClick: () => go('questionnaire', { email: state.email || 'you@school.edu' }) }, 'Sign in')),
        h('div', { className: 'privacy-note' }, h('span', { className: 'ic', style: { width: 18, height: 18 } }, icon('shield')),
          h('span', null, 'Each email creates its own learner account. To switch learners, sign out and use a different email.')),
        h('p', { className: 'fine' }, 'Demo: either button takes you to the questionnaire — no real account is created.'))));
  }

  // ---------- onboarding: questionnaire ----------
  function qLevel() {
    const vals = QUESTIONS.map(q => state.qAnswers[q.key]).filter(v => v != null);
    if (!vals.length) return null;
    const pct = Math.round(vals.reduce((a, b) => a + b, 0) / (QUESTIONS.length * 3) * 100);
    return { pct, label: pct < 45 ? 'Foundation' : pct < 75 ? 'Explorer' : 'Builder' };
  }
  function questionnaireView() {
    const i = state.qIndex, total = QUESTIONS.length, q = QUESTIONS[i];
    const sel = state.qAnswers[q.key];
    const order = QORDER[i];
    const opts = order.map((origIdx, d) => h('button', { key: origIdx, role: 'radio', 'aria-checked': sel === origIdx, className: 'qopt' + (sel === origIdx ? ' sel' : ''), onClick: () => setState(s => ({ qAnswers: Object.assign({}, s.qAnswers, { [q.key]: origIdx }) })) },
      h('span', { className: 'dot' }), h('span', null, h('span', { className: 'num' }, String.fromCharCode(65 + d) + '.  '), q.options[origIdx])));
    const needAge = i === 0 && !state.qAge;
    const age = i === 0 ? h('div', { className: 'age-card' + (needAge ? ' need' : '') + (state.qAge ? ' done' : '') },
      h('div', { className: 'age-top' },
        h('span', { className: 'age-step' }, state.qAge ? '✓' : '1'),
        h('span', { className: 'age-label' }, 'Choose your age range'),
        h('span', { className: 'age-req' }, state.qAge ? 'Set' : 'Required')),
      h('p', { className: 'age-hint' }, 'This tailors examples and reading level to you. We never share it.'),
      h('select', { value: state.qAge, onChange: (e) => setState({ qAge: e.target.value }) }, AGES.map(([v, l]) => h('option', { key: v, value: v }, l)))) : null;
    const canNext = sel != null && (i !== 0 || state.qAge);
    const blockReason = sel == null ? 'Pick an answer to continue' : needAge ? 'Choose your age range above to continue' : null;
    const last = i === total - 1;
    return h('div', { className: 'lp-canvas', 'data-screen-label': 'Questionnaire' }, h('div', { className: 'onb wide' },
      h('div', { className: 'onb-card' },
        h('div', { className: 'q-prog' },
          h('div', { className: 'lab' }, h('span', null, `${q.cat} of 6`), h('span', null, 'Diagnostic')),
          h('div', { className: 'track' }, h('div', { className: 'fill', style: { width: `${Math.round((i + 1) / total * 100)}%` } }))),
        h('div', { className: 'kicker' }, 'Set your starting point'),
        h('h1', { className: 'q-title' }, q.title),
        h('p', { className: 'q-copy' }, q.copy),
        age,
        h('div', { className: 'qopts', role: 'radiogroup', 'aria-label': 'Answer choices' }, opts),
        h('textarea', { className: 'q-note', 'data-fkey': 'qnote', placeholder: 'Optional: add nuance in your own words.', value: state.qNote[q.key] || '', onChange: (e) => setState(s => ({ qNote: Object.assign({}, s.qNote, { [q.key]: e.target.value }) })) }),
        h('div', { className: 'q-actions' },
          h('button', { className: 'btn btn-ghost', disabled: i === 0, style: i === 0 ? { opacity: .4, cursor: 'default' } : null, onClick: () => i > 0 && setState({ qIndex: i - 1 }) }, 'Back'),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', justifyContent: 'flex-end' } },
            blockReason ? h('span', { className: 'block-reason' }, h('span', { style: { width: 14, height: 14, display: 'inline-flex' } }, icon('lock')), blockReason) : null,
            h('button', { className: 'btn btn-primary', disabled: !canNext, style: !canNext ? { opacity: .5, cursor: 'not-allowed' } : null,
              onClick: () => { if (!canNext) return; if (last) go('dashboard', { onboarded: true }); else setState({ qIndex: i + 1 }); } },
              last ? 'Finish and open dashboard' : 'Next category'))))));
  }

  // ---------- dashboard ----------
  function dashboardView() {
    const done = doneCount(); const pct = Math.round(done / 30 * 100); const lvl = qLevel();
    const caps = ['Your canvas is waiting. Finish a lesson to uncover the first square.', 'The night is starting to lift.', 'The horizon is glowing now.', 'Almost there — the sun is breaking through.', 'Complete. A whole sunrise, earned one lesson at a time.'];
    const cap = done === 0 ? caps[0] : caps[Math.min(4, Math.max(1, Math.round(done / 7.5)))];
    const legend = h('div', { className: 'legend' }, ARCS.map((a, k) => {
      const c = Math.max(0, Math.min(5, done - k * 5));
      return h('div', { key: k, className: 'legend-row' }, h('span', { className: 'ld', style: { background: a.color } }), h('span', null, a.name), h('span', { className: 'lc' }, `${c}/5`));
    }));
    const arcBars = h('div', { className: 'arc-bars' }, ARCS.map((a, k) => {
      const c = Math.max(0, Math.min(5, done - k * 5));
      return h('div', { key: k, className: 'arc-bar' },
        h('div', { className: 'top' }, h('span', null, a.name), h('span', { className: 'c' }, `${c}/5`)),
        h('div', { className: 'track' }, h('div', { className: 'fill', style: { width: `${c / 5 * 100}%`, background: a.color } })));
    }));
    return h('div', { className: 'lp-canvas', 'data-screen-label': 'Dashboard' },
      h('div', { className: 'view-head' },
        h('div', { className: 'kicker' }, lvl ? `Your level · ${lvl.label}` : 'Welcome'),
        h('h1', null, done === 0 ? "You're all set. Let's begin." : 'Welcome back.'),
        h('p', null, 'Every lesson you finish uncovers one square of a sunrise. Six arcs, thirty lessons, one picture you paint by learning.')),
      h('div', { className: 'mos-hero' }, h('div', { className: 'mos-hero-grid' },
        h('div', null, mosaic(done, state.variant, state.justFilled)),
        h('div', { className: 'mos-side' },
          h('div', { className: 'kicker' }, 'Progress mosaic'),
          h('h2', null, `${done} of 30 squares filled`),
          h('p', { className: 'mos-cap' }, cap),
          h('div', { className: 'mos-meter' },
            h('div', { className: 'track' }, h('div', { className: 'fill', style: { width: `${pct}%` } })),
            h('div', { className: 'lab' }, h('span', null, `${done}/30 lessons`), h('span', null, `${pct}%`))),
          legend))),
      h('div', { className: 'stat-row' },
        h('div', { className: 'stat' }, h('strong', null, String(done)), h('span', null, 'squares revealed')),
        h('div', { className: 'stat' }, h('strong', null, `${pct}%`), h('span', null, 'course complete')),
        h('div', { className: 'stat' }, h('strong', null, lvl ? lvl.label : '—'), h('span', null, 'diagnostic level')),
        h('button', { className: 'stat', style: { border: 'var(--bw) solid var(--border)', cursor: 'pointer', textAlign: 'left', font: 'inherit', color: 'var(--text)' }, onClick: () => go('notes') }, h('strong', null, String(state.savedNotes.length)), h('span', null, 'saved notes'))),
      h('div', { className: 'dash-cols' },
        h('div', { className: 'panel continue-card' },
          h('h2', null, 'Continue learning'),
          h('div', { className: 'lessonref' },
            h('span', { className: 'lnum', style: { background: arc() } }, String(LESSON.num)),
            h('div', null, h('div', { style: { fontWeight: 600 } }, LESSON.title), h('div', { className: 'muted', style: { fontSize: '13px' } }, `${LESSON.arc} · ~8 min`))),
          h('button', { className: 'btn btn-primary', onClick: () => go('lesson', { idx: 0, sel: {}, passed: {} }) }, done === 0 ? 'Start Lesson 1' : 'Open next lesson', h('span', { style: { width: 16, height: 16 } }, icon('arrow'))),
          h('button', { className: 'btn btn-ghost', onClick: () => go('lessons') }, 'Browse all 30 lessons')),
        h('div', { className: 'panel' },
          h('h2', null, 'Your six arcs'),
          h('p', { className: 'sub' }, 'Each arc is five lessons. Fill an arc to complete a band of the picture.'),
          arcBars)));
  }

  // ---------- lessons catalog ----------
  function lessonsView() {
    const done = doneCount();
    const secs = ARCS.map((a, ai) => {
      const rows = [];
      for (let n = ai * 5 + 1; n <= ai * 5 + 5; n++) {
        const isDone = !!state.completed[n];
        const isNext = !isDone && n === done + 1;
        const playable = n === 1; // only Lesson 1 is wired in this demo
        rows.push(h('button', { key: n, className: 'ltile' + (isDone ? ' done' : ''),
          onClick: () => playable ? go('lesson', { idx: 0, sel: {}, passed: {} }) : null,
          style: !playable ? { opacity: .66 } : null },
          h('span', { className: 'lnum', style: isDone ? null : (isNext ? { background: 'var(--accent-soft)', color: 'var(--accent)' } : null) }, isDone ? '✓' : String(n)),
          h('span', null,
            h('div', { className: 'lt-title' }, n === 1 ? LESSON.title : `Lesson ${n}`),
            h('div', { className: 'lt-q' }, n === 1 ? LESSON.coreQuestion : `${a.name} · part of the ${a.name.toLowerCase()} arc`)),
          h('span', { className: 'lt-act' + (isNext ? ' next' : '') }, isDone ? 'Review' : playable ? (isNext ? 'Start' : 'Open') : 'Soon')));
      }
      return h('section', { key: ai, className: 'arc-sec' },
        h('div', { className: 'arc-head' },
          h('span', { className: 'arc-tag', style: { color: a.color, background: `color-mix(in srgb, ${a.color} 14%, transparent)` } }, `Arc ${ai + 1}`),
          h('h2', null, a.name),
          h('span', { className: 'ac' }, `${Math.max(0, Math.min(5, done - ai * 5))}/5 complete`)),
        h('div', { className: 'ltiles' }, rows));
    });
    return h('div', { className: 'lp-canvas', 'data-screen-label': 'Lessons' },
      h('div', { className: 'view-head' }, h('div', { className: 'kicker' }, '30 lessons · 6 arcs'), h('h1', null, 'All lessons'),
        h('p', null, 'Work straight through, or jump to the arc you need. In this prototype, Lesson 1 is fully playable.')),
      secs);
  }

  // ---------- lesson interaction renderers ----------
  function pass(i) { setState(s => ({ passed: Object.assign({}, s.passed, { [i]: true }), pop: true })); setTimeout(() => setState({ pop: false }), 600); }
  function unlocked(i) { const s = LESSON.steps[i]; return !GATED[s.kind] || !!state.passed[i]; }
  function saveNote(i, s) {
    const vals = ix(i).vals || {};
    const fields = s.fields.map(f => ({ label: f.label, value: (vals[f.key] || '').trim() })).filter(f => f.value);
    const noteId = `${LESSON.num}-${i}`;
    setState(st => {
      const rest = st.savedNotes.filter(n => n.id !== noteId);
      return { savedNotes: [{ id: noteId, lesson: LESSON.num, lessonTitle: LESSON.title, arc: LESSON.arc, arcIndex: LESSON.arcIndex, cardType: s.cardType || 'Note', fields, ts: 'Just now' }].concat(rest) };
    });
    setIx(i, { saved: true });
  }

  function renderStep(s, i) {
    const head = (extra) => [
      h('span', { className: 'kind' }, h('span', { className: 'ic' }, icon(KIND[s.kind].icon)), KIND[s.kind].label),
      h('h2', { className: 'ctitle' }, s.title)].concat(extra);
    const turn = (txt) => h('div', { className: 'turn' }, h('span', { className: 'pulse' }), txt);

    if (s.kind === 'coldOpen') return head([h('p', { className: 'scenario' }, s.scenario), h('p', { className: 'lead-q' }, s.prompt)]);
    if (s.kind === 'reveal') return head([h('p', { className: 'body', style: { fontSize: '18px' } }, s.body),
      s.mistake ? h('div', { className: 'callout bad' }, h('b', null, 'Common mistake: '), s.mistake) : null,
      s.good ? h('div', { className: 'callout good' }, h('b', null, 'Better: '), s.good) : null]);
    if (s.kind === 'watch') {
      const ixs = ix(i);
      return head([
        h('div', { className: 'video-frame' + (ixs.playing ? ' playing' : ''), role: 'button', tabIndex: 0, 'aria-pressed': !!ixs.playing, onClick: () => setIx(i, { playing: !ixs.playing }),
          onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); setIx(i, { playing: !ixs.playing }); } } },
          h('div', { className: 'play' }, h('span', { style: { width: 26, height: 26 } }, icon('play'))),
          h('span', { className: 'vbadge' }, 'Video placeholder'),
          h('span', { className: 'vlabel' }, ixs.playing ? 'Playing… (embed a real video here)' : s.source)),
        h('p', { className: 'muted', style: { marginTop: '14px' } }, s.caption),
        h('div', { className: 'callout good' }, h('b', null, 'Takeaway: '), s.takeaway)
      ]);
    }
    if (s.kind === 'tryLive') {
      const ixs = ix(i);
      return head([h('div', { className: 'promptbox' }, s.prompt),
        h('button', { className: 'btn btn-primary', style: { fontSize: '14px', padding: '11px 18px' }, onClick: () => { if (navigator.clipboard) navigator.clipboard.writeText(s.prompt).catch(() => {}); setIx(i, { copied: true }); setTimeout(() => setIx(i, { copied: false }), 1600); } },
          h('span', { style: { width: 15, height: 15 } }, icon('copy')), ixs.copied ? 'Copied ✓' : 'Copy prompt'),
        s.note ? h('p', { className: 'muted', style: { marginTop: '14px' } }, s.note) : null]);
    }
    if (s.kind === 'classify') {
      const ixs = ix(i), doneR = ixs.done || {}, wrong = ixs.wrong;
      const rows = s.items.map((item, ri) => { const isDone = doneR[ri];
        return h('div', { key: ri, className: 'clf-row' + (isDone ? ' right' : '') + (wrong === ri ? ' wrong' : '') },
          h('span', { className: 'clf-text' }, item.text),
          h('div', { className: 'chips' }, s.buckets.map((b, bi) => h('button', { key: bi, disabled: !!isDone, className: 'chip' + (isDone && bi === item.answer ? ' right' : '') + (isDone && bi !== item.answer ? ' dim' : ''),
            onClick: () => { if (doneR[ri]) return;
              if (bi === item.answer) { const nd = Object.assign({}, doneR, { [ri]: true }); const all = Object.keys(nd).length === s.items.length; setIx(i, { done: nd, wrong: null, fb: all ? '✓ ' + s.reveal : null, fbok: all }); if (all) pass(i); }
              else { setIx(i, { wrong: ri, fb: `Not quite — that belongs in "${s.buckets[item.answer]}." Try that row again.`, fbok: false }); setTimeout(() => setIx(i, { wrong: null }), 500); } } }, b))));
      });
      return head([h('p', { className: 'muted' }, s.prompt), turn('Sort every row to continue'), h('div', { className: 'clf' }, rows), ixs.fb ? h('p', { className: 'fb ' + (ixs.fbok ? 'ok' : 'no') }, ixs.fb) : null]);
    }
    if (s.kind === 'exitCheck') {
      const ixs = ix(i), wrongSet = ixs.wrongSet || {}, won = ixs.won;
      const opts = s.options.map((o, oi) => { const isWrong = wrongSet[oi], isRight = won && o.ok;
        return h('button', { key: oi, disabled: won || isWrong, className: 'opt' + (isRight ? ' right' : '') + (isWrong ? ' wrong' : ''),
          onClick: () => { if (won) return; if (o.ok) { setIx(i, { won: true, fb: '✓ ' + o.feedback, fbok: true }); pass(i); } else { setIx(i, { wrongSet: Object.assign({}, wrongSet, { [oi]: true }), fb: '✗ ' + o.feedback, fbok: false }); } } },
          h('span', { className: 'mark' }, isRight ? icon('check') : null), o.text);
      });
      return head([h('p', { className: 'body' }, s.question), turn('Pick the right answer to continue'), h('div', { className: 'opts' }, opts), ixs.fb ? h('p', { className: 'fb ' + (ixs.fbok ? 'ok' : 'no') }, ixs.fb) : null]);
    }
    if (s.kind === 'workflowChain') {
      const ixs = ix(i), picked = ixs.picked || [], wrong = ixs.wrong;
      const remaining = s.correct.filter(c => !picked.includes(c)).sort();
      const chips = remaining.map((c) => h('button', { key: c, className: 'chip' + (wrong === c ? ' wrong' : ''),
        onClick: () => { const expected = s.correct[picked.length];
          if (c === expected) { const np = picked.concat([c]); const all = np.length === s.correct.length; setIx(i, { picked: np, wrong: null, fb: all ? '✓ ' + s.note : `Good. Now pick step ${np.length + 1}.`, fbok: true }); if (all) pass(i); }
          else { setIx(i, { wrong: c, fb: `Not yet — before "${c}", you need "${expected}."`, fbok: false }); setTimeout(() => setIx(i, { wrong: null }), 500); } } }, c));
      return head([h('div', { className: 'callout' }, h('b', null, 'Goal: '), s.goal), turn('Put the steps in the safest order'),
        h('div', { className: 'wf-pick' }, chips.length ? chips : h('span', { className: 'muted' }, 'All placed ✓')),
        picked.length ? h('ol', { className: 'wf-list' }, picked.map((p, pi) => h('li', { key: pi }, p))) : null,
        ixs.fb ? h('p', { className: 'fb ' + (ixs.fbok ? 'ok' : 'no') }, ixs.fb) : null]);
    }
    if (s.kind === 'toolkitSave') {
      const ixs = ix(i), vals = ixs.vals || {};
      return head([h('div', { className: 'callout' }, h('b', null, 'Optional — '), 'this is your notebook, not a test. Saving is never required to move on.'),
        h('div', { className: 'fields' }, s.fields.map((f) => h('label', { key: f.key, className: 'field2' }, h('span', null, f.label),
          h('input', { type: 'text', 'data-fkey': `tk-${i}-${f.key}`, placeholder: f.placeholder, value: vals[f.key] || '', onChange: (e) => setIx(i, { vals: Object.assign({}, vals, { [f.key]: e.target.value }) }) })))),
        h('div', { style: { marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' } },
          h('button', { className: 'btn btn-primary', style: { fontSize: '14px', padding: '11px 18px' }, onClick: () => saveNote(i, s) }, ixs.saved ? 'Update my note' : 'Save to my notes'),
          ixs.saved ? h('span', { className: 'fb ok', style: { margin: 0 } }, 'Saved to My Notes ✓') : null)]);
    }
    return head([]);
  }

  function lessonView() {
    const L = LESSON, i = state.idx, s = L.steps[i], A = arc(), total = L.steps.length, last = i === total - 1, unlock = unlocked(i);
    const rail = h('div', { className: 'rail' }, L.steps.map((st, k) => h('div', { key: k, className: 'rstep' + (k === i ? ' active' : '') + (k < i ? ' past' : ''), style: k === i ? { '--arc': A } : null },
      h('span', { className: 'ix' }, k < i ? '✓' : String(k + 1)), h('span', null, KIND[st.kind].label))));
    let hint = null;
    if (GATED[s.kind] && !unlock) { let cnt = ''; const ixs = ix(i);
      if (s.kind === 'classify') cnt = `${Object.keys(ixs.done || {}).length} of ${s.items.length}`;
      if (s.kind === 'workflowChain') cnt = `${(ixs.picked || []).length} of ${s.correct.length}`;
      hint = h('div', { className: 'lockhint' }, h('span', { style: { width: 14, height: 14 } }, icon('lock')),
        cnt ? h('span', null, 'Complete ', h('span', { className: 'cnt' }, cnt), ' to unlock Next') : 'Finish this step to unlock Next');
    }
    const nextBtn = h('button', { className: 'btn ' + (unlock ? 'btn-primary' : 'btn-locked') + (state.pop ? ' pop' : ''), disabled: !unlock,
      'aria-label': unlock ? null : 'Next — locked until you finish this step',
      onClick: () => { if (!unlock) return; if (last) { setState(st => ({ completed: Object.assign({}, st.completed, { [L.num]: true }), justFilled: L.num - 1 })); go('done'); } else setState({ idx: i + 1 }); } },
      last ? 'Finish lesson ✓' : 'Next', last ? null : h('span', { style: { width: 16, height: 16 } }, icon('arrow')));
    const backBtn = h('button', { className: 'btn btn-ghost', onClick: () => i > 0 ? setState({ idx: i - 1 }) : go('lessons') },
      h('span', { style: { width: 16, height: 16 } }, icon('back')), i > 0 ? 'Back' : 'All lessons');
    const card = h('div', { className: 'card', style: { '--arc': A } }, renderStep(s, i));
    const notebook = h('aside', { className: 'nb' }, h('h3', null, 'Lesson notebook'),
      h('p', null, 'Margin notes, just for you. Autosaves — never required to move on.'),
      h('textarea', { 'data-fkey': 'lesson-note', placeholder: 'Write anything you want to remember…', value: state.note, onChange: (e) => setState({ note: e.target.value }) }),
      state.note.trim() ? h('p', { className: 'st' }, 'Autosaved to your notes') : null);
    return h('div', { className: 'lp-canvas', 'data-screen-label': 'Lesson' },
      h('header', { className: 'lh' },
        h('div', { className: 'lh-strip', style: { background: A } }),
        h('div', { className: 'crumb' }, h('span', { style: { color: A } }, L.arc), h('span', null, '·'), h('span', null, `Lesson ${L.num} of 30`), h('span', null, '·'), h('span', null, `Step ${i + 1} of ${total}`)),
        h('h1', { className: 'lh-title' }, L.title),
        h('p', { className: 'coreq' }, L.coreQuestion), rail),
      h('div', { className: 'ws' },
        h('div', null, card, h('div', { className: 'nav' }, backBtn, h('div', { style: { textAlign: 'right' } }, nextBtn, hint))), notebook));
  }

  function doneView() {
    const done = doneCount();
    return h('div', { className: 'lp-canvas', 'data-screen-label': 'Lesson complete' }, h('div', { className: 'done' },
      h('div', { className: 'kick kicker' }, 'Lesson complete'),
      h('h1', null, done <= 1 ? 'First light.' : 'Another square filled.'),
      h('p', { className: 'sub' }, `You uncovered square ${done} of 30. Keep going and the whole sunrise comes into focus.`),
      h('div', { className: 'done-mos' }, mosaic(done, state.variant, state.justFilled)),
      h('div', { className: 'row' },
        h('button', { className: 'btn btn-primary', onClick: () => go('lessons') }, 'Next lesson', h('span', { style: { width: 16, height: 16 } }, icon('arrow'))),
        h('button', { className: 'btn btn-ghost', onClick: () => go('dashboard') }, 'Back to dashboard'))));
  }

  // ---------- settings ----------
  function settingsView() {
    const seg = (opts, cur, fn) => h('div', { className: 'seg' }, opts.map(([v, l]) => h('button', { key: v, className: cur === v ? 'on' : '', onClick: () => fn(v) }, l)));
    const sw = (on, fn) => h('div', { className: 'sw' + (on ? ' on' : ''), role: 'switch', 'aria-checked': on, tabIndex: 0, onClick: fn,
      onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); fn(); } } }, h('div', { className: 'knob' }));
    return h('div', { className: 'lp-canvas', 'data-screen-label': 'Settings' },
      h('div', { className: 'view-head' }, h('div', { className: 'kicker' }, 'Your account & appearance'), h('h1', null, 'Settings'),
        h('p', null, 'Everything here is saved on this device. Your sign-in email is only used to save your progress.')),
      h('div', { className: 'set-grid' },
        h('div', { className: 'set-card' }, h('h2', null, 'Account'), h('p', { className: 'sub' }, 'Your email signs you in and saves progress across devices. We never sell it or send ads.'),
          h('div', { className: 'set-row' }, h('span', null, 'Signed in as'), h('span', { className: 'muted', style: { fontWeight: 600 } }, state.email || 'you@school.edu')),
          h('div', { className: 'set-row' }, h('span', null, 'Diagnostic level'), h('span', { className: 'muted' }, qLevel() ? qLevel().label : 'Not taken yet')),
          h('div', { style: { display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' } },
            h('button', { className: 'btn btn-ghost', onClick: () => go('questionnaire', { qIndex: 0 }) }, 'Retake diagnostic'),
            h('button', { className: 'btn btn-ghost', onClick: () => go('account', { onboarded: false, completed: {}, savedNotes: [], qAnswers: {}, qIndex: 0, qAge: '', email: '' }) }, 'Sign out'))),
        h('div', { className: 'set-card' }, h('h2', null, 'Color theme'), h('p', { className: 'sub' }, 'Four full themes — light, dark, sepia, and high-contrast. (Today\'s V2 only ships light and dark.)'),
          h('div', { className: 'set-row' }, h('span', null, 'Theme'), seg([['light', 'Light'], ['dark', 'Dark'], ['sepia', 'Sepia'], ['contrast', 'Contrast']], state.theme, v => setState({ theme: v })))),
        h('div', { className: 'set-card' }, h('h2', null, 'Text size'), h('p', { className: 'sub' }, 'Scales the reading area for younger or low-vision learners.'),
          h('div', { className: 'set-row' }, h('span', null, 'Reading size'), seg([['normal', 'Normal'], ['large', 'Large'], ['xl', 'Extra large']], state.fontScale, v => setState({ fontScale: v }))),
          h('p', { className: 'body', style: { margin: '14px 0 0' } }, 'The quick brown fox jumps. This sentence resizes as you change the setting.')),
        h('div', { className: 'set-card' }, h('h2', null, 'Progress mosaic style'), h('p', { className: 'sub' }, 'How completed squares look. Arc fills each square with its arc colour; Reveal uncovers a sunrise; Hybrid does both.'),
          h('div', { className: 'set-row' }, h('span', null, 'Fill style'), seg([['arc', 'Arc'], ['reveal', 'Reveal'], ['hybrid', 'Hybrid']], state.variant, v => setState({ variant: v }))),
          mosaic(11, state.variant, -1, 'mini-mos')),
        h('div', { className: 'set-card' }, h('h2', null, 'Motion'), h('p', { className: 'sub' }, 'Turn off the fill animations and pulses if movement is distracting.'),
          h('div', { className: 'set-row' }, h('span', null, 'Reduce motion'), sw(state.reduceMotion, () => setState(s => ({ reduceMotion: !s.reduceMotion }))))),
        h('div', { className: 'set-card' }, h('h2', null, 'Your notes'), h('p', { className: 'sub' }, 'Everything you save in a lesson lives in My Notes — your private toolkit.'),
          h('div', { className: 'set-row' }, h('span', null, 'Saved notes'), h('span', { className: 'muted' }, `${state.savedNotes.length} saved`)),
          h('button', { className: 'btn btn-ghost', style: { marginTop: '14px' }, onClick: () => go('notes') }, 'Open My Notes'))));
  }

  // ---------- saved notes ----------
  function notesView() {
    const notes = state.savedNotes;
    const body = notes.length ? h('div', { className: 'notes-grid' }, notes.map(n => h('div', { key: n.id, className: 'note-card', style: { '--arc': ARCS[n.arcIndex].color } },
      h('div', { className: 'nc-top' }, h('span', { className: 'nc-type' }, n.cardType), h('span', { className: 'nc-ts' }, n.ts)),
      h('div', { className: 'nc-lesson' }, `Lesson ${n.lesson} · ${n.lessonTitle}`),
      n.fields.map((f, k) => h('div', { key: k, className: 'nc-field' }, h('div', { className: 'l' }, f.label), h('div', { className: 'v' }, f.value)))
    ))) : h('div', { className: 'notes-empty' },
      h('div', { className: 'ne-mark' }, h('span', { style: { width: 24, height: 24 } }, icon('save'))),
      h('h2', null, 'Your notebook is empty — for now'),
      h('p', null, 'As you work through lessons, the “Save it” steps drop cards here: your agency rules, prompt templates, and decisions. They are private to you.'),
      h('button', { className: 'btn btn-primary', onClick: () => go('lesson', { idx: 0, sel: {}, passed: {} }) }, 'Go to a lesson'));
    return h('div', { className: 'lp-canvas', 'data-screen-label': 'My Notes' },
      h('div', { className: 'view-head' }, h('div', { className: 'kicker' }, 'Your private toolkit'), h('h1', null, 'My Notes'),
        h('p', null, notes.length ? `${notes.length} saved from your lessons. Only you can see these.` : 'Notes you save in lessons collect here.')),
      body);
  }

  // ---------- about ----------
  function aboutView() {
    const P = (...c) => h('p', null, ...c);
    const E = (t) => h('em', null, t);
    const S = (t) => h('strong', null, t);
    return h('div', { className: 'lp-canvas page', 'data-screen-label': 'About' },
      h('div', { className: 'page-hero' }, h('div', { className: 'kicker' }, 'About'),
        h('h1', null, 'Why this site exists.'),
        h('p', { className: 'lead' }, 'Built by a high school student for anyone in high school and up who wants to learn AI the right way.')),
      h('div', { className: 'prose' },
        h('div', { className: 'status-strip' }, h('span', null, S('Status: '), 'The interactive course is live with all 30 lessons. The original chapter pages remain as a free, no-account way to read the core ideas.')),
        h('h2', null, 'The question that started it'),
        P("I'm Aarav. A few months ago I asked my dad a question that's still with me: ", E('"If AI can write my essays, explain things better than my textbooks, and solve my problems, why am I in school?"')),
        P("He didn't have a clean answer. He's been thinking about it ever since, and it sparked a series of talks he gave to my school's teachers and students. But I wanted to do something with the question too — something I could share with people my age and beyond."),
        h('h2', null, 'Why a website'),
        P("I looked at what's out there for people who want to learn AI. The big sites — Khan Academy, MIT, Code.org, Google's AI Essentials — are mostly written by adults for adults, then dumbed down. Most focus on what AI ", E('is'), ". Very few focus on what to ", E('do'), " with it: how to be a great partner with it, how to push back when it's wrong, how to actually build things."),
        P("There's also a missing voice. I couldn't find a serious AI course written by a high schooler. So I built one."),
        h('h2', null, 'Who this is for'),
        P('Anyone who wants to learn how to actually work with AI. Specifically:'),
        h('ul', null,
          h('li', null, S('Students'), ' (9th grade through college) who use AI every week but feel like they\'re not really learning ', E('from'), ' it.'),
          h('li', null, S('Adults'), ' (parents, teachers, professionals, anyone curious) who want a clear, honest overview without the hype.'),
          h('li', null, S('Older learners'), ' who haven\'t gotten into AI yet and want a friendly on-ramp.')),
        P("It's free. You don't need any technical background. If you can read a textbook and click a button, you can use this site."),
        h('h2', null, 'The thesis'),
        h('p', { className: 'pull' }, 'AI takes some skills away and gives others in return. Writing essays from scratch matters less. Writing prompts matters more. Memorising facts matters less. Pattern recognition matters more.'),
        P("The new skills aren't smaller. They're different. And almost no one is teaching them yet."),
        h('h2', null, 'What I believe'),
        h('ul', null,
          h('li', null, S('AI is a partner skill, not a replacement skill. '), 'The people who get good at partnering with AI will outperform people who just use it.'),
          h('li', null, S('Honesty over hype. '), "AI is incredible. It's also wrong sometimes. Both things are true."),
          h('li', null, S('Productive struggle still matters. '), "Don't outsource the thinking you should be learning. Build the foundation, then scale it with AI."),
          h('li', null, S('Peer voice matters. '), 'The best people to teach high schoolers about AI are high schoolers.')),
        h('h2', null, 'How this site is built'),
        P('The course was structured with help from AI tools. I wrote the brief, made the editorial decisions, and reviewed every page. AI helped me draft, refine, and tighten. That partnership ', E('is'), ' the skill this site is about, so it felt right to use it building the thing.'),
        P('Your progress and settings stay in your own browser and account. We don\'t sell your data.'),
        h('h2', null, 'Credits'),
        P('This is a project of ', S('Aarav Shah'), '.'),
        P('Special thanks to my dad, Shaleen, for the questions that started all this and for the source material in the education talks he gave in 2026.'),
        h('hr', { className: 'hr' }),
        h('p', { className: 'small' }, 'This redesign is the V2 interactive course. A real chatbot (bring-your-own-key) is also planned.')));
  }

  // ---------- projects ----------
  function projectsView() {
    const P = (...c) => h('p', null, ...c);
    const S = (t) => h('strong', null, t);
    const stats = [['3.18 → 1.18', 'training loss (63% drop)'], ['300', 'iterations'], ['~4 min', 'total training time'], ['1.44 GB', 'peak memory used'], ['0.228%', 'of params trained (LoRA)'], ['$0', 'cost']];
    return h('div', { className: 'lp-canvas page', 'data-screen-label': 'Projects' },
      h('div', { className: 'page-hero' }, h('div', { className: 'kicker' }, 'Projects'),
        h('h1', null, 'Things built with AI as a partner.'),
        h('p', { className: 'lead' }, 'Real projects, real people, real walkthroughs. Seeded with the founder\'s project — the rest comes from learners like you.')),
      h('div', { className: 'prose' },
        h('div', { className: 'feature' },
          h('div', { className: 'tag' }, 'Featured project · by Aarav'),
          h('h2', { style: { margin: '8px 0 6px' } }, 'I built a small LLM on my MacBook Air.'),
          h('p', { className: 'pull', style: { margin: '0 0 14px' } }, '15 years old. 1 laptop. ~4 minutes of training. $0.'),
          P('The idea: instead of building a frontier model from scratch (which costs $200,000+ in compute), ', S('borrow'), " a model like Meta's free Llama 3.2 1B Instruct and teach it a new trick."),
          h('h3', null, 'The recipe'),
          h('ul', null,
            h('li', null, S('Base model: '), 'Llama 3.2 1B Instruct, 4-bit quantized (free from Meta)'),
            h('li', null, S('Dataset: '), '2,000 SQL examples from Hugging Face'),
            h('li', null, S('Method: '), "LoRA fine-tuning — trained only 0.228% of the model's parameters"),
            h('li', null, S('Hardware: '), 'MacBook Air M3, 16 GB RAM · ~4 minutes, 300 iterations')),
          h('h3', null, 'The result'),
          P('Before fine-tuning, "Show me all students in 10th grade" gave a chatty 72-token markdown response. After fine-tuning, the same prompt produced a clean 39-token SQL query, ready to paste into a database.'),
          h('div', { className: 'stat-grid2' }, stats.map(([n, l], k) => h('div', { key: k, className: 'stat2' }, h('div', { className: 'num' }, n), h('div', { className: 'label' }, l)))),
          h('h3', null, 'What I took away'),
          h('ul', null,
            h('li', null, "AI isn't magic. It's math, data, and a lot of training."),
            h('li', null, "You don't need a $200K supercomputer to do real ML."),
            h('li', null, 'If a 9th grader can build a real LLM specialist on a MacBook Air, so can you.'))),
        h('h2', null, 'Submit your own project'),
        P('Did you build something with AI as a partner? Send it in. We\'ll feature good work here so other learners can see what\'s possible.'),
        h('h2', null, "What we're looking for"),
        h('ul', null,
          h('li', null, S('Real problems, not toy demos. '), 'Did your project actually solve something or teach you something?'),
          h('li', null, S('An honest story. '), "What worked, what didn't, where AI was useful and where it wasn't."),
          h('li', null, S('Beginner-friendly write-ups. '), 'Other learners should be able to copy your approach.'),
          h('li', null, S('Anyone, any age. '), 'The gallery is open.'))));
  }

  // ---------- teaching ----------
  function teachingView() {
    const P = (...c) => h('p', null, ...c);
    const S = (t) => h('strong', null, t);
    const tools = [['01', 'Learning AI', 'Best for course support, prompt coaching, quick quizzes, and private practice in the browser.'], ['02', 'Hugging Face Chat', 'Compare open models and see that "AI" is not one single product.'], ['03', 'LM Studio', 'For older students and adults who want to run models locally and understand privacy and model size.'], ['04', 'Real-world data tools', 'Local or environmental datasets so AI work connects to evidence and place-based questions.']];
    return h('div', { className: 'lp-canvas page', 'data-screen-label': 'Teaching AI' },
      h('div', { className: 'page-hero' }, h('div', { className: 'kicker' }, 'For educators, parents & adult learners'),
        h('h1', null, 'Teach AI as a practice, not a subject.'),
        h('p', { className: 'lead' }, 'AI literacy lands when people try it, break it, repair it, and talk about what changed. The point is not tool training. The point is judgment.')),
      h('div', { className: 'prose' },
        h('div', { className: 'tldr' }, h('h4', null, 'TL;DR'),
          h('ul', null,
            h('li', null, 'Start with a live AI failure, then improve it in front of the room.'),
            h('li', null, 'Teach one durable model: context, role, examples, constraints.'),
            h('li', null, 'Spend more time doing than explaining.'),
            h('li', null, 'Name the learning line: when AI helps you grow, and when it short-circuits the work.'))),
        h('h2', null, 'The 20-40-20 workshop shape'),
        P('For classrooms, faculty workshops, and parent nights, a simple rhythm works: 20 minutes teaching, 40 minutes practicing, 20 minutes sharing. Anything more lecture-heavy makes AI feel abstract.'),
        h('div', { className: 'rhythm' },
          h('div', { className: 'blk' }, h('div', { className: 'big' }, '20'), h('div', { className: 'cap' }, 'teach')),
          h('div', { className: 'blk mid' }, h('div', { className: 'big' }, '40'), h('div', { className: 'cap' }, 'practice')),
          h('div', { className: 'blk' }, h('div', { className: 'big' }, '20'), h('div', { className: 'cap' }, 'share'))),
        h('p', { className: 'small' }, 'The learning happens in the iteration, not the explanation.'),
        h('h2', null, 'Start with a failure'),
        P('Give AI a vague prompt and let everyone watch it produce something generic. Then add context, role, examples, and constraints. The room sees the same tool become more useful because the human became more specific.'),
        h('div', { className: 'compare2' },
          h('div', { className: 'cmp bad' }, h('h4', null, 'Too abstract'), h('pre', null, 'Tell me about AI.'), h('p', null, 'Big topic, vague output, no clear use.')),
          h('div', { className: 'cmp good' }, h('h4', null, 'Teachable'), h('pre', null, 'Act as a patient tutor for a 9th grader.\nExplain why AI can be confidently wrong.\nUse one analogy and end with a question.'), h('p', null, 'Clear audience, job, style, and output shape.'))),
        h('h2', null, 'Adults and students need different doors'),
        h('div', { className: 'compare2' },
          h('div', { className: 'cmp' }, h('h4', null, 'Adults'), h('p', null, 'Start with an existing workflow: email, meeting prep, research, lesson planning. They need to feel the time-back quickly, then you can talk about skill atrophy and verification.')),
          h('div', { className: 'cmp' }, h('h4', null, 'Students'), h('p', null, 'Start with curiosity and identity. Let them stress-test AI, find mistakes, compare answers, and build small things. Do not lead with "this makes homework easier."'))),
        h('h2', null, 'The ethical core'),
        P('The strongest rule is not "AI is allowed" or "AI is banned." The better question is: ', S('what part of this work is supposed to grow my mind?'), ' If AI helps with that, use it. If AI removes that part, pause.'),
        h('div', { className: 'callout-box' }, h('h4', null, 'Use this line'), h('p', null, 'AI should help you think better, not make it unnecessary to think.')),
        h('h2', null, 'Sustainable AI learning tools'),
        P('Use tools that match the learning goal instead of defaulting to the biggest model every time. For practice, smaller, local, or no-signup tools often teach more because learners can see the tradeoffs clearly.'),
        h('div', { className: 'ingrid' }, tools.map(([n, t, d], k) => h('div', { key: k, className: 'ingr' }, h('div', { className: 'num' }, n), h('h4', null, t), h('p', null, d)))),
        h('div', { className: 'callout-box good' }, h('h4', null, 'Good classroom test'), h('p', null, 'If students can explain what they did, what the AI contributed, what they checked, and what they still think themselves, the tool is supporting learning.'))));
  }

  function main() {
    switch (state.view) {
      case 'account': return accountView();
      case 'questionnaire': return questionnaireView();
      case 'lessons': return lessonsView();
      case 'lesson': return lessonView();
      case 'done': return doneView();
      case 'settings': return settingsView();
      case 'notes': return notesView();
      case 'about': return aboutView();
      case 'projects': return projectsView();
      case 'teaching': return teachingView();
      default: return dashboardView();
    }
  }

  // ---------- render harness ----------
  // Because every state change rebuilds the whole tree, keyboard focus would
  // otherwise drop to <body> after each click/keystroke. We restore it: text
  // fields by stable data-fkey (with caret); every other focused control by its
  // structural position (child-index path), which is stable across a same-view
  // re-render.
  function focusPath(el, root) {
    const path = [];
    while (el && el !== root) {
      const p = el.parentNode;
      if (!p) return null;
      path.unshift(Array.prototype.indexOf.call(p.childNodes, el));
      el = p;
    }
    return el === root ? path : null;
  }
  function nodeAtPath(root, path) {
    let n = root;
    for (let i = 0; i < path.length && n; i++) n = n.childNodes[path[i]];
    return n;
  }
  function render() {
    const root = document.getElementById('app');
    if (!root) return;
    // capture focus before teardown
    const act = document.activeElement;
    let restore = null;
    if (act && act !== document.body && root.contains(act)) {
      const fkey = act.dataset ? act.dataset.fkey : null;
      let selS = null, selE = null;
      if (fkey && typeof act.selectionStart === 'number') { try { selS = act.selectionStart; selE = act.selectionEnd; } catch (e) {} }
      restore = { fkey: fkey, path: fkey ? null : focusPath(act, root), selS: selS, selE: selE };
    }

    const lp = h('div', { className: 'lp' }, nav(), main());
    lp.setAttribute('data-theme', state.theme);
    lp.setAttribute('data-fs', state.fontScale);
    lp.setAttribute('data-reduce', state.reduceMotion ? '1' : '0');
    root.textContent = '';
    root.appendChild(lp);

    if (restore) {
      let el = restore.fkey ? root.querySelector('[data-fkey="' + restore.fkey + '"]') : (restore.path ? nodeAtPath(root, restore.path) : null);
      if (el && typeof el.focus === 'function') {
        el.focus();
        if (restore.selS != null && typeof el.setSelectionRange === 'function') { try { el.setSelectionRange(restore.selS, restore.selE); } catch (e) {} }
      }
    }
  }

  render();
})();
