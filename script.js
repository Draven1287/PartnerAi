/* ============================================================
   Learning AI: shared scripts
   Assessment, personalization, and prompt-copy interactions.
   ============================================================ */

// Google Analytics 4.
(function loadAnalytics() {
  const measurementId = 'G-6NYT3LV8V1';
  if (!measurementId || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(tag);
})();

function levelIdFromRoute(route) {
  const value = String(route || '').toLowerCase();
  if (value.includes('builder')) return 'builder';
  if (value.includes('explorer')) return 'explorer';
  if (value.includes('foundation') || value.includes('beginner')) return 'beginner';
  return '';
}

function readLearningSettings() {
  try {
    return JSON.parse(localStorage.getItem('learningai-settings') || 'null') || {};
  } catch (e) {
    return {};
  }
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
    light: 'light mode'
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
  const focusLine = `Your focus: ${focus.example}`;

  if (format === 'bullets') {
    const detailLine = detail === 'compact' ? 'Keep it short.' : detail === 'deep' ? 'Add one deeper question after the basics.' : 'Learn the idea, then try it.';
    return `• ${copy}\n• ${focusLine}\n• ${modeLine}\n• ${detailLine}`;
  }
  if (format === 'steps') {
    return `1. Learn: ${copy}\n2. Connect: ${focus.example}\n3. Try: ${modeLine}\n4. Check: explain ${title.toLowerCase()} in your own words.`;
  }
  if (format === 'visual') {
    return `Picture it first: ${focus.example} Then use the lesson to understand ${title.toLowerCase()}.`;
  }
  if (detail === 'compact') return copy;
  if (detail === 'deep') return `${copy} ${focusLine} Then ask what could go wrong, where the limits are, and how you would test it.`;
  return `${copy} ${focusLine} ${modeLine}`;
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

// --- Assessment gate ---
(function enforceAssessmentGate() {
  const path = location.pathname.split('/').pop() || 'index.html';
  const protectedPages = new Set([
    'index.html',
    'course.html',
    'playground.html',
    'projects.html',
    'chapter-1.html',
    'chapter-2.html',
    'chapter-3.html',
    'chapter-4.html',
    'chapter-5.html'
  ]);
  if (!protectedPages.has(path)) return;
  try {
    const gauge = JSON.parse(localStorage.getItem('modelwise-gauge') || 'null');
    if (gauge?.route && gauge?.savedAt) return;
  } catch (error) {
    // Fall through to assessment if saved data is unreadable.
  }
  const target = encodeURIComponent(path);
  window.location.replace(`assessment.html?start=assessment&next=${target}`);
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
      return JSON.parse(localStorage.getItem('modelwise-user') || 'null');
    } catch (e) {
      return null;
    }
  }

  function writeProfile(profile) {
    localStorage.setItem('modelwise-user', JSON.stringify(profile));
    renderProfile();
  }

  function renderProfile() {
    const profile = readProfile();
    if (profile) {
      profileChip.textContent = `Hey, ${profile.name}`;
      profileJump.textContent = 'Your profile';
      profileGreeting.textContent = `Hey ${profile.name}, ready to start learning today?`;
      profileCopy.textContent = 'Learning AI will use your name, remember your assessment on this device, and shape the course around your level.';
      profileName.value = profile.name || '';
    } else {
      profileChip.textContent = 'Make it yours';
      profileJump.textContent = 'Set name';
      profileGreeting.textContent = 'Make this path yours.';
      profileCopy.textContent = 'Add a private display name. No one else sees it. It just helps the course feel like it is yours when you come back.';
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
    localStorage.setItem('modelwise-gauge', JSON.stringify(saved));
    const profile = readProfile();
    if (profile) writeProfile({ ...profile, lastGauge: saved });
    const nextPath = new URLSearchParams(location.search).get('next');
    const safeNext = nextPath && /^[a-z0-9-]+\.html$/i.test(nextPath) ? nextPath : 'my-path.html';
    window.location.href = safeNext;
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
    if (!name) {
      profileName.focus();
      return;
    }
    writeProfile({ name, createdAt: new Date().toISOString() });
  });

  profileClear?.addEventListener('click', () => {
    const oldProfile = readProfile();
    localStorage.removeItem('modelwise-user');
    const savedGauge = (() => {
      try {
        return JSON.parse(localStorage.getItem('modelwise-gauge') || 'null');
      } catch (e) {
        return null;
      }
    })();
    if (savedGauge) {
      const cleanedFacts = (savedGauge.knownFacts || []).filter(fact => !fact.startsWith('Private display name:'));
      localStorage.setItem('modelwise-gauge', JSON.stringify({
        ...savedGauge,
        knownFacts: ['No private display name saved yet.', ...cleanedFacts]
      }));
    }
    profileName.value = '';
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
      return JSON.parse(localStorage.getItem(key) || 'null');
    } catch (e) {
      return null;
    }
  }

  const settings = readLearningSettings();
  const gauge = readJSON('modelwise-gauge');
  const activeSettings = { ...settings, focusArea: settings.focusArea || gauge?.focusArea || '' };

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
  const paths = {
    beginner: {
      title: 'Level 1: Foundation path',
      copy: 'Start with the mental model first. This path assumes AI still feels unclear, so it explains the basics before asking you to use tools heavily.',
      primary: ['chapter-1.html', 'Start Chapter 1'],
      lessons: [
        ['chapter-1.html', '01 · Foundation', 'What AI actually is', 'Build the basic picture: models, training, prediction, and hallucination.'],
        ['chapter-2.html', '02 · First skill', 'How to talk to AI', 'Learn one reliable prompt pattern without getting buried in jargon.'],
        ['playground.html', '03 · Practice', 'Try two versions of the same prompt', 'See how changing the question changes the answer.'],
        ['chapter-3.html', '04 · Preview', 'Use AI without losing your thinking', 'Learn when AI helps and when it gets in the way.']
      ]
    },
    explorer: {
      title: 'Level 2: Explorer path',
      copy: 'You know some basics. This path moves faster into judgment, verification, and using AI as a thinking partner instead of a search box.',
      primary: ['chapter-2.html', 'Start Chapter 2'],
      lessons: [
        ['chapter-2.html', '01 · Prompt skill', 'Ask better questions', 'Practice context, roles, examples, constraints, and follow-up prompts.'],
        ['chapter-3.html', '02 · Preview', 'Protect your own thinking', 'Learn how to use AI for critique, practice, and feedback without outsourcing the hard part.'],
        ['chapter-4.html', '03 · Preview', 'Check the answer', 'Build habits for sources, uncertainty, claims, and mistakes.'],
        ['playground.html', '04 · Lab', 'Run prompt experiments', 'Compare answers and notice where the model gets stronger or weaker.']
      ]
    },
    builder: {
      title: 'Level 3: Builder path',
      copy: 'You are ready to treat AI like a system you can test. This path starts with building, then loops back into verification and judgment.',
      primary: ['chapter-5.html', 'Open Chapter 5 preview'],
      lessons: [
        ['chapter-5.html', '01 · Project outline', 'Build with AI', 'Move from chat to projects, workflows, experiments, and model comparisons.'],
        ['projects.html', '02 · Project', 'Run a real experiment', 'Turn one idea into a testable project.'],
        ['chapter-4.html', '03 · Preview', 'Build a checking loop', 'Challenge outputs before trusting or publishing them.'],
        ['chapter-3.html', '04 · Preview', 'Use AI as a partner', 'Keep your own taste, reasoning, and responsibility in the loop.']
      ]
    }
  };

  const path = paths[routeId];
  if (!path) return;

  section.hidden = false;
  document.getElementById('lesson-path-title').textContent = path.title;
  document.getElementById('lesson-path-copy').textContent = activeSettings.format || activeSettings.focusArea
    ? `${path.copy} Teaching style: ${settingsSummary(activeSettings)}.`
    : path.copy;
  document.getElementById('lessons-hero-copy').textContent = activeSettings.format || activeSettings.focusArea
    ? `Your saved level is ${gauge.route}. Lessons are currently customized for ${settingsSummary(activeSettings)}.`
    : `Your saved level is ${gauge.route}. Use the recommended order below, or browse the full library after it.`;
  const primary = document.getElementById('lessons-primary');
  primary.href = path.primary[0];
  primary.textContent = path.primary[1];

  list.innerHTML = '';
  path.lessons.forEach(([href, step, title, copy]) => {
    const a = document.createElement('a');
    a.className = 'chapter-card personalized-lesson-card';
    a.href = href;
    const num = document.createElement('div');
    num.className = 'num';
    num.textContent = step;
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

// --- Settings page ---
function initLearningSettings() {
  const form = document.getElementById('learning-settings');
  if (!form) return;
  const stylePreview = document.getElementById('settings-style-preview');
  const summary = document.getElementById('settings-summary');
  const reset = document.getElementById('settings-reset');
  const livePreview = document.getElementById('settings-live-preview');
  const saveStatus = document.getElementById('settings-save-status');

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
    if (livePreview) {
      const previewSettings = {
        format: settings.format || 'short',
        mode: settings.mode || 'plain',
        detail: settings.detail || 'normal',
        focusArea: settings.focusArea || 'student',
        theme: settings.theme || ''
      };
      if (previewSettings.format === 'bullets') {
        livePreview.innerHTML = '<div class="settings-format-active">Bullet points mode is active</div><ul><li>AI can help, but it can also make mistakes.</li><li>Your job is to keep judgment in charge.</li><li>Use Settings any time to switch the lesson style.</li></ul>';
      } else if (previewSettings.format === 'steps') {
        livePreview.innerHTML = '<div class="settings-format-active">Step-by-step mode is active</div><ol><li>Learn when AI helps.</li><li>Notice where it makes mistakes.</li><li>Check the answer before trusting it.</li></ol>';
      } else {
        livePreview.textContent = adaptLessonCopy(
          'You are learning when AI helps, when it makes mistakes, and how to keep your own judgment in charge.',
          'AI judgment',
          previewSettings
        );
      }
    }
  }

  const existing = readLearningSettings();
  applyToForm(existing);
  render(existing);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const settings = readForm();
    localStorage.setItem('learningai-settings', JSON.stringify(settings));
    applyAppearance(settings);
    render(settings);
    if (saveStatus) saveStatus.textContent = 'Saved. Open Lessons or My Path to see this style used there too.';
  });

  form.addEventListener('input', () => {
    const settings = readForm();
    applyAppearance(settings);
    render(settings);
    if (saveStatus) saveStatus.textContent = 'Preview updated. Save when you want to keep it.';
  });

  reset?.addEventListener('click', () => {
    localStorage.removeItem('learningai-settings');
    form.reset();
    document.body.removeAttribute('data-theme');
    document.body.removeAttribute('data-font-scale');
    document.body.removeAttribute('data-font-family');
    ['--bg', '--surface', '--surface-2', '--border', '--text', '--text-dim', '--text-faint', '--accent', '--accent-dim', '--accent-soft'].forEach(name => {
      document.body.style.removeProperty(name);
    });
    render({});
    if (saveStatus) saveStatus.textContent = 'Settings reset.';
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
      return JSON.parse(localStorage.getItem(key) || 'null');
    } catch (e) {
      return null;
    }
  }

  let user = readJSON('modelwise-user');
  const gauge = readJSON('modelwise-gauge');
  const settings = readLearningSettings();
  const focus = focusProfile(settings.focusArea || gauge?.focusArea || '');

  function updateGaugeNameFact(name) {
    const savedGauge = readJSON('modelwise-gauge');
    if (!savedGauge) return;
    const cleanedFacts = (savedGauge.knownFacts || []).filter(fact => !fact.startsWith('Private display name:') && fact !== 'No private display name saved yet.');
    const nameFact = name ? `Private display name: ${name}.` : 'No private display name saved yet.';
    localStorage.setItem('modelwise-gauge', JSON.stringify({ ...savedGauge, knownFacts: [nameFact, ...cleanedFacts] }));
  }

  function syncNameFields() {
    const profileName = document.getElementById('path-profile-name');
    if (profileName) profileName.value = user?.name || '';
    const progressName = document.getElementById('progress-name');
    if (progressName && user?.name) progressName.value = user.name;
  }

  const profileForm = document.getElementById('path-profile-form');
  const profileName = document.getElementById('path-profile-name');
  const profileStatus = document.getElementById('path-profile-status');
  syncNameFields();
  profileForm?.addEventListener('submit', event => {
    event.preventDefault();
    const name = profileName.value.trim();
    if (!name) {
      profileName.focus();
      if (profileStatus) profileStatus.textContent = 'Type a name first.';
      return;
    }
    user = { ...(user || {}), name, updatedAt: new Date().toISOString() };
    localStorage.setItem('modelwise-user', JSON.stringify(user));
    updateGaugeNameFact(name);
    syncNameFields();
    const title = document.getElementById('path-title');
    if (title && !gauge?.route) title.textContent = `Hey ${name}, build your AI path.`;
    if (profileStatus) profileStatus.textContent = `Saved as ${name}.`;
  });

  if (!gauge || !gauge.route) {
    root.hidden = true;
    empty.hidden = false;
    const title = document.getElementById('path-title');
    if (title && user?.name) title.textContent = `Hey ${user.name}, build your AI path.`;
    return;
  }

  const routeId = levelIdFromRoute(gauge.route);
  const routeData = {
    beginner: {
      title: 'Your AI level is: Foundation',
      copy: 'Start by building the mental model. You will learn what AI is before you lean on it.',
      signal: 'This is not a grade. It means the course should start with clear foundations and fewer assumptions.',
      next: ['chapter-1.html', 'Learn what AI is', 'Start with models, training, prediction, and hallucination.'],
      cards: [
        ['chapter-1.html', 'Chapter 1', 'What AI actually is', 'Build the foundation.'],
        ['chapter-2.html', 'Chapter 2', 'One useful prompt pattern', 'Learn context, role, examples, and constraints.'],
        ['playground.html', 'Practice', 'Compare two prompts', 'See how different questions change the answer.']
      ]
    },
    explorer: {
      title: 'Your AI level is: Explorer',
      copy: 'You know some basics. Now the move is judgment: ask better, challenge answers, and verify.',
      signal: 'This is not fixed. It means you are ready for stronger examples, trust checks, and real practice.',
      next: ['chapter-2.html', 'Practice a stronger prompt', 'Use AI as a tutor, critic, and thinking partner.'],
      cards: [
        ['chapter-2.html', 'Chapter 2', 'Ask better questions', 'Upgrade your prompt habits.'],
        ['chapter-3.html', 'Chapter 3 · Preview', 'Protect your thinking', 'Use AI without outsourcing your brain.'],
        ['chapter-4.html', 'Chapter 4 · Preview', 'Check the answer', 'Build verification habits.']
      ]
    },
    builder: {
      title: 'Your AI level is: Builder',
      copy: 'You are ready to test AI, not just use it. Build, compare, verify, and publish what you learn.',
      signal: 'This is a launch point. It means your path can move into experiments, projects, and model comparisons.',
      next: ['chapter-5.html', 'Open project outline', 'Turn AI from a chat window into a project partner.'],
      cards: [
        ['chapter-5.html', 'Chapter 5 · Project outline', 'Start a build', 'Make something real.'],
        ['projects.html', 'Projects', 'Run an experiment', 'Compare models or build a tool.'],
        ['chapter-4.html', 'Chapter 4 · Preview', 'Verification loop', 'Test outputs before trusting them.']
      ]
    }
  }[routeId] || null;

  if (!routeData) {
    root.hidden = true;
    empty.hidden = false;
    return;
  }

  root.hidden = false;
  empty.hidden = true;

  function renderPathName() {
    document.getElementById('path-title').textContent = user?.name ? `Hey ${user.name}, here is your path.` : routeData.title;
    syncNameFields();
  }

  renderPathName();
  document.getElementById('path-copy').textContent = routeData.copy;
  document.getElementById('path-score').textContent = `${gauge.score}%`;
  document.getElementById('path-saved').textContent = gauge.savedAt ? `Saved ${new Date(gauge.savedAt).toLocaleDateString()}` : 'Saved on this device.';
  document.getElementById('path-signal-copy').textContent = routeData.signal;
  const settingsCopy = document.getElementById('path-settings-copy');
  if (settingsCopy) {
    settingsCopy.textContent = settings.format
      ? `Learning AI is set to teach with ${settingsSummary({ ...settings, focusArea: settings.focusArea || gauge.focusArea })}.`
      : `Learning AI will connect examples to ${focus.label.toLowerCase()}. You can customize the format, color, and style in Settings.`;
  }
  const formatPreview = document.getElementById('path-format-preview');
  if (formatPreview) {
    if (settings.format === 'bullets') {
      formatPreview.innerHTML = '<strong>Bullet points mode is active.</strong><ul><li>Lesson cards use short bullet lines.</li><li>My Path and Lessons both use this style.</li><li>You can switch formats any time in Settings.</li></ul>';
    } else if (settings.format === 'steps') {
      formatPreview.innerHTML = '<strong>Step-by-step mode is active.</strong><ol><li>Start with the goal.</li><li>Try the action.</li><li>Check the result.</li></ol>';
    } else {
      formatPreview.innerHTML = '<strong>Current format:</strong> ' + settingsSummary({ ...settings, focusArea: settings.focusArea || gauge.focusArea }) + '.';
    }
  }
  const primary = document.getElementById('path-primary');
  primary.href = routeData.next[0];
  primary.textContent = 'Continue';
  document.getElementById('next-title').textContent = routeData.next[1];
  document.getElementById('next-copy').textContent = routeData.next[2];
  const nextLink = document.getElementById('next-link');
  nextLink.href = routeData.next[0];

  const routeBox = document.getElementById('path-route');
  routeBox.innerHTML = '';
  routeData.cards.forEach(([href, label, title, copy]) => {
    const a = document.createElement('a');
    a.className = 'chapter-card';
    a.href = href;
    a.innerHTML = `<div class="num">${label}</div><h3>${title}</h3><p>${copy}</p>`;
    routeBox.appendChild(a);
  });

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
    ['playground.html', '01', 'Practice', 'Prompt lab', 'Improve a question and compare the answers.'],
    ['course.html', '02', 'Lessons', 'Personal lesson order', 'Follow the course sequence matched to your current level.'],
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
  function renderKnownFacts() {
    const latestGauge = readJSON('modelwise-gauge') || gauge;
    known.innerHTML = '';
    (latestGauge.knownFacts || []).forEach(fact => {
      const li = document.createElement('li');
      li.textContent = fact;
      known.appendChild(li);
    });
  }
  renderKnownFacts();

  profileForm?.addEventListener('submit', () => renderKnownFacts());

  initPrivateProgressSync(user);

  document.getElementById('clear-path')?.addEventListener('click', () => {
    localStorage.removeItem('modelwise-gauge');
    localStorage.removeItem('learningai-private-minutes');
    Object.keys(localStorage)
      .filter(key => key.startsWith('learningai-private-minutes:'))
      .forEach(key => localStorage.removeItem(key));
    location.reload();
  });
}
document.addEventListener('DOMContentLoaded', initMyPath);

function initPrivateProgressSync(user) {
  const panel = document.getElementById('private-progress-panel');
  const form = document.getElementById('private-progress-form');
  const status = document.getElementById('private-progress-status');
  const nameInput = document.getElementById('progress-name');
  const totalEl = document.getElementById('private-progress-total');
  const backendReady = Boolean(window.LEARNING_AI_BACKEND_URL && window.LearningAIBackend?.submitMinutes);

  if (!panel || !form || !status || !nameInput || !totalEl || !backendReady) return;

  panel.hidden = false;
  if (user?.name) nameInput.value = user.name;

  function rememberName(name) {
    const cleaned = String(name || '').trim();
    if (!cleaned) return;
    localStorage.setItem('modelwise-user', JSON.stringify({
      ...(user || {}),
      name: cleaned,
      updatedAt: new Date().toISOString()
    }));
  }

  function progressStorageKey(name) {
    return `learningai-private-minutes:${String(name || '').trim().toLowerCase() || 'local'}`;
  }

  function readSavedProgress(name = nameInput.value) {
    try {
      return JSON.parse(localStorage.getItem(progressStorageKey(name)) || 'null') || { totalMinutes: 0, entries: [] };
    } catch (error) {
      return { totalMinutes: 0, entries: [] };
    }
  }

  function writeSavedProgress(name, progress) {
    localStorage.setItem(progressStorageKey(name), JSON.stringify(progress));
  }

  function renderSavedProgress(name = nameInput.value) {
    const progress = readSavedProgress(name);
    totalEl.textContent = String(progress.totalMinutes || 0);
  }

  renderSavedProgress();
  nameInput.addEventListener('input', () => renderSavedProgress());

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const name = String(data.name || '').trim();
    const minutes = Number(data.minutes);
    status.textContent = 'Sending...';
    try {
      const result = await window.LearningAIBackend.submitMinutes({
        name,
        minutes,
        consent: true
      });
      if (!result.ok) {
        status.textContent = result.error ? `Could not save: ${result.error}.` : 'Could not send minutes.';
        return;
      }
      rememberName(name);
      const progress = readSavedProgress(name);
      progress.totalMinutes = Number(progress.totalMinutes || 0) + minutes;
      progress.entries = [
        ...(progress.entries || []),
        { minutes, savedAt: new Date().toISOString() }
      ].slice(-50);
      writeSavedProgress(name, progress);
      renderSavedProgress(name);
      form.elements.minutes.value = '';
      nameInput.value = name;
      status.textContent = 'Saved. Your minutes stay visible on this device.';
    } catch (error) {
      status.textContent = `Could not reach the backend${error?.message ? `: ${error.message}` : '.'}`;
    }
  });
}
