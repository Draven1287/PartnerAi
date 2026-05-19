/* ============================================================
   Learning AI: shared scripts
   Scripted chatbot demo (v1, no real LLM).
   Routes prompts to the free open-source Llama widget.
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
  document.body.dataset.theme = theme;
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
  return `${format}, ${mode}, ${detail}, ${theme}`;
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

  if (format === 'bullets') {
    const detailLine = detail === 'compact' ? 'Keep it short.' : detail === 'deep' ? 'Add one deeper question after the basics.' : 'Learn the idea, then try it.';
    return `• ${copy}\n• ${modeLine}\n• ${detailLine}`;
  }
  if (format === 'steps') {
    return `1. Learn: ${copy}\n2. Try: ${modeLine}\n3. Check: explain ${title.toLowerCase()} in your own words.`;
  }
  if (format === 'visual') {
    return `Picture it first: ${modeLine} Then use the lesson to understand ${title.toLowerCase()}.`;
  }
  if (detail === 'compact') return copy;
  if (detail === 'deep') return `${copy} Then ask what could go wrong, where the limits are, and how you would test it.`;
  return `${copy} ${modeLine}`;
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

// --- Wire up data-prompt buttons to the free open-source widget ---
// Every "Try this" button on the site now sends the prompt to the floating
// Llama chat (free, open source, in your browser). No closed-tool signups.
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-prompt]');
  if (!btn) return;
  const prompt = btn.getAttribute('data-prompt');
  if (window.ModelWise && typeof window.ModelWise.sendPrompt === 'function') {
    window.ModelWise.sendPrompt(prompt);
  }
});

/* ============================================================
   Scripted demo chatbot
   Recognises a handful of patterns to teach prompting principles.
   It is intentionally NOT a real LLM: the point is to show how
   different *kinds* of prompts produce different *kinds* of replies.
   ============================================================ */

