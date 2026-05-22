/* ============================================================
   Learning AI: shared scripts
   Assessment, personalization, and prompt-copy interactions.
   ============================================================ */

function levelIdFromRoute(route) {
  const value = String(route || '').toLowerCase();
  if (value.includes('builder')) return 'builder';
  if (value.includes('explorer')) return 'explorer';
  if (value.includes('foundation') || value.includes('beginner')) return 'beginner';
  return '';
}

function readLearningSettings() {
  try {
    return JSON.parse(safeGetStorage('learningai-settings') || 'null') || {};
  } catch (e) {
    return {};
  }
}

function safeGetStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

function safeRemoveStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

function showStorageWarning(message = 'Could not save on this device. You can still use the site, but progress may not persist.') {
  const existing = document.getElementById('storage-warning');
  if (existing) {
    existing.textContent = message;
    existing.hidden = false;
    return;
  }
  const target = document.querySelector('main .container') || document.querySelector('main .wide') || document.querySelector('main');
  if (!target) return;
  const warning = document.createElement('div');
  warning.id = 'storage-warning';
  warning.className = 'callout callout-bad';
  warning.textContent = message;
  target.prepend(warning);
}

const LESSON_SEQUENCE = [
  {
    id: 'chapter-1',
    href: 'chapter-1.html',
    stage: 'Foundation',
    label: 'Chapter 1',
    title: 'What AI actually is',
    copy: 'Models, training, prediction, hallucination, and why chat is only one small part of AI.'
  },
  {
    id: 'chapter-2',
    href: 'chapter-2.html',
    stage: 'Foundation',
    label: 'Chapter 2',
    title: 'How to talk to AI',
    copy: 'Learn context, roles, examples, constraints, and follow-up questions.'
  },
  {
    id: 'chapter-3',
    href: 'chapter-3.html',
    stage: 'Explorer',
    label: 'Chapter 3',
    title: 'Being a great AI partner',
    copy: 'Use AI for critique, practice, feedback, and agency without handing over your thinking.'
  },
  {
    id: 'chapter-4',
    href: 'chapter-4.html',
    stage: 'Explorer',
    label: 'Chapter 4',
    title: 'How to check and challenge AI',
    copy: 'Build habits for sources, uncertainty, claims, mistakes, and decision risk.'
  },
  {
    id: 'chapter-5',
    href: 'chapter-5.html',
    stage: 'Builder',
    label: 'Chapter 5',
    title: 'Build with AI',
    copy: 'Move from chat to projects, workflows, experiments, and model comparisons.'
  }
];

const PROJECT_CATALOG = [
  {
    id: 'study-coach-card',
    stage: 'Foundation',
    focus: 'student',
    title: 'Build an AI study coach prompt card',
    copy: 'Create a reusable prompt that gives hints, examples, and a quiz without writing the final answer for you.',
    tools: 'Any free chat tool or a notebook',
    deliverable: 'One prompt card plus a before and after answer.'
  },
  {
    id: 'business-workflow-map',
    stage: 'Foundation',
    focus: 'business',
    title: 'Map one messy workflow',
    copy: 'Pick one repeated task, then design a researcher, drafter, and reviewer workflow you could run manually.',
    tools: 'Paper, docs, or any free chat tool',
    deliverable: 'A three-step workflow with human checkpoints.'
  },
  {
    id: 'debug-coach',
    stage: 'Foundation',
    focus: 'learning-coder',
    title: 'Use AI as a debugging coach',
    copy: 'Bring one small bug and ask for hints, tests, and explanations before asking for the fix.',
    tools: 'Browser editor, local files, or any free chat tool',
    deliverable: 'A bug note that explains what broke and how you fixed it.'
  },
  {
    id: 'lesson-activity-check',
    stage: 'Foundation',
    focus: 'teacher',
    title: 'Turn one topic into an activity',
    copy: 'Use AI to draft an activity, then add checks for understanding, misconceptions, and privacy boundaries.',
    tools: 'Docs or any free chat tool',
    deliverable: 'One activity plan with a verification step.'
  },
  {
    id: 'creative-versions',
    stage: 'Foundation',
    focus: 'creative',
    title: 'Generate, critique, revise',
    copy: 'Ask for three directions, choose one, critique it, and revise it using your own taste.',
    tools: 'Any free chat or image planning tool',
    deliverable: 'Three concepts, one critique, one revised direction.'
  },
  {
    id: 'decision-helper',
    stage: 'Foundation',
    focus: 'personal',
    title: 'Build a decision helper',
    copy: 'Use AI to list options, tradeoffs, missing information, and what you should verify before deciding.',
    tools: 'Any free chat tool or a notes app',
    deliverable: 'A decision table with a final human choice.'
  },
  {
    id: 'verification-ladder',
    stage: 'Explorer',
    focus: 'general',
    title: 'Run a verification ladder',
    copy: 'Ask AI for an answer, mark three claims, verify one outside the model, and record what changed.',
    tools: 'Browser search plus any free chat tool',
    deliverable: 'Three claims, one checked source, one corrected answer.'
  },
  {
    id: 'model-comparison',
    stage: 'Explorer',
    focus: 'general',
    title: 'Compare two AI answers',
    copy: 'Give the same task to two tools or two prompt versions. Score clarity, usefulness, mistakes, and what you would trust.',
    tools: 'Two free tools, or one tool with two prompt versions',
    deliverable: 'A comparison table and a trust decision.'
  },
  {
    id: 'agency-contract',
    stage: 'Explorer',
    focus: 'general',
    title: 'Write your AI agency contract',
    copy: 'Decide what AI is allowed to do for you, what it must never do, and when you have to slow down.',
    tools: 'Notes app or docs',
    deliverable: 'A one-page rule sheet for your own AI use.'
  },
  {
    id: 'mini-tool-spec',
    stage: 'Builder',
    focus: 'general',
    title: 'Design a mini AI-powered tool',
    copy: 'Write a spec for a small tool, define inputs and outputs, then ask AI to critique what could fail.',
    tools: 'Docs, plain HTML, or any free chat tool',
    deliverable: 'A tool spec, risk list, and first prototype plan.'
  },
  {
    id: 'local-model-test',
    stage: 'Builder',
    focus: 'general',
    title: 'Plan a local model test',
    copy: 'Compare what a small local model could do versus a bigger hosted model, without paying for either.',
    tools: 'LM Studio optional, Hugging Face Chat optional',
    deliverable: 'A test plan with tasks, expected limits, and results.'
  }
];

function projectForContext(focus, progress = readLearningProgress()) {
  const done = completedLessonCount(progress);
  const stage = done >= 4 ? 'Builder' : done >= 2 ? 'Explorer' : 'Foundation';
  return PROJECT_CATALOG.find(project => project.stage === stage && project.focus === focus)
    || PROJECT_CATALOG.find(project => project.stage === stage && project.focus === 'general')
    || PROJECT_CATALOG[0];
}

function readLearningProgress() {
  try {
    return JSON.parse(safeGetStorage('learningai-progress') || 'null') || { completed: {} };
  } catch (e) {
    return { completed: {} };
  }
}

