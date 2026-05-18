/* ============================================================
   Aside: shared scripts
   Scripted chatbot demo (v1, no real LLM).
   Routes prompts to the free open-source Llama widget.
   ============================================================ */

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
  if (window.Aside && typeof window.Aside.sendPrompt === 'function') {
    window.Aside.sendPrompt(prompt);
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
  const stepLabel = document.getElementById('gauge-step-label');
  const stepFill = document.getElementById('gauge-step-fill');
  const levelEl = document.getElementById('gauge-level');
  const scoreEl = document.getElementById('gauge-score');
  const titleEl = document.getElementById('gauge-title');
  const copyEl = document.getElementById('gauge-copy');
  const routeEl = document.getElementById('gauge-route');
  const categories = ['definition', 'capability', 'limits', 'learning', 'impact', 'systems'];
  let current = 0;

  const routes = {
    beginner: {
      label: 'Beginner path',
      title: 'Start with the foundations.',
      copy: 'You are at the right starting point. Your path should make AI less mysterious before asking you to use it heavily.',
      chapters: [
        ['chapter-1.html', 'Chapter 1', 'What AI actually is', 'Learn model, training, prediction, hallucination, and why AI can sound smart while still being wrong.'],
        ['assessment.html', 'Gauge reflection', 'Retake after Chapter 1', 'Come back and see which answers changed after the basics click.'],
        ['playground.html', 'Playground', 'Try one careful experiment', 'Ask the same question two ways and compare what changes.']
      ]
    },
    explorer: {
      label: 'Explorer path',
      title: 'You know some of the basics. Now build judgment.',
      copy: 'You probably understand that AI is more than search, but the next step is learning when to trust it, challenge it, and use it as a learning partner.',
      chapters: [
        ['chapter-1.html', 'Chapter 1', 'Clean up the model basics', 'Skim this for the vocabulary: model, token, training, inference, hallucination.'],
        ['chapter-2.html', 'Chapter 2', 'Ask better questions', 'Practice giving context, role, examples, and constraints.'],
        ['chapter-3.html', 'Chapter 3', 'Protect your own thinking', 'Learn where AI helps your brain and where it can weaken the skill you are building.']
      ]
    },
    builder: {
      label: 'Builder path',
      title: 'You are ready to test AI, not just use it.',
      copy: 'Your answers show enough AI literacy to move toward projects, comparisons, and systems thinking.',
      chapters: [
        ['chapter-4.html', 'Chapter 4', 'Use advanced patterns', 'Learn iteration, critique, role design, model choice, and verification loops.'],
        ['chapter-5.html', 'Chapter 5', 'Build with AI', 'Turn AI from a chat window into a project partner.'],
        ['projects.html', 'Projects', 'Run a real experiment', 'Compare models, build tools, or design a useful AI workflow.']
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

  function routeFor(score) {
    if (score >= 72) return routes.builder;
    if (score >= 42) return routes.explorer;
    return routes.beginner;
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
    stepLabel.textContent = isFirst ? 'Profile' : `Category ${current} of ${cards.length - 1}`;
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
    scoreEl.textContent = `${percent}%`;
    titleEl.textContent = route.title;
    copyEl.textContent = `${toneForAge(selectedText('age_range'))} ${route.copy}`;
    renderRoute(route);

    const saved = {
      ageRange: selectedText('age_range'),
      score: percent,
      route: route.label,
      answers: Object.fromEntries(categories.map(name => [name, selectedValue(name)])),
      custom: Object.fromEntries(categories.map(name => [name, form.elements[`${name}_other`]?.value.trim() || ''])),
      ageNote: form.elements.age_other?.value.trim() || '',
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('ai-field-guide-gauge', JSON.stringify(saved));
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
    localStorage.removeItem('ai-field-guide-gauge');
    showStep(0);
  });

  showStep(0);
}
document.addEventListener('DOMContentLoaded', initGauge);