const DEMO_RESPONSES = [
  // Pattern: very short / lazy prompt
  {
    match: p => p.length < 12 && !/[?]/.test(p),
    reply: msg =>
      `I can answer that, but I'll do a much better job if you give me more to work with.\n\nTry telling me:\n• who you are (a student? a teacher? curious?)\n• what you already know\n• what you want me to do with my answer\n\nThe more context, the sharper the response.`,
  },
  // Pattern: "what is AI / what is an LLM"
  {
    match: p => /what is (an? )?(ai|llm|large language model|chatgpt|claude)/i.test(p),
    reply: () =>
      `An LLM (Large Language Model) is a program that learned to predict the next word in a sentence. That's literally the trick.\n\nIt read trillions of words during training. From all that pattern-matching, something useful emerges. It can answer questions, write code, summarise text, etc.\n\nIt doesn't "know" things the way you do. It pattern-matches. That's why it can sound confident and still be wrong. We have a whole lesson on this in Chapter 1.`,
  },
  // Pattern: includes role + task ("act as", "you are a")
  {
    match: p => /(act as|you are a|pretend you'?re|imagine you'?re)/i.test(p),
    reply: () =>
      `Nice, you gave me a role. That single move usually makes my answers way better.\n\nWhen you say "act as a strict editor" or "pretend you're a 9th-grade biology teacher," it shifts my style, vocabulary, and what I emphasise. Try the same prompt without the role and notice the difference.`,
  },
  // Pattern: includes examples ("for example", "like this:")
  {
    match: p => /(for example|like this|e\.g\.|here'?s an example)/i.test(p),
    reply: () =>
      `Great, you showed me an example. That's one of the most powerful prompting moves there is.\n\nLLMs are pattern-matchers. When you show them what "good" looks like, they'll match that pattern. This is called "few-shot prompting." It works on almost everything: writing style, code format, summary length, you name it.`,
  },
  // Pattern: "teach me" / "explain to me"
  {
    match: p => /(teach me|explain (to me|this|it)|help me understand|how does)/i.test(p),
    reply: msg =>
      `Good move, you asked me to teach, not just to answer.\n\nIn a real chat with me (or with common AI tools), this kind of prompt unlocks the *tutor mode*. Try going further: ask me to assume you're smart but ignorant, ask follow-up questions, and ask me to test you at the end.\n\nThat's how you actually learn from AI instead of just consuming it.`,
  },
  // Pattern: asks for an essay / homework
  {
    match: p => /(write (me )?(an? )?essay|do my homework|write my paper)/i.test(p),
    reply: () =>
      `I'll be honest with you here.\n\nI *can* write that essay. Real AI will too. But every time you outsource the thinking before you've practised doing it yourself, the muscle weakens. There's actual research on this. It's called cognitive offloading.\n\nA better move: ask me to help you brainstorm, push back on your draft, find the weak parts of your argument, or test if you understand your own thesis. That makes you sharper, not duller. Chapter 3 goes deep on this.`,
  },
  // Pattern: includes specifics / numbers / structured request
  {
    match: p => /(in \d+|under \d+|exactly \d+|step.by.step|bullet|list)/i.test(p),
    reply: () =>
      `You gave me a constraint. That's another high-leverage prompting move.\n\nConstraints like "in 100 words," "as 3 bullets," "step-by-step," or "for a 14-year-old" force the model to pick a shape and stick to it. Without constraints, you get whatever the model felt like producing, often longer and mushier than you wanted.`,
  },
];

// Generic fallback responses that lightly riff on what the user wrote.
const FALLBACKS = [
  msg => `Here's what I notice about your prompt: it's a question, but it doesn't tell me much about *you*, what you already know, what you'll do with the answer, or what level of detail you want. Try adding even one of those and watch the response get sharper.\n\nReal AI like common AI tools will still try to answer this, but the answer will be generic. That's the trade.`,
  msg => `That's a fine prompt. Want to see it get even better? Try:\n\n• Adding a role ("act as a ___")\n• Adding an example of the output you want\n• Adding a constraint ("in 3 bullets" / "under 100 words")\n\nEvery one of those moves sharpens the answer. Real AI rewards specificity.`,
  msg => `Real AI would answer this. What I want you to notice: the more specific you are, the more specific the answer. Vague in → vague out. That's the whole rule.\n\n(This is a scripted teaching demo. Use the floating chat widget for a real answer.)`,
];

let fbIndex = 0;
function generateReply(userMsg) {
  const trimmed = userMsg.trim();
  for (const rule of DEMO_RESPONSES) {
    if (rule.match(trimmed)) return rule.reply(trimmed);
  }
  const fb = FALLBACKS[fbIndex % FALLBACKS.length];
  fbIndex++;
  return fb(trimmed);
}

// --- Wire up chat widget (if present on the page) ---
function initChat() {
  const root = document.getElementById('chat');
  if (!root) return;

  const win = root.querySelector('.chat-window');
  const ta = root.querySelector('textarea');
  const btn = root.querySelector('button.send');

  function addMsg(text, cls) {
    const div = document.createElement('div');
    div.className = 'msg ' + cls;
    div.textContent = text;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
    return div;
  }

  function send() {
    const val = ta.value.trim();
    if (!val) return;
    addMsg(val, 'msg-user');
    ta.value = '';
    ta.style.height = 'auto';
    const thinking = addMsg('thinking…', 'msg-system');
    setTimeout(() => {
      thinking.remove();
      addMsg(generateReply(val), 'msg-ai');
    }, 500 + Math.random() * 600);
  }

  btn.addEventListener('click', send);
  ta.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
  ta.addEventListener('input', () => {
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  });

  // Quick-chip prompts
  root.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      ta.value = chip.textContent;
      ta.focus();
    });
  });

  // Initial system message
  addMsg("This is a scripted teaching demo: not a real LLM. Try a prompt and I'll teach you what's happening. (For real answers, use the floating chat widget in the corner.)", 'msg-system');
}
document.addEventListener('DOMContentLoaded', initChat);

