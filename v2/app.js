/* ============================================================
   Learning AI V2 — engine
   V2 == V1 (same pages/assessment/My Path/look). Differences:
   6 arcs · 30 lessons · more interaction per lesson · better UI.

   Lessons are step-by-step. You must COMPLETE each interactive
   part before "Next" unlocks. Progress shows as a fill-in mosaic
   (one square per lesson).

   Routes:
     #/                      -> all lessons (arc overview + mosaic)
     #/lessons               -> same
     #/lesson/<id>/<step>    -> one part of a lesson
     #/done/<id>             -> lesson complete

   Persists to V1 storage keys so progress flows to the real site:
     learningai-progress   { completed: { "chapter-1": {completedAt} }, savedAt }
     learningai-settings   { theme, fontScale, ... }  (read-only; theming)
     learningai-toolkit    [ { id, type, lessonId, fields, createdAt } ]
   ============================================================ */

(function () {
  const LESSONS = Array.isArray(window.LESSONS) ? window.LESSONS : [];
  const ARCS = window.V2_ARCS ? Object.values(window.V2_ARCS) : [];
  const KEY = { progress: 'learningai-progress', settings: 'learningai-settings', toolkit: 'learningai-toolkit' };
  const api = window.LearningAIV2Api || null;
  let authChecked = !api;
  let currentUser = null;
  let serverState = null;

  // step kinds that REQUIRE completion before Next unlocks
  const GATED = new Set(['classify', 'exitCheck', 'toolkitSave', 'promptRepair', 'biasSpot', 'agentDesign']);
  // arc colors for the mosaic (one hue per arc)
  const ARC_COLORS = ['#2563eb', '#0891b2', '#7c3aed', '#dc2626', '#ea580c', '#16a34a'];

  const app = document.getElementById('app');
  const progressBarFill = document.querySelector('.progress-bar > div');

  // ---------- storage ----------
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function readJson(k, fb) { try { const v = JSON.parse(get(k) || 'null'); return v == null ? fb : v; } catch (e) { return fb; } }
  function readProgress() { return readJson(KEY.progress, { completed: {} }); }
  function saveProgress(p) { return set(KEY.progress, JSON.stringify({ completed: p.completed || {}, savedAt: new Date().toISOString() })); }
  function readToolkit() { const t = readJson(KEY.toolkit, []); return Array.isArray(t) ? t : []; }
  function saveToolkit(c) { return set(KEY.toolkit, JSON.stringify(c.slice(0, 50))); }

  function applyServerState(state) {
    if (!state) return;
    serverState = state;
    currentUser = state.user || currentUser;
    if (Array.isArray(state.progress)) {
      const completed = {};
      state.progress.forEach(row => {
        if (row.completedAt) completed[row.lessonId] = { completedAt: row.completedAt };
      });
      saveProgress({ completed });
    }
    if (Array.isArray(state.toolkit)) {
      saveToolkit(state.toolkit.map(card => ({
        id: card.id,
        type: card.cardType,
        lessonId: card.lessonId,
        fields: card.payload?.fields || card.payload || {},
        fieldLabels: card.payload?.fieldLabels || {},
        createdAt: card.createdAt
      })));
    }
  }

  // ---------- theming (mirrors V1 applyAppearance for common themes) ----------
  function applyAppearance() {
    const s = readJson(KEY.settings, {}) || {};
    const b = document.body, t = b.style;
    if (s.theme) b.dataset.theme = s.theme; else b.removeAttribute('data-theme');
    b.dataset.fontScale = s.fontScale || 'normal';
    b.dataset.fontFamily = s.fontFamily || 'system';
    if (s.theme === 'dark') {
      t.setProperty('--bg', '#0f1726'); t.setProperty('--surface', '#1b2637'); t.setProperty('--surface-2', '#243247');
      t.setProperty('--border', '#33445c'); t.setProperty('--text', s.textColor || '#f4f7fb'); t.setProperty('--text-dim', '#a7b1c2'); t.setProperty('--text-faint', '#778397');
    } else if (s.theme === 'light') {
      t.setProperty('--bg', '#f7f9fc'); t.setProperty('--surface', '#ffffff'); t.setProperty('--surface-2', '#eef4f8');
      t.setProperty('--border', '#dbe3ea'); t.setProperty('--text', s.textColor || '#121826'); t.setProperty('--text-dim', '#4b5870'); t.setProperty('--text-faint', '#778397');
    }
    if (s.accentColor) t.setProperty('--accent', s.accentColor);
  }

  // ---------- DOM helper ----------
  function h(tag, attrs, kids) {
    const el = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') el.className = attrs[k];
      else if (k === 'html') el.innerHTML = attrs[k];
      else if (k.startsWith('on') && typeof attrs[k] === 'function') el.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    }
    (Array.isArray(kids) ? kids : kids != null ? [kids] : []).forEach(c => {
      if (c == null) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }

  // ---------- progress ----------
  function isDone(id) { return !!readProgress().completed[id]; }
  function doneCount() { const c = readProgress().completed; return LESSONS.filter(l => c[l.id]).length; }
  function markComplete(id) {
    const p = readProgress();
    p.completed[id] = { completedAt: new Date().toISOString() };
    saveProgress(p);
    api?.saveProgress({ lessonId: id, completed: true, currentStep: 999 }).catch(() => {});
  }
  function nextIncomplete() { const c = readProgress().completed; return LESSONS.find(l => !c[l.id]) || null; }
  function updateTopProgress() { if (progressBarFill) progressBarFill.style.width = `${Math.round(doneCount() / LESSONS.length * 100)}%`; }

  function recordInteraction(step, payload) {
    if (!api || !currentLessonId) return;
    const stepIndex = currentLessonStepIndex;
    api.saveInteraction({
      lessonId: currentLessonId,
      stepIndex,
      stepKind: step.kind,
      payload
    }).catch(() => {});
  }

  // ---------- mosaic: one square per lesson, revealing a painting as you complete it ----------
  function buildMosaic(opts) {
    opts = opts || {};
    const done = readProgress().completed;
    const grid = h('div', { class: 'mosaic painting-mosaic' + (opts.small ? ' mosaic-small' : ''), 'aria-label': 'Course progress painting' });
    LESSONS.forEach((l, i) => {
      const col = i % 6;
      const row = Math.floor(i / 6);
      const filled = !!done[l.id];
      const cell = h('a', {
        class: 'mz' + (filled ? ' filled' : '') + (l.id === opts.activeId ? ' active' : ''),
        href: `#/lesson/${l.id}/0`,
        title: `${l.num}. ${l.title}${filled ? ' ✓' : ''}`,
        style: `--tile-col:${col};--tile-row:${row};`
      });
      cell.appendChild(h('span', { class: 'mz-num' }, String(l.num)));
      grid.appendChild(cell);
    });
    return grid;
  }

  // ---------- inline toolkit ----------
  function buildToolkitPanel() {
    const cards = readToolkit();
    const body = h('div', { class: 'tk-list tk-inline-list' });
    if (!cards.length) {
      body.appendChild(h('p', { class: 'muted' }, 'Your lesson saves will appear here: agency rules, prompt repairs, verification checks, and workflow cards.'));
    }
    if (cards.length) {
      cards.slice(0, 8).forEach(card => {
        const lesson = LESSONS.find(l => l.id === card.lessonId);
        const fields = Object.keys(card.fields || {}).map(k => h('p', null, [h('strong', null, `${card.fieldLabels?.[k] || k}: `), card.fields[k] || '—']));
        body.appendChild(h('article', { class: 'tk-card' }, [
          h('span', { class: 'tk-type' }, `${card.type}${lesson ? ' · ' + lesson.title : ''}`),
          ...fields,
          h('button', { class: 'tk-del', onclick: () => { deleteCard(card.id); } }, 'Remove')
        ]));
      });
    }
    return h('section', { class: 'lesson-toolkit', id: 'lesson-toolkit' }, [
      h('div', { class: 'section-heading' }, 'Your lesson toolkit'),
      h('h2', null, cards.length ? 'Reusable cards from the lessons' : 'Save the useful stuff as you go'),
      h('p', { class: 'muted' }, 'This is not a separate path. It is the working notebook you build while completing lesson steps. Stored on this device.'),
      body
    ]);
  }
  function deleteCard(id) { saveToolkit(readToolkit().filter(c => c.id !== id)); render(); }

  // ---------- copy ----------
  function copyText(text, btn) {
    const done = () => { const o = btn.textContent; btn.textContent = 'Copied ✓'; setTimeout(() => { btn.textContent = o; }, 1600); };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    else fallbackCopy(text, done);
  }
  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {} finally { document.body.removeChild(ta); }
  }

  // ============================================================
  //  STEP RENDERERS — renderer(step, ctx). ctx.unlock() enables Next.
  //  Gated kinds keep Next locked until the learner completes the task.
  // ============================================================
  function tag(t) { return h('span', { class: 'step-tag' }, t); }
  function card(kids) { return h('div', { class: 'lesson-card' }, kids); }

  const steps = {
    coldOpen(s) {
      return card([tag('Cold open'), h('h2', null, s.title), h('p', { class: 'scenario' }, s.scenario), s.prompt ? h('p', { class: 'muted' }, s.prompt) : null]);
    },
    reveal(s) {
      return card([tag('Key idea'), h('h2', null, s.title), h('p', null, s.body),
        s.mistake ? h('div', { class: 'callout callout-bad' }, [h('strong', null, 'Common mistake: '), s.mistake]) : null,
        s.good ? h('div', { class: 'callout callout-good' }, [h('strong', null, 'Better: '), s.good]) : null]);
    },
    compare(s) {
      return card([tag('Compare'), h('h2', null, s.title),
        h('div', { class: 'compare-grid' }, [
          h('div', { class: 'compare-col weak' }, [h('span', { class: 'lbl' }, 'Weak'), h('p', null, s.weak)]),
          h('div', { class: 'compare-col strong' }, [h('span', { class: 'lbl' }, 'Strong'), h('p', null, s.strong)])
        ]),
        h('p', { class: 'why' }, [h('strong', null, 'Why: '), s.why])]);
    },
    nextWord(s) {
      const bars = s.options.slice().sort((a, b) => b.p - a.p).map(o => h('div', { class: 'nw-row' }, [
        h('span', { class: 'nw-word' }, o.word),
        h('div', { class: 'nw-track' }, h('div', { class: 'nw-fill', style: `width:${Math.round(o.p * 100)}%` })),
        h('span', { class: 'nw-pct' }, `${Math.round(o.p * 100)}%`)
      ]));
      return card([tag('Predict'), h('h2', null, s.title),
        h('p', { class: 'nw-stem' }, [`“${s.stem} `, h('span', { class: 'nw-blank' }, '____'), '”']), ...bars, h('p', { class: 'why' }, s.note)]);
    },
    tryLive(s) {
      const btn = h('button', { class: 'btn btn-primary', onclick: () => copyText(s.prompt, btn) }, 'Copy prompt');
      return card([tag('Try it for real'), h('h2', null, s.title), h('pre', { class: 'prompt-box' }, s.prompt), btn, s.note ? h('p', { class: 'why' }, s.note) : null]);
    },
    verify(s) {
      return card([tag('Verify'), h('h2', null, s.title), h('div', { class: 'callout' }, [h('strong', null, 'Claim: '), s.claim]),
        h('p', { class: 'muted' }, 'Read laterally — check the claim against other sources first:'), h('ol', null, (s.steps || []).map(x => h('li', null, x))),
        s.note ? h('p', { class: 'why' }, s.note) : null]);
    },
    workflowChain(s) {
      return card([tag('Build a workflow'), h('h2', null, s.title), h('div', { class: 'callout' }, [h('strong', null, 'Goal: '), s.goal]),
        h('p', { class: 'muted' }, 'Correct order:'), h('ol', null, (s.correct || []).map(x => h('li', null, x))), s.note ? h('p', { class: 'why' }, s.note) : null]);
    },
    evalTest(s) {
      const btn = h('button', { class: 'btn btn-primary', onclick: () => copyText(s.prompt, btn) }, 'Copy the eval prompt');
      return card([tag('Write a test'), h('h2', null, s.title), h('div', { class: 'callout' }, [h('strong', null, 'AI output to test: '), s.output]),
        h('pre', { class: 'prompt-box' }, s.prompt), btn, s.note ? h('p', { class: 'why' }, s.note) : null]);
    },

    // ---- gated (must complete) ----
    classify(s, ctx) {
      let correct = 0;
      const fb = h('p', { class: 'step-feedback' }, '');
      const rows = s.items.map(item => {
        const btns = s.buckets.map((b, bi) => h('button', {
          class: 'chip', onclick: (e) => {
            const row = e.target.closest('.classify-row');
            if (row.dataset.done) return;
            const ok = bi === item.answer;
            row.dataset.done = '1'; row.classList.add(ok ? 'right' : 'wrong'); e.target.classList.add('selected');
            recordInteraction(s, { item: item.text, selected: s.buckets[bi], correct: ok });
            if (ok) { correct++; if (correct === s.items.length) { fb.textContent = '✓ ' + (s.reveal || 'All sorted — nice.'); ctx.unlock(); } }
            else fb.textContent = `Not quite — that one belongs in “${s.buckets[item.answer]}.”`;
          }
        }, b));
        return h('div', { class: 'classify-row' }, [h('span', { class: 'classify-text' }, item.text), h('div', { class: 'chip-row' }, btns)]);
      });
      return card([tag('Sort it'), h('h2', null, s.title), h('p', { class: 'muted' }, s.prompt), ...rows, fb, lockHint('Sort all of them correctly to continue.')]);
    },
    exitCheck(s, ctx) {
      const fb = h('p', { class: 'step-feedback' }, '');
      const opts = s.options.map(o => h('button', {
        class: 'btn btn-ghost quiz-opt', onclick: (e) => {
          const wrap = e.target.closest('.lesson-card');
          if (o.ok) {
            wrap.querySelectorAll('.quiz-opt').forEach(b => { b.disabled = true; });
            e.target.classList.add('right'); fb.textContent = '✓ ' + o.feedback; recordInteraction(s, { selected: o.text, correct: true }); ctx.unlock();
          } else { e.target.classList.add('wrong'); e.target.disabled = true; fb.textContent = '✗ ' + o.feedback; recordInteraction(s, { selected: o.text, correct: false }); }
        }
      }, o.text));
      return card([tag('Check'), h('h2', null, s.title), h('p', null, s.question), h('div', { class: 'quiz-opts' }, opts), fb, lockHint('Pick the right answer to continue.')]);
    },
    promptRepair(s, ctx) {
      const inputs = s.fields.map(f => h('label', { class: 'pr-field' }, [h('span', null, f),
        h('input', { type: 'text', 'data-field': f, placeholder: `${f}…`, oninput: check })]));
      const out = h('pre', { class: 'pr-output', hidden: 'true' });
      const fb = h('p', { class: 'step-feedback' }, '');
      function check(e) {
        const wrap = e.target.closest('.lesson-card');
        const all = [...wrap.querySelectorAll('input[data-field]')].every(i => i.value.trim().length > 1);
        if (all) {
          const fields = Object.fromEntries([...wrap.querySelectorAll('input[data-field]')].map(i => [i.dataset.field, i.value.trim()]));
          fb.textContent = '✓ Nice — that is a real instruction now.';
          recordInteraction(s, { fields });
          ctx.unlock();
        }
      }
      const reveal = h('button', { class: 'btn btn-ghost', onclick: () => { out.textContent = s.strong; out.hidden = false; } }, 'Show a strong version');
      return card([tag('Prompt repair'), h('h2', null, s.title),
        h('p', { class: 'muted' }, ['Weak prompt: ', h('em', null, `“${s.weak}”`)]),
        h('p', { class: 'muted' }, 'Fill in each part to repair it:'), h('div', { class: 'pr-fields' }, inputs), reveal, out, fb,
        lockHint('Fill in every field to continue.')]);
    },
    toolkitSave(s, ctx) {
      const inputs = s.fields.map(f => h('label', { class: 'pr-field' }, [h('span', null, f.label),
        h('input', { type: 'text', 'data-key': f.key, placeholder: f.placeholder || '' })]));
      const fb = h('p', { class: 'step-feedback' }, '');
      const saveBtn = h('button', {
        class: 'btn btn-primary', onclick: (e) => {
          const wrap = e.target.closest('.lesson-card');
          const fields = {}, labels = {}; let any = false;
          wrap.querySelectorAll('input[data-key]').forEach(inp => {
            fields[inp.dataset.key] = inp.value.trim();
            const f = s.fields.find(x => x.key === inp.dataset.key); labels[inp.dataset.key] = f ? f.label : inp.dataset.key;
            if (inp.value.trim()) any = true;
          });
          if (!any) { fb.textContent = 'Fill in at least one field first.'; return; }
          const cards = readToolkit();
          const cardId = 'card-' + Date.now();
          cards.unshift({ id: cardId, type: s.cardType, lessonId: currentLessonId, fields, fieldLabels: labels, createdAt: new Date().toISOString() });
          saveToolkit(cards);
          api?.saveToolkit({ id: cardId, cardType: s.cardType, lessonId: currentLessonId, payload: { fields, fieldLabels: labels } }).catch(() => {});
          recordInteraction(s, { fields });
          fb.textContent = 'Saved to your lesson toolkit ✓'; ctx.unlock();
        }
      }, 'Save to my toolkit');
      return card([tag('Save an artifact'), h('h2', null, s.title), h('div', { class: 'pr-fields' }, inputs),
        h('div', { class: 'row-gap' }, [saveBtn, h('a', { class: 'btn btn-ghost', href: '#/lessons' }, 'See lesson toolkit')]), fb,
        lockHint('Save a card to continue.')]);
    },
    biasSpot(s, ctx) {
      const fb = h('p', { class: 'step-feedback' }, '');
      let found = 0;
      const biased = new Set((s.biased || []).map(b => b.toLowerCase()));
      const words = s.passage.split(/(\s+)/).map(token => {
        const clean = token.trim().replace(/[.,!?;:"']/g, '').toLowerCase();
        if (clean && biased.has(clean)) {
          return h('span', { class: 'bias-word', onclick: (e) => {
            if (e.target.dataset.done) return;
            e.target.dataset.done = '1'; e.target.classList.add('hit'); found++;
            recordInteraction(s, { found: clean });
            if (found >= biased.size) { fb.textContent = '✓ ' + (s.reveal || 'You caught the loaded language.'); ctx.unlock(); }
          } }, token);
        }
        return document.createTextNode(token);
      });
      return card([tag('Spot the bias'), h('h2', null, s.title), h('p', { class: 'bias-passage' }, words), fb, lockHint('Find every biased phrase to continue.')]);
    },
    agentDesign(s, ctx) {
      const fb = h('p', { class: 'step-feedback' }, '');
      const usefulTotal = (s.tools || []).filter(t => t.useful).length;
      let usefulFound = 0;
      const opts = (s.tools || []).map(t => h('button', {
        class: 'chip', onclick: (e) => {
          if (e.target.dataset.done) return;
          e.target.dataset.done = '1'; e.target.classList.add(t.useful ? 'right' : 'wrong');
          recordInteraction(s, { tool: t.name, useful: t.useful });
          if (t.useful) { usefulFound++; if (usefulFound >= usefulTotal) { fb.textContent = '✓ Those are the tools this agent needs.'; ctx.unlock(); } }
          else fb.textContent = `✗ ${t.name} is not needed for this goal.`;
        }
      }, t.name));
      return card([tag('Design an agent'), h('h2', null, s.title), h('div', { class: 'callout' }, [h('strong', null, 'Goal: '), s.goal]),
        h('p', { class: 'muted' }, 'Pick every tool this agent actually needs:'), h('div', { class: 'chip-row' }, opts), fb,
        lockHint('Find all the needed tools to continue.')]);
    }
  };
  function lockHint(text) { return h('p', { class: 'lock-hint' }, '🔒 ' + text); }

  // ============================================================
  //  VIEWS
  // ============================================================
  let currentLessonId = null;
  let currentLessonStepIndex = 0;

  function viewAuthGate() {
    const message = h('p', { class: 'step-feedback', id: 'auth-message', 'aria-live': 'polite' }, '');
    const form = h('form', { class: 'auth-card' }, [
      h('div', { class: 'tagline' }, 'Hidden V2 beta'),
      h('h1', null, 'Sign in to save your progress'),
      h('p', { class: 'lead' }, 'We use your email only to sign you in and save your progress. We will not send ads. We will not ask you for money. We will not sell your information.'),
      h('label', { class: 'pr-field' }, [h('span', null, 'Email'), h('input', { name: 'email', type: 'email', autocomplete: 'email', required: 'true' })]),
      h('label', { class: 'pr-field' }, [h('span', null, 'Password'), h('input', { name: 'password', type: 'password', autocomplete: 'current-password', required: 'true', minlength: '8' })]),
      h('label', { class: 'pr-field' }, [h('span', null, 'Display name'), h('input', { name: 'displayName', type: 'text', autocomplete: 'name', maxlength: '40', placeholder: 'Only needed for signup' })]),
      h('div', { class: 'row-gap' }, [
        h('button', { class: 'btn btn-primary', type: 'submit', 'data-mode': 'signup' }, 'Create account'),
        h('button', { class: 'btn btn-ghost', type: 'submit', 'data-mode': 'login' }, 'Sign in')
      ]),
      message
    ]);
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const mode = event.submitter?.dataset.mode || 'login';
      const data = Object.fromEntries(new FormData(form));
      message.textContent = mode === 'signup' ? 'Creating account...' : 'Signing in...';
      const result = mode === 'signup' ? await api.signup(data) : await api.login(data);
      if (!result.ok) {
        message.textContent = result.error || 'Could not sign in.';
        return;
      }
      currentUser = result.user;
      await hydrateFromServer();
      render();
    });
    return h('div', { class: 'container view auth-view' }, [form]);
  }

  async function hydrateFromServer() {
    if (!api) return;
    const state = await api.state();
    if (state.ok) applyServerState(state.state);
    const localGauge = readJson('modelwise-gauge', null);
    if (localGauge) api.saveAssessment(localGauge).catch(() => {});
  }

  function accountBar() {
    if (!currentUser) return null;
    return h('div', { class: 'account-bar' }, [
      h('span', null, `Signed in as ${currentUser.displayName || currentUser.email}`),
      h('button', { class: 'btn btn-ghost', onclick: async () => { await api.logout(); currentUser = null; serverState = null; render(); } }, 'Sign out')
    ]);
  }

  function viewLessons() {
    const c = readProgress().completed;
    const done = doneCount();
    const pct = Math.round(done / LESSONS.length * 100);
    const next = nextIncomplete();

    const sections = ARCS.map((arcName, ai) => {
      const inArc = LESSONS.filter(l => l.arc === arcName);
      if (!inArc.length) return null;
      return h('section', { class: 'arc' }, [
        h('h2', { class: 'arc-title' }, [h('span', { class: 'arc-num', style: `background:${ARC_COLORS[ai]}1a;color:${ARC_COLORS[ai]}` }, `Arc ${ai + 1}`), arcName]),
        h('div', { class: 'lesson-grid' }, inArc.map(l => h('a', {
          class: 'lesson-tile' + (c[l.id] ? ' completed' : '') + (l.stub ? ' stub' : ''), href: `#/lesson/${l.id}/0`
        }, [
          h('span', { class: 'lt-num' }, c[l.id] ? '✓' : String(l.num)),
          h('span', { class: 'lt-title' }, l.title),
          h('span', { class: 'lt-q' }, l.coreQuestion),
          l.stub ? h('span', { class: 'lt-badge' }, 'soon') : null
        ])))
      ]);
    }).filter(Boolean);

    const nextQuestion = next ? next.coreQuestion : 'What can I build now that I understand the basics?';
    return h('div', { class: 'container view' }, [
      accountBar(),
      h('header', { class: 'hero compact' }, [
        h('div', { class: 'tagline' }, next ? `Next question · Lesson ${next.num}` : 'Course complete'),
        h('h1', null, nextQuestion),
        h('p', { class: 'lead' }, next ? `${next.title}. Finish each interactive part to reveal another piece of the painting.` : 'Every square is filled. Your next move is a project.')
      ]),
      h('div', { class: 'mosaic-wrap' }, [
        buildMosaic(),
        h('p', { class: 'muted mosaic-caption' }, `${done} / ${LESSONS.length} painting tiles revealed (${pct}%)`)
      ]),
      next ? h('a', { class: 'btn btn-primary', href: `#/lesson/${next.id}/0` }, done ? `Continue: ${next.num}. ${next.title}` : `Start: ${next.num}. ${next.title}`)
           : h('div', { class: 'callout callout-good' }, '🎉 Every square filled — you finished all 30 lessons.'),
      buildToolkitPanel(),
      ...sections
    ]);
  }

  function viewLesson(id, stepIndex) {
    const lesson = LESSONS.find(l => l.id === id);
    if (!lesson) return notFound();
    currentLessonId = id;
    const total = lesson.steps.length;
    const idx = Math.max(0, Math.min(stepIndex, total - 1));
    currentLessonStepIndex = idx;
    const step = lesson.steps[idx];
    const last = idx === total - 1;
    const gated = GATED.has(step.kind);

    // step progress dots
    const dots = h('div', { class: 'step-dots' }, lesson.steps.map((_, i) =>
      h('span', { class: 'dot' + (i === idx ? ' active' : '') + (i < idx ? ' past' : '') })));

    // Next/Finish button — locked for gated steps until unlock() is called
    const advance = () => {
      if (last) { markComplete(id); updateTopProgress(); location.hash = `#/done/${id}`; }
      else location.hash = `#/lesson/${id}/${idx + 1}`;
    };
    const nextBtn = h('button', { class: 'btn btn-primary' + (gated ? ' is-locked' : ''), onclick: advance }, last ? 'Finish lesson ✓' : 'Next →');
    if (gated) nextBtn.disabled = true;
    const ctx = { unlock() { nextBtn.disabled = false; nextBtn.classList.remove('is-locked'); } };

    const back = idx > 0
      ? h('a', { class: 'btn btn-ghost', href: `#/lesson/${id}/${idx - 1}` }, '← Back')
      : h('a', { class: 'btn btn-ghost', href: '#/lessons' }, '← All lessons');

    const renderer = steps[step.kind] || steps.reveal;
    const body = renderer(step, ctx);

    api?.saveProgress({ lessonId: id, currentStep: idx, completed: false }).catch(() => {});

    return h('div', { class: 'container view lesson-view' }, [
      accountBar(),
      h('div', { class: 'lesson-head' }, [
        h('span', { class: 'crumb' }, `${lesson.arc} · Lesson ${lesson.num} of 30 · part ${idx + 1}/${total}`),
        h('h1', { class: 'lesson-h1' }, lesson.title),
        h('p', { class: 'core-q' }, lesson.coreQuestion),
        dots
      ]),
      body,
      h('div', { class: 'lesson-nav row-gap' }, [back, nextBtn])
    ]);
  }

  function viewDone(id) {
    const lesson = LESSONS.find(l => l.id === id);
    if (!lesson) return notFound();
    const next = nextIncomplete();
    const done = doneCount();
    return h('div', { class: 'container view' }, [
      accountBar(),
      h('header', { class: 'hero compact' }, [
        h('div', { class: 'tagline' }, 'Lesson complete'),
        h('h1', null, `✓ ${lesson.num}. ${lesson.title}`),
        h('p', { class: 'lead' }, `You filled another square — ${done} / ${LESSONS.length} done.`)
      ]),
      h('div', { class: 'mosaic-wrap' }, buildMosaic({ activeId: id })),
      lesson.resources?.length ? h('div', { class: 'callout' }, [h('strong', null, 'Go deeper: '),
        ...lesson.resources.map(r => h('a', { href: r.url, target: '_blank', rel: 'noopener', class: 'res-link' }, r.label))]) : null,
      h('div', { class: 'row-gap' }, [
        next ? h('a', { class: 'btn btn-primary', href: `#/lesson/${next.id}/0` }, `Next: ${next.num}. ${next.title}`)
             : h('a', { class: 'btn btn-primary', href: '../my-path.html' }, 'See My Path'),
        h('a', { class: 'btn btn-ghost', href: '#/lessons' }, 'All lessons'),
        h('a', { class: 'btn btn-ghost', href: '#/lessons' }, 'Lesson toolkit')
      ])
    ]);
  }

  function notFound() {
    return h('div', { class: 'container view' }, [
      h('header', { class: 'hero compact' }, [h('h1', null, 'Not found'), h('p', { class: 'lead' }, 'That page does not exist.')]),
      h('a', { class: 'btn btn-primary', href: '#/lessons' }, 'All lessons')
    ]);
  }

  // ============================================================
  //  ROUTER
  // ============================================================
  function render() {
    if (!app) return;
    if (!authChecked) {
      app.innerHTML = '';
      app.appendChild(h('div', { class: 'container view' }, [
        h('section', { class: 'lesson-card' }, [
          h('div', { class: 'tagline' }, 'Hidden V2 beta'),
          h('h1', null, 'Checking your account...'),
          h('p', { class: 'muted' }, 'V2 saves progress to the Learning AI backend.')
        ])
      ]));
      return;
    }
    if (api && !currentUser) {
      app.innerHTML = '';
      app.appendChild(viewAuthGate());
      updateTopProgress();
      return;
    }
    const parts = (location.hash.replace(/^#/, '') || '/').split('/').filter(Boolean);
    let node;
    if (parts.length === 0) node = viewLessons();
    else if (parts[0] === 'lessons') node = viewLessons();
    else if (parts[0] === 'lesson' && parts[1]) node = viewLesson(parts[1], parseInt(parts[2] || '0', 10) || 0);
    else if (parts[0] === 'done' && parts[1]) node = viewDone(parts[1]);
    else node = viewLessons();

    app.innerHTML = '';
    app.appendChild(node);
    updateTopProgress();
    window.scrollTo(0, 0);
  }

  // ---------- boot ----------
  applyAppearance();

  window.addEventListener('hashchange', render);
  window.addEventListener('storage', (e) => { if (e.key === KEY.settings) applyAppearance(); });
  async function boot() {
    if (api) {
      const me = await api.me();
      if (me.ok) {
        currentUser = me.user;
        await hydrateFromServer();
      }
      authChecked = true;
    }
    if (!LESSONS.length && app) app.appendChild(h('div', { class: 'container view' }, h('p', { class: 'callout callout-bad' }, 'Lessons failed to load.')));
    else render();
  }
  render();
  boot().catch(() => { authChecked = true; render(); });
})();
