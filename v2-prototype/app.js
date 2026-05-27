(() => {
  const LESSONS = [
    {
      id: 'lesson-1',
      title: 'Why AI matters',
      subtitle: 'Start from what matters: why people use AI, and where it can hurt if you let it replace thinking.',
      weak: {
        copy: 'Use AI to get final answers instantly for every assignment and skip your own process.',
        feedback: 'Too risky. You can get answers, but you lose the habit of building your own model of the problem.'
      },
      strong: {
        copy: 'Use AI as a thinking partner: define what you need, ask for a draft, then verify against your own understanding.',
        feedback: 'Good. It keeps you in control of the goal and keeps the final judgment with you.'
      },
      prompt: {
        student: 'You are my AI safety coach. I am building a study plan for a homework task. Ask me two questions that force me to explain what I know before giving a brief hint.',
        adult: 'You are a practical AI co-learner. Help me define why this task is worth solving and what I should not outsource.',
        builder: 'You are a systems coach. Give me a no-code checklist for deciding whether using AI here increases output quality or just speed.',
        teacher: 'You are a classroom AI coach. Give me three ways to introduce AI to students without replacing their own reasoning.',
        creative: 'You are a creativity coach. Give me one prompt style that encourages original thought while using AI for brainstorming.'
      }
    },
    {
      id: 'lesson-2',
      title: 'First useful AI conversation',
      subtitle: 'Learn the first practical loop: prompt, output, refinement, and confidence check.',
      weak: {
        copy: 'Ask: "Can you answer this fast?" and wait for a long single response.',
        feedback: 'Weak. You are outsourcing the framing. Better prompts start with clear constraints and expected output format.'
      },
      strong: {
        copy: 'Prompt like this: "I need a 120-word explanation for a 15-year-old. Give it in three steps and ask me one check question before the final answer."',
        feedback: 'Stronger. You controlled scope, format, tone, and added a built-in confidence check.'
      },
      prompt: {
        student: 'Pretend you are a peer tutor. Use this exact flow: 1) ask my current understanding, 2) give one hint, 3) ask me to try once, 4) then explain the final concept in 6th grade language.',
        adult: 'Act as a practical coach for adults. Start by asking me for my current level, then tailor the explanation to that level in three progressively more specific steps.',
        builder: 'Be my implementation mentor. Ask clarifying questions, then give pseudocode for how I could automate this workflow by hand first and with AI second.',
        teacher: 'Be concise. Create a 5-step live demo for a class where students compare a weak prompt and a better prompt, with one reflection prompt.',
        creative: 'Be my idea coach. Generate a tiny project idea in my life, then rewrite one prompt to improve originality and tone.'
      }
    },
    {
      id: 'lesson-3',
      title: 'What AI is',
      subtitle: 'Use one concrete model: AI is pattern prediction plus learned structure, not magical understanding.',
      weak: {
        copy: 'AI is a thinking machine that knows everything and always has the right answer.',
        feedback: 'That is a common but inaccurate frame. It invites over-trust and blocks verification behavior.'
      },
      strong: {
        copy: 'AI is a trained system that predicts likely outputs from prior data, so it can help with patterns but must be verified.',
        feedback: 'Accurate and practical. This framing supports using AI with judgment instead of blind trust.'
      },
      prompt: {
        student: 'Explain the idea to a 14-year-old using one analogy that is not about human brains, then ask me where this analogy breaks down.',
        adult: 'Explain AI as a probability-based system with examples from writing, coding, and search. Include one limitation where over-trust creates harm.',
        builder: 'Give me a concise architecture-level explanation for a beginner coder, then one sentence on why output confidence != truth.',
        teacher: 'Give a classroom analogy and a 90-second mini-activity to test the claim "AI is not fact-checking itself."',
        creative: 'Give a short, concrete mental model for AI using a creative process example and include one caution about bias.'
      }
    },
    {
      id: 'lesson-4',
      title: 'What is an LLM',
      subtitle: 'Understand the practical mechanics: tokens, context, and why fluent text can still be wrong.',
      weak: {
        copy: 'LLM means the AI has memory of everything so it can answer perfectly after enough training.',
        feedback: 'No. This creates false certainty. An LLM does not have literal memory like a database unless tools are attached.'
      },
      strong: {
        copy: 'An LLM predicts likely next output tokens based on context windows and patterns seen during training, not human-like recall.',
        feedback: 'Good practical frame. It supports safe behavior like constraints, verification, and source checks.'
      },
      prompt: {
        student: 'Create a classroom-ready explanation of LLMs in under 90 seconds and one quick check question I can ask to test understanding.',
        adult: 'Build a short guide that explains token limits and context windows without equations, then show one task they affect.',
        builder: 'Give a starter prompt I can use with another AI to compare "token budget" effects across long inputs.',
        teacher: 'Write one low-stakes activity showing why prompts must define length, style, and source requirements before output quality rises.',
        creative: 'Write a prompt template that helps me generate ideas but forces style constraints to avoid bland responses.'
      }
    },
    {
      id: 'lesson-5',
      title: 'Prompt repair',
      subtitle: 'Turn vague prompts into useful prompts by adding goal, context, constraints, format, and review criteria.',
      weak: {
        copy: 'Write my essay.',
        feedback: 'Too vague. This causes generic results and low transfer. Missing task structure.'
      },
      strong: {
        copy: 'Write a 250-word summary for 10th grade with 3 key points, one caveat, and a 2-question self-check.',
        feedback: 'Much stronger. The output is bounded, understandable, and easier to verify.'
      },
      prompt: {
        student: 'Help me build a repair template: add goal, context, constraints, format, and rubric in 5 lines. Use the "study coach" use case.',
        adult: 'Help me generate one high-quality repair prompt for a work task with two audience levels: quick summary and executive-level detail.',
        builder: 'Create a reusable prompt-repair structure for coding assistance that requires test steps and expected behavior.',
        teacher: 'Give me a copyable repair exercise for students where they improve one weak prompt in class.',
        creative: 'Give a prompt-repair template for writing or visual work that includes output tone and source boundaries.'
      }
    },
    {
      id: 'follow-ups',
      title: 'Follow-ups',
      subtitle: 'Learn why one prompt is not usually enough and how follow-ups improve outcomes.',
      weak: {
        copy: 'Ask one final question and do nothing when the answer is weak.',
        feedback: 'Weak process. You need iterative follow-ups with criteria to improve correctness and usefulness.'
      },
      strong: {
        copy: 'Compare answer A vs B, then ask: "What changed? What confidence check should we run?" before finalizing.',
        feedback: 'Good approach. This forces calibration and correction instead of passive acceptance.'
      },
      prompt: {
        student: 'Create a three-turn follow-up sequence for learning a math topic; include a confidence check at each turn.',
        adult: 'Generate a follow-up playbook for a professional task with escalation rules when the AI output is low quality.',
        builder: 'Produce a follow-up loop for coding help with "reproduce -> isolate bug -> test -> narrow prompt".',
        teacher: 'Draft follow-up questions that reveal student misconceptions without giving away answers.',
        creative: 'Build a prompt sequence that improves creative output while preserving my voice and constraints.'
      }
    },
    {
      id: 'why-ai-is-wrong',
      title: 'Why AI gets wrong',
      subtitle: 'Build a practical failure mindset before trusting any output fully.',
      weak: {
        copy: 'If it sounds confident, it must be correct.',
        feedback: 'Confident tone is not proof. This leads to unverified copying and avoidable mistakes.'
      },
      strong: {
        copy: 'Identify when output likely fails: missing evidence, weak logic, or unsupported details, then test one statement externally.',
        feedback: 'Good. This is the basis of verification and prevents brittle trust.'
      },
      prompt: {
        student: 'Give me one tiny checklist I can use before trusting a tutor-style answer in school.',
        adult: 'Create a hallucination detective checklist for work tasks (4 steps max) with examples.',
        builder: 'Give me a quick reliability stress test sequence for AI-generated technical recommendations.',
        teacher: 'Create a mini classroom exercise where students distinguish high-confidence nonsense from cautious uncertainty.',
        creative: 'Generate a practical check list for AI-generated content quality and bias symptoms.'
      }
    },
    {
      id: 'verify-sources',
      title: 'Verify sources',
      subtitle: 'Use a simple two-step verification loop on every important claim.',
      weak: {
        copy: 'Trust the cited text because it has a fake citation style.',
        feedback: 'Invalid. Formatting is not proof; evidence and consistency still need checking.'
      },
      strong: {
        copy: 'Test one claim with one independent source and flag what remains uncertain or unsupported.',
        feedback: 'Good. This is the right pattern: sample, cross-check, then decide how to use it.'
      },
      prompt: {
        student: 'Give me a source verification prompt for homework research: one claim, one alternative source, one confidence rating.',
        adult: 'Create a verification workflow for professional writing that includes source quality and recency checks.',
        builder: 'Give me a repeatable check prompt: claim extraction, counter-source, evidence quality, final verdict.',
        teacher: 'Create a source-verification mini-rubric students can use in class for research tasks.',
        creative: 'Give me a template that asks for three independent support points before finalizing any factual claim.'
      }
    },
    {
      id: 'tutor-not-cheating',
      title: 'Tutor, not cheating',
      subtitle: 'Learn to use AI for guidance while protecting your own thinking process.',
      weak: {
        copy: 'Ask for full final answers, then submit unchanged.',
        feedback: 'That creates shallow learning and weak transfer. It bypasses your own reasoning.'
      },
      strong: {
        copy: 'Ask for a hint and a checkpoint question, then request explanation only after your first attempt.',
        feedback: 'Strong. You are preserving challenge and converting AI output into practice.'
      },
      prompt: {
        student: 'Create a study assistant prompt that enforces: no final answer first, ask for my attempt first, then explain gaps.',
        adult: 'Create a learning partner prompt for skill acquisition that grades effort quality, not just output quality.',
        builder: 'Draft a "guided partner" prompt with constraints for coding: no full solutions first, only hypotheses and test ideas.',
        teacher: 'Create a classroom-use version of this principle for students under time pressure.',
        creative: 'Build a prompt for critique-based learning in creative writing where AI returns 1 improvement path, not rewrite.'
      }
    },
    {
      id: 'privacy-bias',
      title: 'Privacy and bias',
      subtitle: 'Protect sensitive data and bias risk before scaling AI use.',
      weak: {
        copy: 'Paste everything into AI first because it is convenient and fast.',
        feedback: 'Convenience without caution creates avoidable risk. Some data should not be copied at all.'
      },
      strong: {
        copy: 'Redact sensitive fields first, then use a bias check for group identity or loaded language before final use.',
        feedback: 'Good. This turns safety into a repeatable action step.'
      },
      prompt: {
        student: 'Generate a redaction checklist for school/work examples with personal, school, and financial data risks.',
        adult: 'Give me a bias audit prompt for customer-facing outputs and one fairness check question.',
        builder: 'Create a privacy-first prompt template that enforces no secrets and avoids storing outputs permanently.',
        teacher: 'Draft a lesson-ready activity for spotting and repairing biased wording.',
        creative: 'Give me a creative prompt preflight checklist to avoid stereotype reinforcement.'
      }
    },
    {
      id: 'prompt-to-workflow',
      title: 'Prompt to workflow',
      subtitle: 'Turn one useful prompt into a repeatable process with checkpoints.',
      weak: {
        copy: 'Treat every task as one big prompt and run it every time in the same way.',
        feedback: 'That misses workflow thinking. Repetition requires checkpoints and quality criteria.'
      },
      strong: {
        copy: 'Create input → prompt → output → review → revise → reuse loop with one human checkpoint at each repeat.',
        feedback: 'Excellent. This starts building systems-level agency.'
      },
      prompt: {
        student: 'Turn your study process into a 5-step repeatable workflow and include one checkpoint between each step.',
        adult: 'Build me a workflow spec for recurring work tasks with quality gates and escalation rules.',
        builder: 'Generate a workflow map template with state transitions and failure handling for any AI-assisted task.',
        teacher: 'Create a student-friendly workflow card template for research or writing labs.',
        creative: 'Generate a workflow pattern that preserves originality while using AI for ideation and revisions.'
      }
    },
    {
      id: 'mini-capstone',
      title: 'Mini capstone',
      subtitle: 'Build one useful AI workflow and evaluate it against your own checklist.',
      weak: {
        copy: 'Make a prompt, run it once, and call it done without checking results.',
        feedback: 'Too shallow. This does not produce a provable capability gain.'
      },
      strong: {
        copy: 'Deliver a goal, prompt, output sample, and 3-item review rubric, then rerun with two improvements.',
        feedback: 'Strong. You now have a reusable artifact and evidence of progress.'
      },
      prompt: {
        student: 'Help me build a final capstone for studying one topic: prompt, first draft task, rubric, and reflection points.',
        adult: 'Create a practical capstone structure I can complete in 15 minutes with proof of verification and risk checks.',
        builder: 'Design a mini capstone spec: problem statement, inputs, expected outputs, checkpoints, and failure handling conditions.',
        teacher: 'Draft a capstone template students can submit as an artifact, including peer-review criteria.',
        creative: 'Create a creative capstone brief where AI helps produce a portfolio-ready piece with a human review loop.'
      }
    }
  ];

  const PROFILE_MODES = {
    student: { label: 'Student', actionLabel: 'stay in charge and learn first' },
    adult: { label: 'Adult beginner', actionLabel: 'learn efficiently and safely' },
    builder: { label: 'Builder / coder', actionLabel: 'design useful, testable prompts and workflows' },
    teacher: { label: 'Educator', actionLabel: 'use AI as a facilitator, not a replacement' },
    creative: { label: 'Creative / personal', actionLabel: 'keep originality and ownership in the loop' }
  };

  const STORAGE_KEYS = {
    profile: 'learningai-v2-profile',
    progress: 'learningai-v2-progress',
    cards: 'learningai-v2-toolkit-cards'
  };

  const els = {
    profileMode: document.getElementById('profile-mode'),
    startPath: document.getElementById('start-path'),
    pathStatus: document.getElementById('progress-status'),
    pathProgressText: document.getElementById('path-progress'),
    pathFill: document.getElementById('progress-fill'),
    pathCards: Array.from(document.querySelectorAll('.path-card')),
    lessonTitle: document.getElementById('lesson-title'),
    lessonSubtitle: document.getElementById('lesson-subtitle'),
    weakCopy: document.getElementById('weak-copy'),
    strongCopy: document.getElementById('strong-copy'),
    chooseWeak: document.getElementById('choose-weak'),
    chooseStrong: document.getElementById('choose-strong'),
    feedback: document.getElementById('feedback'),
    lessonPrompt: document.getElementById('lesson-prompt'),
    copyPrompt: document.getElementById('copy-prompt'),
    completeLesson: document.getElementById('complete-lesson'),
    cardForm: document.getElementById('card-builder'),
    cardOutput: document.getElementById('card-output'),
    cardStack: document.getElementById('card-stack')
  };

  if (!els.lessonTitle) {
    return;
  }

  let selectedLesson = null;
  let selectedChoice = null;
  let state = readState();

  setProfileModeFromState();
  bindEvents();
  renderPath();
  renderProgress();
  renderCardStack();
  renderPathIntro();

  function readState() {
    const profile = safeGet(STORAGE_KEYS.profile) || 'student';
    const progress = readJson(STORAGE_KEYS.progress) || { completed: {} };
    return {
      profile,
      completed: progress.completed || {},
      currentIndex: Number.isInteger(progress.currentIndex) ? progress.currentIndex : null,
      cards: Array.isArray(readJson(STORAGE_KEYS.cards)) ? readJson(STORAGE_KEYS.cards) : []
    };
  }

  function saveProfile(value) {
    state.profile = value;
    safeSet(STORAGE_KEYS.profile, value);
    if (selectedLesson !== null) {
      loadLesson(selectedLesson);
    }
    renderPathIntro();
  }

  function saveProgress() {
    safeSet(STORAGE_KEYS.progress, {
      completed: state.completed,
      currentIndex: selectedLesson,
      updatedAt: new Date().toISOString()
    });
  }

  function saveCards(cards) {
    state.cards = cards;
    safeSet(STORAGE_KEYS.cards, cards);
    renderCardStack();
  }

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function readJson(key) {
    const raw = safeGet(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function setProfileModeFromState() {
    if (els.profileMode) {
      els.profileMode.value = PROFILE_MODES[state.profile] ? state.profile : 'student';
    }
  }

  function bindEvents() {
    if (els.startPath) {
      els.startPath.addEventListener('click', startPath);
    }

    if (els.profileMode) {
      els.profileMode.addEventListener('change', (event) => {
        saveProfile(event.target.value);
      });
    }

    els.pathCards.forEach((card) => {
      card.addEventListener('click', () => {
        selectLessonFromCard(card);
      });
    });

    if (els.chooseWeak) {
      els.chooseWeak.addEventListener('click', () => setChoice('weak'));
    }

    if (els.chooseStrong) {
      els.chooseStrong.addEventListener('click', () => setChoice('strong'));
    }

    if (els.copyPrompt) {
      els.copyPrompt.addEventListener('click', copyPromptText);
    }

    if (els.completeLesson) {
      els.completeLesson.addEventListener('click', markLessonComplete);
    }

    if (els.cardForm) {
      els.cardForm.addEventListener('submit', saveCard);
    }
  }

  function startPath() {
    if (selectedLesson === null) {
      selectedLesson = 0;
      loadLesson(selectedLesson);
      updateStatus(`Profile set to ${PROFILE_MODES[state.profile].label}. Starting from lesson 1.`);
    }
  }

  function selectLessonFromCard(cardElement) {
    const nextIndex = Number(cardElement.dataset.index);
    if (Number.isNaN(nextIndex)) return;
    loadLesson(nextIndex);
  }

  function loadLesson(index) {
    if (!LESSONS[index]) return;
    selectedLesson = index;
    selectedChoice = null;
    const lesson = LESSONS[index];
    els.lessonTitle.textContent = `${index + 1}. ${lesson.title}`;
    els.lessonSubtitle.textContent = lesson.subtitle;

    els.weakCopy.textContent = lesson.weak.copy;
    els.strongCopy.textContent = lesson.strong.copy;
    els.feedback.textContent = `Profile: ${PROFILE_MODES[state.profile].label}. Choose the stronger option before you complete this lesson.`;
    els.feedback.className = 'feedback';

    const prompt = lesson.prompt[state.profile] || lesson.prompt.student;
    els.lessonPrompt.textContent = prompt.trim();

    updateLessonButtons();

    els.pathCards.forEach((card) => {
      const idx = Number(card.dataset.index);
      card.classList.toggle('active', idx === index);
    });

    saveProgress();
    renderPathIntro();
  }

  function setChoice(choice) {
    if (selectedLesson === null) {
      updateStatus('Pick a lesson first. Click any lesson card.');
      return;
    }
    selectedChoice = choice;
    const lesson = LESSONS[selectedLesson];
    const data = choice === 'strong' ? lesson.strong : lesson.weak;

    const grade = choice === 'strong' ? 'Strong choice' : 'Weak choice';
    els.feedback.textContent = `${grade}: ${data.feedback}`;
    els.feedback.style.background = choice === 'strong' ? '#ecfdf5' : '#fff7ed';
    els.feedback.style.color = choice === 'strong' ? '#047857' : '#c2410c';

    els.completeLesson.textContent = 'Mark lesson complete';
  }

  function markLessonComplete() {
    if (selectedLesson === null) {
      updateStatus('Pick a lesson first.');
      return;
    }

    const lesson = LESSONS[selectedLesson];
    if (!selectedChoice) {
      updateStatus(`Pick weak or strong response for: ${lesson.title}.`);
      return;
    }

    const lessonId = lesson.id;
    state.completed[lessonId] = {
      completedAt: new Date().toISOString(),
      choice: selectedChoice
    };

    saveProgress();
    updateLessonButtons();
    renderProgress();
    renderPathIntro();

    const next = findNextIncompleteIndex();
    if (next === -1) {
      updateStatus('Great job. You finished the 12-lesson core. Next you can begin the capstone build flow.');
      return;
    }

    if (selectedLesson === next) {
      updateStatus('Lesson saved. Move to the next lesson to continue.');
      return;
    }

    const nextButton = els.pathCards[next];
    if (nextButton) {
      nextButton.focus();
    }
    updateStatus(`Saved. Next suggestion: lesson ${next + 1} (${LESSONS[next].title}).`);
  }

  function findNextIncompleteIndex() {
    for (let i = 0; i < LESSONS.length; i += 1) {
      if (!state.completed[LESSONS[i].id]) {
        return i;
      }
    }
    return -1;
  }

  function renderPath() {
    els.pathCards.forEach((card, index) => {
      const lesson = LESSONS[index];
      if (!lesson) return;
      card.textContent = `${index + 1}. ${lesson.title}`;
      card.dataset.index = String(index);
      if (state.completed[lesson.id]) {
        card.classList.add('completed');
      } else {
        card.classList.remove('completed');
      }
    });
  }

  function updateLessonButtons() {
    if (!els.completeLesson) return;
    if (selectedLesson === null) {
      els.completeLesson.disabled = true;
      return;
    }
    const lesson = LESSONS[selectedLesson];
    if (state.completed[lesson.id]) {
      els.completeLesson.textContent = 'Lesson already complete';
      els.completeLesson.disabled = true;
    } else {
      els.completeLesson.textContent = 'Mark lesson complete';
      els.completeLesson.disabled = false;
    }
  }

  function renderProgress() {
    const done = Object.keys(state.completed).length;
    const total = LESSONS.length;
    const percent = Math.round((done / total) * 100);
    els.pathProgressText.textContent = `${done} / ${total} lessons completed (${percent}%)`;
    if (els.pathFill) {
      els.pathFill.style.width = `${percent}%`;
      els.pathFill.style.background = percent > 0 ? 'linear-gradient(90deg, #2563eb, #16a34a)' : 'var(--accent)';
    }
  }

  function renderPathIntro() {
    if (!els.pathStatus) return;
    if (selectedLesson === null) {
      updateStatus('Pick a lesson from the path, or click Start V2 path to begin at lesson 1.');
      return;
    }

    const lesson = LESSONS[selectedLesson];
    const profile = PROFILE_MODES[state.profile];
    const done = Object.keys(state.completed).length;

    if (state.completed[lesson.id]) {
      updateStatus(`Selected: ${lesson.title}. You already completed it. ${done} complete.`);
    } else {
      updateStatus(`Selected: ${lesson.title}. ${profile.actionLabel} · You are at ${done} / ${LESSONS.length}.`);
    }
  }

  function updateStatus(message) {
    els.pathStatus.textContent = message;
  }

  function copyPromptText() {
    if (!els.lessonPrompt) return;
    const text = els.lessonPrompt.textContent.trim();
    if (!text) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        const prev = els.feedback.textContent;
        els.feedback.textContent = 'Prompt copied. Paste it into your AI tool, run it, then come back and compare results.';
        setTimeout(() => {
          els.feedback.textContent = prev;
        }, 2600);
      }).catch(() => fallbackCopyPrompt(text));
      return;
    }

    fallbackCopyPrompt(text);
  }

  function fallbackCopyPrompt(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(ta);
    els.feedback.textContent = copied
      ? 'Prompt copied. If paste fails, this is the text area to use: select and copy from the prompt box below.'
      : 'Copy failed. Manually select the prompt text and copy it from this page.';
  }

  function saveCard(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = {
      id: `card-${Date.now()}`,
      subject: form.subject?.value.trim() || 'General',
      goal: form.goal?.value.trim() || 'No goal set',
      should: form.should?.value.trim() || 'No preferences set',
      shouldNot: form.should_not?.value.trim() || 'No boundaries set',
      mode: state.profile,
      createdAt: new Date().toISOString()
    };

    const cards = Array.isArray(state.cards) ? [...state.cards] : [];
    cards.unshift(payload);
    saveCards(cards.slice(0, 8));
    els.cardOutput.textContent = formatCard(payload);
    updateStatus('Study Coach card saved locally.');
    form.reset();
  }

  function renderCardStack() {
    if (!els.cardStack) return;
    els.cardStack.innerHTML = '';
    (state.cards || []).forEach((card, index) => {
      const cardEl = document.createElement('article');
      cardEl.className = 'response-card';
      const profile = PROFILE_MODES[card.mode] ? PROFILE_MODES[card.mode].label : 'General';
      cardEl.innerHTML = `
        <span>Saved card ${index + 1} · ${profile}</span>
        <h3>${escapeHtml(card.subject)}</h3>
        <p><strong>Goal:</strong> ${escapeHtml(card.goal)}</p>
        <p><strong>AI should:</strong> ${escapeHtml(card.should)}</p>
        <p><strong>AI should not:</strong> ${escapeHtml(card.shouldNot)}</p>
      `;
      els.cardStack.appendChild(cardEl);
    });

    const latest = state.cards?.[0];
    if (latest) {
      els.cardOutput.textContent = formatCard(latest);
    } else {
      els.cardOutput.textContent = 'Your saved Study Coach Card will appear here.';
    }
  }

  function formatCard(payload) {
    return [
      'Study Coach Card',
      '',
      `Profile: ${PROFILE_MODES[payload.mode]?.label || 'General'}`,
      `Subject: ${payload.subject || 'General'}`,
      `Learning goal: ${payload.goal || 'Not set'}`,
      '',
      'AI should:',
      payload.should || 'Not set',
      '',
      'AI should not:',
      payload.shouldNot || 'Not set'
    ].join('\n');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