// --- AI knowledge + judgment gauge ---
function initGauge() {
  const form = document.getElementById('ai-gauge');
  const result = document.getElementById('gauge-result');
  if (!form || !result) return;

  const cards = [...form.querySelectorAll('.gauge-card')];
  const reset = document.getElementById('gauge-reset');
  const back = document.getElementById('gauge-back');
  const next = document.getElementById('gauge-next');
  const finish = document.getElementById('gauge-finish');
  const retake = document.getElementById('result-retake');
  const stepLabel = document.getElementById('gauge-step-label');
  const stepFill = document.getElementById('gauge-step-fill');
  const levelEl = document.getElementById('gauge-level');
  const scoreEl = document.getElementById('gauge-score');
  const titleEl = document.getElementById('gauge-title');
  const copyEl = document.getElementById('gauge-copy');
  const routeEl = document.getElementById('gauge-route');
  const knownList = document.getElementById('known-list');
  const craftedPrompt = document.getElementById('crafted-prompt');
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

  const routes = {
    beginner: {
      label: 'Level 1: Foundation',
      title: 'Your AI level is: Foundation',
      copy: 'You are at the right starting point. Your path should make AI less mysterious before asking you to use it heavily.',
      chapters: [
        ['chapter-1.html', 'Chapter 1', 'What AI actually is', 'Learn model, training, prediction, hallucination, and why AI can sound smart while still being wrong.'],
        ['chapter-2.html', 'Chapter 2', 'One useful prompt pattern', 'Learn how context, role, examples, and constraints change the answer.'],
        ['playground.html', 'Practice', 'Compare two prompts', 'Ask the same question two ways and notice what changes.']
      ]
    },
    explorer: {
      label: 'Level 2: Explorer',
      title: 'Your AI level is: Explorer',
      copy: 'You probably understand that AI is more than search, but the next step is learning when to trust it, challenge it, and use it as a learning partner.',
      chapters: [
        ['chapter-2.html', 'Chapter 2', 'Ask better questions', 'Practice giving context, role, examples, and constraints.'],
        ['chapter-3.html', 'Chapter 3', 'Protect your own thinking', 'Learn where AI helps your brain and where it can weaken the skill you are building.'],
        ['chapter-4.html', 'Chapter 4', 'Check the answer', 'Build verification habits before trusting important claims.']
      ]
    },
    builder: {
      label: 'Level 3: Builder',
      title: 'Your AI level is: Builder',
      copy: 'Your answers show enough AI literacy to move toward projects, comparisons, and systems thinking.',
      chapters: [
        ['chapter-5.html', 'Chapter 5', 'Start a build', 'Turn AI from a chat window into a project partner.'],
        ['projects.html', 'Projects', 'Run a real experiment', 'Compare models, build tools, or design a useful AI workflow.'],
        ['chapter-4.html', 'Chapter 4', 'Use verification loops', 'Choose models, challenge answers, and test outputs.']
      ]
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
      profileJump.textContent = 'Your guide';
      profileGreeting.textContent = `Hey ${profile.name}, ready to start learning today?`;
      profileCopy.textContent = 'Your guide will use your name, remember your assessment on this device, and shape the course around your level.';
      profileName.value = profile.name || '';
    } else {
      profileChip.textContent = 'Make it yours';
      profileJump.textContent = 'Set name';
      profileGreeting.textContent = 'Make this guide yours.';
      profileCopy.textContent = 'Add a private display name. No one else sees it. It just helps the guide feel like it is yours when you come back.';
    }
  }

  function routeFor(score) {
    const limits = selectedValue('limits');
    const learning = selectedValue('learning');
    const definition = selectedValue('definition');
    const capability = selectedValue('capability');
    if (limits < 2 || learning < 2) return routes.explorer;
    if (score >= 72 && definition >= 2 && capability >= 2) return routes.builder;
    if (score >= 42) return routes.explorer;
    return routes.beginner;
  }

  function signalFor(route, score) {
    const routeId = levelIdFromRoute(route.label);
    const message = {
      beginner: 'Foundation signal',
      explorer: 'Explorer signal',
      builder: 'Builder signal'
    }[routeId] || 'Starting signal';
    return `${message}: ${score}%`;
  }

  function toneForAge(age) {
    if (age === 'teen') return 'Teen path: direct, clear, and not babyish.';
    if (age === 'young-adult') return 'Young adult path: practical, quick, and flexible.';
    if (age === 'older-adult') return 'Older adult path: plain English, patient pacing, no tech ego.';
    return 'Adult path: practical, efficient, and not school-ish.';
  }

  function renderRoute(route) {
    routeEl.innerHTML = '';
    route.chapters.forEach(([href, num, title, description]) => {
      const a = document.createElement('a');
      a.href = href;
      a.className = 'chapter-card';
      a.innerHTML = `<div class="num">${num}</div><h3>${title}</h3><p>${description}</p>`;
      routeEl.appendChild(a);
    });
  }

  function renderTools(route) {
    const toolGrid = document.getElementById('tool-grid');
    if (!toolGrid) return;
    const routeId = levelIdFromRoute(route.label);
    const firstAction = {
      beginner: ['chapter-1.html', '01', 'Start here', 'Learn what AI is', 'Get the mental model before tools and projects.'],
      explorer: ['chapter-2.html', '01', 'Start here', 'Practice a better prompt', 'Use AI as tutor, critic, and thinking partner.'],
      builder: ['chapter-5.html', '01', 'Start here', 'Start a project', 'Build or test something real.']
    }[routeId] || ['course.html', '01', 'Start here', route.title, 'Start with the path matched to your current level.'];
    const tools = [
      firstAction,
      ['playground.html', '02', 'Practice lab', 'Test prompts and compare answers', 'Run small experiments instead of just reading about AI.'],
      ['projects.html', '03', 'Build zone', 'Turn learning into projects', 'Move from chat to real tools, research, and model comparisons.'],
      ['#', '04', 'Guide', 'Ask your personal guide', 'The assistant uses your local profile for tone, level, and next steps.']
    ];
    toolGrid.innerHTML = '';
    tools.forEach(([href, icon, label, title, copy]) => {
      const a = document.createElement('a');
      a.href = href;
      a.className = 'tool-card';
      a.innerHTML = `<span class="tool-icon">${icon}</span><h4>${label}: ${title}</h4><p>${copy}</p>`;
      toolGrid.appendChild(a);
    });
  }

  function buildKnownFacts(route, percent) {
    const profile = readProfile();
    const age = selectedText('age_range');
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
      `AI level: ${route.label} at ${percent}%.`,
      `Strongest areas: ${strengths.length ? strengths.join(', ') : 'still forming'}.`,
      `Needs support with: ${growth.length ? growth.join(', ') : 'mostly advanced work now'}.`,
      `Tone to use: ${toneForAge(age)}`,
      `Current view of AI: ${selectedLabel('definition')}`,
      `Beyond-chat understanding: ${selectedLabel('systems')}`
    ];
  }

  function buildCraftedPrompt(route, percent) {
    const profile = readProfile();
    const name = profile?.name || 'this learner';
    return `You are Learning AI, a personal AI literacy guide for ${name}.

Learner profile:
- Age/tone: ${toneForAge(selectedText('age_range'))}
- Current level: ${route.label}, ${percent}% on the AI knowledge and judgment gauge.
- What they know about AI: ${selectedLabel('definition')}
- What they think AI can do: ${selectedLabel('capability')}
- How they handle trust: ${selectedLabel('limits')}
- How they want to learn with AI: ${selectedLabel('learning')}
- How they think about AI costs: ${selectedLabel('impact')}
- What they know beyond chatbots: ${selectedLabel('systems')}

Teach from this profile. Be clear, modern, and practical. Do not sound cringe. Ask short questions, give examples, and help the learner build real judgment instead of just memorizing definitions.`;
  }

  function currentName() {
    const card = cards[current];
    if (card.dataset.profile === 'age') return 'age_range';
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
    const labels = ['Profile', '1 / 6 · What AI is', '2 / 6 · What AI can do', '3 / 6 · When to verify', '4 / 6 · Learning with AI', '5 / 6 · Costs and tradeoffs', '6 / 6 · Beyond chatbots'];
    stepLabel.textContent = labels[current] || `Category ${current} of ${cards.length - 1}`;
    stepFill.style.width = `${Math.round((current) / (cards.length - 1) * 100)}%`;
  }

  function showIncomplete() {
    result.hidden = false;
    levelEl.textContent = 'Pick one';
    scoreEl.textContent = '';
    titleEl.textContent = 'Choose an answer to continue.';
    copyEl.innerHTML = '<span class="gauge-warning">You can still write a different answer in the box, but pick the closest option first so the gauge can route you.</span>';
    routeEl.innerHTML = '';
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function finishGauge() {
    const values = categories.map(selectedValue);
    const answered = values.filter(v => v !== null);

    if (answered.length < categories.length || !selectedText('age_range')) {
      showIncomplete();
      return;
    }

    const raw = answered.reduce((sum, value) => sum + value, 0);
    const percent = Math.round(raw / (categories.length * 3) * 100);
    const route = routeFor(percent);

    result.hidden = false;
    levelEl.textContent = route.label;
    scoreEl.textContent = signalFor(route, percent);
    titleEl.textContent = route.title;
    copyEl.textContent = `${toneForAge(selectedText('age_range'))} ${route.copy}`;
    renderRoute(route);
    const facts = buildKnownFacts(route, percent);
    knownList.innerHTML = '';
    facts.forEach(fact => {
      const li = document.createElement('li');
      li.textContent = fact;
      knownList.appendChild(li);
    });
    craftedPrompt.value = buildCraftedPrompt(route, percent);
    renderTools(route);

    const saved = {
      ageRange: selectedText('age_range'),
      score: percent,
      route: route.label,
      answers: Object.fromEntries(categories.map(name => [name, selectedValue(name)])),
      answerText: Object.fromEntries(categories.map(name => [name, selectedLabel(name)])),
      custom: Object.fromEntries(categories.map(name => [name, form.elements[`${name}_other`]?.value.trim() || ''])),
      ageNote: form.elements.age_other?.value.trim() || '',
      knownFacts: facts,
      guidePrompt: craftedPrompt.value,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('modelwise-gauge', JSON.stringify(saved));
    const profile = readProfile();
    if (profile) writeProfile({ ...profile, lastGauge: saved });
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  reset?.addEventListener('click', () => {
    form.reset();
    result.hidden = true;
    localStorage.removeItem('modelwise-gauge');
    showStep(0);
  });

  retake?.addEventListener('click', () => {
    form.reset();
    result.hidden = true;
    localStorage.removeItem('modelwise-gauge');
    showStep(0);
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    localStorage.removeItem('modelwise-user');
    profileName.value = '';
    renderProfile();
  });

  renderProfile();
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

  if (settings.format && fullList) {
    fullList.querySelectorAll('.chapter-card').forEach(card => {
      const title = card.querySelector('h3')?.textContent || 'this lesson';
      const p = card.querySelector('p');
      if (!p) return;
      const base = p.dataset.baseCopy || p.textContent;
      p.dataset.baseCopy = base;
      p.className = settings.format === 'bullets' || settings.format === 'steps' ? 'formatted-copy' : '';
      p.textContent = adaptLessonCopy(base, title, settings);
    });
  }

  if (!gauge || !gauge.route) {
    if (settings.format) {
      document.getElementById('lessons-hero-copy').textContent = `Your lessons are set to ${settingsSummary(settings)}. Take the gauge when you want Learning AI to choose your level too.`;
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
        ['chapter-3.html', '04 · Judgment', 'Use AI without losing your thinking', 'Learn when AI helps and when it gets in the way.']
      ]
    },
    explorer: {
      title: 'Level 2: Explorer path',
      copy: 'You know some basics. This path moves faster into judgment, verification, and using AI as a thinking partner instead of a search box.',
      primary: ['chapter-2.html', 'Start Chapter 2'],
      lessons: [
        ['chapter-2.html', '01 · Prompt skill', 'Ask better questions', 'Practice context, roles, examples, constraints, and follow-up prompts.'],
        ['chapter-3.html', '02 · Judgment', 'Protect your own thinking', 'Learn how to use AI for critique, practice, and feedback without outsourcing the hard part.'],
        ['chapter-4.html', '03 · Verification', 'Check the answer', 'Build habits for sources, uncertainty, claims, and mistakes.'],
        ['playground.html', '04 · Lab', 'Run prompt experiments', 'Compare answers and notice where the model gets stronger or weaker.']
      ]
    },
    builder: {
      title: 'Level 3: Builder path',
      copy: 'You are ready to treat AI like a system you can test. This path starts with building, then loops back into verification and judgment.',
      primary: ['chapter-5.html', 'Start Chapter 5'],
      lessons: [
        ['chapter-5.html', '01 · Build', 'Build with AI', 'Move from chat to projects, workflows, experiments, and model comparisons.'],
        ['projects.html', '02 · Project', 'Run a real experiment', 'Turn one idea into a testable project.'],
        ['chapter-4.html', '03 · Verification', 'Build a checking loop', 'Challenge outputs before trusting or publishing them.'],
        ['chapter-3.html', '04 · Judgment', 'Use AI as a partner', 'Keep your own taste, reasoning, and responsibility in the loop.']
      ]
    }
  };

  const path = paths[routeId];
  if (!path) return;

  section.hidden = false;
  document.getElementById('lesson-path-title').textContent = path.title;
  document.getElementById('lesson-path-copy').textContent = settings.format
    ? `${path.copy} Teaching style: ${settingsSummary(settings)}.`
    : path.copy;
  document.getElementById('lessons-hero-copy').textContent = settings.format
    ? `Your saved level is ${gauge.route}. Lessons are currently customized for ${settingsSummary(settings)}.`
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
    p.className = settings.format === 'bullets' || settings.format === 'steps' ? 'formatted-copy' : '';
    p.textContent = adaptLessonCopy(copy, title, settings);
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

  function applyToForm(settings) {
    ['theme', 'format', 'mode', 'detail'].forEach(name => {
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
    localStorage.setItem('learningai-settings', JSON.stringify(settings));
    applyAppearance(settings);
    render(settings);
  });

  form.addEventListener('input', () => {
    const settings = readForm();
    applyAppearance(settings);
    render(settings);
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

  const user = readJSON('modelwise-user');
  const gauge = readJSON('modelwise-gauge');
  const settings = readLearningSettings();

  if (!gauge || !gauge.route) {
    root.hidden = true;
    empty.hidden = false;
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
        ['chapter-3.html', 'Chapter 3', 'Protect your thinking', 'Use AI without outsourcing your brain.'],
        ['chapter-4.html', 'Chapter 4', 'Check the answer', 'Build verification habits.']
      ]
    },
    builder: {
      title: 'Your AI level is: Builder',
      copy: 'You are ready to test AI, not just use it. Build, compare, verify, and publish what you learn.',
      signal: 'This is a launch point. It means your path can move into experiments, projects, and model comparisons.',
      next: ['chapter-5.html', 'Start a project', 'Turn AI from a chat window into a project partner.'],
      cards: [
        ['chapter-5.html', 'Chapter 5', 'Start a build', 'Make something real.'],
        ['projects.html', 'Projects', 'Run an experiment', 'Compare models or build a tool.'],
        ['chapter-4.html', 'Chapter 4', 'Verification loop', 'Test outputs before trusting them.']
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

  document.getElementById('path-title').textContent = user?.name ? `Hey ${user.name}, here is your path.` : routeData.title;
  document.getElementById('path-copy').textContent = routeData.copy;
  document.getElementById('path-score').textContent = `${gauge.score}%`;
  document.getElementById('path-saved').textContent = gauge.savedAt ? `Saved ${new Date(gauge.savedAt).toLocaleDateString()}` : 'Saved on this device.';
  document.getElementById('path-signal-copy').textContent = routeData.signal;
  const settingsCopy = document.getElementById('path-settings-copy');
  if (settingsCopy) {
    settingsCopy.textContent = settings.format
      ? `Learning AI is set to teach with ${settingsSummary(settings)}.`
      : 'Choose how Learning AI should teach you: bullets, steps, short explanations, examples, projects, or deeper detail.';
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
    ['#', '02', 'Guide', 'Ask Learning AI', 'Use your profile to get a next-step plan.'],
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
  document.getElementById('path-prompt').value = gauge.guidePrompt || 'Retake the assessment to generate a guide setup.';

  document.getElementById('clear-path')?.addEventListener('click', () => {
    localStorage.removeItem('modelwise-gauge');
    location.reload();
  });
}
document.addEventListener('DOMContentLoaded', initMyPath);
