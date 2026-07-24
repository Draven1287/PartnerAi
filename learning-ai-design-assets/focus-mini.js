(() => {
  const widgets = [...document.querySelectorAll('[data-focus-mini]')];
  if (!widgets.length) return;

  const STORAGE_KEY = 'learningai-learning-rhythm-v1';
  const GOAL_SECONDS = 25 * 60;
  const today = new Date().toLocaleDateString('en-CA');
  const IDLE_LIMIT_SECONDS = 10 * 60;
  const defaults = {date:today,secondsToday:0,totalSeconds:0,sessions:0,goalDays:0,goalRecordedFor:'',running:false,startedAt:0,lastActivityAt:0,pauseReason:''};
  let state;
  try { state = {...defaults,...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')}; }
  catch { state = {...defaults}; }
  if (state.date !== today) state = {...state,date:today,secondsToday:0,running:false,startedAt:0};

  if (state.running) state.lastActivityAt = Date.now();
  const elapsed = () => state.running ? Math.max(0,Math.floor((Math.min(Date.now(),Number(state.lastActivityAt||Date.now())+IDLE_LIMIT_SECONDS*1000)-state.startedAt)/1000)) : 0;
  const secondsToday = () => Number(state.secondsToday || 0) + elapsed();
  const commit = () => {
    if (!state.running) return;
    const seconds = elapsed();
    state.secondsToday = Number(state.secondsToday || 0) + seconds;
    state.totalSeconds = Number(state.totalSeconds || 0) + seconds;
    state.startedAt = Date.now();
  };
  const save = () => { commit(); localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); };
  const pauseIfIdle = () => { if (!state.running || Date.now()-Number(state.lastActivityAt||Date.now()) < IDLE_LIMIT_SECONDS*1000) return; commit(); state.running=false; state.startedAt=0; state.pauseReason='away'; localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); };
  const recordActivity = () => { if (!state.running) return; state.lastActivityAt=Date.now(); state.pauseReason=''; localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); };
  const format = seconds => `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;

  function render() {
    pauseIfIdle();
    const seconds = secondsToday();
    const progress = Math.min(1,seconds/GOAL_SECONDS);
    widgets.forEach(widget => {
      const ring = widget.querySelector('[data-focus-ring]');
      const clock = widget.querySelector('[data-focus-clock]');
      const toggle = widget.querySelector('[data-focus-toggle]');
      const status = widget.querySelector('[data-focus-status]');
      const circumference = 2 * Math.PI * 22;
      if (ring) {
        ring.style.strokeDasharray = String(circumference);
        ring.style.strokeDashoffset = String(circumference * (1-progress));
      }
      if (clock) clock.textContent = format(seconds);
      if (toggle) {
        toggle.textContent = state.running ? 'Pause' : seconds ? 'Resume' : 'Start focus';
        toggle.setAttribute('aria-pressed',String(state.running));
      }
      if (status) status.textContent = state.running ? 'Learning time is being counted.' : state.pauseReason === 'away' ? 'Paused after 10 minutes without activity.' : seconds >= GOAL_SECONDS ? 'Today’s recommended focus reached.' : seconds ? 'Paused and saved on this device.' : 'A 25-minute checkpoint is recommended.';
    });
  }

  widgets.forEach(widget => widget.querySelector('[data-focus-toggle]')?.addEventListener('click',() => {
    if (state.running) { commit(); state.running = false; state.startedAt = 0; }
    else { state.running = true; state.startedAt = Date.now(); state.lastActivityAt = Date.now(); state.pauseReason = ''; }
    save(); render();
  }));
  window.addEventListener('storage',event => { if (event.key === STORAGE_KEY) { try { state = {...defaults,...JSON.parse(event.newValue || '{}')}; } catch {} render(); } });
  ['pointerdown','keydown','wheel','touchstart'].forEach(type => document.addEventListener(type,recordActivity,{passive:true}));
  window.addEventListener('pagehide',save);
  setInterval(render,1000);
  render();
})();
