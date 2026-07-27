(() => {
  const capabilityGrid = document.querySelector('#capabilityGrid');
  const milestoneGrid = document.querySelector('#milestoneGrid');
  const rotation = document.querySelector('#badgeRotation');
  if (!capabilityGrid || !milestoneGrid || !rotation) return;

  const EARNED_KEY = 'learningai-achievements-v2';
  const RHYTHM_KEY = 'learningai-learning-rhythm-v1';
  const selectedName = document.querySelector('#selectedBadgeName');
  /* The turn control now sits with the medals, so it names the medal it turns
     rather than relying on a heading two panels away. */
  const turnTargetName = document.querySelector('#turnTargetName');
  const selectedDetailName = document.querySelector('#selectedBadgeDetailName');
  const selectedMeaning = document.querySelector('#selectedBadgeMeaning');
  const selectedRequirement = document.querySelector('#selectedBadgeRequirement');
  const selectedStatus = document.querySelector('#selectedBadgeStatus');
  const selectedEarned = document.querySelector('#selectedBadgeEarned');
  const rotationValue = document.querySelector('#badgeRotationValue');
  const showFront = document.querySelector('#badgeShowFront');
  const showBack = document.querySelector('#badgeShowBack');
  const capabilityCount = document.querySelector('#capabilityEarnedCount');
  const milestoneCount = document.querySelector('#milestoneEarnedCount');
  const poses = new WeakMap();
  let activeObject = null;

  const capabilities = [
    ['arc-1', 'First Signal', 'Explain what prediction is and choose when not to trust it.', 5, './badges/faces/arc-01-first-signal', '#2d9c94'],
    ['arc-2', 'Pattern Seeker', 'Give AI a clear goal, useful context, and boundaries.', 10, './badges/faces/arc-02-pattern-seeker', '#ea6f5f'],
    ['arc-3', 'Better Questions', 'Ask a question that exposes uncertainty instead of hiding it.', 15, './badges/faces/arc-03-better-questions', '#8668d5'],
    ['arc-4', 'Truth Check', 'Check an important claim outside the model.', 20, './badges/faces/arc-04-truth-check', '#81bcca'],
    ['arc-5', 'Context Keeper', 'Decide what AI may remember and what must remain private.', 25, './badges/faces/arc-05-context-keeper', '#6e8f70'],
    ['arc-6', 'Human Judgment', 'Make and explain the final human decision.', 30, './badges/faces/arc-06-human-judgment', '#c7903b'],
    ['arc-7', 'Privacy Boundary', 'Remove sensitive data and set a safe information boundary.', 35, './badges/faces/arc-07-privacy-boundary', '#d76557'],
    ['arc-8', 'Workflow Builder', 'Build a repeatable workflow with a human approval point.', 40, './badges/faces/arc-08-workflow-builder', '#318f8d'],
    ['arc-9', 'Agent Director', 'Direct an agent while keeping scope, review, and stop controls.', 45, './badges/faces/arc-09-agent-director', '#7b61b8'],
    ['arc-10', 'Control Remains Yours', 'Complete a goal with AI while preserving authorship and control.', 50, './badges/faces/arc-10-control-remains-yours', '#b58c45']
  ].map(([id, name, meaning, target, art, color]) => ({ id, name, meaning, target, art, color, kind: 'capability' }));

  /* The four timed pins used to be elapsed minutes and nothing else, which a
     learner could collect by pressing Start and walking away. The panel above
     promises the opposite — "a practical human capability you practised, not
     time served" — and the timer cannot tell learning from an open tab: focus.js
     counts wall-clock seconds while it runs and only stops after ten minutes
     with no interaction *anywhere on the page*, so a scroll every nine minutes
     accumulates hours. Rather than soften the promise, each of the four now
     needs the focused time AND work the code can genuinely see: a lesson step
     recorded by lesson.html / lesson-one.html, or a finished lesson. The names
     and the artwork are unchanged; only what qualifies is. Awards already
     engraved under the old rule are left alone — nothing is taken back. */
  const milestones = [
    ['first-lesson', 'First Lesson', 'Finished your first guided lesson.', 'lessons', 1, '12% 25%', '#ef5b58'],
    ['first-arc', 'First Arc', 'Proved the first complete capability.', 'lessons', 5, '35% 25%', '#57a477'],
    ['halfway', 'Halfway', 'Completed 25 of 50 lessons.', 'lessons', 25, '61% 25%', '#db9a42'],
    ['course-complete', 'Course Complete', 'Completed the full 50-lesson path.', 'lessons', 50, '86% 25%', '#54a8b8'],
    /* Scoped to today, not to all time: finishing the free first lesson is a
       precondition of reaching this page, so an all-time "one lesson step"
       clause would already be true for every learner who can see the pin and
       would prove nothing. */
    ['first-five', 'First Five', 'Five focused minutes on a day you worked in a lesson.', 'totalSeconds', 5 * 60, '12% 52%', '#ee6c76',
      { metric: 'lessonStepsToday', target: 1, text: 'a lesson step completed today', unit: 'lesson steps today', unitOne: 'lesson step today' }],
    ['focus-25', 'Focus 25', 'The 25-minute checkpoint, on a day you did real work.', 'todaySeconds', 25 * 60, '35% 52%', '#9d6bd1',
      { metric: 'lessonStepsToday', target: 1, text: 'a lesson step completed today', unit: 'lesson steps today', unitOne: 'lesson step today' }],
    /* Two finished lessons, not one: the free first lesson is a precondition of
       reaching this page at all, so a one-lesson clause would be satisfied
       before the timer had counted a second and would prove nothing. */
    ['one-hour', 'One Hour', 'An hour of focused learning and two lessons finished.', 'totalSeconds', 60 * 60, '61% 52%', '#39a9b8',
      { metric: 'lessons', target: 2, text: 'two finished lessons', unit: 'lessons' }],
    ['five-hours', 'Five Hours', 'Five hours of focused learning and five lessons finished.', 'totalSeconds', 5 * 60 * 60, '86% 52%', '#d69d38',
      { metric: 'lessons', target: 5, text: 'five finished lessons', unit: 'lessons' }],
    ['first-return', 'First Return', 'Came back for another learning session.', 'sessions', 2, '12% 78%', '#42a8c0'],
    ['five-sessions', 'Five Sessions', 'Returned for five separate sessions.', 'sessions', 5, '35% 78%', '#dc7666'],
    ['first-note', 'First Note', 'Saved your first optional learning note.', 'notes', 1, '61% 78%', '#d3a23d'],
    ['first-project', 'First Project', 'Completed your first practical project.', 'projects', 1, '86% 78%', '#4a98ae']
  ].map(([id, name, meaning, metric, target, sprite, color, also]) => ({ id, name, meaning, metric, target, sprite, color, also, kind: 'milestone' }));

  function readJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function rhythmSnapshot() {
    const state = readJSON(RHYTHM_KEY, {});
    const running = Boolean(state.running);
    const lastActive = Number(state.lastActivityAt || Date.now());
    const end = Math.min(Date.now(), lastActive + (10 * 60 * 1000));
    const live = running ? Math.max(0, Math.floor((end - Number(state.startedAt || end)) / 1000)) : 0;
    return {
      todaySeconds: Number(state.secondsToday || 0) + live,
      totalSeconds: Number(state.totalSeconds || 0) + live,
      sessions: Number(state.sessions || 0)
    };
  }

  /* focus.js keys its day the same way; a pin that says "today" and a timer that
     says "today" must roll over at the same moment. */
  const dayKey = value => {
    const date = new Date(value ?? Date.now());
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-CA');
  };

  /* The only records of work actually done inside a lesson. lesson.html writes
     learningai-lesson-draft:<id> with a `steps` map as the learner advances and
     archives it into learningai-lesson-evidence when the lesson is finished;
     lesson-one.html keeps its own draft with a `current` step number. Nothing
     here is inferred from time — every count comes from a step the learner
     actually completed and the timestamp on the record that holds it. */
  function lessonWork() {
    const today = dayKey();
    let steps = 0;
    let stepsToday = 0;
    const add = (count, when) => {
      if (count <= 0) return;
      steps += count;
      if (dayKey(when) === today) stepsToday += count;
    };
    const stepCount = value => (value && typeof value === 'object' ? Object.keys(value).length : 0);
    const evidence = readJSON('learningai-lesson-evidence', []);
    if (Array.isArray(evidence)) evidence.forEach(record => add(stepCount(record?.steps), record?.completedAt));
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = String(localStorage.key(index));
      if (!key.startsWith('learningai-lesson-draft:')) continue;
      const draft = readJSON(key, null);
      add(stepCount(draft?.steps), draft?.updatedAt);
    }
    /* lesson-one keeps no per-step map, only which step it is on, so the steps
       behind the learner are `current - 1`. */
    const first = readJSON('learningai-lesson-one-draft-v2', null);
    if (first) add(Math.max(0, Number(first.current || 1) - 1), first.updatedAt);
    return { steps, stepsToday };
  }

  function noteCount() {
    const toolkit = readJSON('learningai-toolkit', []);
    let notebooks = 0;
    for (let index = 0; index < localStorage.length; index += 1) {
      if (String(localStorage.key(index)).startsWith('learningai-v2-lesson-notes:')) notebooks += 1;
    }
    return (Array.isArray(toolkit) ? toolkit.length : 0) + notebooks;
  }

  function projectCount() {
    const values = [
      readJSON('learningai-project-completions', []),
      readJSON('learningai-completed-projects', []),
      readJSON('learningai-projects', [])
    ];
    return values.reduce((count, value) => {
      if (Array.isArray(value)) return Math.max(count, value.length);
      if (value && typeof value === 'object') return Math.max(count, Object.values(value).filter(Boolean).length);
      return count;
    }, 0);
  }

  function courseSnapshot() {
    return window.LearningAICourseState?.snapshot?.() || { completed: {}, completedCount: 0 };
  }

  function metricSnapshot() {
    const course = courseSnapshot();
    const completed = course.completed || {};
    const work = lessonWork();
    const today = dayKey();
    const finishedToday = Object.values(completed).filter(entry => dayKey(entry?.completedAt) === today).length;
    return {
      lessons: Number(course.completedCount || 0),
      /* A finished lesson is worth at least a lesson's-worth of steps even when
         its draft has been archived away or the record predates the evidence
         log — otherwise the floor would fall below what we already know. */
      lessonSteps: Math.max(work.steps, Number(course.completedCount || 0)),
      lessonStepsToday: Math.max(work.stepsToday, finishedToday),
      notes: noteCount(),
      projects: projectCount(),
      ...rhythmSnapshot(),
      completed
    };
  }

  function readEarned() {
    return readJSON(EARNED_KEY, {});
  }

  function achievementMetric(item, metrics) {
    return item.kind === 'capability' ? metrics.lessons : Number(metrics[item.metric] || 0);
  }

  /* An award is earned when every clause of its requirement is met, not just the
     first. Time-based pins carry a second clause; everything else has one. */
  function meetsRequirement(item, metrics) {
    if (achievementMetric(item, metrics) < item.target) return false;
    if (!item.also) return true;
    return Number(metrics[item.also.metric] || 0) >= item.also.target;
  }

  function inferredTimestamp(item, metrics) {
    if (item.kind === 'capability' || item.metric === 'lessons') {
      const lessonNumber = item.kind === 'capability' ? item.target : item.target;
      const entry = metrics.completed[`chapter-${lessonNumber}`];
      if (entry?.completedAt) return entry.completedAt;
    }
    return new Date().toISOString();
  }

  function syncAwards() {
    const metrics = metricSnapshot();
    const earned = readEarned();
    let changed = false;
    [...capabilities, ...milestones].forEach(item => {
      if (!earned[item.id] && meetsRequirement(item, metrics)) {
        earned[item.id] = inferredTimestamp(item, metrics);
        changed = true;
      }
    });
    if (changed) localStorage.setItem(EARNED_KEY, JSON.stringify(earned));
    return { metrics, earned };
  }

  function stamp(value) {
    if (!value) return 'Not yet earned';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Earned';
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  }

  /* The short form engraved on the back of the object, where the type is under
     4px: the first clause only. The readable copy on the card and in the
     inspector carries the whole requirement. */
  function stampText(item, current, earnedAt) {
    if (earnedAt) return `Earned · ${stamp(earnedAt)}`;
    if (item.kind === 'capability' || item.metric === 'lessons') return `Locked · ${Math.min(current, item.target)} of ${item.target} lessons`;
    if (item.metric === 'totalSeconds' || item.metric === 'todaySeconds') {
      return `Locked · ${Math.min(Math.floor(current / 60), Math.floor(item.target / 60))} of ${Math.floor(item.target / 60)} minutes`;
    }
    return `Locked · ${Math.min(current, item.target)} of ${item.target}`;
  }

  /* A pin with two clauses has to show both, or a learner who has sat through
     the minutes is told only that the minutes are done and left wondering why
     nothing was awarded. */
  function progressText(item, current, earnedAt, metrics) {
    const base = stampText(item, current, earnedAt);
    if (earnedAt || !item.also || !metrics) return base;
    const have = Number(metrics[item.also.metric] || 0);
    return `${base} · ${Math.min(have, item.also.target)} of ${item.also.target} ${item.also.target === 1 ? (item.also.unitOne || item.also.unit) : item.also.unit}`;
  }

  function requirementText(item) {
    const base = primaryRequirementText(item);
    return item.also ? `${base}, plus ${item.also.text}` : base;
  }

  function primaryRequirementText(item) {
    if (item.kind === 'capability' || item.metric === 'lessons') {
      return `Complete ${item.target} ${item.target === 1 ? 'lesson' : 'lessons'}`;
    }
    if (item.metric === 'totalSeconds' || item.metric === 'todaySeconds') {
      const minutes = Math.floor(item.target / 60);
      return `${minutes} focused ${minutes === 1 ? 'minute' : 'minutes'}${item.metric === 'todaySeconds' ? ' today' : ''}`;
    }
    if (item.metric === 'sessions') return `Return for ${item.target} learning sessions`;
    if (item.metric === 'notes') return 'Save one optional learning note';
    if (item.metric === 'projects') return 'Complete one practical project';
    return `Reach ${item.target}`;
  }

  /* renderStatus runs every second and this panel is aria-live, so writing the
     same string back would have a screen reader re-announce the whole card once
     a second. Only touch the node when the text has actually changed. */
  function setText(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }

  function updateInspector(item) {
    if (!item) return;
    const { metrics, earned } = syncAwards();
    const current = achievementMetric(item, metrics);
    const earnedAt = earned[item.id];
    setText(selectedDetailName, item.name);
    setText(selectedMeaning, item.meaning);
    setText(selectedRequirement, requirementText(item));
    setText(selectedStatus, progressText(item, current, earnedAt, metrics));
    /* "Earned date appears here" was placeholder copy that every learner saw,
       because nothing is engraved until a badge is actually earned. Say what is
       true and what would change it. */
    setText(selectedEarned, earnedAt
      ? `First earned ${stamp(earnedAt)}`
      : `Not engraved yet — ${requirementText(item)}`);
  }

  /* 24 staves, one every 15deg. The matching geometry constants live in
     achievement-vault.css (.achievement-edge i): change one and change both. */
  const EDGE_STAVES = 24;
  const RAD = Math.PI / 180;

  /* The medal only ever turns about its vertical axis, so a stave keeps its
     place on the screen for the whole turn — the one at the top stays at the
     top. Its tone is therefore a fixed material property and can be baked once.
     rotateZ(0) sits on the right and angles run clockwise, so a light at the
     upper left of the screen sits at 225deg. */
  function staveTint(index) {
    const lit = Math.cos((index * (360 / EDGE_STAVES) - 225) * RAD);
    const alpha = Math.round(Math.abs(lit) * (lit > 0 ? .36 : .34) * 255);
    return `${lit > 0 ? '#ffffff' : '#161a19'}${alpha.toString(16).padStart(2, '0')}`;
  }

  function edgeMarkup() {
    let staves = '';
    for (let index = 0; index < EDGE_STAVES; index += 1) {
      staves += `<i style="--slice:${index};--facet-tint:${staveTint(index)}"></i>`;
    }
    return `<span class="achievement-edge" aria-hidden="true">${staves}</span>`;
  }

  function objectMarkup(item) {
    const frontStyle = item.kind === 'capability'
      ? `--front-image:url('${item.art}-front.jpg');--back-image:url('${item.art}-back.jpg')`
      : `--sprite-position:${item.sprite};--back-image:url('./badges/learningai-small-milestone-pin-backs-concept-v1.png');--back-size:650% 650%;--back-position:${item.sprite}`;
    return `
      <button class="achievement-object" type="button" data-achievement="${item.id}" data-face="front" aria-pressed="false" aria-describedby="selectedBadgeMeaning selectedBadgeStatus">
        <span class="achievement-stage" aria-hidden="true">
          <span class="achievement-coin" style="${frontStyle}">
            ${edgeMarkup()}
            <span class="achievement-face achievement-front ${item.kind === 'milestone' ? 'milestone-front' : ''}"></span>
            <span class="achievement-face achievement-back ${item.kind === 'milestone' ? 'milestone-back' : ''}">
              <span class="engraving-plate">
                <strong>${item.name}</strong>
                <time data-earned-stamp>Not yet earned</time>
              </span>
            </span>
          </span>
        </span>
        <span class="turn-hint" aria-hidden="true">Tap to flip <b>⇄</b></span>
      </button>
      <div class="achievement-copy">
        <strong>${item.name}</strong>
        <span>${item.meaning}</span>
        <small data-achievement-progress>Locked</small>
      </div>`;
  }

  function buildGrid(grid, items, className) {
    /* The number is on the card, not only on the artwork, so the whole set can
       be read at a glance instead of one medal at a time. */
    grid.innerHTML = items.map((item, index) => `<article class="achievement-item ${className}" data-card="${item.id}" style="--accent:${item.color}"><span class="item-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>${objectMarkup(item)}</article>`).join('');
  }

  /* A rainbow strip standing in for the whole collection: every award has a
     segment whether or not it is scrolled into view, the segment is coloured
     and filled by its own accent once earned, and pressing one brings that
     award to the middle of the rail. */
  function buildPreview(container, items) {
    if (!container) return;
    container.innerHTML = items.map((item, index) => `<button class="preview-chip" type="button" data-target="${item.id}" style="--accent:${item.color}" aria-label="${item.name}"><i aria-hidden="true"></i><span aria-hidden="true">${String(index + 1).padStart(2, '0')}</span></button>`).join('');
  }

  function railFor(container) {
    return container?.closest('.vault-panel')?.querySelector('.vault-rail') || null;
  }

  /* Two things at once: which awards are currently scrolled into view, and
     which one the inspector below is describing. */
  function syncPreview(container) {
    const rail = railFor(container);
    if (!container || !rail) return;
    const cards = [...rail.querySelectorAll('.achievement-item')];
    const chips = [...container.querySelectorAll('.preview-chip')];
    if (!cards.length || !chips.length) return;
    const railBox = rail.getBoundingClientRect();
    cards.forEach((card, index) => {
      const chip = chips[index];
      if (!chip) return;
      const box = card.getBoundingClientRect();
      chip.classList.toggle('is-visible', box.left >= railBox.left - 2 && box.right <= railBox.right + 2);
      const selected = card.classList.contains('is-selected');
      chip.classList.toggle('is-current', selected);
      if (selected) chip.setAttribute('aria-current', 'true');
      else chip.removeAttribute('aria-current');
    });
  }

  function syncPreviews() {
    document.querySelectorAll('.rail-preview').forEach(syncPreview);
  }

  function wirePreview(container) {
    if (!container) return;
    const rail = railFor(container);
    container.addEventListener('click', event => {
      const chip = event.target.closest('.preview-chip');
      if (!chip) return;
      const card = document.querySelector(`[data-card="${chip.dataset.target}"]`);
      if (!card) return;
      card.scrollIntoView({ inline: 'center', block: 'nearest', behavior: motionMode() === 'standard' ? 'smooth' : 'auto' });
      const object = card.querySelector('.achievement-object');
      if (object) { selectObject(object); object.focus({ preventScroll: true }); }
      syncPreview(container);
    });
    rail?.addEventListener('scroll', () => syncPreview(container), { passive: true });
    rail?.addEventListener('scrollend', () => syncPreview(container), { passive: true });
    window.addEventListener('resize', () => syncPreview(container), { passive: true });
  }

  /* normalizedDegrees() and faceFor() lived here to work out which face was
     showing after a drag had left the medal at an arbitrary angle. Nothing can
     produce an arbitrary angle any more, so the face is simply the state we put
     it in and both helpers have gone.

     Two states and no third. The control used to run -180…0…180 with the scale
     reading Back / Front / Back, so "Front" was the middle of the track and the
     medal's resting position looked like a mid-turn parking spot rather than a
     face. There is now one stop for each face and nothing between them. */
  const FACE_ANGLE = { front: 0, back: 180 };
  const faceLabel = face => (face === 'back' ? 'Back' : 'Front');
  const faceOfValue = value => (Number(value) >= 1 ? 'back' : 'front');

  function motionMode() {
    const mode = document.documentElement.dataset.motion;
    if (mode === 'none' || mode === 'reduced' || mode === 'standard') return mode;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'standard';
  }

  /* Every turn is now 180deg or nothing, but the duration still follows the
     angle travelled: asking for the face already showing costs no time, so
     pressing "Show front" twice does not replay the animation. Reduced motion
     keeps the turn but shortens it; "none" cuts straight to the face. */
  function turnDuration(travel) {
    const mode = motionMode();
    if (mode === 'none') return 0;
    const base = Math.min(660, 170 + Math.min(360, Math.abs(travel)) * 2.6);
    return Math.round(mode === 'reduced' ? Math.min(240, base * .4) : base);
  }

  /* A highlight that stays put while the object turns is the thing that breaks
     the illusion, so the light is fixed to the screen and the medal moves under
     it. For a slightly domed face the hot spot sits where the surface normal
     bisects eye and light, which after a turn of `y` puts it at
     -(0.23·cos y + 1.04·sin y) across the face: just left of centre at rest,
     sliding off the edge as the face turns away. The back face is mirrored by
     its own rotateY(180deg), which cancels the sign, so one value serves both.
     The rim brightens as it swings side-on and catches the light. */
  function applyLight(object, y) {
    const angle = y * RAD;
    const across = Math.max(-1.15, Math.min(1.15, -((.23 * Math.cos(angle)) + (1.04 * Math.sin(angle)))));
    const facing = Math.abs(Math.cos(angle));
    const style = object.style;
    style.setProperty('--shine-x', `${(across * 30).toFixed(2)}%`);
    /* A constant: nothing tilts the medal any more, so there is no X pose left
       for the vertical component of the highlight to follow. */
    style.setProperty('--shine-y', '-6%');
    style.setProperty('--shine-a', (.14 + (.46 * Math.sqrt(facing))).toFixed(3));
    style.setProperty('--sheen', `${(150 - (Math.sin(angle) * 28)).toFixed(1)}deg`);
    style.setProperty('--edge-lum', (.04 + (.26 * Math.abs(Math.sin(angle)))).toFixed(3));
  }

  /* The only place a medal's angle is ever written, and it takes a face rather
     than a number of degrees. No call site can ask for 47deg, so no medal can
     be left edge-on or part-turned: the control, a tap, the two buttons and the
     first paint all arrive here with 'front' or 'back'. --rotate-x is written
     as a literal 0deg for the same reason — the drag that used to lean a medal
     while it was being turned has gone, and with it the only thing that ever
     wrote a non-zero X. */
  function setFace(object, face, animate = true) {
    const pose = poses.get(object);
    if (!pose) return;
    const next = FACE_ANGLE[face] ?? 0;
    object.style.setProperty('--turn-ms', `${animate ? turnDuration(Math.abs(next - pose.y)) : 0}ms`);
    pose.y = next;
    object.style.setProperty('--rotate-x', '0deg');
    object.style.setProperty('--rotate-y', `${next}deg`);
    applyLight(object, next);
    object.dataset.face = face;
    object.setAttribute('aria-pressed', String(face === 'back'));
    if (object === activeObject) syncControl(face);
  }

  function flip(object) {
    setFace(object, object.dataset.face === 'back' ? 'front' : 'back');
  }

  /* One control serves whichever medal is selected, so selecting a medal and
     turning one both end here. aria-valuetext carries the face to a screen
     reader — a raw "0" and "1" would be read out otherwise — and the visible
     <output> is no longer a live region: the slider announces its own value
     change, and a tap on a medal announces through its aria-pressed. Two live
     announcements for one action is worse than none. */
  function syncControl(face) {
    const value = face === 'back' ? '1' : '0';
    if (rotation.value !== value) rotation.value = value;
    rotation.setAttribute('aria-valuetext', faceLabel(face));
    setText(rotationValue, faceLabel(face));
  }

  function selectObject(object) {
    activeObject = object;
    document.querySelectorAll('.achievement-item').forEach(card => card.classList.toggle('is-selected', card.contains(object)));
    const item = [...capabilities, ...milestones].find(entry => entry.id === object.dataset.achievement);
    selectedName.textContent = item?.name || 'badge';
    if (turnTargetName) turnTargetName.textContent = item?.name || 'this medal';
    updateInspector(item);
    syncControl(object.dataset.face === 'back' ? 'back' : 'front');
    syncPreviews();
  }

  /* No pointer handlers at all. Turning is the slider's job now — "the slider
     is the only way they can turn it around, so they do not have to click and
     drag there" — so setPointerCapture, the primary-button check, the movement
     threshold and the five different ways a released drag used to settle onto a
     face are all gone with the gesture they existed to make safe. What is left
     is a plain button: it selects, and it flips. Enter and Space reach the click
     handler through the button's own activation behaviour, so there is no
     keydown handler either, and therefore no arrow-key nudge that could park a
     medal at 15deg. */
  function wireObject(object) {
    poses.set(object, { y: 0 });
    setFace(object, 'front', false);
    object.addEventListener('focus', () => selectObject(object));
    object.addEventListener('click', () => {
      selectObject(object);
      flip(object);
    });
  }

  function renderStatus() {
    const { metrics, earned } = syncAwards();
    let earnedCapabilities = 0;
    let earnedMilestones = 0;
    [...capabilities, ...milestones].forEach(item => {
      const card = document.querySelector(`[data-card="${item.id}"]`);
      if (!card) return;
      const current = achievementMetric(item, metrics);
      const earnedAt = earned[item.id];
      card.classList.toggle('is-earned', Boolean(earnedAt));
      card.classList.toggle('is-locked', !earnedAt);
      const object = card.querySelector('.achievement-object');
      const progress = progressText(item, current, earnedAt, metrics);
      object.setAttribute('aria-label', `${item.name}. ${item.meaning} ${progress}. Press Enter to flip it, or use the Front and Back slider below the collection.`);
      card.querySelector('[data-earned-stamp]').textContent = earnedAt ? stamp(earnedAt) : `To earn · ${stampText(item, current, earnedAt)}`;
      card.querySelector('[data-achievement-progress]').textContent = progress;
      const chip = document.querySelector(`.preview-chip[data-target="${item.id}"]`);
      if (chip) {
        chip.classList.toggle('is-earned', Boolean(earnedAt));
        chip.setAttribute('aria-label', `${item.name}. ${progress}. Show this one.`);
      }
      if (earnedAt && item.kind === 'capability') earnedCapabilities += 1;
      if (earnedAt && item.kind === 'milestone') earnedMilestones += 1;
    });
    capabilityCount.textContent = String(earnedCapabilities);
    milestoneCount.textContent = String(earnedMilestones);
    const selectedItem = activeObject && [...capabilities, ...milestones].find(entry => entry.id === activeObject.dataset.achievement);
    updateInspector(selectedItem);
  }

  const capabilityPreview = document.querySelector('#capabilityPreview');
  const milestonePreview = document.querySelector('#milestonePreview');
  const vaultSwitch = document.querySelector('.vault-switch');
  const switchOptions = [...document.querySelectorAll('.switch-option')];

  function collectionOf(tab) {
    return String(tab.getAttribute('aria-controls') || '').replace('Panel', '');
  }

  /* One collection is shown at a time. The milestone set used to live in a
     separate collapsed panel, so half the awards on the page were behind a
     click and the two vaults together made the page feel stacked. */
  function activateCollection(name, moveFocus, userInitiated) {
    switchOptions.forEach(tab => {
      const mine = collectionOf(tab) === name;
      tab.setAttribute('aria-selected', String(mine));
      tab.tabIndex = mine ? 0 : -1;
      const panel = document.querySelector(`#${tab.getAttribute('aria-controls')}`);
      if (panel) panel.hidden = !mine;
      if (mine && moveFocus) tab.focus();
    });
    document.querySelectorAll('.vault-count').forEach(count => {
      count.hidden = count.dataset.countFor !== name;
    });
    if (vaultSwitch) vaultSwitch.dataset.active = name;
    /* Switching collections moves the inspector with you: it would otherwise
       keep describing an award that is no longer on screen. */
    if (userInitiated) {
      const first = document.querySelector(`#${name}Panel .achievement-object`);
      if (first) selectObject(first);
    }
    syncPreview(name === 'milestone' ? milestonePreview : capabilityPreview);
  }

  switchOptions.forEach((tab, index) => {
    tab.addEventListener('click', () => activateCollection(collectionOf(tab), false, true));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0
        : event.key === 'End' ? switchOptions.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : switchOptions.length - 1)) % switchOptions.length;
      activateCollection(collectionOf(switchOptions[next]), true, true);
    });
  });

  buildGrid(capabilityGrid, capabilities, 'capability-item');
  buildGrid(milestoneGrid, milestones, 'milestone-item');
  buildPreview(capabilityPreview, capabilities);
  buildPreview(milestonePreview, milestones);
  wirePreview(capabilityPreview);
  wirePreview(milestonePreview);
  document.querySelectorAll('.achievement-object').forEach(wireObject);
  selectObject(document.querySelector('.achievement-object'));
  if (vaultSwitch) activateCollection('capability', false);
  syncPreviews();

  /* A range with two steps cannot be left between them. The browser snaps the
     value to 0 or 1 for a pointer drag, a click anywhere on the track, an arrow
     key, Home and End alike, so there is nothing to settle on release and no
     state in which a medal is edge-on — the whole `settleRotation` apparatus
     that used to catch a thumb dropped at 90° has no case left to catch. */
  rotation.addEventListener('input', () => {
    if (activeObject) setFace(activeObject, faceOfValue(rotation.value));
  });

  showFront?.addEventListener('click', () => {
    if (!activeObject) return;
    setFace(activeObject, 'front');
    activeObject.focus();
  });

  showBack?.addEventListener('click', () => {
    if (!activeObject) return;
    setFace(activeObject, 'back');
    activeObject.focus();
  });

  window.addEventListener('learningai:rhythm', renderStatus);
  window.addEventListener('learningai:progress', renderStatus);
  window.addEventListener('storage', renderStatus);
  setInterval(renderStatus, 1000);
  renderStatus();
})();
