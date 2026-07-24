(() => {
  const root = document.querySelector('.learning-rhythm');
  if (!root) return;

  const STORAGE_KEY = 'learningai-learning-rhythm-v1';
  const GOAL_SECONDS = 25 * 60;
  const today = new Date().toLocaleDateString('en-CA');
  const IDLE_LIMIT_SECONDS = 10 * 60;
  const defaults = { date: today, secondsToday: 0, totalSeconds: 0, sessions: 0, lastSessionTotalSeconds: 0, activeServerSessionId: '', goalDays: 0, goalRecordedFor: '', running: false, startedAt: 0, lastActivityAt: 0, pauseReason: '' };
  let state;

  try { state = { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
  catch { state = { ...defaults }; }

  if (state.date !== today) {
    state.date = today;
    state.secondsToday = 0;
    state.running = false;
    state.startedAt = 0;
  }

  const toggle = document.querySelector('#focusToggle');
  const finish = document.querySelector('#focusFinish');
  const clock = document.querySelector('#focusClock');
  const ring = document.querySelector('#focusRingValue');
  const feedback = document.querySelector('#focusFeedback');
  const count = document.querySelector('#badgeCount');
  const shelf = document.querySelector('#badgeShelf');
  const detail = document.querySelector('#badgeDetail');
  const circumference = 2 * Math.PI * 66;
  ring.style.strokeDasharray = String(circumference);

  const badgeDefinitions = {
    'first-lesson': { name: 'First Lesson', description: 'You completed the first guided lesson and made a decision with AI without handing over control.', target: 1, metric: () => window.LearningAICourseState?.snapshot?.().completedCount || 0, unit: 'lesson' },
    'first-five': { name: 'First Five', description: 'Your first five focused minutes turn intention into practice.', target: 5 * 60, metric: () => totalSeconds(), unit: 'minutes' },
    'focus-25': { name: 'Focus 25', description: 'You reached the recommended daily learning goal without rushing.', target: GOAL_SECONDS, metric: () => secondsToday(), unit: 'minutes' },
    'one-hour': { name: 'One Hour', description: 'You have returned to a focused learning routine for one hour in total.', target: 60 * 60, metric: () => totalSeconds(), unit: 'minutes' },
    'five-sessions': { name: 'Five Sessions', description: 'You returned to the work five separate times.', target: 5, metric: () => state.sessions, unit: 'sessions' }
  };

  function liveElapsed() {
    const end = Math.min(Date.now(), Number(state.lastActivityAt || Date.now()) + IDLE_LIMIT_SECONDS * 1000);
    return state.running ? Math.max(0, Math.floor((end - state.startedAt) / 1000)) : 0;
  }

  function secondsToday() { return state.secondsToday + liveElapsed(); }
  function totalSeconds() { return state.totalSeconds + liveElapsed(); }
  const newSessionId = () => crypto.randomUUID?.() || `focus-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  async function syncCompletedSession(sessionSeconds, clientSessionId) {
    if (!clientSessionId || sessionSeconds < 60) return;
    const result = await window.LearningAIAPI.queueMinutes({
      minutes: Math.max(1, Math.round(sessionSeconds / 60)),
      clientSessionId
    });
    feedback.textContent = result.ok
      ? 'Session saved to your LearningAI account.'
      : 'Session saved on this device. It will sync when the connection returns.';
  }

  function commitElapsed() {
    if (!state.running) return;
    const elapsed = liveElapsed();
    state.secondsToday += elapsed;
    state.totalSeconds += elapsed;
    state.startedAt = Date.now();
  }

  function recordGoalDay() {
    if (secondsToday() >= GOAL_SECONDS && state.goalRecordedFor !== today) {
      state.goalRecordedFor = today;
      state.goalDays += 1;
    }
  }

  function save() {
    commitElapsed();
    recordGoalDay();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function pauseIfIdle() {
    if (!state.running || Date.now() - Number(state.lastActivityAt || Date.now()) < IDLE_LIMIT_SECONDS * 1000) return;
    commitElapsed(); state.running = false; state.startedAt = 0; state.pauseReason = 'away';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function recordActivity() {
    if (!state.running) return;
    state.lastActivityAt = Date.now(); state.pauseReason = '';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  }

  function badgeProgress(definition) {
    const current = definition.metric();
    const earned = current >= definition.target;
    const shownCurrent = definition.unit === 'minutes' ? Math.floor(current / 60) : current;
    const shownTarget = definition.unit === 'minutes' ? Math.floor(definition.target / 60) : definition.target;
    const unit = shownTarget === 1 ? definition.unit : `${definition.unit}s`;
    return { current, earned, label: `${Math.min(shownCurrent, shownTarget)} of ${shownTarget} ${unit}` };
  }

  function selectBadge(key) {
    const definition = badgeDefinitions[key];
    const progress = badgeProgress(definition);
    shelf.querySelectorAll('.learning-badge').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.badge === key)));
    detail.innerHTML = `<strong>${definition.name}</strong><span>${definition.description}</span><small>${progress.earned ? 'Earned' : progress.label}</small>`;
  }

  function render() {
    pauseIfIdle();
    const todaySeconds = secondsToday();
    const progress = Math.min(1, todaySeconds / GOAL_SECONDS);
    clock.textContent = formatTime(todaySeconds);
    ring.style.strokeDashoffset = String(circumference * (1 - progress));
    toggle.textContent = state.running ? 'Pause learning' : todaySeconds ? 'Resume learning' : 'Start learning';
    toggle.setAttribute('aria-pressed', String(state.running));
    feedback.textContent = state.running ? 'Learning time is being counted.' : state.pauseReason === 'away' ? 'Paused after 10 minutes without activity. Your time is saved.' : todaySeconds >= GOAL_SECONDS ? 'Daily recommendation reached. Well done.' : todaySeconds ? 'Paused. Your time is saved on this device.' : 'Ready when you are.';

    let earnedCount = 0;
    shelf.querySelectorAll('.learning-badge').forEach(button => {
      const progressState = badgeProgress(badgeDefinitions[button.dataset.badge]);
      button.classList.toggle('is-earned', progressState.earned);
      button.setAttribute('aria-label', `${badgeDefinitions[button.dataset.badge].name}: ${progressState.earned ? 'earned' : progressState.label}`);
      if (progressState.earned) earnedCount += 1;
    });
    count.textContent = String(earnedCount);
    const selected = shelf.querySelector('.learning-badge[aria-pressed="true"]');
    if (selected) selectBadge(selected.dataset.badge);
  }

  toggle.addEventListener('click', () => {
    if (state.running) {
      commitElapsed();
      state.running = false;
      state.startedAt = 0;
      feedback.textContent = 'Paused. Your time is saved on this device.';
    } else {
      state.activeServerSessionId ||= newSessionId();
      state.running = true;
      state.startedAt = Date.now();
      state.lastActivityAt = Date.now();
      state.pauseReason = '';
    }
    save();
    render();
  });

  finish?.addEventListener('click', () => {
    commitElapsed();
    const sessionSeconds = totalSeconds() - Number(state.lastSessionTotalSeconds || 0);
    const sessionId = state.activeServerSessionId || newSessionId();
    if (sessionSeconds < 60) {
      feedback.textContent = 'Learn for at least one minute before finishing a session.';
      render();
      return;
    }
    state.running = false;
    state.startedAt = 0;
    state.sessions += 1;
    state.lastSessionTotalSeconds = totalSeconds();
    state.activeServerSessionId = '';
    recordGoalDay();
    save();
    feedback.textContent = 'Session saved on this device. Syncing to your account…';
    render();
    void syncCompletedSession(sessionSeconds, sessionId);
  });

  shelf.addEventListener('click', event => {
    const button = event.target.closest('.learning-badge');
    if (button) selectBadge(button.dataset.badge);
  });

  if (state.running) state.lastActivityAt = Date.now();
  ['pointerdown','keydown','wheel','touchstart'].forEach(type => document.addEventListener(type, recordActivity, {passive:true}));

  window.addEventListener('pagehide', save);
  void window.LearningAIAPI.flushMinuteQueue();
  setInterval(render, 1000);
  render();
})();