function saveLearningProgress(progress) {
  return safeSetStorage('learningai-progress', JSON.stringify({
    completed: progress.completed || {},
    savedAt: new Date().toISOString()
  }));
}

function readProjectProgress() {
  try {
    return JSON.parse(safeGetStorage('learningai-project-progress') || 'null') || { completed: {} };
  } catch (e) {
    return { completed: {} };
  }
}

function saveProjectProgress(progress) {
  return safeSetStorage('learningai-project-progress', JSON.stringify({
    completed: progress.completed || {},
    savedAt: new Date().toISOString()
  }));
}

function completedProjectCount(progress = readProjectProgress()) {
  return PROJECT_CATALOG.filter(item => progress.completed?.[item.id]).length;
}

function currentLessonId() {
  const page = location.pathname.split('/').pop() || '';
  const lesson = LESSON_SEQUENCE.find(item => item.href === page);
  return lesson?.id || '';
}

function completedLessonCount(progress = readLearningProgress()) {
  return LESSON_SEQUENCE.filter(item => progress.completed?.[item.id]).length;
}

function nextLesson(progress = readLearningProgress()) {
  return LESSON_SEQUENCE.find(item => !progress.completed?.[item.id]) || null;
}

function stageStatus(progress = readLearningProgress()) {
  return ['Foundation', 'Explorer', 'Builder'].map(stage => {
    const lessons = LESSON_SEQUENCE.filter(item => item.stage === stage);
    const done = lessons.filter(item => progress.completed?.[item.id]).length;
    return { stage, done, total: lessons.length };
  });
}

