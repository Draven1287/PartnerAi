(() => {
  const LESSONS = Array.isArray(window.V2_LESSON_BLUEPRINT) ? window.V2_LESSON_BLUEPRINT : [];

  if (!LESSONS.length) {
    return;
  }

  const PROFILE_MODES = {
    student: { label: 'Student', actionLabel: 'stay in charge and learn first' },
    adult: { label: 'Adult beginner', actionLabel: 'learn efficiently and safely' },
    builder: { label: 'Builder / coder', actionLabel: 'design useful, testable prompts and workflows' },
    teacher: { label: 'Educator', actionLabel: 'facilitate without replacing judgment' },
    creative: { label: 'Creative / personal', actionLabel: 'keep originality and ownership in the loop' }
  };

  const STORAGE_KEYS = {
    profile: 'learningai-v2-profile',
    progress: 'learningai-v2-progress',
    cards: 'learningai-v2-toolkit-cards',
    sessionName: 'learningai-v2-session-name',
    sessionId: 'learningai-v2-session-id'
  };

  const els = {
    body: document.body,
    pathGrid: document.getElementById('path-grid'),
    profileMode: document.getElementById('profile-mode'),
    startPath: document.getElementById('start-path'),
    pathStatus: document.getElementById('progress-status'),
    pathProgressText: document.getElementById('path-progress'),
    pathFill: document.getElementById('progress-fill'),
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
    cardStack: document.getElementById('card-stack'),
    sessionNameInput: document.getElementById('session-name'),
    sessionStartBtn: document.getElementById('start-session'),
    sessionStatus: document.getElementById('session-status-text'),
    sessionActiveCount: document.getElementById('session-active-count'),
    sessionTotalTime: document.getElementById('session-total-time'),
    activeUserList: document.getElementById('active-user-list')
  };

  const defaultLesson = LESSONS[0];
  let selectedLesson = null;
  let selectedChoice = null;
  const state = readState();

  let activeTicker = null;
  let trackedSession = null;
  let heartbeatHandle = null;

  if (!els.lessonTitle || !els.startPath || !els.pathGrid) {
    // Lesson page may render with a different script.
    return;
  }

  setProfileModeFromState();
  bindEvents();
  renderPath();
  renderProgress();
  renderCardStack();
  renderPathIntro();
  hydrateSessionFromStorage();
  renderSessionControls();
  refreshActiveSessions();

  if (state.currentIndex) {
    loadLesson(indexFromLessonId(state.currentIndex) || 0);
  }

  if (els.sessionStartBtn) {
    heartbeatHandle = window.setInterval(heartbeatSession, 30000);
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        heartbeatSession(true);
      }
    });
  }

  window.addEventListener('beforeunload', () => {
    if (trackedSession?.sessionId && !trackedSession.localOnly) {
      const payload = {
        sessionId: trackedSession.sessionId,
        route: window.location.pathname,
        elapsedMs: getLocalElapsedMs()
      };
      navigator.sendBeacon?.('/api/session/end', JSON.stringify(payload));
    }
  });

  function hydrateSessionFromStorage() {
    if (!els.sessionNameInput) return;

    const name = safeGet(STORAGE_KEYS.sessionName);
    if (name) {
      els.sessionNameInput.value = name;
      els.pathStatus && updateStatus(`Saved session for ${name}. Click Start Session to resume tracking.`);
    }
  }

  function renderSessionControls() {
    const hasControls = trackedSession && trackedSession.name;
    if (!els.sessionStatus) return;

    if (!hasControls) {
      if (els.sessionNameInput?.value) {
        els.sessionStatus.textContent = `Ready to track: ${els.sessionNameInput.value}`;
      } else {
        els.sessionStatus.textContent = 'No active participant session.';
      }
      return;
    }

    if (trackedSession.localOnly) {
      els.sessionStatus.textContent = `${trackedSession.name} logged in locally (no backend).`;
    } else {
      const elapsed = formatSeconds(Math.round((Date.now() - trackedSession.startedAt) / 1000));
      els.sessionStatus.textContent = `${trackedSession.name} active · elapsed ${elapsed}`;
    }
  }

  function hydrateState() {
    const progress = readJson(STORAGE_KEYS.progress) || { completed: {}, currentIndex: 0 };
    state.profile = safeGet(STORAGE_KEYS.profile) || 'student';
    state.completed = progress.completed || {};
    state.currentIndex = progress.currentIndex || defaultLesson.id;
    state.cards = Array.isArray(readJson(STORAGE_KEYS.cards)) ? readJson(STORAGE_KEYS.cards) : [];
  }

  function readState() {
    const progress = readJson(STORAGE_KEYS.progress) || { completed: {} };
    const rawProfile = safeGet(STORAGE_KEYS.profile) || 'student';

    return {
      profile: PROFILE_MODES[rawProfile] ? rawProfile : 'student',
      completed: progress.completed || {},
      currentIndex: progress.currentIndex || LESSONS[0].id,
      cards: Array.isArray(readJson(STORAGE_KEYS.cards)) ? readJson(STORAGE_KEYS.cards) : []
    };
  }

  function bindEvents() {
    els.startPath.addEventListener('click', startPath);

    if (els.profileMode) {
      els.profileMode.addEventListener('change', (event) => {
        saveProfile(event.target.value);
      });
    }

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

    if (els.sessionStartBtn) {
      els.sessionStartBtn.addEventListener('click', startTrackingSession);
    }

    if (els.sessionNameInput) {
      els.sessionNameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          startTrackingSession();
        }
      });
    }
  }

  function renderPath() {
    if (!els.pathGrid) return;

    els.pathGrid.innerHTML = '';

    LESSONS.forEach((lesson, index) => {
      const row = document.createElement('div');
      row.className = 'path-card-row';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'path-card';
      btn.dataset.index = String(index);
      btn.textContent = `${lesson.index}. ${lesson.title}`;
      btn.addEventListener('click', () => loadLesson(index));
      if (state.completed[lesson.id]) {
        btn.classList.add('completed');
      }
      row.appendChild(btn);

      const link = document.createElement('a');
      link.className = 'lesson-link';
      link.href = `lesson.html?lesson=${lesson.slug}`;
      link.textContent = `Open lesson ${lesson.index}`;
      row.appendChild(link);

      els.pathGrid.appendChild(row);
    });
  }

  function renderProgress() {
    const done = Object.keys(state.completed || {}).length;
    const total = LESSONS.length;
    const percent = Math.max(0, Math.round((done / total) * 100));
    if (els.pathProgressText) {
      els.pathProgressText.textContent = `${done} / ${total} lessons completed (${percent}%)`;
    }
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
    const done = Object.keys(state.completed || {}).length;

    if (state.completed[lesson.id]) {
      updateStatus(`Selected: ${lesson.title}. Completed: ${done}/${LESSONS.length}.`);
    } else {
      updateStatus(`Selected: ${lesson.title}. ${profile.actionLabel}. You are at ${done} / ${LESSONS.length}.`);
    }
  }

  function setProfileModeFromState() {
    if (els.profileMode) {
      els.profileMode.value = PROFILE_MODES[state.profile] ? state.profile : 'student';
    }
  }

  function saveProfile(value) {
    state.profile = value;
    safeSet(STORAGE_KEYS.profile, value);
    updatePromptCopy();
    renderPathIntro();
  }

  function saveProgress() {
    const progress = {
      completed: state.completed,
      currentIndex: state.currentIndex || LESSONS[0].id,
      updatedAt: new Date().toISOString()
    };
    safeSet(STORAGE_KEYS.progress, progress);
  }

  function startPath() {
    if (selectedLesson === null) {
      loadLesson(0);
      updateStatus(`Profile set to ${PROFILE_MODES[state.profile].label}. Starting from lesson 1.`);
    }
  }

  function loadLesson(index) {
    const lesson = LESSONS[index];
    if (!lesson) return;

    selectedLesson = index;
    selectedChoice = null;
    state.currentIndex = lesson.id;

    els.lessonTitle.textContent = `${lesson.index}. ${lesson.title}`;
    els.lessonSubtitle.textContent = lesson.subtitle;

    const extracted = extractLessonChoices(lesson);
    els.weakCopy.textContent = extracted.weak.label;
    els.strongCopy.textContent = extracted.strong.label;
    els.feedback.textContent = `Profile: ${PROFILE_MODES[state.profile].label}. Select a stronger choice before completing.`;
    els.feedback.className = 'feedback';

    els.lessonPrompt.textContent = resolvePrompt(lesson);

    updateLessonButtons();
    updateStatus(`Selected lesson ${lesson.index} loaded.`);
    renderPath();
    renderPathIntro();
    saveProgress();
  }

  function extractLessonChoices(lesson) {
    const choices = Array.isArray(lesson.tryFirst?.choices) ? lesson.tryFirst.choices : [];
    const strong = choices.find((choice) => choice && choice.correct) || choices[choices.length - 1] || { label: 'No strong option set.' };
    const weak = choices.find((choice) => !choice.correct) || choices[0] || { label: 'No weak option set.' };
    return {
      strong: {
        label: strong.label || 'No strong option set.',
        feedback: strong.feedback || 'No strong feedback set.'
      },
      weak: {
        label: weak.label || 'No weak option set.',
        feedback: weak.feedback || 'No weak feedback set.'
      },
      all: choices
    };
  }

  function resolvePrompt(lesson) {
    const starter = lesson.prompt || lesson.saveTemplate?.line1 || '';
    if (typeof starter === 'string') {
      return starter;
    }

    if (typeof starter === 'object') {
      return starter[state.profile] || starter.student || Object.values(starter)[0] || '';
    }

    return 'No starter prompt yet for this lesson.';
  }

  function setChoice(choice) {
    if (selectedLesson === null) {
      updateStatus('Pick a lesson first. Click any lesson card.');
      return;
    }

    selectedChoice = choice;
    const lesson = LESSONS[selectedLesson];
    const extracted = extractLessonChoices(lesson);
    const bundle = choice === 'strong' ? extracted.strong : extracted.weak;

    els.feedback.textContent = `${choice === 'strong' ? 'Strong choice' : 'Weak choice'}: ${bundle.feedback}`;
    els.feedback.style.background = choice === 'strong' ? '#ecfdf5' : '#fff7ed';
    els.feedback.style.color = choice === 'strong' ? '#047857' : '#b45309';
    updateLessonButtons();
  }

  function markLessonComplete() {
    if (selectedLesson === null) {
      updateStatus('Pick a lesson first.');
      return;
    }

    const lesson = LESSONS[selectedLesson];
    if (!selectedChoice) {
      updateStatus(`Pick a weak or strong response for: ${lesson.title}.`);
      return;
    }

    if (selectedChoice === 'weak') {
      updateStatus('Please use the stronger response before marking complete. This keeps the learning path meaningful.');
      return;
    }

    state.completed[lesson.id] = {
      completedAt: new Date().toISOString(),
      choice: selectedChoice,
      profile: state.profile,
      index: lesson.index
    };

    saveProgress();
    updateLessonButtons();
    renderProgress();
    renderPath();
    renderPathIntro();

    const next = findNextIncompleteIndex();
    if (next === -1) {
      updateStatus('Great job. You finished all 30 lessons. Build the capstone in lesson 30.');
      return;
    }

    const nextLesson = LESSONS[next];
    updateStatus(`Saved. Next suggestion: lesson ${nextLesson.index} (${nextLesson.title}).`);
  }

  function findNextIncompleteIndex() {
    for (let i = 0; i < LESSONS.length; i += 1) {
      if (!state.completed[LESSONS[i].id]) {
        return i;
      }
    }
    return -1;
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
      els.completeLesson.disabled = !selectedChoice;
    }
  }

  function copyPromptText() {
    if (!els.lessonPrompt) return;
    const text = els.lessonPrompt.textContent.trim();
    if (!text) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        const prev = els.feedback.textContent;
        els.feedback.textContent = 'Prompt copied. Paste it into your AI tool, run it, then compare your result with your own check.';
        setTimeout(() => {
          els.feedback.textContent = prev;
        }, 2400);
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
      ? 'Prompt copied. If paste fails, select and copy from the prompt box below.'
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
    state.cards = cards.slice(0, 8);
    safeSet(STORAGE_KEYS.cards, state.cards);
    els.cardOutput.textContent = formatCard(payload);
    updateStatus('Study Coach card saved locally.');
    form.reset();
    renderCardStack();
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

  function updateStatus(message) {
    if (els.pathStatus) {
      els.pathStatus.textContent = message;
    }
  }

  function indexFromLessonId(lessonId) {
    if (!lessonId) return null;
    if (/^\d+$/.test(String(lessonId))) {
      const found = LESSONS.findIndex((lesson) => lesson.index === Number(lessonId));
      return found >= 0 ? found : null;
    }
    const found = LESSONS.findIndex((lesson) => lesson.id === lessonId || lesson.slug === lessonId);
    return found >= 0 ? found : null;
  }

  function startTrackingSession() {
    const name = (els.sessionNameInput?.value || '').trim();
    if (!name) {
      if (els.sessionStatus) {
        els.sessionStatus.textContent = 'Enter a name before starting session tracking.';
      }
      return;
    }

    safeSet(STORAGE_KEYS.sessionName, name);

    const payload = {
      name,
      route: window.location.pathname,
      device: navigator.userAgent
    };

    postSession('/api/session/start', payload)
      .then((resp) => {
        const sessionId = resp?.sessionId;
        if (!sessionId) {
          trackedSession = {
            sessionId: `local-${Date.now()}`,
            name,
            localOnly: true,
            startedAt: Date.now()
          };
          safeSet(STORAGE_KEYS.sessionId, trackedSession.sessionId);
          renderSessionControls();
          return;
        }

        trackedSession = {
          sessionId,
          name,
          localOnly: false,
          startedAt: Date.now(),
          lastHeartbeat: Date.now()
        };
        safeSet(STORAGE_KEYS.sessionId, sessionId);
        updateStatus('Session tracking started. Time and active users are now live.');
        renderSessionControls();
        heartbeatSession();
        refreshActiveSessions();
      });
  }

  function heartbeatSession(isHidden = false) {
    if (!trackedSession || !trackedSession.sessionId) return;
    if (trackedSession.localOnly) return;

    const elapsedMs = getLocalElapsedMs();
    postSession('/api/session/heartbeat', {
      sessionId: trackedSession.sessionId,
      name: trackedSession.name,
      route: window.location.pathname,
      elapsedMs
    });

    if (!isHidden && Math.random() < 0.25) {
      renderSessionControls();
    }
  }

  function getLocalElapsedMs() {
    if (!trackedSession || !trackedSession.startedAt) return 0;
    return Date.now() - trackedSession.startedAt;
  }

  function refreshActiveSessions() {
    if (activeTicker) window.clearInterval(activeTicker);
    activeTicker = window.setInterval(updateActiveUsers, 45000);
    updateActiveUsers();
  }

  function updateActiveUsers() {
    if (!els.sessionActiveCount && !els.sessionTotalTime && !els.activeUserList) return;

    fetch('/api/sessions/active?windowMs=120000')
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (!payload) return;
        const active = Array.isArray(payload.active) ? payload.active : [];
        if (els.sessionActiveCount) {
          els.sessionActiveCount.textContent = active.length ? `${active.length} active now` : 'No active users logged';
        }
        if (els.sessionTotalTime) {
          els.sessionTotalTime.textContent = `Community time: ${formatSeconds(Math.round((payload.totalTimeMs || 0) / 1000))}`;
        }
        if (els.activeUserList) {
          els.activeUserList.innerHTML = '';
          active.forEach((user) => {
            const item = document.createElement('li');
            item.textContent = `${user.name} · ${formatSeconds(Math.round((user.totalSeconds || 0)))} total`;
            els.activeUserList.appendChild(item);
          });
          if (!active.length) {
            const item = document.createElement('li');
            item.textContent = 'No live sessions found.';
            els.activeUserList.appendChild(item);
          }
        }
      })
      .catch(() => {
        if (els.sessionStatus && !trackedSession?.localOnly) {
          els.sessionStatus.textContent = 'Session API is unavailable. Run the V2 server (node v2-prototype/server.js).';
        }
      });
  }

  async function postSession(endpoint, body) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) return null;
      return response.json();
    } catch (_e) {
      return null;
    }
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

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) {
      return `${h}h ${m}m ${seconds}s`;
    }
    return `${m}m ${seconds}s`;
  }
})();
