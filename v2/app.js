/* ============================================================
   Learning AI V2 — engine
   V2 == V1 (same pages/assessment/My Path/look). Differences:
   10 arcs · 50 lessons · more interaction per lesson · better UI.

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
  const PRODUCT_VERSION = String(window.LEARNING_AI_PRODUCT_VERSION || 'V2').toUpperCase();
  const PRODUCT_PATH = String(window.LEARNING_AI_PRODUCT_PATH || '/v2/');
  const SAMPLE_FIRST_FLOW = window.LEARNING_AI_ONBOARDING_FLOW === 'sample-first';
  const SAMPLE_LESSON_ID = 'chapter-1';
  let LESSONS = Array.isArray(window.LESSONS) ? window.LESSONS : [];
  let ARCS = window.V2_ARCS ? Object.values(window.V2_ARCS) : [];
  const KEY = {
    progress: 'learningai-progress',
    settings: 'learningai-settings',
    toolkit: 'learningai-toolkit',
    assessment: 'learningai-v2-assessment',
    diagnosticDraft: 'learningai-v2-diagnostic-draft',
    palette: 'learningai-v2-palette',
    guestProgress: 'learningai-v3-guest-progress',
    guestStepProgress: 'learningai-v3-guest-step-progress',
    guestToolkit: 'learningai-v3-guest-toolkit',
    guestInteractions: 'learningai-v3-guest-interactions',
    guestOwner: 'learningai-v3-guest-owner'
  };
  const api = window.LearningAIV2Api || null;
  let authChecked = !api;
  let backendUnavailable = false;
  let currentUser = null;
  let serverState = null;
  let curriculumLoadedFromBackend = false;

  // step kinds that REQUIRE completion before Next unlocks. Toolkit saving is intentionally optional.
  const GATED = new Set(['classify', 'exitCheck', 'promptRepair', 'biasSpot', 'agentDesign', 'workflowChain', 'tryLive', 'verify']);
  // Arc position is communicated by label, number, and shape. Keep color
  // restrained so progress reads as one continuous journey, not ten products.
  const ARC_COLORS = ['#343941', '#3b4048', '#42474f', '#494e56', '#50555d', '#595d64', '#62666c', '#6b6f75', '#777a80', '#85888d'];
  const AGE_RANGES = [
    ['', 'Choose age range'],
    ['13-15', '13-15'],
    ['16-18', '16-18'],
    ['19-24', '19-24'],
    ['25-34', '25-34'],
    ['35-49', '35-49'],
    ['50-plus', '50+'],
    ['prefer-not', 'Prefer not to say']
  ];
  const V2_PALETTES = [
    { id: 'editorial-control', name: 'Onyx Editorial', bg: '#0b0d10', surface: '#14171c', surface2: '#1b1f26', border: '#30343c', text: '#f1ede4', textDim: '#a9adb4', accent: '#d84a3d', accentSoft: '#3a211f' },
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
  function accountScopedKey(base) {
    if (!SAMPLE_FIRST_FLOW || !currentUser) return base;
    return `${base}:${encodeURIComponent(currentUserKey())}`;
  }
  function progressStorageKey() {
    return SAMPLE_FIRST_FLOW && !currentUser ? KEY.guestProgress : accountScopedKey(KEY.progress);
  }
  function stepProgressStorageKey() {
    return SAMPLE_FIRST_FLOW && !currentUser ? KEY.guestStepProgress : accountScopedKey('learningai-v2-step-progress');
  }
  function toolkitStorageKey() {
    return SAMPLE_FIRST_FLOW && !currentUser ? KEY.guestToolkit : accountScopedKey(KEY.toolkit);
  }
  function readProgress() { return readJson(progressStorageKey(), { completed: {} }); }
  function saveProgress(p) { return set(progressStorageKey(), JSON.stringify({ completed: p.completed || {}, savedAt: new Date().toISOString() })); }
  function readToolkit() { const t = readJson(toolkitStorageKey(), []); return Array.isArray(t) ? t : []; }
  function saveToolkit(c) { return set(toolkitStorageKey(), JSON.stringify(c.slice(0, 50))); }
  function pendingToolkitStorageKey() { return accountScopedKey('learningai-v2-pending-toolkit'); }
  function pendingProgressStorageKey() { return accountScopedKey('learningai-v2-pending-progress'); }
  function assessmentStorageKey() { return accountScopedKey(KEY.assessment); }
  function diagnosticDraftStorageKey() { return accountScopedKey(KEY.diagnosticDraft); }
  function pendingAssessmentStorageKey() { return accountScopedKey('learningai-v2-pending-assessment'); }
  function activityConsentStorageKey() { return accountScopedKey('learningai-v2-activity-consent'); }
  function readActivityConsent() {
    return Boolean(currentUser && readJson(activityConsentStorageKey(), {})?.shareLearningActivity);
  }
  function readPendingToolkit() { const t = readJson(pendingToolkitStorageKey(), []); return Array.isArray(t) ? t : []; }
  function savePendingToolkit(c) { return set(pendingToolkitStorageKey(), JSON.stringify(c.slice(0, 50))); }
  function readPendingProgress() { const t = readJson(pendingProgressStorageKey(), []); return Array.isArray(t) ? t : []; }
  function savePendingProgress(c) { return set(pendingProgressStorageKey(), JSON.stringify(c.slice(0, 100))); }
  function readStepProgress() { const s = readJson(stepProgressStorageKey(), {}); return s && typeof s === 'object' ? s : {}; }
  function maxStepReached(id) { const v = readStepProgress()[id]; return Number.isInteger(v) && v > 0 ? v : 0; }
  function recordStepReached(id, idx) {
    const sp = readStepProgress();
    if ((Number.isInteger(sp[id]) ? sp[id] : 0) >= idx) return;
    sp[id] = idx;
    set(stepProgressStorageKey(), JSON.stringify(sp));
  }
  function currentUserKey() { return currentUser?.id || currentUser?.email || 'unknown'; }
  function importedUserKey() { return `learningai-v2-imported:${currentUserKey()}`; }
  function lessonNoteKey(lessonId) {
    return SAMPLE_FIRST_FLOW && !currentUser
      ? `learningai-v3-guest-lesson-notes:${lessonId}`
      : accountScopedKey(`learningai-v2-lesson-notes:${lessonId}`);
  }
  function saveToolkitCard(card, { queue = true } = {}) {
    const cards = readToolkit().filter(existing => existing.id !== card.id);
    saveToolkit([{ ...card, updatedAt: new Date().toISOString() }, ...cards]);
    if (queue && !(SAMPLE_FIRST_FLOW && !currentUser)) {
      savePendingToolkit([card, ...readPendingToolkit().filter(existing => existing.id !== card.id)]);
    }
  }
  function isCompleteV2Assessment(assessment) {
    const responses = Array.isArray(assessment?.responses) ? assessment.responses : [];
    const answered = new Set(responses.map(response => response?.key).filter(Boolean));
    return DIAGNOSTIC_QUESTIONS.every(question => answered.has(question.key));
  }
  function saveAssessmentLocal(assessment) {
    if (!isCompleteV2Assessment(assessment)) return false;
    set(assessmentStorageKey(), JSON.stringify(assessment));
    if (!SAMPLE_FIRST_FLOW) set('modelwise-gauge', JSON.stringify(assessment));
    return true;
  }
  function clearV2LocalSession() {
    try {
      const progressKey = progressStorageKey();
      const toolkitKey = toolkitStorageKey();
      const stepKey = stepProgressStorageKey();
      const pendingProgressKey = pendingProgressStorageKey();
      const pendingToolkitKey = pendingToolkitStorageKey();
      localStorage.removeItem(assessmentStorageKey());
      if (!SAMPLE_FIRST_FLOW) localStorage.removeItem('modelwise-gauge');
      localStorage.removeItem(diagnosticDraftStorageKey());
      localStorage.removeItem(pendingProgressKey);
      localStorage.removeItem(pendingToolkitKey);
      localStorage.removeItem(pendingAssessmentStorageKey());
      // Per-learner state must not leak to the next account on a shared
      // computer (school machines): step unlocks, notes, last-complete.
      localStorage.removeItem(stepKey);
      localStorage.removeItem('learningai-v2-last-complete');
      if (SAMPLE_FIRST_FLOW && currentUser) {
        localStorage.removeItem(progressKey);
        localStorage.removeItem(toolkitKey);
      }
      Object.keys(localStorage)
        .filter(k => k.startsWith('learningai-v2-lesson-notes:') && (!SAMPLE_FIRST_FLOW || k.endsWith(`:${encodeURIComponent(currentUserKey())}`)))
        .forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  }

  function normalizeCurriculumStep(step) {
    const payload = step?.payload && typeof step.payload === 'object' && !Array.isArray(step.payload) ? step.payload : {};
    return {
      kind: step?.kind || payload.kind || 'reveal',
      ...payload,
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
        if (Number.isInteger(Number(row.currentStep))) recordStepReached(row.lessonId, Number(row.currentStep));
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
      if (SAMPLE_FIRST_FLOW && !currentUser) return false;
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
    b.dataset.motion = s.reduceMotion ? 'reduced' : 'full';
    b.dataset.fontScale = s.fontScale || 'normal';
    b.dataset.fontFamily = s.fontFamily || 'system';
    if (s.theme === 'dark') {
      t.setProperty('--bg', '#0b0d10'); t.setProperty('--surface', '#14171c'); t.setProperty('--surface-2', '#1b1f26');
      t.setProperty('--border', '#30343c'); t.setProperty('--text', s.textColor || '#f1ede4'); t.setProperty('--text-dim', '#a9adb4'); t.setProperty('--text-faint', '#777c85');
      t.setProperty('--accent', s.accentColor || '#d84a3d'); t.setProperty('--accent-soft', '#3a211f');
      b.style.colorScheme = 'dark';
    } else if (s.theme === 'light') {
      t.setProperty('--bg', '#f7f9fc'); t.setProperty('--surface', '#ffffff'); t.setProperty('--surface-2', '#eef4f8');
      t.setProperty('--border', '#dbe3ea'); t.setProperty('--text', s.textColor || '#121826'); t.setProperty('--text-dim', '#4b5870'); t.setProperty('--text-faint', '#778397');
      t.setProperty('--accent', s.accentColor || '#b42318'); t.setProperty('--accent-soft', '#f3d9d5');
      b.style.colorScheme = 'light';
    } else if (s.theme === 'sepia') {
      t.setProperty('--bg', '#f4ecd8'); t.setProperty('--surface', '#fff8e7'); t.setProperty('--surface-2', '#eadfc5');
      t.setProperty('--border', '#9b8a6f'); t.setProperty('--text', s.textColor || '#2b241c'); t.setProperty('--text-dim', '#5e5040'); t.setProperty('--text-faint', '#74634f');
      t.setProperty('--accent', s.accentColor || '#8c2f1f'); t.setProperty('--accent-soft', '#ead0bd');
      b.style.colorScheme = 'light';
    } else if (s.theme === 'contrast') {
      t.setProperty('--bg', '#ffffff'); t.setProperty('--surface', '#ffffff'); t.setProperty('--surface-2', '#f0f0f0');
      t.setProperty('--border', '#000000'); t.setProperty('--text', s.textColor || '#000000'); t.setProperty('--text-dim', '#1a1a1a'); t.setProperty('--text-faint', '#333333');
      t.setProperty('--accent', s.accentColor || '#0037a6'); t.setProperty('--accent-soft', '#dce8ff');
      b.style.colorScheme = 'light';
    } else {
      b.dataset.theme = 'dark';
      b.style.colorScheme = 'dark';
    }
    if (s.accentColor) t.setProperty('--accent', s.accentColor);
  }

  function apiErrorText(error) {
    if (error === 'network_error') return 'Could not reach the server. Check your connection and try again.';
    if (error === 'request_timeout') return 'The server took too long to respond. Please try again.';
    if (error === 'invalid_credentials' || error === 'invalid_login') return 'That email and password do not match. Check the password, or create a new account with a different email.';
    if (error === 'email_exists') return 'That email already has an account. Choose Sign in and use the password you created earlier.';
    if (error === 'rate_limited') return 'Too many attempts. Wait a few minutes, then try again.';
    return error || 'Could not complete that request.';
  }

  function guestSampleProgress() {
    return readJson(KEY.guestProgress, { completed: {} });
  }

  function guestSampleIsComplete() {
    return Boolean(guestSampleProgress()?.completed?.[SAMPLE_LESSON_ID]?.completedAt);
  }

  function guestSampleOwnerMatchesCurrentUser() {
    const owner = get(KEY.guestOwner);
    return Boolean(owner && currentUser && owner === currentUserKey());
  }

  function clearGuestSample() {
    try {
      localStorage.removeItem(KEY.guestProgress);
      localStorage.removeItem(KEY.guestStepProgress);
      localStorage.removeItem(KEY.guestToolkit);
      localStorage.removeItem(KEY.guestInteractions);
      localStorage.removeItem(KEY.guestOwner);
      Object.keys(localStorage)
        .filter(key => key.startsWith('learningai-v3-guest-lesson-notes:'))
        .forEach(key => localStorage.removeItem(key));
    } catch (e) {}
  }

  async function transferGuestSampleToCurrentUser() {
    if (!SAMPLE_FIRST_FLOW || !currentUser || !guestSampleIsComplete() || !guestSampleOwnerMatchesCurrentUser()) return false;
    const guestCompletion = guestSampleProgress().completed[SAMPLE_LESSON_ID];
    const guestCards = readJson(KEY.guestToolkit, []);
    const guestInteractions = readJson(KEY.guestInteractions, []);
    const accountProgress = readProgress();
    const accountCards = readToolkit();
    accountProgress.completed = {
      ...(accountProgress.completed || {}),
      [SAMPLE_LESSON_ID]: accountProgress.completed?.[SAMPLE_LESSON_ID] || guestCompletion
    };
    saveProgress(accountProgress);
    const guestCardList = Array.isArray(guestCards) ? guestCards : [];
    const accountCardList = Array.isArray(accountCards) ? accountCards : [];
    const mergedCards = [...accountCardList];
    for (const guestCard of guestCardList) {
      const accountCard = mergedCards.find(card => card.id === guestCard.id);
      const guestTime = Date.parse(guestCard.updatedAt || guestCard.createdAt || 0) || 0;
      const accountTime = Date.parse(accountCard?.updatedAt || accountCard?.createdAt || 0) || 0;
      if (!accountCard) mergedCards.push(guestCard);
      else if (guestTime > accountTime) mergedCards[mergedCards.indexOf(accountCard)] = guestCard;
    }
    saveToolkit(mergedCards);

    const progressResult = await api.saveProgress({
      lessonId: SAMPLE_LESSON_ID,
      completed: true,
      currentStep: 999
    }).catch(() => ({ ok: false }));
    if (!progressResult.ok) {
      queueProgressSave({ lessonId: SAMPLE_LESSON_ID, completed: true, currentStep: 999 });
    }

    const unsyncedCards = [];
    for (const card of guestCardList) {
      const accountCard = accountCardList.find(existing => existing.id === card.id);
      const guestTime = Date.parse(card.updatedAt || card.createdAt || 0) || 0;
      const accountTime = Date.parse(accountCard?.updatedAt || accountCard?.createdAt || 0) || 0;
      if (accountCard && accountTime >= guestTime) continue;
      const saved = await api.saveToolkit({
        id: card.id,
        cardType: card.type,
        lessonId: card.lessonId,
        payload: { fields: card.fields, fieldLabels: card.fieldLabels || {} }
      }).catch(() => ({ ok: false }));
      if (!saved.ok) unsyncedCards.push(card);
    }
    if (unsyncedCards.length) {
      savePendingToolkit([
        ...unsyncedCards,
        ...readPendingToolkit().filter(card => !unsyncedCards.some(guestCard => guestCard.id === card.id))
      ]);
    }

    set(KEY.guestToolkit, JSON.stringify(unsyncedCards));

    const unsyncedInteractions = [];
    for (const interaction of Array.isArray(guestInteractions) ? guestInteractions : []) {
      const payload = {
        ...(interaction.payload || {}),
        __clientTransferId: interaction.clientTransferId || `${interaction.lessonId}:${interaction.stepIndex}:${interaction.stepKind}`
      };
      let saved;
      if (interaction.stepKind === 'exitCheck' && api.submitQuizAnswer) {
        saved = await api.submitQuizAnswer({
          lessonId: interaction.lessonId,
          stepIndex: interaction.stepIndex,
          quizKey: interaction.stepTitle || 'exit-check',
          answer: payload,
          correct: interaction.correct,
          feedback: payload.feedback || ''
        }).catch(() => ({ ok: false }));
      } else {
        saved = await api.saveInteraction({ ...interaction, payload }).catch(() => ({ ok: false }));
      }
      if (saved.ok && GATED.has(interaction.stepKind) && interaction.stepKind !== 'exitCheck' && payload.completed === true && api.completeActivity) {
        saved = await api.completeActivity({
          lessonId: interaction.lessonId,
          stepIndex: interaction.stepIndex,
          activityKind: interaction.stepKind,
          activityKey: interaction.stepTitle || interaction.stepKind,
          payload
        }).catch(() => ({ ok: false }));
      }
      if (!saved.ok) unsyncedInteractions.push(interaction);
    }
    set(KEY.guestInteractions, JSON.stringify(unsyncedInteractions));

    const fullySaved = progressResult.ok && !unsyncedCards.length && !unsyncedInteractions.length;
    if (fullySaved) clearGuestSample();
    return fullySaved;
  }

  function activePalette() {
    const id = get(KEY.palette) || 'editorial-control';
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
    if (!currentLessonId) return;
    const stepIndex = currentLessonStepIndex;
    const correct = typeof payload?.correct === 'boolean' ? payload.correct : null;
    const interaction = {
      lessonId: currentLessonId,
      stepIndex,
      stepKind: step.kind,
      stepTitle: step.title || step.question || step.cardType || step.kind,
      payload,
      correct
    };
    if (SAMPLE_FIRST_FLOW && !currentUser) {
      const saved = readJson(KEY.guestInteractions, []);
      const interactions = Array.isArray(saved) ? saved : [];
      const key = `${interaction.lessonId}:${interaction.stepIndex}:${interaction.stepKind}`;
      const next = interactions.filter(item => `${item.lessonId}:${item.stepIndex}:${item.stepKind}` !== key);
      next.push({ ...interaction, clientTransferId: key });
      set(KEY.guestInteractions, JSON.stringify(next.slice(-100)));
      return;
    }
    if (!api) return;
    if (step.kind === 'exitCheck' && api.submitQuizAnswer) {
      api.submitQuizAnswer({
        lessonId: currentLessonId,
        stepIndex,
        quizKey: step.title || step.question || 'exit-check',
        answer: payload,
        correct,
        feedback: payload?.feedback || ''
      }).catch(() => {});
    } else {
      api.saveInteraction(interaction).catch(() => {});
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
      const col = i % 10;
      const row = Math.floor(i / 10);
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
    const textarea = h('textarea', {
      id: noteId,
      rows: '9',
      placeholder: 'Write anything you want to remember from this lesson...',
      oninput: event => {
        const text = event.target.value.trim();
        set(noteKey, event.target.value);
        if (!text) {
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
  function prose(text, className = '') {
    const blocks = String(text || '').split(/\n{2,}/).map(block => block.trim()).filter(Boolean);
    return h('div', { class: `lesson-prose ${className}`.trim() }, blocks.map(block => h('p', null, block)));
  }
  function lessonStage(kind) {
    if (kind === 'coldOpen') return 'Frame';
    if (kind === 'reveal' || kind === 'nextWord') return 'Understand';
    if (kind === 'toolkitSave') return 'Capture';
    if (kind === 'exitCheck') return 'Prove';
    return 'Practice';
  }

  const steps = {
    coldOpen(s) {
      return card([tag('Start with your experience'), h('h2', null, s.title), prose(s.scenario, 'scenario'),
        s.prompt ? h('div', { class: 'lesson-reflection' }, [h('strong', null, 'Before you continue'), h('p', null, s.prompt)]) : null]);
    },
    reveal(s) {
      return card([tag('Understand the mechanism'), h('h2', null, s.title), prose(s.body),
        s.mistake ? h('div', { class: 'callout callout-bad' }, [h('strong', null, 'Common mistake: '), s.mistake]) : null,
        s.good ? h('div', { class: 'callout callout-good' }, [h('strong', null, 'Keep control: '), s.good]) : null]);
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
    tryLive(s, ctx) {
      const btn = h('button', { class: 'btn btn-primary', onclick: () => copyText(s.prompt, btn) }, 'Copy prompt');
      const evidence = h('textarea', { rows: '4', 'data-evidence': 'try-live', placeholder: 'Write what you noticed, changed, or checked…' });
      const fb = h('p', { class: 'step-feedback', 'aria-live': 'polite' }, '');
      const complete = h('button', { class: 'btn btn-ghost', onclick: () => {
        const value = evidence.value.trim();
        if (value.length < 12) { fb.textContent = 'Add one specific observation before continuing.'; return; }
        recordInteraction(s, { evidence: value, completed: true });
        fb.textContent = '✓ You captured evidence from the attempt.';
        complete.disabled = true;
        ctx.unlock();
      } }, 'Record what happened');
      return card([tag('Try it for real'), h('h2', null, s.title), h('pre', { class: 'prompt-box' }, s.prompt), btn,
        s.note ? h('p', { class: 'why' }, s.note) : null,
        h('label', { class: 'pr-field evidence-field' }, [h('span', null, 'Evidence from your attempt'), evidence]), complete, fb,
        lockHint('Try the prompt and record one specific observation to continue.')]);
    },
    verify(s, ctx) {
      const evidence = h('textarea', { rows: '4', 'data-evidence': 'verify', placeholder: 'What did the independent check show? Name the source or method you used…' });
      const fb = h('p', { class: 'step-feedback', 'aria-live': 'polite' }, '');
      const complete = h('button', { class: 'btn btn-primary', onclick: () => {
        const value = evidence.value.trim();
        if (value.length < 12) { fb.textContent = 'Add the result of a real independent check before continuing.'; return; }
        recordInteraction(s, { evidence: value, completed: true });
        fb.textContent = '✓ The check is recorded. Keep the source with your decision.';
        complete.disabled = true;
        ctx.unlock();
      } }, 'Record verification');
      return card([tag('Verify'), h('h2', null, s.title), h('div', { class: 'callout' }, [h('strong', null, 'Claim: '), s.claim]),
        h('p', { class: 'muted' }, 'Read laterally — check the claim against other sources first:'), h('ol', null, (s.steps || []).map(x => h('li', null, x))),
        s.note ? h('p', { class: 'why' }, s.note) : null,
        h('label', { class: 'pr-field evidence-field' }, [h('span', null, 'Verification evidence'), evidence]), complete, fb,
        lockHint('Record what an independent source or method showed to continue.')]);
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
          const wrap = e.target.closest('.lesson-card');
          const fields = {}, labels = {}; let any = false;
          wrap.querySelectorAll('input[data-key]').forEach(inp => {
            fields[inp.dataset.key] = inp.value.trim();
            const f = s.fields.find(x => x.key === inp.dataset.key); labels[inp.dataset.key] = f ? f.label : inp.dataset.key;
            if (inp.value.trim()) any = true;
          });
          if (!any) { fb.textContent = 'Fill in at least one field first.'; return; }
          const cardId = 'card-' + Date.now();
          saveToolkitCard({ id: cardId, type: s.cardType, lessonId: currentLessonId, fields, fieldLabels: labels, createdAt: new Date().toISOString() }, { queue: false });
          const isGuestSample = SAMPLE_FIRST_FLOW && !currentUser;
          fb.textContent = isGuestSample ? 'Saved on this device.' : 'Saved locally. Syncing...';
          const synced = api && currentUser
            ? await api.saveToolkit({ id: cardId, cardType: s.cardType, lessonId: currentLessonId, payload: { fields, fieldLabels: labels } }).catch(() => ({ ok: false }))
            : { ok: false, skipped: true };
          if (!isGuestSample && !synced.ok) {
            savePendingToolkit([readToolkit().find(card => card.id === cardId), ...readPendingToolkit().filter(card => card.id !== cardId)].filter(Boolean));
          }
          recordInteraction(s, { fields, synced: !!synced.ok });
          fb.textContent = isGuestSample
            ? 'Saved on this device. If you create an account after the lesson, this will move into Saved Notes.'
            : synced.ok
              ? 'Saved to Saved Notes.'
              : 'Saved locally. It is queued to sync after the backend is available.';
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
    const sampleFinished = SAMPLE_FIRST_FLOW && guestSampleIsComplete();
    const message = h('p', { class: 'step-feedback', id: 'auth-message', 'aria-live': 'polite' }, '');
    const passwordInput = h('input', { name: 'password', type: 'password', autocomplete: sampleFinished ? 'new-password' : 'current-password', required: 'true', minlength: '8' });
    const selectAuthMode = mode => passwordInput.setAttribute('autocomplete', mode === 'signup' ? 'new-password' : 'current-password');
    const form = h('form', { class: 'auth-card' }, [
      h('div', { class: 'tagline' }, 'Your learning record'),
      h('h1', null, sampleFinished ? 'Save lesson one and unlock the course' : 'Continue your learning'),
      h('p', { class: 'lead' }, sampleFinished
        ? 'Create your account, answer six short starting questions, and the complete Learning AI site will open.'
        : 'Sign in to return to your lessons, progress, and Saved Notes.'),
      h('label', { class: 'pr-field' }, [h('span', null, 'Email'), h('input', { name: 'email', type: 'email', autocomplete: 'email', required: 'true' })]),
      h('label', { class: 'pr-field' }, [h('span', null, 'Password'), passwordInput]),
      h('label', { class: 'pr-field' }, [h('span', null, 'Display name · new accounts only'), h('input', { name: 'displayName', type: 'text', autocomplete: 'name', maxlength: '40', placeholder: 'How should we address you?' })]),
      sampleFinished ? h('label', { class: 'sample-owner-confirmation' }, [
        h('input', { name: 'ownsSample', type: 'checkbox', value: 'yes' }),
        h('span', null, 'I completed this sample lesson on this device. Add its completion, answers, and optional notes to my account.')
      ]) : null,
      h('div', { class: 'row-gap' }, sampleFinished ? [
        h('button', { class: 'btn btn-primary', type: 'submit', 'data-mode': 'signup', onclick: () => selectAuthMode('signup') }, 'Create account and continue'),
        h('button', { class: 'btn btn-ghost', type: 'submit', 'data-mode': 'login', onclick: () => selectAuthMode('login') }, 'I already have an account'),
        h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => {
          clearGuestSample();
          location.hash = '#/';
          render();
        } }, 'This is not my lesson—start over')
      ] : [
        h('button', { class: 'btn btn-primary', type: 'submit', 'data-mode': 'login' }, 'Sign in')
      ]),
      h('p', { class: 'auth-privacy' }, sampleFinished
        ? 'This device’s sample is added only after you confirm it is yours. New or existing accounts keep their own saved progress.'
        : 'New learners begin with the free first lesson before creating an account.'),
      h('p', { class: 'auth-privacy' }, [
        'Forgot your password? ',
        h('a', { href: 'mailto:learningai4youprojects@duck.com?subject=LearningAI%20account%20help' }, 'Contact Learning AI account help')
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
      if (sampleFinished && data.ownsSample !== 'yes') {
        buttons.forEach(button => { button.disabled = false; });
        message.textContent = 'Confirm that you completed this sample before adding it to your account.';
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
      if (SAMPLE_FIRST_FLOW && sampleFinished && data.ownsSample === 'yes') {
        set(KEY.guestOwner, currentUserKey());
      }
      if (mode === 'signup') {
        serverState = null;
        clearV2LocalSession();
        if (SAMPLE_FIRST_FLOW) {
          try {
            localStorage.removeItem(KEY.progress);
            localStorage.removeItem(KEY.toolkit);
          } catch (e) {}
        }
      }
      await hydrateFromServer({ importLocal: false });
      if (mode === 'signup' || guestSampleOwnerMatchesCurrentUser()) {
        await transferGuestSampleToCurrentUser();
      }
      location.hash = SAMPLE_FIRST_FLOW && !hasAssessment() ? '#/questionnaire' : '#/';
      render();
    });
    const introduction = h('section', { class: 'auth-intro' }, [
      h('div', { class: 'tagline' }, 'Learning AI'),
      h('h2', null, sampleFinished ? 'Your first capability is complete.' : 'Keep your judgment. Expand what you can do.'),
      h('p', null, sampleFinished
        ? 'Your completion, interaction answers, and optional notes belong to you. Create an account to keep them and continue from any device.'
        : 'Fifty guided lessons for understanding, questioning, and directing AI—without handing over control.'),
      h('div', { class: 'auth-proof' }, [
        h('span', null, sampleFinished ? 'Lesson 1 complete' : '10 arcs'),
        h('span', null, '50 free lessons'),
        h('span', null, 'Saved progress')
      ])
    ]);
    return h('div', { class: 'container view auth-view' }, [h('div', { class: 'auth-shell' }, [introduction, form])]);
  }

  function viewGuestWelcome() {
    const lesson = playableLesson(SAMPLE_LESSON_ID);
    const serviceNotice = backendUnavailable
      ? h('div', { class: 'callout callout-bad', role: 'status' }, [
          h('strong', null, 'Account service is temporarily unavailable.'),
          h('p', null, 'You can still try lesson one, but you cannot create an account, submit the starting questions, or unlock the full course until the service is back.')
        ])
      : null;
    return h('div', { class: 'container view v3-guest-welcome' }, [
      h('section', { class: 'dashboard-hero v3-sample-hero' }, [
        h('div', { class: 'dashboard-primary' }, [
          h('div', { class: 'tagline' }, 'Learning AI · Your first lesson is free'),
          h('h1', null, 'Try the course before creating an account.'),
          h('p', { class: 'lead' }, 'Start with one guided lesson. You will make predictions, inspect what the system is doing, and decide when its answer deserves your trust.'),
          h('div', { class: 'v3-onboarding-sequence', 'aria-label': 'How access works' }, [
            h('span', { class: 'active' }, '1 · Free lesson'),
            h('span', null, '2 · Create account'),
            h('span', null, '3 · Starting questions'),
            h('span', null, '4 · Full access')
          ]),
          serviceNotice,
          h('div', { class: 'row-gap' }, [
            h('a', { class: 'btn btn-primary', href: `#/lesson/${SAMPLE_LESSON_ID}/0` },
              backendUnavailable ? 'Try lesson one while offline' : lesson ? `Start: ${lesson.title}` : 'Start lesson one'),
            h('a', { class: 'btn btn-ghost', href: '#/signin' }, 'Already have an account? Sign in')
          ]),
          h('p', { class: 'muted' }, 'No credit card. All 50 lessons are free. You create an account only after finishing the sample lesson.')
        ]),
        h('aside', { class: 'dashboard-panel v3-sample-panel' }, [
          h('div', { class: 'tagline' }, 'What happens in lesson one'),
          h('h2', null, lesson?.coreQuestion || 'What is AI actually doing?'),
          h('p', null, lesson?.blurb || 'Build a useful first mental model through interaction, not a lecture.'),
          h('dl', { class: 'v3-sample-facts' }, [
            h('div', null, [h('dt', null, 'Time'), h('dd', null, `${lesson?.minutes || 8} minutes`)]),
            h('div', null, [h('dt', null, 'Format'), h('dd', null, 'Guided and interactive')]),
            h('div', null, [h('dt', null, 'Account'), h('dd', null, 'Not required yet')])
          ])
        ])
      ])
    ]);
  }

  function viewApiUnavailable() {
    const status = h('p', { class: 'step-feedback', role: 'status', 'aria-live': 'polite' },
      guestSampleIsComplete() ? 'Lesson one is still saved on this device.' : '');
    return h('div', { class: 'container view auth-view' }, [
      h('section', { class: 'lesson-card diagnostic-card' }, [
        h('div', { class: 'tagline' }, 'Learning AI'),
        h('h1', null, 'Accounts are temporarily unavailable'),
        h('p', { class: 'lead' }, guestSampleIsComplete()
          ? 'Your completed first lesson is still saved on this device. Try again when the account service is available.'
          : 'The account service could not be reached. Your course has not been changed.'),
        h('div', { class: 'row-gap' }, [
          h('button', { class: 'btn btn-primary', type: 'button', onclick: () => window.location.reload() }, 'Try again'),
          h('a', { class: 'btn btn-ghost', href: '#/' }, 'Return to course introduction')
        ]),
        status
      ])
    ]);
  }

  async function hydrateFromServer(options = {}) {
    if (!api) return;
    const shouldImportBrowserData = options.importLocal !== false;
    await syncPendingProgress();
    await syncPendingToolkit();
    // Retry a questionnaire that couldn't be uploaded when it was finished.
    const pendingAssessment = currentUser ? readJson(pendingAssessmentStorageKey(), null) : null;
    if (pendingAssessment) {
      const saved = await api.saveAssessment(pendingAssessment).catch(() => ({ ok: false }));
      if (saved.ok) { try { localStorage.removeItem(pendingAssessmentStorageKey()); } catch (e) {} }
    }
    await loadCurriculumFromBackend();
    let state = await api.state();
    const shouldImportLocal = !SAMPLE_FIRST_FLOW && shouldImportBrowserData && currentUser && !get(importedUserKey());
    if (shouldImportLocal) {
      const imported = await api.importLocal({ progress: readProgress(), toolkit: readToolkit() }).catch(() => ({ ok: false }));
      if (imported.ok) {
        const importedAt = new Date().toISOString();
        set(importedUserKey(), importedAt);
        state = await api.state();
      }
      // On import failure, still apply the state we already fetched; the
      // import retries on the next sign-in because the flag stays unset.
    }
    if (state.ok) applyServerState(state.state);
    if (guestSampleOwnerMatchesCurrentUser()) {
      await transferGuestSampleToCurrentUser();
    }
    if (readActivityConsent()) {
      api.saveVisit({ path: location.hash || '#/' }).catch(() => {});
    }
  }

  function accountBar() {
    if (!currentUser) return null;
    const questionnaireLabel = hasAssessment() ? 'Retake questionnaire' : 'Take questionnaire';
    return h('div', { class: 'account-bar' }, [
      h('span', null, `Signed in as ${currentUser.displayName || currentUser.email}`),
      h('a', { class: 'btn btn-ghost', href: '#/questionnaire' }, questionnaireLabel),
      h('button', { class: 'btn btn-ghost', onclick: async () => {
        await syncPendingProgress();
        await syncPendingToolkit();
        const pendingAssessment = readJson(pendingAssessmentStorageKey(), null);
        if (pendingAssessment) {
          const saved = await api.saveAssessment(pendingAssessment).catch(() => ({ ok: false }));
          if (saved.ok) localStorage.removeItem(pendingAssessmentStorageKey());
        }
        if (readPendingProgress().length || readPendingToolkit().length || readJson(pendingAssessmentStorageKey(), null)) {
          window.alert('Some recent learning is still waiting to save. Check your connection and try signing out again so nothing is lost.');
          return;
        }
        await api.logout();
        clearV2LocalSession();
        currentUser = null;
        serverState = null;
        location.hash = '#/';
        render();
      } }, 'Sign out')
    ]);
  }

  function assessmentResult() {
    if (api && currentUser) {
      return isCompleteV2Assessment(serverState?.assessment) ? serverState.assessment : null;
    }
    const candidates = [
      serverState?.assessment,
      readJson(assessmentStorageKey(), null),
      SAMPLE_FIRST_FLOW ? null : readJson('modelwise-gauge', null)
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
    const ready = SAMPLE_FIRST_FLOW
      ? authChecked && Boolean(currentUser) && hasAssessment() && !onDiagnostic
      : authChecked && (!api || (currentUser && !onDiagnostic));
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
    const draft = readJson(diagnosticDraftStorageKey(), { index: 0, answers: {}, notes: {} });
    draft.answers = draft.answers || {};
    draft.notes = draft.notes || {};
    draft.profile = draft.profile || {};
    const total = DIAGNOSTIC_QUESTIONS.length;
    const index = Math.max(0, Math.min(Number(draft.index) || 0, total - 1));
    const question = DIAGNOSTIC_QUESTIONS[index];
    const message = h('p', { class: 'step-feedback', 'aria-live': 'polite' }, '');

    function saveDraft(nextDraft) {
      set(diagnosticDraftStorageKey(), JSON.stringify(nextDraft));
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
        learningStyle: `Interactive ${PRODUCT_VERSION} lessons with checks before moving on.`,
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
      h('small', { class: 'muted' }, 'Learning AI is designed for ages 13+. Choose “Prefer not to say” if you do not want to share an age range.'),
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
        const saved = await api.saveAssessment(assessment).catch(() => ({ ok: false, error: 'network_error' }));
        if (!saved.ok) {
          const savedOnDevice = set(pendingAssessmentStorageKey(), JSON.stringify(assessment));
          if (SAMPLE_FIRST_FLOW) {
            message.textContent = savedOnDevice
              ? `Not saved to your account yet (${friendlyError(saved)}). Your answers remain on this device; keep this page open and choose Finish again.`
              : `Your answers could not be saved to your account or this device (${friendlyError(saved)}). Keep this page open and choose Finish again.`;
            return;
          }
        }
      }
      saveAssessmentLocal(assessment);
      serverState = { ...(serverState || {}), assessment };
      localStorage.removeItem(diagnosticDraftStorageKey());
      location.hash = '#/';
      render();
    } }, 'Finish and open dashboard');

    const returnLink = h('p', { class: 'questionnaire-return' },
      hasAssessment()
        ? h('a', { href: '#/' }, 'Take me back to my dashboard')
        : SAMPLE_FIRST_FLOW
          ? 'Complete all six categories to open your dashboard and the rest of Learning AI.'
          : h('a', { href: '#/' }, 'Skip for now and open the dashboard'));

    return h('div', { class: 'container view auth-view' }, [
      h('section', { class: 'lesson-card diagnostic-card' }, [
        h('div', { class: 'gauge-progress diagnostic-progress' }, [
          h('span', null, `${question.category} of 6`),
          h('div', null, progressFill)
        ]),
        h('h1', null, 'Set your starting point'),
        SAMPLE_FIRST_FLOW && !hasAssessment()
          ? h('div', { class: 'callout diagnostic-disclosure' }, [
              h('strong', null, 'Why these six questions are required'),
              h('p', null, 'Your answers set your starting level, focus area, and lesson recommendation. We ask for an age range—not a birth date—so guidance can fit the learner. Your answers are saved to your Learning AI account and may be reviewed by Learning AI administrators to support and improve the course.'),
              h('a', { href: '../privacy.html' }, 'Read the privacy details')
            ])
          : null,
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
            h('div', { class: 'dash-stat' }, [h('strong', null, profile ? `${profile.score ?? 0}%` : 'Not set'), h('span', null, 'starting point')]),
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
        h('p', { class: 'lead' }, `This is the full ${PRODUCT_VERSION} journey. Today shows your next action; this page lets you open any lesson or review completed work.`),
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
    const gated = Boolean(step.gated) || GATED.has(step.kind);

    const lessonStages = [...new Set(lesson.steps.map(lessonStep => lessonStage(lessonStep.kind)))];
    const activeStageIndex = lessonStages.indexOf(lessonStage(step.kind));
    const stageRail = h('ol', { class: 'lesson-stage-rail', 'aria-label': 'Lesson sequence', style: `--lesson-steps:${lessonStages.length}` }, lessonStages.map((stageName, i) =>
      h('li', {
        class: (i === activeStageIndex ? 'active' : '') + (i < activeStageIndex ? ' past' : ''),
        'aria-current': i === activeStageIndex ? 'step' : null
      }, [h('span', { class: 'stage-number' }, String(i + 1).padStart(2, '0')), h('span', { class: 'stage-name' }, stageName)])));

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
    let body = null;
    const ctx = {
      unlock() {
        if (!nextBtn.disabled) return;
        nextBtn.disabled = false;
        nextBtn.classList.remove('is-locked');
        nextBtn.setAttribute('aria-label', nextLabel);
        // Persist the newly reached boundary as soon as the learner completes
        // the gate, so a refresh does not make them repeat valid evidence.
        recordStepReached(id, Math.min(idx + 1, total - 1));
        saveProgressToBackend({ lessonId: id, currentStep: Math.min(idx + 1, total - 1), completed: false });
        const hint = body?.querySelector('.lock-hint');
        if (hint) {
          hint.textContent = '✓ Step complete. Next is available.';
          hint.classList.add('done');
        }
        nextBtn.focus();
      }
    };

    const back = idx > 0
      ? h('a', { class: 'btn btn-ghost', href: `#/lesson/${id}/${idx - 1}` }, '← Back')
      : h('a', { class: 'btn btn-ghost', href: SAMPLE_FIRST_FLOW && !currentUser ? '#/' : '#/lessons' },
          SAMPLE_FIRST_FLOW && !currentUser ? '← About the course' : '← All lessons');

    const renderer = steps[step.kind] || steps.reveal;
    body = renderer(step, ctx);
    if (gated && !nextBtn.disabled) {
      const hint = body.querySelector('.lock-hint');
      if (hint) {
        hint.textContent = '✓ Step complete. Next is available.';
        hint.classList.add('done');
      }
    }
    const notebook = buildLessonNotebook(lesson);

    saveProgressToBackend({ lessonId: id, currentStep: idx, completed: false });

    return h('div', { class: 'container view lesson-view' }, [
      accountBar(),
      h('div', { class: 'lesson-head' }, [
        h('div', { class: 'lesson-heading-copy' }, [
          h('span', { class: 'crumb' }, `${lesson.arc} · Lesson ${lesson.num} of ${LESSONS.length} · part ${idx + 1}/${total}`),
          h('h1', { class: 'lesson-h1' }, lesson.title),
          h('p', { class: 'core-q' }, lesson.coreQuestion)
        ]),
        h('div', { class: 'lesson-outcome' }, [
          h('div', null, [h('span', null, 'You will leave with'), h('strong', null, lesson.blurb)]),
          h('div', null, [h('span', null, 'Designed time'), h('strong', null, `${lesson.minutes || 8} minutes`)])
        ]),
        stageRail
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
        ...lesson.resources.map(r => h('a', { href: r.url, target: '_blank', rel: 'noopener', class: 'res-link' }, r.label))]) : null,
      h('div', { class: 'row-gap' }, [
        next ? h('a', { class: 'btn btn-primary', href: `#/lesson/${next.id}/0` }, `Next: ${next.num}. ${next.title}`)
             : h('a', { class: 'btn btn-primary', href: '../my-path.html' }, 'See My Path'),
        h('a', { class: 'btn btn-ghost', href: '#/lessons' }, 'All lessons'),
        h('a', { class: 'btn btn-ghost', href: '#/lessons' }, 'Lesson list')
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
    const settings = { ...(readJson(KEY.settings, {}) || {}), shareLearningActivity: readActivityConsent() };
    function savePatch(patch) {
      if (Object.prototype.hasOwnProperty.call(patch, 'shareLearningActivity')) {
        set(activityConsentStorageKey(), JSON.stringify({
          shareLearningActivity: Boolean(patch.shareLearningActivity),
          savedAt: new Date().toISOString()
        }));
      } else {
        set(KEY.settings, JSON.stringify({ ...settings, ...patch, savedAt: new Date().toISOString() }));
      }
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
    const deletionMessage = h('p', { class: 'step-feedback', 'aria-live': 'polite' }, '');
    const deletionForm = h('form', { class: 'settings-profile-form', onsubmit: async event => {
      event.preventDefault();
      const confirmation = String(new FormData(event.currentTarget).get('confirmation') || '').trim();
      if (confirmation !== 'DELETE') {
        deletionMessage.textContent = 'Type DELETE exactly before removing the account.';
        return;
      }
      const button = event.currentTarget.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      deletionMessage.textContent = 'Deleting your account and learning data...';
      const result = api ? await api.deleteAccount(confirmation).catch(() => ({ ok: false, error: 'network_error' })) : { ok: false, error: 'backend_not_configured' };
      if (!result.ok) {
        if (button) button.disabled = false;
        deletionMessage.textContent = apiErrorText(result.error);
        return;
      }
      clearV2LocalSession();
      currentUser = null;
      serverState = null;
      location.hash = '#/';
      render();
    } }, [
      h('label', { class: 'pr-field' }, [
        h('span', null, 'Type DELETE to confirm'),
        h('input', { name: 'confirmation', type: 'text', autocomplete: 'off', spellcheck: 'false' })
      ]),
      h('div', { class: 'row-gap' }, [h('button', { class: 'btn btn-ghost', type: 'submit' }, 'Delete my account')]),
      deletionMessage
    ]);
    return h('div', { class: 'container view v2-page' }, [
      accountBar(),
      h('header', { class: 'hero compact' }, [
        h('div', { class: 'tagline' }, `${PRODUCT_VERSION} settings`),
        h('h1', null, 'Make the course easier to use'),
        h('p', { class: 'lead' }, `These settings stay with your Learning AI account and update ${PRODUCT_VERSION} immediately.`)
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
            h('button', { class: 'btn btn-ghost', 'aria-pressed': settings.theme === 'light' ? 'true' : 'false', onclick: () => savePatch({ theme: 'light' }) }, 'Light'),
            h('button', { class: 'btn btn-ghost', 'aria-pressed': settings.theme === 'dark' ? 'true' : 'false', onclick: () => savePatch({ theme: 'dark' }) }, 'Dark'),
            h('button', { class: 'btn btn-ghost', 'aria-pressed': settings.theme === 'sepia' ? 'true' : 'false', onclick: () => savePatch({ theme: 'sepia' }) }, 'Sepia'),
            h('button', { class: 'btn btn-ghost', 'aria-pressed': settings.theme === 'contrast' ? 'true' : 'false', onclick: () => savePatch({ theme: 'contrast' }) }, 'High contrast'),
            h('button', { class: 'btn btn-ghost', 'aria-pressed': !settings.theme ? 'true' : 'false', onclick: () => savePatch({ theme: '' }) }, 'Default')
          ]),
          h('p', { class: 'muted' }, `Current: ${settings.theme || 'default'}`)
        ]),
        h('article', { class: 'dashboard-section v2-settings-card' }, [
          h('h2', null, 'Text size'),
          h('div', { class: 'seg-row' }, [
            h('button', { class: 'btn btn-ghost', 'aria-pressed': !settings.fontScale || settings.fontScale === 'normal' ? 'true' : 'false', onclick: () => savePatch({ fontScale: 'normal' }) }, 'Normal'),
            h('button', { class: 'btn btn-ghost', 'aria-pressed': settings.fontScale === 'large' ? 'true' : 'false', onclick: () => savePatch({ fontScale: 'large' }) }, 'Large'),
            h('button', { class: 'btn btn-ghost', 'aria-pressed': settings.fontScale === 'xl' ? 'true' : 'false', onclick: () => savePatch({ fontScale: 'xl' }) }, 'Extra large')
          ]),
          h('p', { class: 'muted' }, `Current: ${settings.fontScale === 'xl' ? 'extra large' : settings.fontScale || 'normal'}. This changes immediately for reading comfort.`)
        ]),
        h('article', { class: 'dashboard-section v2-settings-card' }, [
          h('h2', null, 'Motion'),
          h('p', null, 'Motion shows route changes and progress. Reduce it whenever movement makes reading or concentration harder.'),
          h('div', { class: 'seg-row' }, [
            h('button', { class: 'btn btn-ghost', 'aria-pressed': settings.reduceMotion ? 'false' : 'true', onclick: () => savePatch({ reduceMotion: false }) }, 'Full motion'),
            h('button', { class: 'btn btn-ghost', 'aria-pressed': settings.reduceMotion ? 'true' : 'false', onclick: () => savePatch({ reduceMotion: true }) }, 'Reduce motion')
          ]),
          h('p', { class: 'muted' }, settings.reduceMotion ? 'Reduced motion is on. All information and feedback remain available.' : 'Full motion is on. Your device-level reduced-motion preference is still respected.')
        ]),
        h('article', { class: 'dashboard-section v2-settings-card' }, [
          h('h2', null, 'Share learning activity'),
          h('p', null, 'Choose whether Learning AI may record active learning minutes plus the current lesson or page. This helps us understand which parts hold attention. It is off unless you turn it on.'),
          h('div', { class: 'seg-row' }, [
            h('button', {
              class: 'btn btn-ghost',
              'aria-pressed': settings.shareLearningActivity ? 'true' : 'false',
              onclick: () => savePatch({ shareLearningActivity: true })
            }, 'Share activity'),
            h('button', {
              class: 'btn btn-ghost',
              'aria-pressed': settings.shareLearningActivity ? 'false' : 'true',
              onclick: () => savePatch({ shareLearningActivity: false })
            }, 'Keep activity private')
          ]),
          h('p', { class: 'muted' }, settings.shareLearningActivity
            ? 'Sharing is on. You can turn it off at any time.'
            : 'Sharing is off. Learning AI is not recording your active minutes or page visits.')
        ]),
        h('article', { class: 'dashboard-section v2-settings-card' }, [
          h('h2', null, 'Starting point'),
          h('p', null, SAMPLE_FIRST_FLOW
            ? 'The six-category starting questionnaire is required once after lesson 1. It sets your starting level, focus area, and lesson recommendation. You can retake it whenever your experience changes.'
            : 'The optional questionnaire personalizes your suggested starting point. You can skip it and begin with lesson 1 at any time.'),
          h('div', { class: 'row-gap' }, [
            h('a', { class: 'btn btn-primary', href: '#/questionnaire' }, hasAssessment() ? 'Retake questionnaire' : 'Take questionnaire'),
            h('button', { class: 'btn btn-ghost', onclick: () => {
              localStorage.removeItem(assessmentStorageKey());
              localStorage.removeItem('modelwise-gauge');
              localStorage.removeItem(diagnosticDraftStorageKey());
              serverState = { ...(serverState || {}), assessment: null };
              location.hash = '#/questionnaire';
              render();
            } }, SAMPLE_FIRST_FLOW ? 'Clear and retake' : 'Clear local result')
          ])
        ]),
        h('article', { class: 'dashboard-section v2-settings-card callout-bad' }, [
          h('h2', null, 'Delete account and learning data'),
          h('p', null, 'This permanently removes your account, progress, questionnaire answers, interaction evidence, and Saved Notes from Learning AI. It cannot be undone.'),
          h('p', { class: 'muted' }, 'This affects Learning AI only. It does not delete an account or chat history from any outside AI service you used for practice.'),
          deletionForm
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

  function viewAccess() {
    return h('div', { class: 'container view v2-page access-page free-access-page' }, [
      accountBar(),
      h('header', { class: 'access-hero' }, [
        h('div', { class: 'tagline' }, 'Open access'),
        h('h1', null, 'All 50 lessons. Free.'),
        h('p', { class: 'lead' }, 'Understanding AI should not depend on finishing a trial or keeping a subscription. Every lesson, interaction, project prompt, accessibility setting, and progress record is available without a course payment.'),
        h('p', { class: 'access-status' }, 'Your learning path is open. No lesson is locked behind payment.')
      ]),
      h('section', { class: 'free-access-grid', 'aria-label': 'What free access includes' }, [
        h('article', { class: 'free-access-statement' }, [
          h('span', { class: 'tagline' }, 'The complete journey'),
          h('strong', null, '10 arcs · 50 authored lessons'),
          h('p', null, 'Start with what AI is, learn how to direct and verify it, then use it to build useful projects while keeping your own judgment.')
        ]),
        h('article', { class: 'free-access-statement' }, [
          h('span', { class: 'tagline' }, 'Your record'),
          h('strong', null, 'Progress and Saved Notes'),
          h('p', null, 'Your completed lessons, evidence, preferences, and optional notes stay connected to your account.')
        ]),
        h('article', { class: 'free-access-statement' }, [
          h('span', { class: 'tagline' }, 'The promise'),
          h('strong', null, 'Learning comes before commerce'),
          h('p', null, 'There are no purchase prompts inside lessons, no completion pressure, and no recurring payment required to keep learning.')
        ])
      ]),
      h('div', { class: 'row-gap access-free-action' }, [
        h('a', { class: 'btn btn-primary', href: '#/lessons' }, 'Explore all 50 lessons'),
        h('a', { class: 'btn btn-ghost', href: '#/' }, 'Return to Today')
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
        h('div', { class: 'tagline' }, `About ${PRODUCT_VERSION}`),
        h('h1', null, 'Learning AI is for anyone starting from questions'),
        h('p', { class: 'lead' }, `${PRODUCT_VERSION} is a guided course with accounts, saved progress, interactive lessons, and projects. It begins with anxious and curious learners aged 13+, while remaining useful to teachers, parents, builders, and adults starting from questions.`)
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
          h('p', { class: 'muted' }, `${PRODUCT_VERSION} saves progress to the Learning AI backend.`)
        ])
      ]));
      return;
    }
    if (SAMPLE_FIRST_FLOW && !currentUser) {
      const onSampleLesson = parts[0] === 'lesson' && parts[1] === SAMPLE_LESSON_ID;
      const onSampleDone = parts[0] === 'done' && parts[1] === SAMPLE_LESSON_ID;
      const onSignIn = parts[0] === 'signin' || parts[0] === 'access';
      let guestNode;
      if (onSampleLesson) {
        guestNode = viewLesson(SAMPLE_LESSON_ID, parseInt(parts[2] || '0', 10) || 0);
      } else if (onSampleDone && guestSampleIsComplete()) {
        guestNode = (!api || backendUnavailable) ? viewApiUnavailable() : viewAuthGate();
      } else if (onSignIn) {
        guestNode = (!api || backendUnavailable) ? viewApiUnavailable() : viewAuthGate();
      } else {
        guestNode = viewGuestWelcome();
      }
      app.innerHTML = '';
      app.appendChild(guestNode);
      updateShellChrome(parts);
      updateTopProgress();
      trackPageView();
      window.scrollTo(0, 0);
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
    // In the launch journey, the completed questionnaire is the final access
    // gate after account creation. Returning accounts that have not finished
    // it resume here before the rest of the product becomes available.
    if (SAMPLE_FIRST_FLOW && currentUser && !hasAssessment()) node = viewDiagnostic();
    else if (parts[0] === 'diagnostic' || parts[0] === 'questionnaire') node = viewDiagnostic();
    else if (parts.length === 0) node = viewDashboard();
    else if (parts[0] === 'lessons') node = viewLessonsCatalog();
    else if (parts[0] === 'access') node = viewAccess();
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
    window.gtag('event', 'page_view', { page_location: location.href, page_path: PRODUCT_PATH + hash.replace(/^#/, '') });
  }

  // ---------- time tracking: report active minutes to the backend ----------
  let activeSeconds = 0;
  setInterval(() => {
    if (document.visibilityState !== 'visible' || !currentUser || !api?.saveMinutes) return;
    if (!readActivityConsent()) return;
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
