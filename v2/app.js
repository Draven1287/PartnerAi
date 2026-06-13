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
     learningai-toolkit    [ { id, type, lessonId, fields, createdAt } ]  // saved notes/cards
     learningai-v2-lesson-notes:{lessonId}  side notebook text mirrored into Saved Notes
   ============================================================ */

(function () {
  let LESSONS = Array.isArray(window.LESSONS) ? window.LESSONS : [];
  let ARCS = window.V2_ARCS ? Object.values(window.V2_ARCS) : [];
  const KEY = {
    progress: 'learningai-progress',
    settings: 'learningai-settings',
    toolkit: 'learningai-toolkit',
    assessment: 'learningai-v2-assessment',
    diagnosticDraft: 'learningai-v2-diagnostic-draft',
    palette: 'learningai-v2-palette'
  };
  const api = window.LearningAIV2Api || null;
  let authChecked = !api;
  let backendUnavailable = false;
  let currentUser = null;
  let serverState = null;
  let curriculumLoadedFromBackend = false;

  // step kinds that REQUIRE completion before Next unlocks. Toolkit saving is intentionally optional.
  const GATED = new Set(['classify', 'exitCheck', 'promptRepair', 'biasSpot', 'agentDesign', 'workflowChain']);
  // arc colors for the mosaic (one hue per arc)
  const ARC_COLORS = ['#2563eb', '#0891b2', '#7c3aed', '#dc2626', '#ea580c', '#16a34a'];
  const AGE_RANGES = [
    ['', 'Choose age range'],
    ['under-13', 'Under 13'],
    ['13-15', '13-15'],
    ['16-18', '16-18'],
    ['19-24', '19-24'],
    ['25-34', '25-34'],
    ['35-49', '35-49'],
    ['50-plus', '50+'],
    ['prefer-not', 'Prefer not to say']
  ];
  const V2_PALETTES = [
    { id: 'clear-blue', name: 'Clear Blue', bg: '#f7f9fc', surface: '#ffffff', surface2: '#eef4f8', border: '#dbe3ea', text: '#121826', textDim: '#4b5870', accent: '#2563eb', accentSoft: '#dbeafe' },
    { id: 'teal-studio', name: 'Teal Studio', bg: '#f2fbfb', surface: '#ffffff', surface2: '#e2f3f2', border: '#c7dfdf', text: '#102026', textDim: '#45606a', accent: '#0f8b8d', accentSoft: '#d6f3f0' },
    { id: 'ink-coral', name: 'Ink Coral', bg: '#fbf7f4', surface: '#ffffff', surface2: '#f5e7df', border: '#e2d3ca', text: '#171821', textDim: '#5d5965', accent: '#e0523f', accentSoft: '#ffe1dc' },
    { id: 'green-amber', name: 'Green Amber', bg: '#f7faf4', surface: '#ffffff', surface2: '#edf4e4', border: '#d7e2ca', text: '#152015', textDim: '#4e604d', accent: '#2f7d4f', accentSoft: '#dff2e5' },
    { id: 'violet-mint', name: 'Violet Mint', bg: '#f8f7ff', surface: '#ffffff', surface2: '#eef7f4', border: '#ddd7f4', text: '#17152b', textDim: '#57516b', accent: '#6d5bd0', accentSoft: '#e7e3ff' }
  ];
  const DIAGNOSTIC_QUESTIONS = [
    {
      key: 'definition',
      category: 'Category 1',
      title: 'When someone says “AI,” what do they mean?',
      copy: 'Pick the answer you could explain and use reliably right now.',
      options: [
        ['0', 'A website that gives answers when you type questions.'],
        ['1', 'A computer program that can copy human writing and conversation.'],
        ['2', 'A trained model that finds patterns in data and uses those patterns to make predictions or decisions.'],
        ['3', 'A family of systems: language models, image models, recommendation systems, robots, agents, and tools that can act across software.']
      ]
    },
    {
      key: 'capability',
      category: 'Category 2',
      title: 'What can modern AI systems actually do?',
      copy: 'Imagine someone says, “AI is just a smarter search engine.” What do you think?',
      options: [
        ['0', 'That sounds right. It mostly finds information faster.'],
        ['1', 'It can answer questions, write drafts, and summarize text.'],
        ['2', 'It can explain, code, plan, translate, analyze images, simulate conversations, and help build tools.'],
        ['3', 'It can become part of a workflow: using tools, calling APIs, checking files, running code, and coordinating multi-step work.']
      ]
    },
    {
      key: 'limits',
      category: 'Category 3',
      title: 'When should you slow down and check?',
      copy: 'An AI gives a confident answer about a medical, legal, historical, or scientific fact. What would you actually do next?',
      options: [
        ['0', 'Trust it if the answer sounds detailed.'],
        ['1', 'Ask it again and see if it says the same thing.'],
        ['2', 'Ask for sources, then check reliable sources yourself.'],
        ['3', 'Treat the answer as a starting point, verify outside the model, and ask what evidence would change the answer.']
      ]
    },
    {
      key: 'learning',
      category: 'Category 4',
      title: 'How should you use AI without losing control?',
      copy: 'Pick what you would actually do when you are learning something new.',
      options: [
        ['0', 'Let it do the main thinking so you can move faster.'],
        ['1', 'Ask it to explain the answer in easier words.'],
        ['2', 'Ask for hints, examples, and a check so you still do the important thinking.'],
        ['3', 'Use it as a tutor, critic, and practice partner while protecting the skill you are trying to build.']
      ]
    },
    {
      key: 'impact',
      category: 'Category 5',
      title: 'How do you think about AI’s real-world costs?',
      copy: 'Someone says, “AI has real environmental and social costs.” What would you actually say back?',
      options: [
        ['0', 'They are wrong. New technology always wins.'],
        ['1', 'They are right. AI should probably be avoided.'],
        ['2', 'The costs are real, but we should compare them with benefits, efficiency improvements, and better infrastructure.'],
        ['3', 'We should ask better questions: which model, what task, how much energy, what alternative, what social benefit, and who pays the cost?']
      ]
    },
    {
      key: 'systems',
      category: 'Category 6',
      title: 'What do you know beyond chatbots?',
      copy: 'What comes after typing questions into a chatbot?',
      options: [
        ['0', 'Mostly better chatbots.'],
        ['1', 'Tools that write, summarize, and search faster.'],
        ['2', 'Personal tutors, coding helpers, research assistants, creative tools, and agents that use software.'],
        ['3', 'AI systems connected to data, tools, robots, labs, simulations, businesses, and scientific workflows.']
      ]
    }
  ];
  const QUESTION_INSIGHTS = {
    definition: {
      label: 'What AI actually is',
      lessonId: 'chapter-3',
      reason: 'Your answer suggests the next useful move is building a cleaner mental model of AI, not just using chat tools.'
    },
    capability: {
      label: 'What AI can do beyond search',
      lessonId: 'chapter-9',
      reason: 'Your answer suggests you should see models, tools, and agents as part of one working system.'
    },
    limits: {
      label: 'Checking confident AI answers',
      lessonId: 'chapter-8',
      reason: 'Your answer suggests the most important next habit is knowing why AI can sound right while being wrong.'
    },
    learning: {
      label: 'Keeping your thinking in charge',
      lessonId: 'chapter-1',
      reason: 'Your answer suggests the next useful move is setting rules for when AI helps you learn instead of replacing your thinking.'
    },
    impact: {
      label: 'Judgment and real-world tradeoffs',
      lessonId: 'chapter-1',
      reason: 'Your answer suggests you should start with human judgment before getting deeper into tools and workflows.'
    },
    systems: {
      label: 'AI systems beyond chatbots',
      lessonId: 'chapter-9',
      reason: 'Your answer suggests you are ready to connect chatbots, tools, agents, and workflows.'
    }
  };

  const app = document.getElementById('app');
  const progressBarFill = document.querySelector('.progress-bar > div');
  const shellNav = document.getElementById('v2-shell-nav');

  // ---------- storage ----------
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function readJson(k, fb) { try { const v = JSON.parse(get(k) || 'null'); return v == null ? fb : v; } catch (e) { return fb; } }
  function readProgress() { return readJson(KEY.progress, { completed: {} }); }
  function saveProgress(p) { return set(KEY.progress, JSON.stringify({ completed: p.completed || {}, savedAt: new Date().toISOString() })); }
  function readToolkit() { const t = readJson(KEY.toolkit, []); return Array.isArray(t) ? t : []; }
  function saveToolkit(c) { return set(KEY.toolkit, JSON.stringify(c.slice(0, 50))); }
  function readPendingToolkit() { const t = readJson('learningai-v2-pending-toolkit', []); return Array.isArray(t) ? t : []; }
  function savePendingToolkit(c) { return set('learningai-v2-pending-toolkit', JSON.stringify(c.slice(0, 50))); }
  function readPendingProgress() { const t = readJson('learningai-v2-pending-progress', []); return Array.isArray(t) ? t : []; }
  function savePendingProgress(c) { return set('learningai-v2-pending-progress', JSON.stringify(c.slice(0, 100))); }
  function readStepProgress() { const s = readJson('learningai-v2-step-progress', {}); return s && typeof s === 'object' ? s : {}; }
  function maxStepReached(id) { const v = readStepProgress()[id]; return Number.isInteger(v) && v > 0 ? v : 0; }
  function recordStepReached(id, idx) {
    const sp = readStepProgress();
    if ((Number.isInteger(sp[id]) ? sp[id] : 0) >= idx) return;
    sp[id] = idx;
    set('learningai-v2-step-progress', JSON.stringify(sp));
  }
  function currentUserKey() { return currentUser?.id || currentUser?.email || 'unknown'; }
  function importedUserKey() { return `learningai-v2-imported:${currentUserKey()}`; }
  function lessonNoteKey(lessonId) { return `learningai-v2-lesson-notes:${lessonId}`; }
  function saveToolkitCard(card, { queue = true } = {}) {
    const cards = readToolkit().filter(existing => existing.id !== card.id);
    saveToolkit([{ ...card, updatedAt: new Date().toISOString() }, ...cards]);
    if (queue) savePendingToolkit([card, ...readPendingToolkit().filter(existing => existing.id !== card.id)]);
  }
  function isCompleteV2Assessment(assessment) {
    const responses = Array.isArray(assessment?.responses) ? assessment.responses : [];
    const answered = new Set(responses.map(response => response?.key).filter(Boolean));
    return DIAGNOSTIC_QUESTIONS.every(question => answered.has(question.key));
  }
  function saveAssessmentLocal(assessment) {
    if (!isCompleteV2Assessment(assessment)) return false;
    set(KEY.assessment, JSON.stringify(assessment));
    set('modelwise-gauge', JSON.stringify(assessment));
    return true;
  }
  function clearV2LocalSession() {
    try {
      localStorage.removeItem(KEY.assessment);
      localStorage.removeItem('modelwise-gauge');
      localStorage.removeItem(KEY.diagnosticDraft);
      localStorage.removeItem('learningai-v2-pending-progress');
      localStorage.removeItem('learningai-v2-pending-toolkit');
      localStorage.removeItem('learningai-v2-pending-assessment');
      // Per-learner state must not leak to the next account on a shared
      // computer (school machines): step unlocks, notes, last-complete.
      localStorage.removeItem('learningai-v2-step-progress');
      localStorage.removeItem('learningai-v2-last-complete');
      // Completed-lessons map and saved notes are the most personal data and
      // were previously left behind. They are shared with V1, so a signed-in
      // V2 learner gets them back from the server on next login via
      // hydrateFromServer; clearing here keeps a shared machine private.
      localStorage.removeItem(KEY.progress);
      localStorage.removeItem(KEY.toolkit);
      Object.keys(localStorage)
        .filter(k => k.startsWith('learningai-v2-lesson-notes:'))
        .forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  }

  function normalizeCurriculumStep(step) {
    const payload = step?.payload && typeof step.payload === 'object' && !Array.isArray(step.payload) ? step.payload : {};
    return {
      ...payload,
      kind: step?.kind || payload.kind || 'reveal',
      title: step?.title || payload.title || '',
      gated: Boolean(step?.gated)
    };
  }

  function normalizeCurriculumLesson(lesson) {
    const steps = Array.isArray(lesson?.steps) ? lesson.steps.map(normalizeCurriculumStep) : [];
    return {
      id: lesson.id,
      num: Number(lesson.num) || 0,
      arc: lesson.arc || '',
      title: lesson.title || '',
      coreQuestion: lesson.coreQuestion || '',
      blurb: lesson.blurb || '',
      minutes: Number(lesson.minutes) || 8,
      resources: Array.isArray(lesson.resources) ? lesson.resources : [],
      stub: Boolean(lesson.stub || lesson.status !== 'published' || !steps.length),
      steps
    };
  }

  function applyCurriculum(curriculum) {
    if (!curriculum || !Array.isArray(curriculum.lessons) || !curriculum.lessons.length) return false;
    LESSONS = curriculum.lessons
      .map(normalizeCurriculumLesson)
      .filter(lesson => lesson.id && lesson.title)
      .sort((a, b) => a.num - b.num);
    const moduleTitles = Array.isArray(curriculum.modules)
      ? curriculum.modules.map(module => module.title).filter(Boolean)
      : [];
    ARCS = moduleTitles.length ? moduleTitles : [...new Set(LESSONS.map(lesson => lesson.arc).filter(Boolean))];
    curriculumLoadedFromBackend = true;
    return true;
  }

  async function loadCurriculumFromBackend() {
    if (!api?.curriculum || !currentUser) return false;
    const result = await api.curriculum().catch(() => ({ ok: false }));
    if (!result.ok) return false;
    return applyCurriculum(result.curriculum);
  }

  function applyServerState(state) {
    if (!state) return;
    serverState = state;
    currentUser = state.user || currentUser;
    if (isCompleteV2Assessment(state.assessment)) saveAssessmentLocal(state.assessment);
    if (Array.isArray(state.progress)) {
      const completed = {};
      state.progress.forEach(row => {
        if (row.completedAt) completed[row.lessonId] = { completedAt: row.completedAt };
      });
      saveProgress({ completed });
    }
    if (Array.isArray(state.toolkit)) {
      const pending = readPendingToolkit();
      const syncedCards = state.toolkit.map(card => ({
        id: card.id,
        type: card.cardType,
        lessonId: card.lessonId,
        fields: card.payload?.fields || card.payload || {},
        fieldLabels: card.payload?.fieldLabels || {},
        createdAt: card.createdAt
      }));
      const syncedIds = new Set(syncedCards.map(card => card.id));
      saveToolkit([...pending.filter(card => !syncedIds.has(card.id)), ...syncedCards]);
    }
  }

  function queueProgressSave(progress) {
    const key = `${progress.lessonId}:${progress.completed ? 'done' : 'step'}`;
    const pending = readPendingProgress().filter(item => item.key !== key);
    pending.unshift({ key, progress, queuedAt: new Date().toISOString() });
    savePendingProgress(pending);
  }

  async function saveProgressToBackend(progress) {
    if (!api || !currentUser) {
      queueProgressSave(progress);
      return false;
    }
    const result = await api.saveProgress(progress).catch(() => ({ ok: false }));
    if (!result.ok) {
      queueProgressSave(progress);
      return false;
    }
    return true;
  }

  async function syncPendingProgress() {
    if (!api || !currentUser) return;
    const pending = readPendingProgress();
    if (!pending.length) return;
    const stillPending = [];
    for (const item of pending) {
      const result = await api.saveProgress(item.progress).catch(() => ({ ok: false }));
      if (!result.ok) stillPending.push(item);
    }
    savePendingProgress(stillPending);
  }

  async function syncPendingToolkit() {
    if (!api || !currentUser) return;
    const pending = readPendingToolkit();
    if (!pending.length) return;
    const stillPending = [];
    for (const card of pending) {
      const result = await api.saveToolkit({ id: card.id, cardType: card.type, lessonId: card.lessonId, payload: { fields: card.fields, fieldLabels: card.fieldLabels || {} } }).catch(() => ({ ok: false }));
      if (!result.ok) stillPending.push(card);
    }
    savePendingToolkit(stillPending);
  }

  // ---------- theming (mirrors V1 applyAppearance for common themes) ----------
  function applyAppearance() {
    const s = readJson(KEY.settings, {}) || {};
    const b = document.body, t = b.style;
    applyV2Palette();
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

  function apiErrorText(error) {
    if (error === 'network_error') return 'Could not reach the server. Check your connection and try again.';
    if (error === 'request_timeout') return 'The server took too long to respond. Please try again.';
    if (error === 'invalid_credentials') return 'That email and password did not match an account.';
    if (error === 'email_exists') return 'That email already has an account. Use Sign in instead.';
    return error || 'Could not complete that request.';
  }

  function activePalette() {
    const id = get(KEY.palette) || 'green-amber';
    return V2_PALETTES.find(palette => palette.id === id) || V2_PALETTES[0];
  }

  function applyV2Palette() {
    const palette = activePalette();
    const t = document.body.style;
    t.setProperty('--bg', palette.bg);
    t.setProperty('--surface', palette.surface);
    t.setProperty('--surface-2', palette.surface2);
    t.setProperty('--border', palette.border);
    t.setProperty('--text', palette.text);
    t.setProperty('--text-dim', palette.textDim);
    t.setProperty('--text-faint', palette.textDim);
    t.setProperty('--accent', palette.accent);
    t.setProperty('--accent-soft', palette.accentSoft);
  }

  // Only allow link schemes that can't execute script. Anything else
  // (javascript:, data:, vbscript:) becomes an inert anchor. Lesson
  // resources can come from admin-authored backend curriculum, so this
  // guards every rendered href, not just the bundled lessons.
  function safeUrl(url) {
    const value = String(url == null ? '' : url).trim();
    return /^(https?:|mailto:|#|\/|\.)/i.test(value) ? value : '#';
  }

  // ---------- DOM helper ----------
  function h(tag, attrs, kids) {
    const el = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') el.className = attrs[k];
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
  function doneCount() { const c = readProgress().completed; return LESSONS.filter(l => !l.stub && c[l.id]).length; }
  function markComplete(id) {
    const lesson = LESSONS.find(l => l.id === id);
    if (!lesson || lesson.stub) return;
    const p = readProgress();
    if (p.completed[id]?.completedAt) return; // keep the original completion date
    p.completed[id] = { completedAt: new Date().toISOString() };
    saveProgress(p);
    set('learningai-v2-last-complete', id);
    saveProgressToBackend({ lessonId: id, completed: true, currentStep: 999 });
  }
  function nextIncomplete() { const c = readProgress().completed; return LESSONS.find(l => !l.stub && !c[l.id]) || null; }
  function playableLesson(id) {
    return LESSONS.find(lesson => lesson.id === id && !lesson.stub) || null;
  }
  function recommendedFromAssessment(assessment) {
    if (!isCompleteV2Assessment(assessment)) return null;
    const responses = Array.isArray(assessment.responses) ? assessment.responses : [];
    const sorted = responses.slice().sort((a, b) => (Number(a.score) || 0) - (Number(b.score) || 0));
    const weakest = sorted[0] || null;
    const strongest = sorted[sorted.length - 1] || null;
    const score = Number(assessment.scorePercent ?? assessment.score) || 0;
    const level = assessment.level || (score < 45 ? 'Foundation' : score < 75 ? 'Explorer' : 'Builder');
    const fallbackLessonId = level === 'Builder' ? 'chapter-9' : level === 'Explorer' ? 'chapter-6' : 'chapter-1';
    const insight = QUESTION_INSIGHTS[weakest?.key] || QUESTION_INSIGHTS[assessment.weakestKey] || QUESTION_INSIGHTS.definition;
    const lesson = playableLesson(insight.lessonId) || playableLesson(fallbackLessonId) || nextIncomplete();
    return {
      level,
      score,
      weakest,
      strongest,
      focusLabel: insight.label,
      reason: insight.reason,
      lesson,
      lessonId: lesson?.id || insight.lessonId,
      strongestLabel: QUESTION_INSIGHTS[strongest?.key]?.label || strongest?.category || ''
    };
  }
  function updateTopProgress() { if (progressBarFill) progressBarFill.style.width = `${Math.round(doneCount() / LESSONS.length * 100)}%`; }

  function recordInteraction(step, payload) {
    if (!api || !currentLessonId) return;
    const stepIndex = currentLessonStepIndex;
    const correct = typeof payload?.correct === 'boolean' ? payload.correct : null;
    api.saveInteraction({
      lessonId: currentLessonId,
      stepIndex,
      stepKind: step.kind,
      payload,
      correct
    }).catch(() => {});
    if (step.kind === 'exitCheck' && api.submitQuizAnswer) {
      api.submitQuizAnswer({
        lessonId: currentLessonId,
        stepIndex,
        quizKey: step.title || step.question || 'exit-check',
        answer: payload,
        correct,
        feedback: payload?.feedback || ''
      }).catch(() => {});
    }
    // Only count an activity as completed when the renderer says the whole
    // step is done — not on every click (wrong picks included).
    if (GATED.has(step.kind) && step.kind !== 'exitCheck' && payload?.completed === true && api.completeActivity) {
      api.completeActivity({
        lessonId: currentLessonId,
        stepIndex,
        activityKind: step.kind,
        activityKey: step.title || step.cardType || step.kind,
        payload
      }).catch(() => {});
    }
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
      const locked = !!l.stub;
      const current = l.id === opts.currentId;
      const justUnlocked = l.id === get('learningai-v2-last-complete');
      const cell = h(locked ? 'span' : 'a', {
        class: 'mz' + (filled ? ' filled' : '') + (locked ? ' locked' : '') + (current ? ' current' : '') + (l.id === opts.activeId ? ' active' : '') + (justUnlocked ? ' just-unlocked' : ''),
        href: locked ? null : `#/lesson/${l.id}/0`,
        title: `${l.num}. ${l.title}${filled ? ' ✓' : locked ? ' (coming soon)' : ''}`,
        style: `--tile-col:${col};--tile-row:${row};`
      });
      cell.appendChild(h('span', { class: 'mz-num' }, String(l.num)));
      grid.appendChild(cell);
    });
    try { localStorage.removeItem('learningai-v2-last-complete'); } catch (e) {}
    return grid;
  }

  // ---------- saved notes ----------
  function buildToolkitPanel() {
    const cards = readToolkit();
    const body = h('div', { class: 'tk-list tk-inline-list' });
    if (!cards.length) {
      body.appendChild(h('p', { class: 'muted' }, 'Your saved notes will appear here: quick notebook thoughts, agency rules, prompt repairs, verification checks, and workflow cards.'));
    }
    if (cards.length) {
      cards.slice(0, 8).forEach(card => {
        const lesson = LESSONS.find(l => l.id === card.lessonId);
        const fields = Object.keys(card.fields || {}).map(k => h('p', null, [h('strong', null, `${card.fieldLabels?.[k] || k}: `), card.fields[k] || '—']));
        body.appendChild(h('article', { class: 'tk-card' }, [
          h('span', { class: 'tk-type' }, `${card.type}${lesson ? ' · ' + lesson.title : ''}`),
          ...fields,
        ]));
      });
    }
    return h('section', { class: 'lesson-toolkit', id: 'lesson-toolkit' }, [
      h('div', { class: 'section-heading' }, 'Your saved notes'),
      h('h2', null, cards.length ? 'Notes and reusable cards from the lessons' : 'Save thoughts as you go'),
      h('p', { class: 'muted' }, 'Saved Notes is your notebook for optional lesson notes, useful prompts, checks, and workflow cards. It is for you, not a requirement for finishing a step.'),
      body
    ]);
  }

  function buildLessonNotebook(lesson) {
    const noteKey = lessonNoteKey(lesson.id);
    const noteId = `lesson-note-${lesson.id}`;
    const initial = get(noteKey) || '';
    const status = h('p', { class: 'lesson-notebook-status muted', 'aria-live': 'polite' }, initial ? 'Saved in Saved Notes.' : 'Type here if you want notes. This is optional.');
    // Debounce the server sync so notes reach the backend during the session
    // (not only on the next page load) without a request per keystroke.
    let syncTimer;
    const textarea = h('textarea', {
      id: noteId,
      rows: '9',
      placeholder: 'Write anything you want to remember from this lesson...',
      oninput: event => {
        const text = event.target.value.trim();
        set(noteKey, event.target.value);
        if (!text) {
          clearTimeout(syncTimer);
          const remaining = readToolkit().filter(card => card.id !== noteId);
          saveToolkit(remaining);
          savePendingToolkit(readPendingToolkit().filter(card => card.id !== noteId));
          status.textContent = 'Notebook cleared. Nothing was saved.';
          return;
        }
        const card = {
          id: noteId,
          type: 'Saved note',
          lessonId: lesson.id,
          fields: { note: text },
          fieldLabels: { note: 'Note' },
          createdAt: new Date().toISOString()
        };
        saveToolkitCard(card);
        status.textContent = 'Autosaved to Saved Notes.';
        clearTimeout(syncTimer);
        syncTimer = setTimeout(() => { syncPendingToolkit(); }, 1200);
      }
    }, initial);
    return h('aside', { class: 'lesson-notebook', 'aria-label': 'Lesson notebook' }, [
      h('div', { class: 'section-heading' }, 'Saved Notes'),
      h('h2', null, 'Lesson notebook'),
      h('p', { class: 'muted' }, 'Use this like margin notes. It autosaves into Saved Notes, but you never have to write here to move on.'),
      textarea,
      status
    ]);
  }

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
    workflowChain(s, ctx) {
      const correct = s.correct || [];
      const choices = (s.choices || correct).slice().sort((a, b) => a.localeCompare(b));
      const picked = [];
      const fb = h('p', { class: 'step-feedback' }, '');
      const list = h('ol', { class: 'workflow-picked' });
      const buttons = choices.map(choice => h('button', { class: 'chip', onclick: (e) => {
        const expected = correct[picked.length];
        const ok = choice === expected;
        recordInteraction(s, { choice, expected, position: picked.length + 1, correct: ok });
        if (!ok) {
          fb.textContent = `Not yet — before “${choice}”, you need “${expected}.”`;
          e.target.classList.add('wrong');
          setTimeout(() => e.target.classList.remove('wrong'), 900);
          return;
        }
        picked.push(choice);
        e.target.disabled = true;
        e.target.classList.add('right');
        list.appendChild(h('li', null, choice));
        if (picked.length === correct.length) {
          fb.textContent = '✓ That is a repeatable workflow, not just a one-off prompt.';
          recordInteraction(s, { completed: true, correct: true, steps: correct.length });
          ctx.unlock();
        } else {
          fb.textContent = `Good. Pick step ${picked.length + 1}.`;
        }
      } }, choice));
      return card([tag('Build a workflow'), h('h2', null, s.title), h('div', { class: 'callout' }, [h('strong', null, 'Goal: '), s.goal]),
        h('p', { class: 'muted' }, 'Pick the workflow steps in the safest useful order:'), h('div', { class: 'chip-row' }, buttons), list, fb,
        s.note ? h('p', { class: 'why' }, s.note) : null, lockHint('Build the workflow in order to continue.')]);
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
            recordInteraction(s, { item: item.text, selected: s.buckets[bi], correct: ok });
            if (ok) {
              row.dataset.done = '1'; row.classList.remove('wrong'); row.classList.add('right'); e.target.classList.add('selected');
              correct++; if (correct === s.items.length) { fb.textContent = '✓ ' + (s.reveal || 'All sorted — nice.'); recordInteraction(s, { completed: true, correct: true, items: s.items.length }); ctx.unlock(); }
            }
            else {
              row.classList.add('wrong'); e.target.classList.add('wrong');
              fb.textContent = `Not quite — that one belongs in “${s.buckets[item.answer]}.” Try that row again.`;
              setTimeout(() => { row.classList.remove('wrong'); e.target.classList.remove('wrong'); }, 900);
            }
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
            e.target.classList.add('right'); fb.textContent = '✓ ' + o.feedback; recordInteraction(s, { selected: o.text, correct: true, feedback: o.feedback }); ctx.unlock();
          } else { e.target.classList.add('wrong'); e.target.disabled = true; fb.textContent = '✗ ' + o.feedback; recordInteraction(s, { selected: o.text, correct: false, feedback: o.feedback }); }
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
          recordInteraction(s, { fields, completed: true, correct: true });
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
        class: 'btn btn-primary', onclick: async (e) => {
          const btn = e.target;
          if (btn.disabled) return;
          const wrap = btn.closest('.lesson-card');
          const fields = {}, labels = {}; let any = false;
          wrap.querySelectorAll('input[data-key]').forEach(inp => {
            fields[inp.dataset.key] = inp.value.trim();
            const f = s.fields.find(x => x.key === inp.dataset.key); labels[inp.dataset.key] = f ? f.label : inp.dataset.key;
            if (inp.value.trim()) any = true;
          });
          if (!any) { fb.textContent = 'Fill in at least one field first.'; return; }
          // Block a second click from creating a duplicate card while the
          // first save (and its network round-trip) is still in flight.
          btn.disabled = true;
          try {
            const cardId = 'card-' + Date.now();
            saveToolkitCard({ id: cardId, type: s.cardType, lessonId: currentLessonId, fields, fieldLabels: labels, createdAt: new Date().toISOString() }, { queue: false });
            fb.textContent = 'Saved locally. Syncing...';
            const synced = api ? await api.saveToolkit({ id: cardId, cardType: s.cardType, lessonId: currentLessonId, payload: { fields, fieldLabels: labels } }).catch(() => ({ ok: false })) : { ok: false, skipped: true };
            if (!synced.ok) savePendingToolkit([readToolkit().find(card => card.id === cardId), ...readPendingToolkit().filter(card => card.id !== cardId)].filter(Boolean));
            recordInteraction(s, { fields, synced: !!synced.ok });
            fb.textContent = synced.ok ? 'Saved to Saved Notes.' : 'Saved locally. It is queued to sync after the backend is available.';
          } finally {
            btn.disabled = false;
          }
        }
      }, 'Save to Saved Notes');
      return card([tag('Optional save'), h('h2', null, s.title),
        h('div', { class: 'callout toolkit-explainer' }, [
          h('strong', null, 'What is Saved Notes? '),
          'It is your saved-notes space: a place to keep useful prompts, checks, rules, workflows, and lesson notes. It is like note-taking, not a test.'
        ]),
        h('p', { class: 'muted' }, 'Fill this in only if it would help you later. The Next button is not tied to saving; you can move on without saving anything.'),
        h('div', { class: 'pr-fields' }, inputs),
        h('div', { class: 'row-gap toolkit-actions' }, [saveBtn]), fb]);
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
            if (found >= biased.size) { fb.textContent = '✓ ' + (s.reveal || 'You caught the loaded language.'); recordInteraction(s, { completed: true, correct: true, found: biased.size }); ctx.unlock(); }
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
          if (t.useful) { usefulFound++; if (usefulFound >= usefulTotal) { fb.textContent = '✓ Those are the tools this agent needs.'; recordInteraction(s, { completed: true, correct: true, tools: usefulTotal }); ctx.unlock(); } }
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
      h('div', { class: 'tagline' }, 'Learning AI'),
      h('h1', null, 'Sign in to save your progress'),
      h('p', { class: 'lead' }, 'We use your email only to sign you in and save your progress. We will not send ads. We will not ask you for money. We will not sell your information.'),
      h('p', { class: 'muted' }, 'Each email creates its own learner account. To switch learners, sign out and use a different email.'),
      h('label', { class: 'pr-field' }, [h('span', null, 'Email'), h('input', { name: 'email', type: 'email', autocomplete: 'email', required: 'true' })]),
      h('label', { class: 'pr-field' }, [h('span', null, 'Password'), h('input', { name: 'password', type: 'password', autocomplete: 'current-password', required: 'true', minlength: '8' })]),
      h('label', { class: 'pr-field' }, [h('span', null, 'Display name'), h('input', { name: 'displayName', type: 'text', autocomplete: 'name', maxlength: '40', placeholder: 'Required when creating an account' })]),
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
      const buttons = Array.from(form.querySelectorAll('button[type="submit"]'));
      buttons.forEach(button => { button.disabled = true; });
      if (mode === 'signup' && !String(data.displayName || '').trim()) {
        buttons.forEach(button => { button.disabled = false; });
        message.textContent = 'Add your display name before creating an account.';
        return;
      }
      message.textContent = mode === 'signup' ? 'Creating account...' : 'Signing in...';
      const result = mode === 'signup' ? await api.signup(data) : await api.login(data);
      buttons.forEach(button => { button.disabled = false; });
      if (!result.ok) {
        message.textContent = apiErrorText(result.error);
        return;
      }
      currentUser = result.user;
      if (mode === 'signup') {
        serverState = null;
        clearV2LocalSession();
      }
      await hydrateFromServer({ importLocal: mode !== 'signup' });
      location.hash = '#/';
      render();
    });
    return h('div', { class: 'container view auth-view' }, [form]);
  }

  function viewApiUnavailable() {
    return h('div', { class: 'container view auth-view' }, [
      h('section', { class: 'lesson-card diagnostic-card' }, [
        h('div', { class: 'tagline' }, 'Learning AI'),
        h('h1', null, "We can't reach your account right now"),
        h('p', { class: 'lead' }, "Your lessons are safe — we just couldn't connect to save and load your progress. This is usually a short network hiccup."),
        h('p', { class: 'muted' }, 'Check your internet connection, then try again.'),
        h('div', { class: 'row-gap' }, [
          h('button', { class: 'btn btn-primary', onclick: () => {
            backendUnavailable = false;
            authChecked = false;
            render();
            boot().catch(() => { authChecked = true; render(); });
          } }, 'Try again')
        ])
      ])
    ]);
  }

  async function hydrateFromServer(options = {}) {
    if (!api) return;
    const shouldImportBrowserData = options.importLocal !== false;
    await syncPendingProgress();
    await syncPendingToolkit();
    // Retry a questionnaire that couldn't be uploaded when it was finished.
    const pendingAssessment = currentUser ? readJson('learningai-v2-pending-assessment', null) : null;
    if (pendingAssessment) {
      const saved = await api.saveAssessment(pendingAssessment).catch(() => ({ ok: false }));
      if (saved.ok) { try { localStorage.removeItem('learningai-v2-pending-assessment'); } catch (e) {} }
    }
    await loadCurriculumFromBackend();
    let state = await api.state();
    const shouldImportLocal = shouldImportBrowserData && currentUser && !get('learningai-v2-imported-ever') && !get(importedUserKey());
    if (shouldImportLocal) {
      const imported = await api.importLocal({ progress: readProgress(), toolkit: readToolkit() }).catch(() => ({ ok: false }));
      if (imported.ok) {
        const importedAt = new Date().toISOString();
        set(importedUserKey(), importedAt);
        set('learningai-v2-imported-ever', importedAt);
        state = await api.state();
      }
      // On import failure, still apply the state we already fetched; the
      // import retries on the next sign-in because the flag stays unset.
    }
    if (state.ok) applyServerState(state.state);
    api.saveVisit({ path: location.hash || '#/', referrer: document.referrer || '' }).catch(() => {});
  }

  function accountBar() {
    if (!currentUser) return null;
    const questionnaireLabel = hasAssessment() ? 'Retake questionnaire' : 'Take questionnaire';
    return h('div', { class: 'account-bar' }, [
      h('span', null, `Signed in as ${currentUser.displayName || currentUser.email}`),
      h('a', { class: 'btn btn-ghost', href: '#/' }, 'Dashboard'),
      h('a', { class: 'btn btn-ghost', href: '#/questionnaire' }, questionnaireLabel),
      h('button', { class: 'btn btn-ghost', onclick: async () => {
        const out = await api.logout();
        // If logout never reached the server (offline / timeout) the session
        // cookie survives, so the next person on a shared machine would be
        // silently signed back in at boot. Record the intent and retry there.
        if (!out || !out.ok) { try { localStorage.setItem('learningai-v2-pending-logout', '1'); } catch (e) {} }
        currentUser = null;
        serverState = null;
        clearV2LocalSession();
        location.hash = '#/';
        render();
      } }, 'Sign out')
    ]);
  }

  function assessmentResult() {
    // For signed-in users prefer the server copy, but fall back to the
    // last-known-good local cache (applyServerState keeps it in sync) so a
    // single transient api.state() failure can't re-gate a learner who has
    // already finished the questionnaire and overwrite their starting point.
    const candidates = [
      serverState?.assessment,
      readJson(KEY.assessment, null),
      readJson('modelwise-gauge', null)
    ];
    return candidates.find(isCompleteV2Assessment) || null;
  }

  function hasAssessment() {
    return !!assessmentResult();
  }

  function setShellVisible(visible) {
    document.body.classList.toggle('v2-onboarding', !visible);
    document.body.classList.toggle('v2-shell-ready', visible);
    if (shellNav) shellNav.hidden = !visible;
  }

  function updateShellChrome(routeParts) {
    const onDiagnostic = routeParts?.[0] === 'diagnostic' || routeParts?.[0] === 'questionnaire';
    const ready = authChecked && (!api || (currentUser && !onDiagnostic));
    setShellVisible(Boolean(ready));
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href') || '';
      const route = routeParts?.[0] || '';
      const active = (href === '#/' && (!routeParts || routeParts.length === 0)) || href === `#/${route}`;
      link.classList.toggle('active', active);
    });
  }

  function learningMode() {
    const profile = recommendedFromAssessment(assessmentResult());
    return profile?.level ? `${profile.level} mode` : 'Explorer mode';
  }

  function diagnosticSummary() {
    const profile = recommendedFromAssessment(assessmentResult());
    if (!profile) return 'Take the diagnostic to set your starting point.';
    const lessonCopy = profile.lesson ? `Recommended next: Lesson ${profile.lesson.num}, ${profile.lesson.title}.` : '';
    return `${profile.reason} ${lessonCopy}`;
  }

  function viewDiagnostic() {
    const draft = readJson(KEY.diagnosticDraft, { index: 0, answers: {}, notes: {} });
    draft.answers = draft.answers || {};
    draft.notes = draft.notes || {};
    draft.profile = draft.profile || {};
    const total = DIAGNOSTIC_QUESTIONS.length;
    const index = Math.max(0, Math.min(Number(draft.index) || 0, total - 1));
    const question = DIAGNOSTIC_QUESTIONS[index];
    const message = h('p', { class: 'step-feedback', 'aria-live': 'polite' }, '');

    function saveDraft(nextDraft) {
      set(KEY.diagnosticDraft, JSON.stringify(nextDraft));
    }

    function selectedAnswer() {
      return draft.answers[question.key] || null;
    }

    function saveCurrentAnswer(value, label) {
      draft.answers[question.key] = {
        key: question.key,
        category: question.category,
        value,
        label,
        score: Number(value)
      };
      saveDraft(draft);
    }

    function buildAssessment() {
      const responses = DIAGNOSTIC_QUESTIONS.map(q => ({
        ...(draft.answers[q.key] || {}),
        freeText: String(draft.notes[q.key] || '').trim()
      }));
      const totalScore = responses.reduce((sum, response) => sum + (Number(response.score) || 0), 0);
      const maxScore = DIAGNOSTIC_QUESTIONS.length * 3;
      const scorePercent = Math.round((totalScore / maxScore) * 100);
      const level = scorePercent < 45 ? 'Foundation' : scorePercent < 75 ? 'Explorer' : 'Builder';
      const sorted = responses.slice().sort((a, b) => (Number(a.score) || 0) - (Number(b.score) || 0));
      const weakestResponse = sorted[0] || {};
      const strongestResponse = sorted[sorted.length - 1] || {};
      const weakest = weakestResponse.category || '';
      const strongest = strongestResponse.category || '';
      const insight = QUESTION_INSIGHTS[weakestResponse.key] || QUESTION_INSIGHTS.definition;
      const assessment = {
        level,
        route: level,
        score: scorePercent,
        scorePercent,
        scoreRaw: totalScore,
        maxScore,
        ageRange: draft.profile.ageRange || 'prefer-not',
        weakestKey: weakestResponse.key || '',
        strongestKey: strongestResponse.key || '',
        focusLabel: insight.label,
        recommendedLessonId: insight.lessonId,
        recommendationReason: insight.reason,
        primaryGoal: 'Learn AI with judgment, practice, and useful projects.',
        learningStyle: 'Interactive V2 lessons with checks before moving on.',
        mainConcern: weakest ? `Needs the most support in ${weakest}.` : 'Build strong AI judgment.',
        weakestCategory: weakest,
        strongestCategory: strongest,
        completedAt: new Date().toISOString(),
        responses
      };
      return assessment;
    }

    function canMove() {
      if (index === 0 && !draft.profile.ageRange) {
        message.textContent = 'Choose an age range first. Use “Prefer not to say” if you do not want to answer.';
        return false;
      }
      if (selectedAnswer()) return true;
      message.textContent = `Choose one answer for ${question.category} first.`;
      return false;
    }

    const progressFill = h('span', { style: `width:${Math.round(((index + 1) / total) * 100)}%` });
    const ageSelect = index === 0 ? h('label', { class: 'diagnostic-profile' }, [
      h('span', null, 'Age range'),
      h('select', { onchange: event => {
        draft.profile.ageRange = event.target.value;
        saveDraft(draft);
      } }, AGE_RANGES.map(([value, label]) => h('option', {
        value,
        selected: draft.profile.ageRange === value ? 'true' : null
      }, label)))
    ]) : null;
    const options = h('div', { class: 'diagnostic-options' }, question.options.map(([value, label], optionIndex) => h('label', { 'data-shortcut': String(optionIndex + 1) }, [
      h('input', {
        type: 'radio',
        name: question.key,
        value,
        checked: selectedAnswer()?.value === value ? 'true' : null,
        onchange: () => saveCurrentAnswer(value, label)
      }),
      h('span', null, [h('strong', { class: 'shortcut-num' }, `${optionIndex + 1}. `), label])
    ])));
    const note = h('textarea', {
      placeholder: 'Optional: add nuance in your own words.',
      oninput: event => {
        draft.notes[question.key] = event.target.value;
        saveDraft(draft);
      }
    }, draft.notes[question.key] || '');
    const back = h('button', { class: 'btn btn-ghost', type: 'button', disabled: index === 0 ? 'true' : null, onclick: () => {
      draft.index = Math.max(0, index - 1);
      saveDraft(draft);
      render();
    } }, 'Back');
    const next = h('button', { class: 'btn btn-primary', type: 'button', onclick: () => {
      if (!canMove()) return;
      draft.index = Math.min(total - 1, index + 1);
      saveDraft(draft);
      render();
    } }, 'Next category');
    const finish = h('button', { class: 'btn btn-primary', type: 'button', onclick: async () => {
      if (!canMove()) return;
      const missing = DIAGNOSTIC_QUESTIONS.find(q => !draft.answers[q.key]);
      if (missing) {
        draft.index = DIAGNOSTIC_QUESTIONS.indexOf(missing);
        saveDraft(draft);
        render();
        return;
      }
      const assessment = buildAssessment();
      message.textContent = 'Saving your starting point...';
      if (api && currentUser) {
        const saved = await api.saveAssessment(assessment).catch(() => ({ ok: false }));
        // Never trap the learner at the gate: on failure keep the answers
        // locally and retry the upload on the next session sync.
        if (!saved.ok) set('learningai-v2-pending-assessment', JSON.stringify(assessment));
      }
      saveAssessmentLocal(assessment);
      serverState = { ...(serverState || {}), assessment };
      localStorage.removeItem(KEY.diagnosticDraft);
      location.hash = '#/';
      render();
    } }, 'Finish and open dashboard');

    // Only offer a way out when a starting point already exists — otherwise
    // the dashboard route just gates straight back here.
    const returnLink = hasAssessment() ? h('p', { class: 'questionnaire-return' }, h('a', { href: '#/' }, 'Take me back to my dashboard')) : null;

    return h('div', { class: 'container view auth-view' }, [
      h('section', { class: 'lesson-card diagnostic-card' }, [
        h('div', { class: 'gauge-progress diagnostic-progress' }, [
          h('span', null, `${question.category} of 6`),
          h('div', null, progressFill)
        ]),
        h('h1', null, 'Set your starting point'),
        h('div', { class: 'gauge-kicker' }, question.category),
        h('h2', null, question.title),
        h('p', { class: 'lead' }, question.copy),
        ageSelect,
        options,
        note,
        h('div', { class: 'gauge-actions' }, [back, index === total - 1 ? finish : next]),
        message,
        returnLink
      ])
    ]);
  }

  function lessonCatalogSections(next, completed) {
    return ARCS.map((arcName, ai) => {
      const inArc = LESSONS.filter(l => l.arc === arcName);
      if (!inArc.length) return null;
      const arcDone = inArc.filter(l => completed[l.id]).length;
      return h('section', { class: 'arc' }, [
        h('div', { class: 'arc-catalog-head' }, [
          h('h2', { class: 'arc-title' }, [h('span', { class: 'arc-num', style: `background:${ARC_COLORS[ai]}1a;color:${ARC_COLORS[ai]}` }, `Arc ${ai + 1}`), arcName]),
          h('span', { class: 'arc-count' }, `${arcDone}/${inArc.length} complete`)
        ]),
        h('div', { class: 'lesson-grid' }, inArc.map(l => {
          const locked = !!l.stub;
          const current = next && next.id === l.id;
          const done = !!completed[l.id];
          return h(locked ? 'span' : 'a', {
            class: 'lesson-tile' + (done ? ' completed' : '') + (locked ? ' locked' : '') + (current ? ' current' : ''),
            href: locked ? null : `#/lesson/${l.id}/0`
          }, [
            h('span', { class: 'lt-num' }, done ? '✓' : String(l.num)),
            h('span', { class: 'lt-copy' }, [
              h('span', { class: 'lt-title' }, l.title),
              h('span', { class: 'lt-q' }, l.coreQuestion)
            ]),
            h('span', { class: 'lt-action' + (locked ? ' locked' : '') + (current ? ' next' : '') }, locked ? 'Coming soon' : done ? 'Review lesson' : current ? 'Open next lesson' : 'Open lesson')
          ]);
        }))
      ]);
    }).filter(Boolean);
  }

  function viewDashboard() {
    const c = readProgress().completed;
    const done = doneCount();
    const pct = Math.round(done / LESSONS.length * 100);
    const profile = recommendedFromAssessment(assessmentResult());
    const recommendedLesson = profile?.lesson || null;
    const firstPathLesson = done === 0 && recommendedLesson && !c[recommendedLesson.id] ? recommendedLesson : null;
    const next = firstPathLesson || nextIncomplete();
    const authoredTotal = LESSONS.filter(l => !l.stub).length;
    const mode = learningMode();

    const arcCards = ARCS.map((arcName, ai) => {
      const inArc = LESSONS.filter(l => l.arc === arcName && !l.stub);
      const arcDone = inArc.filter(l => c[l.id]).length;
      return h('div', { class: 'arc-progress-row' }, [
        h('strong', null, `Arc ${ai + 1}: ${arcName}`),
        h('span', { class: 'muted' }, `${arcDone}/${inArc.length || LESSONS.filter(l => l.arc === arcName).length}`),
        h('progress', { value: String(arcDone), max: String(inArc.length || 1) })
      ]);
    });

    return h('div', { class: 'container view v2-dashboard' }, [
      accountBar(),
      h('section', { class: 'dashboard-hero' }, [
        h('div', { class: 'dashboard-primary' }, [
          h('div', { class: 'tagline' }, next ? `${mode} · ${firstPathLesson ? 'recommended start' : 'next lesson'} ${next.num}` : 'Course progress'),
          h('h1', null, next ? next.coreQuestion : 'Every authored lesson is complete'),
          h('p', { class: 'lead' }, next ? `${next.title}. ${firstPathLesson && profile ? profile.reason : 'Complete the guided interactions to reveal the next painting tile.'}` : 'Review your Saved Notes, then start a real project with the patterns you saved.'),
          h('div', { class: 'dashboard-stats' }, [
            h('div', { class: 'dash-stat' }, [h('strong', null, `${done}`), h('span', null, 'tiles revealed')]),
            h('div', { class: 'dash-stat' }, [h('strong', null, `${pct}%`), h('span', null, 'complete')]),
            h('div', { class: 'dash-stat' }, [h('strong', null, profile ? `${profile.score ?? 0}%` : 'Needed'), h('span', null, 'questionnaire')]),
            h('div', { class: 'dash-stat' }, [h('strong', null, `${readToolkit().length}`), h('span', null, 'saved notes')])
          ]),
          h('div', { class: 'row-gap' }, [
            next ? h('a', { class: 'btn btn-primary', href: `#/lesson/${next.id}/0` }, firstPathLesson ? `Start recommended lesson ${next.num}` : done ? `Continue lesson ${next.num}` : `Start lesson ${next.num}`)
                 : h('a', { class: 'btn btn-primary', href: '#/projects' }, 'Start a project'),
            firstPathLesson && playableLesson('chapter-1') && firstPathLesson.id !== 'chapter-1' ? h('a', { class: 'btn btn-ghost', href: '#/lesson/chapter-1/0' }, 'Start from lesson 1 instead') : null,
            h('a', { class: 'btn btn-ghost', href: '#/questionnaire' }, profile ? 'Retake questionnaire' : 'Take questionnaire')
          ])
        ]),
        h('aside', { class: 'dashboard-panel' }, [
          h('div', { class: 'tagline' }, 'Progress painting'),
          buildMosaic({ currentId: next?.id }),
          h('p', { class: 'muted mosaic-caption' }, `${done} / ${LESSONS.length} lesson tiles revealed.${LESSONS.length - authoredTotal > 0 ? ` ${LESSONS.length - authoredTotal} future lessons are coming soon.` : ''}`)
        ])
      ]),
      h('section', { class: 'dashboard-grid' }, [
        h('div', { class: 'dashboard-section' }, [
          h('h2', null, 'Your learning mode'),
          h('div', { class: 'diagnostic-plan' }, [
            h('div', { class: 'path-card' }, [h('span', null, 'Mode'), h('strong', null, mode)]),
            h('div', { class: 'path-card' }, [h('span', null, 'Focus'), h('strong', null, profile?.focusLabel || 'Build AI judgment')]),
            h('div', { class: 'path-card' }, [h('span', null, 'Recommended'), h('strong', null, profile?.lesson ? `Lesson ${profile.lesson.num}` : 'Next lesson')])
          ]),
          h('p', null, diagnosticSummary()),
          h('div', { class: 'arc-progress-list' }, arcCards),
          h('p', { class: 'row-gap' }, h('a', { class: 'btn btn-ghost', href: '#/lessons' }, 'View all lessons'))
        ]),
        h('div', { class: 'dashboard-section' }, [buildToolkitPanel()])
      ])
    ]);
  }

  function viewLessonsCatalog() {
    const c = readProgress().completed;
    const next = nextIncomplete();
    const authoredTotal = LESSONS.filter(l => !l.stub).length;
    const done = doneCount();
    return h('div', { class: 'container view v2-page v2-lessons-catalog' }, [
      accountBar(),
      h('header', { class: 'hero compact lessons-catalog-head' }, [
        h('div', { class: 'tagline' }, 'Lesson catalog'),
        h('h1', null, 'All lessons'),
        h('p', { class: 'lead' }, 'This is the full V2 lesson list. Dashboard shows your next action; this page is for opening any available lesson or reviewing completed work.'),
        h('div', { class: 'catalog-action-row' }, [
          next ? h('a', { class: 'btn btn-primary', href: `#/lesson/${next.id}/0` }, `Open lesson ${next.num}`) : h('a', { class: 'btn btn-primary', href: '#/projects' }, 'Start a project'),
          h('a', { class: 'btn btn-ghost', href: '#/' }, 'Back to dashboard'),
          h('span', { class: 'catalog-count' }, `${done}/${authoredTotal} available lessons complete`)
        ])
      ]),
      ...lessonCatalogSections(next, c)
    ]);
  }

  function viewLesson(id, stepIndex) {
    const lesson = LESSONS.find(l => l.id === id);
    if (!lesson) return notFound();
    if (lesson.stub) return viewLockedLesson(lesson);
    const total = lesson.steps.length;
    if (!total) return viewLockedLesson(lesson);
    currentLessonId = id;
    let idx = Math.max(0, Math.min(stepIndex, total - 1));
    // Gating also applies to the URL: no deep-linking past the furthest
    // step actually reached (completed lessons stay fully reviewable).
    if (!isDone(id)) {
      const furthest = Math.min(maxStepReached(id), total - 1);
      if (idx > furthest) {
        idx = furthest;
        history.replaceState(null, '', `#/lesson/${id}/${idx}`);
      }
    }
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
      else { recordStepReached(id, idx + 1); location.hash = `#/lesson/${id}/${idx + 1}`; }
    };
    const nextLabel = last ? 'Finish lesson ✓' : 'Next →';
    const nextBtn = h('button', {
      class: 'btn btn-primary' + (gated ? ' is-locked' : ''),
      'aria-label': gated ? `${last ? 'Finish lesson' : 'Next'} (locked until you complete this step)` : null,
      onclick: advance
    }, nextLabel);
    // Already-passed steps stay unlocked (back-navigation and review of
    // completed lessons must not force redoing the puzzle).
    const alreadyPassed = isDone(id) || idx < maxStepReached(id);
    if (gated && !alreadyPassed) nextBtn.disabled = true;
    if (gated && alreadyPassed) { nextBtn.classList.remove('is-locked'); nextBtn.setAttribute('aria-label', nextLabel); }
    const ctx = {
      unlock() {
        if (!nextBtn.disabled) return;
        nextBtn.disabled = false;
        nextBtn.classList.remove('is-locked');
        nextBtn.setAttribute('aria-label', nextLabel);
        nextBtn.focus();
      }
    };

    const back = idx > 0
      ? h('a', { class: 'btn btn-ghost', href: `#/lesson/${id}/${idx - 1}` }, '← Back')
      : h('a', { class: 'btn btn-ghost', href: '#/lessons' }, '← All lessons');

    const renderer = steps[step.kind] || steps.reveal;
    const body = renderer(step, ctx);
    const notebook = buildLessonNotebook(lesson);

    saveProgressToBackend({ lessonId: id, currentStep: idx, completed: false });

    return h('div', { class: 'container view lesson-view' }, [
      accountBar(),
      h('div', { class: 'lesson-head' }, [
        h('span', { class: 'crumb' }, `${lesson.arc} · Lesson ${lesson.num} of 30 · part ${idx + 1}/${total}`),
        h('h1', { class: 'lesson-h1' }, lesson.title),
        h('p', { class: 'core-q' }, lesson.coreQuestion),
        dots
      ]),
      h('div', { class: 'lesson-workspace' }, [
        h('div', { class: 'lesson-main' }, [body, h('div', { class: 'lesson-nav row-gap' }, [back, nextBtn])]),
        notebook
      ])
    ]);
  }

  function viewDone(id) {
    const lesson = LESSONS.find(l => l.id === id);
    if (!lesson) return notFound();
    if (!isDone(id)) {
      history.replaceState(null, '', `#/lesson/${id}/0`);
      return viewLesson(id, 0);
    }
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
        ...lesson.resources.map(r => h('a', { href: safeUrl(r.url), target: '_blank', rel: 'noopener', class: 'res-link' }, r.label))]) : null,
      h('div', { class: 'row-gap' }, [
        next ? h('a', { class: 'btn btn-primary', href: `#/lesson/${next.id}/0` }, `Next: ${next.num}. ${next.title}`)
             : h('a', { class: 'btn btn-primary', href: '../my-path.html' }, 'See My Path'),
        h('a', { class: 'btn btn-ghost', href: '#/lessons' }, 'All lessons')
      ])
    ]);
  }

  function viewLockedLesson(lesson) {
    return h('div', { class: 'container view' }, [
      accountBar(),
      h('section', { class: 'lesson-card' }, [
        h('div', { class: 'tagline' }, 'Locked lesson'),
        h('h1', null, `${lesson.num}. ${lesson.title}`),
        h('p', { class: 'lead' }, 'This lesson is intentionally locked until it has real interactions, optional saved-note prompts, and an exit check.'),
        h('a', { class: 'btn btn-primary', href: '#/' }, 'Back to dashboard')
      ])
    ]);
  }

  function viewSettings() {
    const settings = readJson(KEY.settings, {}) || {};
    function savePatch(patch) {
      set(KEY.settings, JSON.stringify({ ...settings, ...patch, savedAt: new Date().toISOString() }));
      applyAppearance();
      render();
    }
    const profileMessage = h('p', { class: 'step-feedback', 'aria-live': 'polite' }, '');
    const nameInput = h('input', {
      name: 'displayName',
      type: 'text',
      autocomplete: 'name',
      maxlength: '40',
      required: 'true',
      value: currentUser?.displayName || ''
    });
    const profileForm = h('form', { class: 'settings-profile-form', onsubmit: async event => {
      event.preventDefault();
      const displayName = String(new FormData(event.currentTarget).get('displayName') || '').trim().replace(/\s+/g, ' ');
      if (!displayName) {
        profileMessage.textContent = 'Add a display name first.';
        return;
      }
      const button = event.currentTarget.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      profileMessage.textContent = 'Saving name...';
      const result = api ? await api.updateProfile({ displayName }).catch(() => ({ ok: false, error: 'network_error' })) : { ok: false, error: 'backend_not_configured' };
      if (button) button.disabled = false;
      if (!result.ok) {
        profileMessage.textContent = apiErrorText(result.error);
        return;
      }
      currentUser = result.user;
      serverState = { ...(serverState || {}), user: result.user };
      const accountLabel = document.querySelector('.account-bar span');
      if (accountLabel) accountLabel.textContent = `Signed in as ${currentUser.displayName || currentUser.email}`;
      profileMessage.textContent = 'Name saved.';
    } }, [
      h('label', { class: 'pr-field' }, [h('span', null, 'Display name'), nameInput]),
      h('div', { class: 'row-gap' }, [h('button', { class: 'btn btn-primary', type: 'submit' }, 'Save name')]),
      profileMessage
    ]);
    return h('div', { class: 'container view v2-page' }, [
      accountBar(),
      h('header', { class: 'hero compact' }, [
        h('div', { class: 'tagline' }, 'V2 settings'),
        h('h1', null, 'Make the course easier to use'),
        h('p', { class: 'lead' }, 'These settings stay in V2. They do not send you back to the older site.')
      ]),
      h('section', { class: 'v2-card-grid' }, [
        h('article', { class: 'dashboard-section v2-settings-card' }, [
          h('h2', null, 'Account name'),
          h('p', null, 'This is the name shown on your account. You can change it here when you need to.'),
          h('p', { class: 'muted' }, 'Name changes are saved on the backend so an admin can help if an account gets confusing.'),
          profileForm
        ]),
        h('article', { class: 'dashboard-section v2-settings-card' }, [
          h('h2', null, 'Theme'),
          h('div', { class: 'seg-row' }, [
            h('button', { class: 'btn btn-ghost', onclick: () => savePatch({ theme: 'light' }) }, 'Light'),
            h('button', { class: 'btn btn-ghost', onclick: () => savePatch({ theme: 'dark' }) }, 'Dark'),
            h('button', { class: 'btn btn-ghost', onclick: () => savePatch({ theme: '' }) }, 'Default')
          ]),
          h('p', { class: 'muted' }, `Current: ${settings.theme || 'default'}`)
        ]),
        h('article', { class: 'dashboard-section v2-settings-card' }, [
          h('h2', null, 'Text size'),
          h('div', { class: 'seg-row' }, [
            h('button', { class: 'btn btn-ghost', onclick: () => savePatch({ fontScale: 'normal' }) }, 'Normal'),
            h('button', { class: 'btn btn-ghost', onclick: () => savePatch({ fontScale: 'large' }) }, 'Large'),
            h('button', { class: 'btn btn-ghost', onclick: () => savePatch({ fontScale: 'xl' }) }, 'Extra large')
          ]),
          h('p', { class: 'muted' }, 'This is for reading comfort during lessons.')
        ]),
        h('article', { class: 'dashboard-section v2-settings-card' }, [
          h('h2', null, 'Starting point'),
          h('p', null, 'Every learner sets a starting point with the questionnaire before the lessons open — it personalizes your path and shows us where people begin.'),
          h('div', { class: 'row-gap' }, [
            h('a', { class: 'btn btn-primary', href: '#/questionnaire' }, hasAssessment() ? 'Retake questionnaire' : 'Take questionnaire'),
            h('button', { class: 'btn btn-ghost', onclick: () => {
              localStorage.removeItem(KEY.assessment);
              localStorage.removeItem('modelwise-gauge');
              localStorage.removeItem(KEY.diagnosticDraft);
              serverState = { ...(serverState || {}), assessment: null };
              location.hash = '#/questionnaire';
              render();
            } }, 'Clear local result')
          ])
        ])
      ])
    ]);
  }

  function viewProjects() {
    return h('div', { class: 'container view v2-page' }, [
      accountBar(),
      h('header', { class: 'hero compact' }, [
        h('div', { class: 'tagline' }, 'Projects'),
        h('h1', null, 'Build something useful with AI'),
        h('p', { class: 'lead' }, 'Real case studies first, then starter projects learners can build at different ages and skill levels.')
      ]),
      h('section', { class: 'project-feature' }, [
        h('span', { class: 'lt-badge' }, 'featured project · by Aarav'),
        h('h2', null, 'I built a small LLM on my MacBook Air'),
        h('p', { class: 'lead' }, '15 years old. 1 laptop. About 4 minutes of training. $0.'),
        h('p', null, 'The idea was not to build a frontier model from scratch. Aarav borrowed Meta\'s free Llama 3.2 1B Instruct model and fine-tuned it into a small SQL specialist.'),
        h('div', { class: 'project-stat-grid' }, [
          h('div', { class: 'project-stat' }, [h('strong', null, 'Llama 3.2 1B'), h('span', null, 'base model')]),
          h('div', { class: 'project-stat' }, [h('strong', null, '2,000'), h('span', null, 'SQL examples')]),
          h('div', { class: 'project-stat' }, [h('strong', null, '0.228%'), h('span', null, 'parameters trained')]),
          h('div', { class: 'project-stat' }, [h('strong', null, '~4 min'), h('span', null, 'training time')]),
          h('div', { class: 'project-stat' }, [h('strong', null, '3.18 → 1.18'), h('span', null, 'training loss')]),
          h('div', { class: 'project-stat' }, [h('strong', null, '$0'), h('span', null, 'cost')])
        ]),
        h('div', { class: 'project-columns' }, [
          h('div', null, [
            h('h3', null, 'Recipe'),
            h('ul', { class: 'compact-list' }, [
              h('li', null, 'Base model: Llama 3.2 1B Instruct, 4-bit quantized.'),
              h('li', null, 'Dataset: 2,000 SQL examples from Hugging Face, b-mc2/sql-create-context.'),
              h('li', null, 'Method: LoRA fine-tuning with Apple MLX on a MacBook Air M3 with 16 GB RAM.'),
              h('li', null, 'Run: 300 iterations and 1.44 GB peak memory.')
            ])
          ]),
          h('div', null, [
            h('h3', null, 'Result'),
            h('p', null, 'Before fine-tuning, the model gave a chatty markdown answer for “Show me all students in 10th grade.” After fine-tuning, it produced a clean SQL query ready to paste into a database.'),
            h('p', { class: 'muted' }, 'Lesson: AI is math, data, training, and choices. You can do real ML without a huge lab if the project is scoped well.')
          ])
        ])
      ]),
      h('section', { class: 'v2-card-grid' }, [
        h('article', { class: 'project-card' }, [
          h('span', { class: 'lt-badge' }, 'case study'),
          h('h2', null, 'Multi-agent ethics dialogue experiment'),
          h('p', null, 'Made by Aarav, Felix, and AI. Two AI systems were tested as strategic negotiators and ethical decision-makers across trolley problems, prisoner’s dilemma cases, treaty negotiation, and war-negotiation scenarios.'),
          h('ul', { class: 'compact-list' }, [
            h('li', null, 'Current priority: the Treaty of Westmark, with General Mara Vance negotiating against General Darian Voss.'),
            h('li', null, 'The setup tests asymmetric private information, deception/manipulation pressure, repeated diplomacy loops, and whether a settlement is reached.'),
            h('li', null, 'The runs save JSON transcripts, checkpoints, terminal logs, final treaty drafts, private/public responses, secretary interventions, and historian analysis.'),
            h('li', null, 'The analysis scripts turn treaty, prisoner, trolley, and negotiation outputs into CSV summaries and presentation dashboard views.')
          ]),
          h('p', { class: 'muted' }, 'Next step: turn the experiment files into a readable public case study with screenshots, example JSON snippets, charts, and reflection questions.')
        ]),
        h('article', { class: 'project-card' }, [
          h('span', { class: 'lt-badge' }, 'starter project'),
          h('h2', null, 'Prompt repair journal'),
          h('p', null, 'Collect three weak prompts, repair each one, and explain what changed: goal, context, constraints, format, or verification.')
        ]),
        h('article', { class: 'project-card' }, [
          h('span', { class: 'lt-badge' }, 'starter project'),
          h('h2', null, 'AI verification checklist'),
          h('p', null, 'Pick a claim, ask AI for help, then show the outside sources and checks that made the answer safer.')
        ]),
        h('article', { class: 'project-card' }, [
          h('span', { class: 'lt-badge' }, 'starter project'),
          h('h2', null, 'Source-checking mini newsroom'),
          h('p', null, 'Choose one viral claim, ask AI for possible explanations, then build a source board that separates facts, guesses, and missing evidence.')
        ]),
        h('article', { class: 'project-card' }, [
          h('span', { class: 'lt-badge' }, 'starter project'),
          h('h2', null, 'Privacy-safe school helper'),
          h('p', null, 'Create a FAQ helper for a club, class, or event using only public information. Add a rule that blocks private names, grades, health details, and personal data.')
        ]),
        h('article', { class: 'project-card' }, [
          h('span', { class: 'lt-badge' }, 'starter project'),
          h('h2', null, 'Science fair data explainer'),
          h('p', null, 'Bring a small spreadsheet, ask AI to explain patterns, then verify the explanation with charts and your own notes before presenting it.')
        ]),
        h('article', { class: 'project-card' }, [
          h('span', { class: 'lt-badge' }, 'starter project'),
          h('h2', null, 'Human-in-control agent workflow'),
          h('p', null, 'Design a tiny workflow where AI drafts, checks, and organizes, but a person approves every final action. Good for emails, study plans, or research notes.')
        ])
      ])
    ]);
  }

  function viewTeaching() {
    return h('div', { class: 'container view v2-page' }, [
      accountBar(),
      h('header', { class: 'hero compact' }, [
        h('div', { class: 'tagline' }, 'For teaching AI'),
        h('h1', null, 'Use Learning AI in a class, club, or workshop'),
        h('p', { class: 'lead' }, 'This section is for teachers, mentors, and learners who want to run AI activities with people, not just read pages alone.')
      ]),
      h('section', { class: 'v2-card-grid' }, [
        h('article', { class: 'project-card' }, [
          h('h2', null, 'Discussion-first lessons'),
          h('p', null, 'Each V2 lesson should have one moment where a group can pause, compare answers, and explain the judgment behind a choice.')
        ]),
        h('article', { class: 'project-card' }, [
          h('h2', null, 'Multi-agent classroom activity'),
          h('p', null, 'Students can compare what happens when two AI agents negotiate, compete, or reason through ethical pressure. The activity can use the Westmark treaty, prisoner’s dilemma, trolley problem, and war-negotiation runs as examples.'),
          h('ul', { class: 'compact-list' }, [
            h('li', null, 'Frame it as experimental design, controls, reproducible scripts, and observed patterns, not as AI-perfect truth.'),
            h('li', null, 'Discuss payoff structures, hidden information, endless talk, agreement rate, number of turns, deception detection, and human oversight.'),
            h('li', null, 'Compare how the secretary intervention changes stalled negotiations.')
          ]),
          h('p', { class: 'muted' }, 'Teaching materials still needed: setup instructions, safe discussion framing, sample outputs, and questions about evidence, incentives, deception, and oversight.')
        ])
      ])
    ]);
  }

  function viewAboutV2() {
    return h('div', { class: 'container view v2-page' }, [
      accountBar(),
      h('header', { class: 'hero compact' }, [
        h('div', { class: 'tagline' }, 'About V2'),
        h('h1', null, 'Learning AI is for anyone starting from questions'),
        h('p', { class: 'lead' }, 'V2 is being built as a guided course with accounts, saved progress, interactive lessons, and projects. The goal is not “AI for high school students only.” It is AI learning that works whether you are a student, teacher, parent, builder, or curious adult.')
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
    const parts = (location.hash.replace(/^#/, '') || '/').split('/').filter(Boolean);
    if (!authChecked) {
      updateShellChrome(parts);
      app.innerHTML = '';
      app.appendChild(h('div', { class: 'container view' }, [
        h('section', { class: 'lesson-card' }, [
          h('div', { class: 'tagline' }, 'Learning AI'),
          h('h1', null, 'Checking your account...'),
          h('p', { class: 'muted' }, 'V2 saves progress to the Learning AI backend.')
        ])
      ]));
      return;
    }
    if (!api) {
      updateShellChrome(parts);
      app.innerHTML = '';
      app.appendChild(viewApiUnavailable());
      updateTopProgress();
      return;
    }
    if (backendUnavailable) {
      updateShellChrome(parts);
      app.innerHTML = '';
      app.appendChild(viewApiUnavailable());
      updateTopProgress();
      return;
    }
    if (api && !currentUser) {
      updateShellChrome(parts);
      app.innerHTML = '';
      app.appendChild(viewAuthGate());
      updateTopProgress();
      return;
    }
    if (parts[0] !== 'lesson' && parts[0] !== 'done') currentLessonId = null;
    let node;
    // The questionnaire is required before lessons: it gives every learner a
    // recommended start AND gives the course data on where people begin.
    // Settings/about stay reachable so appearance and info aren't locked away.
    const needsQuestionnaire = currentUser && !hasAssessment()
      && !['diagnostic', 'questionnaire', 'settings', 'about'].includes(parts[0] || '');
    if (needsQuestionnaire) node = viewDiagnostic();
    else if (parts[0] === 'diagnostic' || parts[0] === 'questionnaire') node = viewDiagnostic();
    else if (parts.length === 0) node = viewDashboard();
    else if (parts[0] === 'lessons') node = viewLessonsCatalog();
    else if (parts[0] === 'settings') node = viewSettings();
    else if (parts[0] === 'projects') node = viewProjects();
    else if (parts[0] === 'teaching') node = viewTeaching();
    else if (parts[0] === 'about') node = viewAboutV2();
    else if (parts[0] === 'lesson' && parts[1]) node = viewLesson(parts[1], parseInt(parts[2] || '0', 10) || 0);
    else if (parts[0] === 'done' && parts[1]) node = viewDone(parts[1]);
    else node = viewDashboard();

    app.innerHTML = '';
    app.appendChild(node);
    updateShellChrome(parts);
    updateTopProgress();
    trackPageView();
    window.scrollTo(0, 0);
  }

  // GA4 only sees the initial load of a hash-routed app; report route changes too.
  let lastTrackedHash = location.hash || '#/';
  function trackPageView() {
    if (!window.gtag) return;
    const hash = location.hash || '#/';
    if (hash === lastTrackedHash) return;
    lastTrackedHash = hash;
    window.gtag('event', 'page_view', { page_location: location.href, page_path: '/v2/' + hash.replace(/^#/, '') });
  }

  // ---------- time tracking: report active minutes to the backend ----------
  let activeSeconds = 0;
  setInterval(() => {
    if (document.visibilityState !== 'visible' || !currentUser || !api?.saveMinutes) return;
    activeSeconds += 15;
    if (activeSeconds >= 60) {
      activeSeconds -= 60;
      api.saveMinutes({ minutes: 1, lessonId: currentLessonId || null, path: location.hash || '#/' }).catch(() => {});
    }
  }, 15000);

  // ---------- boot ----------
  applyAppearance();

  window.addEventListener('hashchange', render);
  window.addEventListener('storage', (e) => { if (e.key === KEY.settings) applyAppearance(); });
  window.addEventListener('keydown', event => {
    const route = (location.hash.replace(/^#/, '') || '/').split('/').filter(Boolean)[0] || '';
    if (route !== 'questionnaire' && route !== 'diagnostic') return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(document.activeElement?.tagName || '')) return;
    if (/^[1-4]$/.test(event.key)) {
      const option = document.querySelector(`.diagnostic-options label[data-shortcut="${event.key}"] input`);
      if (option) {
        event.preventDefault();
        option.click();
      }
    }
    if (event.key === 'Enter') {
      const primary = document.querySelector('.diagnostic-card .gauge-actions .btn-primary');
      if (primary) {
        event.preventDefault();
        primary.click();
      }
    }
  });
  async function boot() {
    if (api) {
      // Finish a sign-out that couldn't reach the server last time before we
      // trust any surviving session cookie.
      if (get('learningai-v2-pending-logout')) {
        const out = await api.logout();
        if (out && out.ok) { try { localStorage.removeItem('learningai-v2-pending-logout'); } catch (e) {} }
      }
      const me = await api.me();
      if (!me.ok && ['network_error', 'request_timeout'].includes(me.error)) {
        backendUnavailable = true;
        authChecked = true;
        render();
        return;
      }
      if (me.ok) {
        currentUser = me.user;
        await hydrateFromServer();
      }
      authChecked = true;
    }
    if (!api) authChecked = true;
    if (!LESSONS.length && app) app.appendChild(h('div', { class: 'container view' }, h('p', { class: 'callout callout-bad' }, 'Lessons failed to load.')));
    else render();
  }
  render();
  boot().catch(() => { authChecked = true; render(); });
})();
