(() => {
  const storageKeys = {
    profile: 'learningai-v2-profile',
    progress: 'learningai-v2-progress',
    cards: 'learningai-v2-toolkit-cards'
  };

  const els = {
    title: document.getElementById('lesson-title'),
    subtitle: document.getElementById('lesson-subtitle'),
    status: document.getElementById('lesson-status'),
    hookTitle: document.getElementById('lesson-hook-title'),
    hookScenario: document.getElementById('lesson-hook-scenario'),
    choices: document.getElementById('lesson-choices'),
    feedback: document.getElementById('lesson-feedback'),
    revealTitle: document.getElementById('lesson-reveal-title'),
    revealBody: document.getElementById('lesson-reveal-body'),
    mistake: document.getElementById('lesson-mistake'),
    good: document.getElementById('lesson-good'),
    prompt: document.getElementById('lesson-prompt'),
    copyBtn: document.getElementById('copy-prompt'),
    form: document.getElementById('lesson-toolkit-form'),
    toolkitOutput: document.getElementById('toolkit-output'),
    mastery: document.getElementById('lesson-mastery'),
    markBtn: document.getElementById('mark-complete'),
    nextLink: document.getElementById('lesson-next'),
    backLink: document.getElementById('lesson-back'),
    progressCopy: document.getElementById('lesson-progress-copy'),
  };

  const lessonSlug = new URLSearchParams(location.search).get('lesson') || 'lesson-1';
  const allLessons = Array.isArray(window.V2_LESSON_BLUEPRINT) ? window.V2_LESSON_BLUEPRINT : [];
  const index = Math.max(0, allLessons.findIndex(item => item.slug === lessonSlug || String(item.id) === lessonSlug));
  const lesson = allLessons[index] || allLessons[0];

  if (!lesson) {
    els.title.textContent = 'Lesson not found';
    els.subtitle.textContent = 'Check the lesson link and try again.';
    return;
  }

  const profile = safeGet(storageKeys.profile) || 'student';
  let revealBodyBase = '';
  renderLesson(lesson, profile);
  setupEvents(lesson);
  renderProgressSummary();

  function renderLesson(currentLesson, currentProfile) {
    els.title.textContent = `Lesson ${currentLesson.index}: ${currentLesson.title}`;
    els.subtitle.textContent = currentLesson.subtitle;
    els.status.textContent = `Profile: ${profileLabel(currentProfile)}. Pick a response, copy the prompt, then save your card.`;

    els.hookTitle.textContent = currentLesson.hook.title;
    els.hookScenario.textContent = currentLesson.hook.scenario;

    els.choices.innerHTML = '';
    currentLesson.tryFirst.choices.forEach((item, choiceIndex) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'path-card';
      btn.style.textAlign = 'left';
      btn.style.marginBottom = '0.6rem';
      btn.innerHTML = `<strong>${choiceIndex + 1}.</strong> ${escapeHtml(item.label)}`;
      btn.addEventListener('click', () => handleChoice(item));
      els.choices.appendChild(btn);
    });

    els.feedback.textContent = currentLesson.tryFirst.prompt;
    els.feedback.style.background = '#eef4ff';
    els.feedback.style.color = '#1d4ed8';

    els.revealTitle.textContent = currentLesson.reveal.title;
    els.revealBody.textContent = currentLesson.reveal.body;
    revealBodyBase = currentLesson.reveal.body;
    els.mistake.textContent = currentLesson.reveal.mistake;
    els.good.textContent = currentLesson.reveal.good;

    els.prompt.textContent = currentLesson.prompt;

    els.form.line1.value = currentLesson.saveTemplate.line1 || '';
    els.form.line2.value = currentLesson.saveTemplate.line2 || '';
    els.form.line3.value = currentLesson.saveTemplate.line3 || '';
    els.form.line4.value = currentLesson.saveTemplate.line4 || '';

    els.mastery.textContent = currentLesson.mastery;

    if (currentLesson.next) {
      els.nextLink.href = `lesson.html?lesson=${currentLesson.next}`;
      els.nextLink.textContent = `Next: ${currentLesson.next.replace('lesson-', 'Lesson ')}`;
    } else {
      els.nextLink.textContent = 'Review path';
      els.nextLink.href = 'index.html#path';
    }

    els.backLink.href = 'index.html#path';

    const savedCards = readJson(storageKeys.cards) || [];
    const lessonCard = savedCards.find(item => item.lessonSlug === currentLesson.slug);
    if (lessonCard) {
      els.toolkitOutput.textContent = formatCard(lessonCard);
    } else {
      els.toolkitOutput.textContent = 'Saved cards appear here.';
    }

    const progress = readJson(storageKeys.progress) || { completed: {} };
    const nextBtnLabel = progress.completed?.[currentLesson.id] ? 'Lesson already complete' : 'Mark this lesson complete';
    els.markBtn.textContent = nextBtnLabel;
    els.markBtn.disabled = Boolean(progress.completed?.[currentLesson.id]);
  }

  function handleChoice(item) {
    els.feedback.textContent = `You chose: ${item.label}. ${item.feedback}`;
    els.feedback.style.background = item.correct ? '#ecfdf5' : '#fff7ed';
    els.feedback.style.color = item.correct ? '#047857' : '#b45309';

    const selected = `Selected answer: ${item.label}`;
    els.revealBody.textContent = item.correct
      ? `${revealBodyBase} ${selected} This is the stronger path.`
      : `${revealBodyBase} ${selected} This is weaker; revise your framing.`;
  }

  function setupEvents(currentLesson) {
    els.copyBtn.addEventListener('click', () => copyText(els.prompt.textContent));

    els.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const payload = {
        lessonSlug: currentLesson.slug,
        lessonIndex: currentLesson.index,
        lessonTitle: currentLesson.title,
        profile,
        createdAt: new Date().toISOString(),
        line1: String(formData.get('line1') || '').trim(),
        line2: String(formData.get('line2') || '').trim(),
        line3: String(formData.get('line3') || '').trim(),
        line4: String(formData.get('line4') || '').trim(),
      };

      const cards = readJson(storageKeys.cards) || [];
      const nextCards = [payload, ...cards.filter(c => c.lessonSlug !== currentLesson.slug)].slice(0, 12);
      safeSet(storageKeys.cards, nextCards);
      els.toolkitOutput.textContent = formatCard(payload);
      setStatus('Card saved locally.');
    });

    els.markBtn.addEventListener('click', () => {
      const progress = readJson(storageKeys.progress) || { completed: {} };
      progress.completed = progress.completed || {};
      progress.completed[currentLesson.id] = {
        completeAt: new Date().toISOString(),
        lessonIndex: currentLesson.index
      };
      progress.currentIndex = currentLesson.index;
      progress.updatedAt = new Date().toISOString();
      safeSet(storageKeys.progress, progress);

      els.markBtn.textContent = 'Lesson already complete';
      els.markBtn.disabled = true;
      setStatus(`Lesson ${currentLesson.index} marked complete. ${totalDone(progress)} / ${allLessons.length} done.`);
      renderProgressSummary();
      setTimeout(() => {
        window.location.href = 'index.html#path';
      }, 500);
    });
  }

  function totalDone(progress) {
    return Object.keys(progress.completed || {}).length;
  }

  function renderProgressSummary() {
    const progress = readJson(storageKeys.progress) || { completed: {} };
    const done = totalDone(progress);
    const total = allLessons.length;
    const percent = Math.round((done / total) * 100);
    if (els.progressCopy) {
      els.progressCopy.textContent = `Lesson ${lessonSlug}: ${done}/${total} complete (${percent}%) in local V2 path.`;
    }
  }

  function setStatus(message) {
    els.status.textContent = message;
  }

  function copyText(text) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setStatus('Prompt copied. Paste it into your AI tool, run it, then return here to capture your best version.');
      }).catch(() => fallbackCopy(text));
      return;
    }
    fallbackCopy(text);
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(ta);
    setStatus(copied ? 'Prompt copied.' : 'Could not copy automatically. Select and copy from prompt area.');
  }

  function formatCard(item) {
    return [
      `Lesson ${item.lessonIndex}: ${item.lessonTitle}`,
      `Profile: ${profileLabel(item.profile)}`,
      '',
      item.line1 || '-',
      item.line2 || '-',
      item.line3 || '-',
      item.line4 || '-',
      '',
      `Saved: ${new Date(item.createdAt).toLocaleString()}`
    ].join('\n');
  }

  function profileLabel(value) {
    return {
      student: 'Student',
      adult: 'Adult beginner',
      builder: 'Builder / coder',
      teacher: 'Educator',
      creative: 'Creative / personal'
    }[value] || 'Student';
  }

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (_e) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      return true;
    } catch (_e) {
      return false;
    }
  }

  function readJson(key) {
    const raw = safeGet(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (_e) {
      return null;
    }
  }
})();