function hexToRgb(hex) {
  const value = String(hex || '').replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(value)) return null;
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function shade(hex, percent) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const next = {};
  ['r', 'g', 'b'].forEach(key => {
    const target = percent >= 0 ? 255 : 0;
    next[key] = Math.round(rgb[key] + (target - rgb[key]) * Math.abs(percent));
  });
  return `#${[next.r, next.g, next.b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

function applyAppearance(settings = readLearningSettings()) {
  if (!document.body) return;
  const theme = settings.theme || '';
  if (theme) document.body.dataset.theme = theme;
  else document.body.removeAttribute('data-theme');
  document.body.dataset.fontScale = settings.fontScale || 'normal';
  document.body.dataset.fontFamily = settings.fontFamily || 'system';

  const target = document.body.style;
  const accent = settings.accentColor || '';
  const text = settings.theme === 'dark' && settings.textColor === '#121826' ? '' : settings.textColor || '';
  const background = settings.theme === 'dark' && settings.backgroundColor === '#f7f9fc' ? '' : settings.backgroundColor || '';
  if (theme === 'dark') {
    target.setProperty('--bg', '#0f1726');
    target.setProperty('--surface', '#1b2637');
    target.setProperty('--surface-2', '#243247');
    target.setProperty('--border', '#33445c');
    target.setProperty('--text', text || '#f4f7fb');
    target.setProperty('--text-dim', '#a7b1c2');
    target.setProperty('--text-faint', '#778397');
  } else if (theme === 'light') {
    target.setProperty('--bg', '#f7f9fc');
    target.setProperty('--surface', '#ffffff');
    target.setProperty('--surface-2', '#eef4f8');
    target.setProperty('--border', '#dbe3ea');
    target.setProperty('--text', text || '#121826');
    target.setProperty('--text-dim', '#4b5870');
    target.setProperty('--text-faint', '#7a869a');
  } else if (theme === 'sepia') {
    target.setProperty('--bg', '#f4ecd8');
    target.setProperty('--surface', '#fffaf0');
    target.setProperty('--surface-2', '#eadfc7');
    target.setProperty('--border', '#d8c9ab');
    target.setProperty('--text', '#1f1a14');
    target.setProperty('--text-dim', '#564a3a');
    target.setProperty('--text-faint', '#766a59');
  } else if (theme === 'high-contrast') {
    target.setProperty('--bg', '#ffffff');
    target.setProperty('--surface', '#ffffff');
    target.setProperty('--surface-2', '#f2f2f2');
    target.setProperty('--border', '#111111');
    target.setProperty('--text', '#000000');
    target.setProperty('--text-dim', '#222222');
    target.setProperty('--text-faint', '#444444');
  }
  if (accent) {
    const rgb = hexToRgb(accent);
    target.setProperty('--accent', accent);
    target.setProperty('--accent-dim', shade(accent, -0.18));
    if (rgb) target.setProperty('--accent-soft', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
  }
  if (background) {
    target.setProperty('--bg', background);
    target.setProperty('--surface', theme === 'dark' ? shade(background, 0.08) : shade(background, 0.5));
    target.setProperty('--surface-2', theme === 'dark' ? shade(background, 0.14) : shade(background, 0.32));
    target.setProperty('--border', theme === 'dark' ? shade(background, 0.22) : shade(background, -0.12));
  }
  if (text && !theme) target.setProperty('--text', text);
}

applyAppearance();
document.addEventListener('DOMContentLoaded', () => applyAppearance());

function settingsSummary(settings) {
  const format = {
    bullets: 'bullet points',
    short: 'short paragraphs',
    steps: 'step by step',
    visual: 'visual examples first'
  }[settings.format] || 'normal lesson cards';
  const mode = {
    examples: 'examples first',
    practice: 'practice fast',
    project: 'project connections',
    plain: 'simple explanations'
  }[settings.mode] || 'balanced learning';
  const detail = {
    compact: 'compact',
    normal: 'normal detail',
    deep: 'deeper explanation'
  }[settings.detail] || 'normal detail';
  const theme = {
    dark: 'dark mode',
    light: 'light mode',
    sepia: 'warm sepia',
    'high-contrast': 'high contrast'
  }[settings.theme] || 'default colors';
  const focus = focusProfile(settings.focusArea).label.toLowerCase();
  return `${format}, ${mode}, ${detail}, ${theme}, ${focus}`;
}

function focusProfile(focus) {
  return {
    student: {
      label: 'Student agency',
      goal: 'learn how to stay in charge of the thinking while using AI as a tutor, critic, and practice partner',
      example: 'Use the lesson on homework, studying, writing, and asking for hints without outsourcing your brain.',
      challenge: 'Ask AI for hints, then answer in your own words before asking it to critique you.'
    },
    business: {
      label: 'Business productivity',
      goal: 'learn how to use AI and multi-agent workflows to research, plan, draft, check, and ship work faster',
      example: 'Use the lesson on emails, meetings, research, workflows, and agent teams that divide tasks.',
      challenge: 'Design a three-agent workflow: researcher, drafter, and reviewer.'
    },
    'learning-coder': {
      label: 'Learning coder',
      goal: 'learn coding with AI without becoming dependent on copied answers',
      example: 'Use the lesson on debugging, reading code, asking for explanations, and building small projects.',
      challenge: 'Ask AI to explain one bug, then fix a similar bug yourself.'
    },
    teacher: {
      label: 'Teacher',
      goal: 'learn how to guide students, plan lessons, build activities, and set healthy AI boundaries',
      example: 'Use the lesson on feedback, differentiation, lesson planning, and classroom AI norms.',
      challenge: 'Turn one lesson into a practice activity with a verification step.'
    },
    creative: {
      label: 'Creative',
      goal: 'learn how to use AI for ideas and prototypes while keeping your own taste',
      example: 'Use the lesson on brainstorming, storyboarding, editing, and comparing versions.',
      challenge: 'Generate three directions, choose one, and explain why it matches your taste.'
    },
    personal: {
      label: 'Personal life',
      goal: 'learn how to use AI for everyday decisions, planning, learning, and organization',
      example: 'Use the lesson on schedules, explanations, decisions, and personal projects.',
      challenge: 'Ask AI to help plan something real, then check what it missed.'
    }
  }[focus] || {
    label: 'General AI use',
    goal: 'learn AI through practical examples that match your life',
    example: 'Use the lesson on a real task you care about.',
    challenge: 'Try the idea once, then ask what changed.'
  };
}

function ageToneProfile(ageRange) {
  return {
    teen: 'Keep it direct, concrete, and not over-explained.',
    'young-adult': 'Use practical examples that connect school, work, and early career decisions.',
    adult: 'Keep it practical and time-aware, with workplace and life examples.',
    'older-adult': 'Use plain language, avoid jargon, and connect ideas to real decisions.'
  }[ageRange] || 'Use clear examples and avoid assuming what the learner already knows.';
}

function levelProfile(level) {
  const route = levelIdFromRoute(level);
  return {
    beginner: {
      label: 'Foundation',
      framing: 'Build the mental model slowly before using AI heavily.',
      challenge: 'Your check: explain the idea in plain language.'
    },
    explorer: {
      label: 'Explorer',
      framing: 'Use this as a fast calibration. You may know pieces already, but the goal is cleaner vocabulary and better judgment.',
      challenge: 'Your check: name one place this idea could fail.'
    },
    builder: {
      label: 'Builder',
      framing: 'Treat this as a systems audit before projects. You are checking whether you understand what you are building on.',
      challenge: 'Your check: turn the idea into a small test or project rule.'
    }
  }[route] || {
    label: 'Foundation',
    framing: 'Build the mental model clearly before moving faster.',
    challenge: 'Your check: explain the idea in your own words.'
  };
}

function adaptLessonCopy(copy, title, settings) {
  const format = settings.format || 'short';
  const mode = settings.mode || 'plain';
  const detail = settings.detail || 'normal';
  const modeLine = {
    examples: 'Example first: look for one concrete case, then learn the idea behind it.',
    practice: 'Practice fast: try it once, notice what changes, then improve it.',
    project: 'Project link: connect this to something you could build or test.',
    plain: 'Plain version: understand the basic idea before adding harder details.'
  }[mode] || copy;
  const focus = focusProfile(settings.focusArea);
  const level = levelProfile(settings.route || settings.level);
  const tone = ageToneProfile(settings.ageRange);
  const focusLine = `Your focus: ${focus.example}`;
  const levelLine = `${level.label} framing: ${level.framing}`;
  const challengeLine = level.challenge;

  if (format === 'bullets') {
    const detailLine = detail === 'compact' ? 'Keep it short.' : detail === 'deep' ? 'Add one deeper question after the basics.' : 'Learn the idea, then try it.';
    return `• ${copy}\n• ${levelLine}\n• ${focusLine}\n• ${modeLine}\n• ${detailLine}`;
  }
  if (format === 'steps') {
    return `1. Learn: ${copy}\n2. Calibrate: ${level.framing}\n3. Connect: ${focus.example}\n4. Try: ${modeLine}\n5. Check: ${challengeLine}`;
  }
  if (format === 'visual') {
    return `Picture it first: ${focus.example} Then use ${title.toLowerCase()} as a ${level.label.toLowerCase()} lens. ${challengeLine}`;
  }
  if (detail === 'compact') return copy;
  if (detail === 'deep') return `${copy} ${levelLine} ${focusLine} Then ask what could go wrong, where the limits are, and how you would test it. ${tone}`;
  return `${copy} ${levelLine} ${focusLine} ${modeLine}`;
}

// --- Scroll progress bar ---
(function progressBar() {
  const bar = document.querySelector('.progress-bar > div');
  if (!bar) return;
  function update() {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// --- Active nav link ---
(function highlightNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
    if (path.startsWith('chapter-') && href === 'course.html') a.classList.add('active');
  });
})();

// --- Wire up data-prompt buttons as copy-to-clipboard helpers ---
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-prompt]');
  if (!btn) return;
  const prompt = btn.getAttribute('data-prompt');

  function showCopyStatus(message) {
    const status = document.getElementById('copy-status');
    if (status) {
      status.textContent = message;
      setTimeout(() => { status.textContent = ''; }, 4500);
    } else {
      btn.dataset.originalHtml = btn.dataset.originalHtml || btn.innerHTML;
      btn.textContent = message.startsWith('Copied') ? 'Copied' : 'Copy failed';
      btn.setAttribute('aria-label', message);
      setTimeout(() => {
        btn.innerHTML = btn.dataset.originalHtml;
        btn.removeAttribute('aria-label');
      }, 1600);
    }
  }

  const clipboard = window.navigator && window.navigator.clipboard;
  if (!clipboard?.writeText) {
    showCopyStatus('Copy is not available in this browser. Select and copy the prompt manually.');
    return;
  }

  clipboard.writeText(prompt).then(() => {
    showCopyStatus('Copied. Paste it into the AI tool you want to test.');
  }).catch(() => {
    showCopyStatus('Copy did not work in this browser. Select and copy the prompt manually.');
  });
});

// --- AI knowledge + judgment gauge ---
function initGauge() {
  const form = document.getElementById('ai-gauge');
  const result = document.getElementById('gauge-result');
  if (!form || !result) return;

  const cards = [...form.querySelectorAll('.gauge-card')];
  const back = document.getElementById('gauge-back');
  const next = document.getElementById('gauge-next');
  const finish = document.getElementById('gauge-finish');
  const stepLabel = document.getElementById('gauge-step-label');
  const stepFill = document.getElementById('gauge-step-fill');
  const levelEl = document.getElementById('gauge-level');
  const scoreEl = document.getElementById('gauge-score');
  const titleEl = document.getElementById('gauge-title');
  const copyEl = document.getElementById('gauge-copy');
  const profileChip = document.getElementById('profile-chip');
  const profileJump = document.getElementById('profile-jump');
  const profilePanel = document.getElementById('profile-panel');
  const profileGreeting = document.getElementById('profile-greeting');
  const profileCopy = document.getElementById('profile-copy');
  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');
  const profileSave = document.getElementById('profile-save');
  const profileClear = document.getElementById('profile-clear');
  const categories = ['definition', 'capability', 'limits', 'learning', 'impact', 'systems'];
  let current = 0;

  function shuffleArray(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function shuffleLabels(container) {
    if (!container || container.dataset.shuffled === 'true') return;
    const labels = [...container.querySelectorAll(':scope > label')];
    if (labels.length < 2) return;
    shuffleArray(labels).forEach(label => container.appendChild(label));
    container.dataset.shuffled = 'true';
  }

  function shuffleStaticQuestionOptions() {
    form.querySelectorAll('.gauge-card[data-category]:not([data-category="learning"])').forEach(shuffleLabels);
  }

  const learningQuestionByFocus = {
    student: {
      title: 'How should students use AI?',
      copy: 'You are stuck on homework or studying. What would you actually do?',
      options: [
        'Have it write the answer so you can move on.',
        'Ask it to explain the answer in easier words.',
        'Ask for hints, examples, and a quiz so you still do the thinking.',
        'Use it as a tutor, critic, and practice partner while protecting the skill you are trying to build.'
      ]
    },
    business: {
      title: 'How should you use AI at work?',
      copy: 'You have a messy work task: research, planning, writing, or follow-up. What would you actually do?',
      options: [
        'Have it produce the final work and send it along.',
        'Ask it to make the task faster by drafting or summarizing.',
        'Ask it to structure the work, surface assumptions, and give you a checklist to review.',
        'Use it as a research assistant, drafter, reviewer, and workflow partner while you keep responsibility for decisions and quality.'
      ]
    },
    'learning-coder': {
      title: 'How should new coders use AI?',
      copy: 'Your code is broken or you do not understand what to build next. What would you actually do?',
      options: [
        'Paste the problem in and copy whatever code it gives back.',
        'Ask it to explain the code or error message.',
        'Ask for hints, small examples, and tests so you can fix a similar problem yourself.',
        'Use it as a debugging coach, code reviewer, and practice partner while making sure you can explain and modify the solution.'
      ]
    },
    teacher: {
      title: 'How should teachers use AI?',
      copy: 'You are planning a lesson, activity, feedback, or classroom policy. What would you actually do?',
      options: [
        'Have it generate the lesson or feedback and use it as-is.',
        'Ask it for ideas or simpler wording.',
        'Ask it for options, misconceptions, checks for understanding, and ways to adapt for different learners.',
        'Use it as a planning partner, differentiation assistant, and critique tool while you protect student privacy, accuracy, and learning goals.'
      ]
    },
    creative: {
      title: 'How should creatives use AI?',
      copy: 'You are stuck on a story, design, video, image, song idea, or campaign. What would you actually do?',
      options: [
        'Have it make the finished piece and call it done.',
        'Ask it for ideas or a cleaner version.',
        'Ask it for variations, references, constraints, and critique so you can choose and refine.',
        'Use it as a brainstormer, prototype partner, editor, and taste-check while keeping authorship, direction, and final judgment yours.'
      ]
    },
    personal: {
      title: 'How should you use AI in daily life?',
      copy: 'You are making a plan, learning something, or organizing a real-life task. What would you actually do?',
      options: [
        'Let it decide for you so you do not have to think about it.',
        'Ask it to make the task faster or simpler.',
        'Ask it for options, tradeoffs, and a checklist so you can choose carefully.',
        'Use it as a planning partner and second opinion while keeping your values and final decision in charge.'
      ]
    }
  };

  const routes = {
    beginner: {
      label: 'Level 1: Foundation',
      title: 'Your AI level is: Foundation',
      copy: 'You are at the right starting point. Your path should make AI less mysterious before asking you to use it heavily.'
    },
    explorer: {
      label: 'Level 2: Explorer',
      title: 'Your AI level is: Explorer',
      copy: 'You probably understand that AI is more than search, but the next step is learning when to trust it, challenge it, and use it as a learning partner.'
    },
    builder: {
      label: 'Level 3: Builder',
      title: 'Your AI level is: Builder',
      copy: 'Your answers show enough AI literacy to move toward projects, comparisons, and systems thinking.'
    }
  };

  function selectedValue(name) {
    const chosen = form.querySelector(`input[name="${name}"]:checked`);
    return chosen ? Number(chosen.value) : null;
  }

  function selectedText(name) {
    const chosen = form.querySelector(`input[name="${name}"]:checked`);
    return chosen ? chosen.value : '';
  }

  function selectedLabel(name) {
    const chosen = form.querySelector(`input[name="${name}"]:checked`);
    return chosen ? chosen.closest('label').textContent.trim() : '';
  }

  function readProfile() {
    try {
      return JSON.parse(safeGetStorage('modelwise-user') || 'null');
    } catch (e) {
      return null;
    }
  }

  function writeProfile(profile) {
    if (safeSetStorage('modelwise-user', JSON.stringify(profile))) {
      renderProfile();
    } else {
      showStorageWarning('Could not save your display name in this browser.');
    }
  }

  function renderProfile() {
    const profile = readProfile();
    if (profile) {
      profileChip.textContent = `Hey, ${profile.name}`;
      profileJump.textContent = 'Your profile';
      profileGreeting.textContent = `Hey ${profile.name}, ready to start learning today?`;
      profileCopy.textContent = profile.email
        ? 'Learning AI will use your name, remember your assessment on this device, and keep your V2 update email locally for now.'
        : 'Learning AI will use your name, remember your assessment on this device, and shape the course around your level.';
      profileName.value = profile.name || '';
      if (profileEmail) profileEmail.value = profile.email || '';
    } else {
      profileChip.textContent = 'Make it yours';
      profileJump.textContent = 'Set name';
      profileGreeting.textContent = 'Make this path yours.';
      profileCopy.textContent = 'Add a private display name and, if you want, an email for V2 updates. This is saved only in this browser for now.';
      if (profileEmail) profileEmail.value = '';
    }
  }

  function routeFor(score) {
    const limits = selectedValue('limits');
    const learning = selectedValue('learning');
    const definition = selectedValue('definition');
    const capability = selectedValue('capability');
    if (limits < 2 || learning < 2) return routes.beginner;
    if (score >= 72 && definition >= 2 && capability >= 2) return routes.builder;
    if (score >= 42) return routes.explorer;
    return routes.beginner;
  }

  function toneForAge(age) {
    if (age === 'teen') return 'Teen path: direct, clear, and not babyish.';
    if (age === 'young-adult') return 'Young adult path: practical, quick, and flexible.';
    if (age === 'older-adult') return 'Older adult path: plain English, patient pacing, no tech ego.';
    return 'Adult path: practical, efficient, and not school-ish.';
  }

  function updateLearningQuestion() {
    const focus = selectedText('focus_area') || 'student';
    const data = learningQuestionByFocus[focus] || learningQuestionByFocus.personal;
    const title = document.getElementById('learning-question-title');
    const copy = document.getElementById('learning-question-copy');
    const options = document.getElementById('learning-options');
    if (!title || !copy || !options) return;
    title.textContent = data.title;
    copy.textContent = data.copy;
    options.dataset.shuffled = 'false';
    options.innerHTML = data.options.map((text, index) => (
      `<label><input type="radio" name="learning" value="${index}"> ${text}</label>`
    )).join('');
    shuffleLabels(options);
  }

  function buildKnownFacts(route, percent) {
    const profile = readProfile();
    const age = selectedText('age_range');
    const focus = focusProfile(selectedText('focus_area'));
    const ageText = {
      teen: 'teenager, about 13 to 17',
      'young-adult': 'young adult, about 18 to 25',
      adult: 'adult, about 26 to 64',
      'older-adult': 'older adult, 65+'
    }[age] || 'learner';
    const strengths = [];
    const growth = [];
    categories.forEach(name => {
      const value = selectedValue(name);
      if (value >= 2) strengths.push(name);
      else growth.push(name);
    });
    return [
      profile ? `Private display name: ${profile.name}.` : 'No private display name saved yet.',
      profile?.email ? `V2 update email saved locally: ${profile.email}.` : 'No V2 update email saved.',
      `Age range: ${ageText}.`,
      `Focus area: ${focus.label}.`,
      `AI level: ${route.label} at ${percent}%.`,
      `Strongest areas: ${strengths.length ? strengths.join(', ') : 'still forming'}.`,
      `Needs support with: ${growth.length ? growth.join(', ') : 'mostly advanced work now'}.`,
      `Tone to use: ${toneForAge(age)}`,
      `Current view of AI: ${selectedLabel('definition')}`,
      `Beyond-chat understanding: ${selectedLabel('systems')}`
    ];
  }

  function currentName() {
    const card = cards[current];
    if (card.dataset.profile === 'age') return 'age_range';
    if (card.dataset.profile === 'focus') return 'focus_area';
    return card.dataset.category;
  }

  function validateCurrent() {
    const name = currentName();
    if (!name) return true;
    return !!form.querySelector(`input[name="${name}"]:checked`);
  }

  function showStep(index) {
    current = Math.max(0, Math.min(index, cards.length - 1));
    cards.forEach((card, i) => card.classList.toggle('active', i === current));
    const isFirst = current === 0;
    const isLast = current === cards.length - 1;
    back.hidden = isFirst;
    next.hidden = isLast;
    finish.hidden = !isLast;
    const labels = ['Profile', 'Focus area', '1 / 6 · What AI is', '2 / 6 · What AI can do', '3 / 6 · When to verify', '4 / 6 · Learning with AI', '5 / 6 · Costs and tradeoffs', '6 / 6 · Beyond chatbots'];
    stepLabel.textContent = labels[current] || `Category ${current} of ${cards.length - 1}`;
    stepFill.style.width = `${Math.round((current) / (cards.length - 1) * 100)}%`;
  }

  function showIncomplete() {
    result.hidden = false;
    levelEl.textContent = 'Pick one';
    scoreEl.textContent = '';
    titleEl.textContent = 'Choose an answer to continue.';
    copyEl.innerHTML = '<span class="gauge-warning">You can still write a different answer in the box, but pick the closest option first so the gauge can route you.</span>';
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function finishGauge() {
    const values = categories.map(selectedValue);
    const answered = values.filter(v => v !== null);

    if (answered.length < categories.length || !selectedText('age_range') || !selectedText('focus_area')) {
      showIncomplete();
      return;
    }

    const raw = answered.reduce((sum, value) => sum + value, 0);
    const percent = Math.round(raw / (categories.length * 3) * 100);
    const route = routeFor(percent);

    const facts = buildKnownFacts(route, percent);

    const saved = {
      ageRange: selectedText('age_range'),
      focusArea: selectedText('focus_area'),
      focusLabel: focusProfile(selectedText('focus_area')).label,
      score: percent,
      route: route.label,
      answers: Object.fromEntries(categories.map(name => [name, selectedValue(name)])),
      answerText: Object.fromEntries(categories.map(name => [name, selectedLabel(name)])),
      custom: Object.fromEntries(categories.map(name => [name, form.elements[`${name}_other`]?.value.trim() || ''])),
      ageNote: form.elements.age_other?.value.trim() || '',
      focusNote: form.elements.focus_other?.value.trim() || '',
      knownFacts: facts,
      savedAt: new Date().toISOString()
    };
    if (!safeSetStorage('modelwise-gauge', JSON.stringify(saved))) {
      showStorageWarning('Could not save your assessment in this browser. You can still browse lessons, but My Path may not persist.');
      return;
    }
    const profile = readProfile();
    if (profile) writeProfile({ ...profile, lastGauge: saved });
    window.location.href = 'my-path.html';
  }

  next?.addEventListener('click', () => {
    if (!validateCurrent()) {
      showIncomplete();
      return;
    }
    result.hidden = true;
    showStep(current + 1);
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  back?.addEventListener('click', () => {
    result.hidden = true;
    showStep(current - 1);
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateCurrent()) {
      showIncomplete();
      return;
    }
    finishGauge();
  });

  profileJump?.addEventListener('click', () => {
    profilePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  profileSave?.addEventListener('click', () => {
    const name = profileName.value.trim();
    const email = profileEmail?.value.trim() || '';
    if (!name) {
      profileName.focus();
      return;
    }
    if (email && !profileEmail.checkValidity()) {
      profileEmail.focus();
      return;
    }
    const existing = readProfile() || {};
    writeProfile({
      ...existing,
      name,
      email,
      createdAt: existing.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  });

  profileClear?.addEventListener('click', () => {
    const oldProfile = readProfile();
    safeRemoveStorage('modelwise-user');
    const savedGauge = (() => {
      try {
        return JSON.parse(safeGetStorage('modelwise-gauge') || 'null');
      } catch (e) {
        return null;
      }
    })();
    if (savedGauge) {
      const cleanedFacts = (savedGauge.knownFacts || []).filter(fact => (
        !fact.startsWith('Private display name:') && !fact.startsWith('V2 update email saved locally:')
      ));
      safeSetStorage('modelwise-gauge', JSON.stringify({
        ...savedGauge,
        knownFacts: ['No private display name saved yet.', 'No V2 update email saved.', ...cleanedFacts]
      }));
    }
    profileName.value = '';
    if (profileEmail) profileEmail.value = '';
    renderProfile();
  });

  form.querySelectorAll('input[name="focus_area"]').forEach(input => {
    input.addEventListener('change', updateLearningQuestion);
  });

  renderProfile();
  shuffleStaticQuestionOptions();
  updateLearningQuestion();
  showStep(0);
}
document.addEventListener('DOMContentLoaded', initGauge);

// --- Personalized Lessons page ---
function initPersonalizedLessons() {
  const section = document.getElementById('personal-lessons');
  const list = document.getElementById('lesson-path-list');
  const fullList = document.getElementById('full-lesson-list');
  if (!section || !list) return;

  function readJSON(key) {
    try {
      return JSON.parse(safeGetStorage(key) || 'null');
    } catch (e) {
      return null;
    }
  }

  const settings = readLearningSettings();
  const gauge = readJSON('modelwise-gauge');
  const activeSettings = {
    ...settings,
    focusArea: settings.focusArea || gauge?.focusArea || '',
    ageRange: gauge?.ageRange || '',
    route: gauge?.route || ''
  };
  const progress = readLearningProgress();
  const next = nextLesson(progress);

  if ((activeSettings.format || activeSettings.focusArea) && fullList) {
    fullList.querySelectorAll('.chapter-card').forEach(card => {
      const title = card.querySelector('h3')?.textContent || 'this lesson';
      const p = card.querySelector('p');
      if (!p) return;
      const base = p.dataset.baseCopy || p.textContent;
      p.dataset.baseCopy = base;
      p.className = activeSettings.format === 'bullets' || activeSettings.format === 'steps' ? 'formatted-copy' : '';
      p.textContent = adaptLessonCopy(base, title, activeSettings);
    });
  }

  if (!gauge || !gauge.route) {
    if (activeSettings.format || activeSettings.focusArea) {
      document.getElementById('lessons-hero-copy').textContent = `Your lessons are set to ${settingsSummary(activeSettings)}. Take the gauge when you want Learning AI to choose your level too.`;
    }
    return;
  }

  const routeId = levelIdFromRoute(gauge.route);
  const level = levelProfile(routeId);
  const lessons = LESSON_SEQUENCE.map((item, index) => [
    item.href,
    `${String(index + 1).padStart(2, '0')} · ${item.stage}`,
    item.title,
    item.copy,
    item.id
  ]);

  section.hidden = false;
  document.getElementById('lesson-path-title').textContent = 'Your sequence: Foundation to Explorer to Builder';
  document.getElementById('lesson-path-copy').textContent = activeSettings.format || activeSettings.focusArea
    ? `Everyone starts with Chapter 1. Your current signal is ${level.label}, so the examples, pacing, and challenge prompts use ${settingsSummary(activeSettings)}.`
    : `Everyone starts with Chapter 1. Your current signal is ${level.label}, so the course changes the framing instead of skipping the foundation.`;
  document.getElementById('lessons-hero-copy').textContent = activeSettings.format || activeSettings.focusArea
    ? `Your saved level is ${gauge.route}. Start at Chapter 1, then move through Foundation, Explorer, and Builder with ${settingsSummary(activeSettings)}.`
    : `Your saved level is ${gauge.route}. Start at Chapter 1 and move forward as you complete each lesson.`;
  const primary = document.getElementById('lessons-primary');
  primary.href = next ? next.href : 'projects.html';
  primary.textContent = next ? `Continue: ${next.title}` : 'Start a project';

  list.innerHTML = '';
  lessons.forEach(([href, step, title, copy, id]) => {
    const a = document.createElement('a');
    a.className = 'chapter-card personalized-lesson-card';
    if (progress.completed?.[id]) a.classList.add('is-complete');
    a.href = href;
    const num = document.createElement('div');
    num.className = 'num';
    num.textContent = progress.completed?.[id] ? `${step} · Done` : step;
    const h3 = document.createElement('h3');
    h3.textContent = title;
    const p = document.createElement('p');
    p.className = activeSettings.format === 'bullets' || activeSettings.format === 'steps' ? 'formatted-copy' : '';
    p.textContent = adaptLessonCopy(copy, title, activeSettings);
    a.append(num, h3, p);
    list.appendChild(a);
  });
}
document.addEventListener('DOMContentLoaded', initPersonalizedLessons);

// --- Lesson-specific personalization panel ---
function initLessonPersonalizationPanel() {
  const lessonId = currentLessonId();
  if (!lessonId) return;
  const lesson = LESSON_SEQUENCE.find(item => item.id === lessonId);
  const container = document.querySelector('main .section-tight .container') || document.querySelector('main .container');
  if (!lesson || !container) return;

  let gauge = null;
  try {
    gauge = JSON.parse(safeGetStorage('modelwise-gauge') || 'null');
  } catch (e) {
    gauge = null;
  }

  const settings = readLearningSettings();
  const activeSettings = {
    ...settings,
    focusArea: settings.focusArea || gauge?.focusArea || '',
    ageRange: gauge?.ageRange || '',
    route: gauge?.route || ''
  };
  if (!activeSettings.focusArea && !activeSettings.route && !activeSettings.format) return;

  const focus = focusProfile(activeSettings.focusArea);
  const level = levelProfile(activeSettings.route || activeSettings.level);
  const project = projectForContext(activeSettings.focusArea);
  const panel = document.createElement('section');
  panel.className = 'lesson-personal-panel';
  panel.innerHTML = `
    <span class="section-heading">For your path</span>
    <h2>${lesson.title}, built for ${level.label.toLowerCase()} ${focus.label.toLowerCase()}</h2>
    <div class="path-mini-grid">
      <div>
        <strong>How to read this lesson</strong>
        <p>${level.framing}</p>
      </div>
      <div>
        <strong>Your focus</strong>
        <p>${focus.goal}.</p>
      </div>
      <div>
        <strong>Do this before moving on</strong>
        <p>${focus.challenge} ${level.challenge}</p>
      </div>
    </div>
    <p class="small"><strong>Project connection:</strong> ${project.title}. ${project.copy}</p>
  `;
  container.appendChild(panel);
}
document.addEventListener('DOMContentLoaded', initLessonPersonalizationPanel);

// --- Lesson progress controls ---
function initLessonProgress() {
  const lessonId = currentLessonId();
  if (!lessonId) return;
  const lesson = LESSON_SEQUENCE.find(item => item.id === lessonId);
  const container = document.querySelector('main .section-tight .container') || document.querySelector('main .container');
  if (!lesson || !container) return;

  const progress = readLearningProgress();
  const complete = Boolean(progress.completed?.[lessonId]);
  const panel = document.createElement('section');
  panel.className = 'lesson-progress-panel';
  panel.innerHTML = `
    <div>
      <span class="section-heading">${lesson.stage} progress</span>
      <h2>${complete ? 'This lesson is marked complete.' : 'Save your progress when you finish.'}</h2>
      <p>${complete ? 'My Path will use this to move you toward the next stage.' : 'Learning AI saves progress only in this browser, then recommends the next lesson or project.'}</p>
    </div>
    <button type="button" class="btn btn-primary" id="mark-lesson-complete">${complete ? 'Completed' : 'Mark lesson complete'}</button>
  `;
  container.appendChild(panel);

  panel.querySelector('#mark-lesson-complete')?.addEventListener('click', () => {
    const nextProgress = readLearningProgress();
    nextProgress.completed = nextProgress.completed || {};
    nextProgress.completed[lessonId] = new Date().toISOString();
    if (!saveLearningProgress(nextProgress)) {
      showStorageWarning('Could not save lesson progress in this browser.');
      return;
    }
    const next = nextLesson(nextProgress);
    panel.querySelector('h2').textContent = 'Progress saved.';
    panel.querySelector('p').textContent = !next
      ? 'You finished the lesson sequence. Open Projects to keep building.'
      : `Next up: ${next.title}.`;
    const btn = panel.querySelector('#mark-lesson-complete');
    btn.textContent = 'Saved';
    btn.disabled = true;
  });
}
document.addEventListener('DOMContentLoaded', initLessonProgress);

// --- Settings page ---
function initLearningSettings() {
  const form = document.getElementById('learning-settings');
  if (!form) return;
  const stylePreview = document.getElementById('settings-style-preview');
  const summary = document.getElementById('settings-summary');
  const reset = document.getElementById('settings-reset');

  function applyToForm(settings) {
    ['theme', 'focusArea', 'format', 'mode', 'detail'].forEach(name => {
      const value = settings[name];
      if (!value) return;
      const input = form.querySelector(`input[name="${name}"][value="${value}"]`);
      if (input) input.checked = true;
    });
    if (settings.accentColor) form.elements.accentColor.value = settings.accentColor;
    if (settings.textColor) form.elements.textColor.value = settings.textColor;
    if (settings.backgroundColor) form.elements.backgroundColor.value = settings.backgroundColor;
    if (settings.fontScale) form.elements.fontScale.value = settings.fontScale;
    if (settings.fontFamily) form.elements.fontFamily.value = settings.fontFamily;
    form.elements.note.value = settings.note || '';
  }

  function readForm() {
    return {
      theme: form.elements.theme.value || '',
      accentColor: form.elements.accentColor.value || '',
      textColor: form.elements.theme.value === 'dark' && form.elements.textColor.value === '#121826' ? '' : form.elements.textColor.value || '',
      backgroundColor: form.elements.theme.value === 'dark' && form.elements.backgroundColor.value === '#f7f9fc' ? '' : form.elements.backgroundColor.value || '',
      fontScale: form.elements.fontScale.value || 'normal',
      fontFamily: form.elements.fontFamily.value || 'system',
      focusArea: form.elements.focusArea.value || '',
      format: form.elements.format.value || 'short',
      mode: form.elements.mode.value || 'plain',
      detail: form.elements.detail.value || 'normal',
      note: form.elements.note.value.trim(),
      savedAt: new Date().toISOString()
    };
  }

  function render(settings) {
    const formatLabel = {
      bullets: 'Bullets',
      short: 'Short',
      steps: 'Steps',
      visual: 'Visual'
    }[settings.format] || 'Custom';
    stylePreview.textContent = formatLabel;
    summary.textContent = settings.format ? settingsSummary(settings) : 'Saved only in this browser.';
  }

  const existing = readLearningSettings();
  applyToForm(existing);
  render(existing);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const settings = readForm();
    if (!safeSetStorage('learningai-settings', JSON.stringify(settings))) {
      showStorageWarning('Could not save settings in this browser.');
      return;
    }
    applyAppearance(settings);
    render(settings);
  });

  form.addEventListener('input', () => {
    const settings = readForm();
    applyAppearance(settings);
    render(settings);
  });

  reset?.addEventListener('click', () => {
    safeRemoveStorage('learningai-settings');
    form.reset();
    document.body.removeAttribute('data-theme');
    document.body.removeAttribute('data-font-scale');
    document.body.removeAttribute('data-font-family');
    ['--bg', '--surface', '--surface-2', '--border', '--text', '--text-dim', '--text-faint', '--accent', '--accent-dim', '--accent-soft'].forEach(name => {
      document.body.style.removeProperty(name);
    });
    render({});
  });
}
document.addEventListener('DOMContentLoaded', initLearningSettings);

// --- Personalized My Path dashboard ---
function initMyPath() {
  const root = document.getElementById('path-dashboard');
  const empty = document.getElementById('path-empty');
  if (!root || !empty) return;

  function readJSON(key) {
    try {
      return JSON.parse(safeGetStorage(key) || 'null');
    } catch (e) {
      return null;
    }
  }

  const user = readJSON('modelwise-user');
  const gauge = readJSON('modelwise-gauge');
  const settings = readLearningSettings();
  const progress = readLearningProgress();
  const focus = focusProfile(settings.focusArea || gauge?.focusArea || '');

  if (!gauge || !gauge.route) {
    root.hidden = true;
    empty.hidden = false;
    return;
  }

  const routeId = levelIdFromRoute(gauge.route);
  const next = nextLesson(progress);
  const doneCount = completedLessonCount(progress);
  const projectDoneCount = completedProjectCount();
  const matchedProject = projectForContext(settings.focusArea || gauge?.focusArea || '', progress);
  const routeData = {
    beginner: {
      title: 'Your AI level is: Foundation',
      copy: 'Start by building the mental model. You will learn what AI is before you lean on it.',
      signal: 'This is not a grade. It means the course should start with clear foundations and fewer assumptions.',
      nextCopy: 'Start with models, training, prediction, and hallucination.'
    },
    explorer: {
      title: 'Your AI level is: Explorer',
      copy: 'You know some basics. You still start at Chapter 1, but the course treats it like calibration, then moves you into judgment and verification.',
      signal: 'This is not fixed. It means you are ready for stronger examples, trust checks, and real practice.',
      nextCopy: 'Use the early chapters to sharpen vocabulary, then move into partner skill and verification.'
    },
    builder: {
      title: 'Your AI level is: Builder',
      copy: 'You are ready to test AI, not just use it. You still start at Chapter 1 as a systems check before building.',
      signal: 'This is a launch point. It means your path can move into experiments, projects, and model comparisons.',
      nextCopy: 'Move through the sequence quickly, then spend more time on projects and model comparisons.'
    }
  }[routeId] || null;

  if (!routeData) {
    root.hidden = true;
    empty.hidden = false;
    return;
  }

  root.hidden = false;
  empty.hidden = true;

  const badge = document.getElementById('active-persona-badge');
  if (badge) {
    badge.hidden = false;
    badge.textContent = `Active path: ${focus.label} · ${routeData.title.replace('Your AI level is: ', '')}`;
  }
  document.getElementById('path-title').textContent = user?.name ? `Hey ${user.name}, here is your path.` : routeData.title;
  document.getElementById('path-copy').textContent = `${routeData.copy} Progress: ${doneCount} of ${LESSON_SEQUENCE.length} lessons and ${projectDoneCount} projects complete.`;
  document.getElementById('path-score').textContent = `${doneCount}/${LESSON_SEQUENCE.length}`;
  document.getElementById('path-saved').textContent = gauge.savedAt ? `Saved ${new Date(gauge.savedAt).toLocaleDateString()}` : 'Saved on this device.';
  document.getElementById('path-signal-copy').textContent = routeData.signal;
  const settingsCopy = document.getElementById('path-settings-copy');
  if (settingsCopy) {
    settingsCopy.textContent = settings.format
      ? `Learning AI is set to teach with ${settingsSummary({ ...settings, focusArea: settings.focusArea || gauge.focusArea })}.`
      : `Learning AI will connect examples to ${focus.label.toLowerCase()}. You can customize the format, color, and style in Settings.`;
  }
  const primary = document.getElementById('path-primary');
  primary.href = next ? next.href : 'projects.html';
  primary.textContent = next ? 'Continue' : 'Start a project';
  document.getElementById('next-title').textContent = next ? next.title : 'Start a project';
  document.getElementById('next-copy').textContent = next ? routeData.nextCopy : 'You finished the lesson sequence. Now use Projects to apply what you learned.';
  const nextLink = document.getElementById('next-link');
  nextLink.href = next ? next.href : 'projects.html';
  nextLink.textContent = next ? 'Continue' : 'Open projects';

  const routeBox = document.getElementById('path-route');
  routeBox.innerHTML = '';
  LESSON_SEQUENCE.forEach(item => {
    const a = document.createElement('a');
    a.className = 'chapter-card';
    if (progress.completed?.[item.id]) a.classList.add('is-complete');
    a.href = item.href;
    a.innerHTML = `<div class="num">${item.stage}${progress.completed?.[item.id] ? ' · Done' : ''}</div><h3>${item.title}</h3><p>${adaptLessonCopy(item.copy, item.title, { ...settings, focusArea: settings.focusArea || gauge.focusArea, ageRange: gauge.ageRange, route: gauge.route })}</p>`;
    routeBox.appendChild(a);
  });

  const stageBox = document.getElementById('path-stages');
  if (stageBox) {
    stageBox.innerHTML = '';
    stageStatus(progress).forEach(item => {
      const div = document.createElement('div');
      div.className = 'stage-card';
      div.innerHTML = `<strong>${item.stage}</strong><span>${item.done} of ${item.total} complete</span>`;
      stageBox.appendChild(div);
    });
  }

  const projectBox = document.getElementById('path-project');
  if (projectBox && matchedProject) {
    const projectProgress = readProjectProgress();
    const isProjectDone = Boolean(projectProgress.completed?.[matchedProject.id]);
    projectBox.innerHTML = `
      <span class="section-heading">${matchedProject.stage} project</span>
      <h2>${matchedProject.title}</h2>
      <p>${matchedProject.copy}</p>
      <p class="small"><strong>Cost:</strong> $0 · <strong>Tools:</strong> ${matchedProject.tools}</p>
      <p class="small"><strong>Deliverable:</strong> ${matchedProject.deliverable}</p>
      <p class="small"><strong>Status:</strong> ${isProjectDone ? 'Completed on this device.' : 'Not completed yet.'}</p>
      <a href="projects.html" class="btn btn-primary">See project catalog</a>
    `;
  }

  const skillMap = document.getElementById('skill-map');
  const answerLabels = {
    definition: 'What AI is',
    capability: 'What AI can do',
    limits: 'When to verify',
    learning: 'Learning with AI',
    impact: 'Costs and tradeoffs',
    systems: 'Beyond chatbots'
  };
  skillMap.innerHTML = '';
  Object.entries(answerLabels).forEach(([key, label]) => {
    const score = Number(gauge.answers?.[key] ?? 0);
    const item = document.createElement('div');
    item.className = 'skill-item';
    const band = score >= 3 ? 'Strong' : score >= 2 ? 'Developing' : 'Build this';
    item.innerHTML = `<span>${label}</span><strong>${band}</strong>`;
    skillMap.appendChild(item);
  });

  const tools = [
    ['playground.html', '01', 'Practice', 'Prompt practice', 'Improve a question and compare the answers in an outside tool.'],
    ['course.html', '02', 'Lessons', 'Personal sequence', 'Follow the same lesson ladder with examples matched to your current level.'],
    ['projects.html', '03', 'Build', 'Project starter', 'Turn one idea into a useful AI project.'],
    ['chapter-4.html', '04', 'Check', 'Verification', 'Learn when to slow down and verify.']
  ];
  const toolsBox = document.getElementById('path-tools');
  toolsBox.innerHTML = '';
  tools.forEach(([href, icon, label, title, copy]) => {
    const a = document.createElement('a');
    a.href = href;
    a.className = 'tool-card';
    a.innerHTML = `<span class="tool-icon">${icon}</span><h4>${label}: ${title}</h4><p>${copy}</p>`;
    toolsBox.appendChild(a);
  });

  const known = document.getElementById('path-known');
  known.innerHTML = '';
  (gauge.knownFacts || []).forEach(fact => {
    const li = document.createElement('li');
    li.textContent = fact;
    known.appendChild(li);
  });
  document.getElementById('clear-path')?.addEventListener('click', () => {
    safeRemoveStorage('modelwise-gauge');
    location.reload();
  });
}
document.addEventListener('DOMContentLoaded', initMyPath);

// --- Projects catalog ---
function initProjectsCatalog() {
  const root = document.getElementById('project-catalog');
  if (!root) return;
  const settings = readLearningSettings();
  let gauge = null;
  try {
    gauge = JSON.parse(safeGetStorage('modelwise-gauge') || 'null');
  } catch (e) {
    gauge = null;
  }
  const focus = settings.focusArea || gauge?.focusArea || '';
  const preferred = projectForContext(focus);
  const progress = readProjectProgress();

  const grouped = ['Foundation', 'Explorer', 'Builder'].map(stage => ({
    stage,
    projects: PROJECT_CATALOG.filter(project => project.stage === stage)
  }));

  root.innerHTML = '';
  grouped.forEach(group => {
    const section = document.createElement('section');
    section.className = 'project-stage';
    section.innerHTML = `<div class="section-heading">${group.stage}</div><h2>${group.stage} projects</h2>`;
    const grid = document.createElement('div');
    grid.className = 'project-grid';
    group.projects.forEach(project => {
      const card = document.createElement('article');
      card.className = 'project-card';
      if (project.id === preferred?.id) card.classList.add('is-recommended');
      if (progress.completed?.[project.id]) card.classList.add('is-complete');
      card.innerHTML = `
        <div class="tag">${project.focus === 'general' ? 'All learners' : focusProfile(project.focus).label}</div>
        <h3>${project.title}</h3>
        <p>${project.copy}</p>
        <p class="small"><strong>Cost:</strong> $0 · <strong>Tools:</strong> ${project.tools}</p>
        <p class="small"><strong>Deliverable:</strong> ${project.deliverable}</p>
        <button type="button" class="btn btn-ghost project-complete-btn" data-project-id="${project.id}">${progress.completed?.[project.id] ? 'Completed' : 'Mark complete'}</button>
      `;
      grid.appendChild(card);
    });
    section.appendChild(grid);
    root.appendChild(section);
  });

  root.addEventListener('click', event => {
    const button = event.target.closest('[data-project-id]');
    if (!button) return;
    const nextProgress = readProjectProgress();
    nextProgress.completed = nextProgress.completed || {};
    const card = button.closest('.project-card');
    const isComplete = Boolean(nextProgress.completed[button.dataset.projectId]);

    if (isComplete) {
      delete nextProgress.completed[button.dataset.projectId];
      if (!saveProjectProgress(nextProgress)) {
        showStorageWarning('Could not update project progress in this browser.');
        return;
      }
      button.textContent = 'Mark complete';
      card?.classList.remove('is-complete');
      return;
    }

    const verified = window.confirm(
      'Before you mark this complete:\n\n' +
      '1. Did you check the AI output for mistakes or bias?\n' +
      '2. Did you adapt the work instead of copying blindly?\n\n' +
      'Click OK to record this project as complete.'
    );
    if (!verified) return;

    nextProgress.completed[button.dataset.projectId] = new Date().toISOString();
    if (!saveProjectProgress(nextProgress)) {
      showStorageWarning('Could not save project progress in this browser.');
      return;
    }
    button.textContent = 'Completed';
    card?.classList.add('is-complete');
  });
}
document.addEventListener('DOMContentLoaded', initProjectsCatalog);
