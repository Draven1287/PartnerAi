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
  let LESSONS = Array.isArray(window.LESSONS) ? window.LESSONS : [];
  let ARCS = window.V2_ARCS ? Object.values(window.V2_ARCS) : [];
  const KEY = {
    progress: 'learningai-progress',
    settings: 'learningai-settings',
    toolkit: 'learningai-toolkit',
    assessment: 'learningai-v2-assessment',
    diagnosticDraft: 'learningai-v2-diagnostic-draft'
  };
  const api = window.LearningAIV2Api || null;
  let authChecked = !api;
  let currentUser = null;
  let serverState = null;
  let curriculumLoadedFromBackend = false;

  // step kinds that REQUIRE completion before Next unlocks
  const GATED = new Set(['classify', 'exitCheck', 'toolkitSave', 'promptRepair', 'biasSpot', 'agentDesign', 'workflowChain']);
  // arc colors for the mosaic (one hue per arc)
  const ARC_COLORS = ['#2563eb', '#0891b2', '#7c3aed', '#dc2626', '#ea580c', '#16a34a'];
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
  function currentUserKey() { return currentUser?.id || currentUser?.email || 'unknown'; }
  function importedUserKey() { return `learningai-v2-imported:${currentUserKey()}`; }
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
  function doneCount() { const c = readProgress().completed; return LESSONS.filter(l => !l.stub && c[l.id]).length; }
  function markComplete(id) {
    const lesson = LESSONS.find(l => l.id === id);
    if (!lesson || lesson.stub) return;
    const p = readProgress();
    p.completed[id] = { completedAt: new Date().toISOString() };
    saveProgress(p);
    set('learningai-v2-last-complete', id);
    saveProgressToBackend({ lessonId: id, completed: true, currentStep: 999 });
  }
  function nextIncomplete() { const c = readProgress().completed; return LESSONS.find(l => !l.stub && !c[l.id]) || null; }
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
    if (GATED.has(step.kind) && step.kind !== 'exitCheck' && (correct === true || correct == null) && api.completeActivity) {
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
      const cell = h('a', {
        class: 'mz' + (filled ? ' filled' : '') + (locked ? ' locked' : '') + (current ? ' current' : '') + (l.id === opts.activeId ? ' active' : '') + (justUnlocked ? ' just-unlocked' : ''),
        href: locked ? '#/lessons' : `#/lesson/${l.id}/0`,
        title: `${l.num}. ${l.title}${filled ? ' ✓' : locked ? ' locked' : ''}`,
        style: `--tile-col:${col};--tile-row:${row};`,
        'aria-disabled': locked ? 'true' : null
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
        ]));
      });
    }
    return h('section', { class: 'lesson-toolkit', id: 'lesson-toolkit' }, [
      h('div', { class: 'section-heading' }, 'Your lesson toolkit'),
      h('h2', null, cards.length ? 'Reusable cards from the lessons' : 'Save the useful stuff as you go'),
      h('p', { class: 'muted' }, 'This is not a separate path. It is the working notebook you build while completing lesson steps. When you are signed in, it syncs to the backend.'),
      body
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
              correct++; if (correct === s.items.length) { fb.textContent = '✓ ' + (s.reveal || 'All sorted — nice.'); ctx.unlock(); }
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
        class: 'btn btn-primary', onclick: async (e) => {
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
          fb.textContent = 'Saved locally. Syncing...';
          const synced = api ? await api.saveToolkit({ id: cardId, cardType: s.cardType, lessonId: currentLessonId, payload: { fields, fieldLabels: labels } }).catch(() => ({ ok: false })) : { ok: false, skipped: true };
          if (!synced.ok) savePendingToolkit([cards[0], ...readPendingToolkit().filter(card => card.id !== cardId)]);
          recordInteraction(s, { fields, synced: !!synced.ok });
          fb.textContent = synced.ok ? 'Saved to your backend toolkit ✓' : 'Saved locally. It is queued to sync after the backend is available.'; ctx.unlock();
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
      h('p', { class: 'muted' }, 'Each email creates its own learner account. To switch learners, sign out and use a different email.'),
      h('label', { class: 'pr-field' }, [h('span', null, 'Email'), h('input', { name: 'email', type: 'email', autocomplete: 'email', required: 'true' })]),
      h('label', { class: 'pr-field' }, [h('span', null, 'Password'), h('input', { name: 'password', type: 'password', autocomplete: 'current-password', required: 'true', minlength: '8' })]),
      h('label', { class: 'pr-field' }, [h('span', null, 'Display name'), h('input', { name: 'displayName', type: 'text', autocomplete: 'name', maxlength: '40', placeholder: 'Only needed when creating an account' })]),
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
      if (!hasAssessment()) location.hash = '#/questionnaire';
      render();
    });
    return h('div', { class: 'container view auth-view' }, [form]);
  }

  function viewApiUnavailable() {
    return h('div', { class: 'container view auth-view' }, [
      h('section', { class: 'lesson-card diagnostic-card' }, [
        h('div', { class: 'tagline' }, 'Hidden V2 beta'),
        h('h1', null, 'V2 accounts are unavailable right now'),
        h('p', { class: 'lead' }, 'This preview needs the Learning AI backend before it can show the course. V1 is still the public site while V2 is being built.'),
        h('p', { class: 'muted' }, 'For local testing, start the V2 backend and reload this page.')
      ])
    ]);
  }

  async function hydrateFromServer() {
    if (!api) return;
    const localGauge = assessmentResult();
    await syncPendingProgress();
    await syncPendingToolkit();
    await loadCurriculumFromBackend();
    let state = await api.state();
    const shouldImportLocal = currentUser && !get('learningai-v2-imported-ever') && !get(importedUserKey());
    if (shouldImportLocal) {
      const imported = await api.importLocal({ progress: readProgress(), toolkit: readToolkit(), assessment: localGauge || null }).catch(() => ({ ok: false }));
      if (imported.ok) {
        const importedAt = new Date().toISOString();
        set(importedUserKey(), importedAt);
        set('learningai-v2-imported-ever', importedAt);
        state = await api.state();
      } else {
        return;
      }
    }
    if (state.ok) applyServerState(state.state);
    if (localGauge && !state?.state?.assessment) api.saveAssessment(localGauge).catch(() => {});
    api.saveVisit({ path: location.hash || '#/', referrer: document.referrer || '' }).catch(() => {});
  }

  function accountBar() {
    if (!currentUser) return null;
    return h('div', { class: 'account-bar' }, [
      h('span', null, `Signed in as ${currentUser.displayName || currentUser.email}`),
      h('a', { class: 'btn btn-ghost', href: '#/' }, 'Dashboard'),
      h('a', { class: 'btn btn-ghost', href: '#/questionnaire' }, 'Retake questionnaire'),
      h('button', { class: 'btn btn-ghost', onclick: async () => {
        await api.logout();
        currentUser = null;
        serverState = null;
        clearV2LocalSession();
        location.hash = '#/';
        render();
      } }, 'Sign out')
    ]);
  }

  function assessmentResult() {
    if (api && currentUser && serverState) {
      return isCompleteV2Assessment(serverState.assessment) ? serverState.assessment : null;
    }
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
    const ready = authChecked && (!api || (currentUser && hasAssessment() && !onDiagnostic));
    setShellVisible(Boolean(ready));
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href') || '';
      const route = routeParts?.[0] || '';
      const active = (href === '#/' && (!routeParts || routeParts.length === 0)) || href === `#/${route}`;
      link.classList.toggle('active', active);
    });
  }

  function learningMode() {
    const a = assessmentResult() || {};
    const confidence = String(a.responses?.find?.(r => r.key === 'confidence')?.value || a.level || a.route || '').toLowerCase();
    if (confidence.includes('builder')) return 'Builder mode';
    if (confidence.includes('foundation')) return 'Foundation mode';
    return 'Explorer mode';
  }

  function diagnosticSummary() {
    const a = assessmentResult();
    if (!a) return 'Take the diagnostic to set your starting point.';
    const weakest = a.weakestCategory ? `Focus area: ${a.weakestCategory}.` : '';
    const strongest = a.strongestCategory ? `Strength: ${a.strongestCategory}.` : '';
    return [a.primaryGoal || 'Build stronger AI habits.', weakest, strongest].filter(Boolean).join(' ');
  }

  function viewDiagnostic() {
    const draft = readJson(KEY.diagnosticDraft, { index: 0, answers: {}, notes: {} });
    draft.answers = draft.answers || {};
    draft.notes = draft.notes || {};
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
      const weakest = sorted[0]?.category || '';
      const strongest = sorted[sorted.length - 1]?.category || '';
      const assessment = {
        level,
        route: level,
        score: scorePercent,
        scoreRaw: totalScore,
        maxScore,
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
      if (selectedAnswer()) return true;
      message.textContent = `Choose one answer for ${question.category} first.`;
      return false;
    }

    const progressFill = h('span', { style: `width:${Math.round(((index + 1) / total) * 100)}%` });
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
        if (!saved.ok) {
          message.textContent = saved.error || 'Could not save yet. Try again when the backend is reachable.';
          return;
        }
      }
      saveAssessmentLocal(assessment);
      serverState = { ...(serverState || {}), assessment };
      localStorage.removeItem(KEY.diagnosticDraft);
      location.hash = '#/';
      render();
    } }, 'Finish and open dashboard');

    const returnLink = hasAssessment()
      ? h('p', { class: 'questionnaire-return' }, h('a', { href: '#/' }, 'Take me back to my dashboard'))
      : null;

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
        options,
        note,
        h('div', { class: 'gauge-actions' }, [back, index === total - 1 ? finish : next]),
        message,
        returnLink
      ])
    ]);
  }

  function viewLessons(showCatalog = false) {
    const c = readProgress().completed;
    const done = doneCount();
    const pct = Math.round(done / LESSONS.length * 100);
    const next = nextIncomplete();
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

    const sections = ARCS.map((arcName, ai) => {
      const inArc = LESSONS.filter(l => l.arc === arcName);
      if (!inArc.length) return null;
      return h('section', { class: 'arc' }, [
        h('h2', { class: 'arc-title' }, [h('span', { class: 'arc-num', style: `background:${ARC_COLORS[ai]}1a;color:${ARC_COLORS[ai]}` }, `Arc ${ai + 1}`), arcName]),
        h('div', { class: 'lesson-grid' }, inArc.map(l => {
          const locked = !!l.stub;
          const current = next && next.id === l.id;
          return h('a', {
            class: 'lesson-tile' + (c[l.id] ? ' completed' : '') + (locked ? ' locked' : '') + (current ? ' current' : ''),
            href: locked ? '#/lessons' : `#/lesson/${l.id}/0`,
            'aria-disabled': locked ? 'true' : null
          }, [
            h('span', { class: 'lt-num' }, c[l.id] ? '✓' : String(l.num)),
            h('span', { class: 'lt-title' }, l.title),
            h('span', { class: 'lt-q' }, l.coreQuestion),
            locked ? h('span', { class: 'lt-badge' }, 'locked') : current ? h('span', { class: 'lt-badge' }, 'next') : null
          ]);
        }))
      ]);
    }).filter(Boolean);

    return h('div', { class: 'container view v2-dashboard' }, [
      accountBar(),
      h('section', { class: 'dashboard-hero' }, [
        h('div', { class: 'dashboard-primary' }, [
          h('div', { class: 'tagline' }, next ? `${mode} · Next lesson ${next.num}` : 'Course progress'),
          h('h1', null, next ? next.coreQuestion : 'Every authored lesson is complete'),
          h('p', { class: 'lead' }, next ? `${next.title}. Complete the guided interactions to reveal the next painting tile.` : 'Review your toolkit, then start a real project with the patterns you saved.'),
          h('div', { class: 'dashboard-stats' }, [
            h('div', { class: 'dash-stat' }, [h('strong', null, `${done}`), h('span', null, 'tiles revealed')]),
            h('div', { class: 'dash-stat' }, [h('strong', null, `${pct}%`), h('span', null, 'complete')]),
            h('div', { class: 'dash-stat' }, [h('strong', null, `${readToolkit().length}`), h('span', null, 'toolkit cards')])
          ]),
          h('div', { class: 'row-gap' }, [
            next ? h('a', { class: 'btn btn-primary', href: `#/lesson/${next.id}/0` }, done ? `Continue lesson ${next.num}` : `Start lesson ${next.num}`)
                 : h('a', { class: 'btn btn-primary', href: '#/projects' }, 'Start a project'),
            h('a', { class: 'btn btn-ghost', href: '#/questionnaire' }, 'Retake questionnaire')
          ])
        ]),
        h('aside', { class: 'dashboard-panel' }, [
          h('div', { class: 'tagline' }, 'Progress painting'),
          buildMosaic({ currentId: next?.id }),
          h('p', { class: 'muted mosaic-caption' }, `${done} / ${LESSONS.length} lesson tiles revealed. ${LESSONS.length - authoredTotal} future lessons are locked until authored.`)
        ])
      ]),
      h('section', { class: 'dashboard-grid' }, [
        h('div', { class: 'dashboard-section' }, [
          h('h2', null, 'Your learning mode'),
          h('p', null, diagnosticSummary()),
          h('div', { class: 'arc-progress-list' }, arcCards),
          !showCatalog ? h('p', { class: 'row-gap' }, h('a', { class: 'btn btn-ghost', href: '#/lessons' }, 'View all lessons')) : null
        ]),
        h('div', { class: 'dashboard-section' }, [buildToolkitPanel()])
      ]),
      showCatalog ? h('header', { class: 'hero compact catalog-head' }, [
        h('div', { class: 'tagline' }, 'All V2 lessons'),
        h('h1', null, 'Course catalog'),
        h('p', { class: 'lead' }, 'This is the full 30-lesson map. Authored lessons are playable now; locked tiles stay visible so you can see what is coming next.')
      ]) : null,
      ...(showCatalog ? sections : [])
    ]);
  }

  function viewLesson(id, stepIndex) {
    const lesson = LESSONS.find(l => l.id === id);
    if (!lesson) return notFound();
    if (lesson.stub) return viewLockedLesson(lesson);
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

    saveProgressToBackend({ lessonId: id, currentStep: idx, completed: false });

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

  function viewLockedLesson(lesson) {
    return h('div', { class: 'container view' }, [
      accountBar(),
      h('section', { class: 'lesson-card' }, [
        h('div', { class: 'tagline' }, 'Locked lesson'),
        h('h1', null, `${lesson.num}. ${lesson.title}`),
        h('p', { class: 'lead' }, 'This lesson is intentionally locked until it has real gated interactions, a useful toolkit artifact, and an exit check.'),
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
    return h('div', { class: 'container view v2-page' }, [
      accountBar(),
      h('header', { class: 'hero compact' }, [
        h('div', { class: 'tagline' }, 'V2 settings'),
        h('h1', null, 'Make the course easier to use'),
        h('p', { class: 'lead' }, 'These settings stay in V2. They do not send you back to the older site.')
      ]),
      h('section', { class: 'v2-card-grid' }, [
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
          h('p', null, 'Retake the six-category questionnaire when you want V2 to reset your learning mode.'),
          h('div', { class: 'row-gap' }, [
            h('a', { class: 'btn btn-primary', href: '#/questionnaire' }, 'Retake questionnaire'),
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
        h('p', { class: 'lead' }, 'Projects should become real build ideas and case studies, not a playground link. This page is the V2 project hub.')
      ]),
      h('section', { class: 'v2-card-grid' }, [
        h('article', { class: 'project-card' }, [
          h('span', { class: 'lt-badge' }, 'case study draft'),
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
          h('span', { class: 'lt-badge' }, 'starter'),
          h('h2', null, 'Prompt repair journal'),
          h('p', null, 'Collect three weak prompts, repair each one, and explain what changed: goal, context, constraints, format, or verification.')
        ]),
        h('article', { class: 'project-card' }, [
          h('span', { class: 'lt-badge' }, 'starter'),
          h('h2', null, 'AI verification checklist'),
          h('p', null, 'Pick a claim, ask AI for help, then show the outside sources and checks that made the answer safer.')
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
          h('div', { class: 'tagline' }, 'Hidden V2 beta'),
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
    if (api && !currentUser) {
      updateShellChrome(parts);
      app.innerHTML = '';
      app.appendChild(viewAuthGate());
      updateTopProgress();
      return;
    }
    let node;
    if (currentUser && !hasAssessment() && parts[0] !== 'diagnostic' && parts[0] !== 'questionnaire') node = viewDiagnostic();
    else if (parts[0] === 'diagnostic' || parts[0] === 'questionnaire') node = viewDiagnostic();
    else if (parts.length === 0) node = viewLessons(false);
    else if (parts[0] === 'lessons') node = viewLessons(true);
    else if (parts[0] === 'settings') node = viewSettings();
    else if (parts[0] === 'projects') node = viewProjects();
    else if (parts[0] === 'teaching') node = viewTeaching();
    else if (parts[0] === 'about') node = viewAboutV2();
    else if (parts[0] === 'lesson' && parts[1]) node = viewLesson(parts[1], parseInt(parts[2] || '0', 10) || 0);
    else if (parts[0] === 'done' && parts[1]) node = viewDone(parts[1]);
    else node = viewLessons();

    app.innerHTML = '';
    app.appendChild(node);
    updateShellChrome(parts);
    updateTopProgress();
    window.scrollTo(0, 0);
  }

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
