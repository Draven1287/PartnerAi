(() => {
  const capabilityGrid = document.querySelector('#capabilityGrid');
  const milestoneGrid = document.querySelector('#milestoneGrid');
  const rotation = document.querySelector('#badgeRotation');
  if (!capabilityGrid || !milestoneGrid || !rotation) return;

  const EARNED_KEY = 'learningai-achievements-v2';
  const RHYTHM_KEY = 'learningai-learning-rhythm-v1';
  const selectedName = document.querySelector('#selectedBadgeName');
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

  const milestones = [
    ['first-lesson', 'First Lesson', 'Finished your first guided lesson.', 'lessons', 1, '12% 25%', '#ef5b58'],
    ['first-arc', 'First Arc', 'Proved the first complete capability.', 'lessons', 5, '35% 25%', '#57a477'],
    ['halfway', 'Halfway', 'Completed 25 of 50 lessons.', 'lessons', 25, '61% 25%', '#db9a42'],
    ['course-complete', 'Course Complete', 'Completed the full 50-lesson path.', 'lessons', 50, '86% 25%', '#54a8b8'],
    ['first-five', 'First Five', 'Focused for your first five minutes.', 'totalSeconds', 5 * 60, '12% 52%', '#ee6c76'],
    ['focus-25', 'Focus 25', 'Reached the suggested 25-minute checkpoint.', 'todaySeconds', 25 * 60, '35% 52%', '#9d6bd1'],
    ['one-hour', 'One Hour', 'Built one hour of focused learning.', 'totalSeconds', 60 * 60, '61% 52%', '#39a9b8'],
    ['five-hours', 'Five Hours', 'Built five hours of focused learning.', 'totalSeconds', 5 * 60 * 60, '86% 52%', '#d69d38'],
    ['first-return', 'First Return', 'Came back for another learning session.', 'sessions', 2, '12% 78%', '#42a8c0'],
    ['five-sessions', 'Five Sessions', 'Returned for five separate sessions.', 'sessions', 5, '35% 78%', '#dc7666'],
    ['first-note', 'First Note', 'Saved your first optional learning note.', 'notes', 1, '61% 78%', '#d3a23d'],
    ['first-project', 'First Project', 'Completed your first practical project.', 'projects', 1, '86% 78%', '#4a98ae']
  ].map(([id, name, meaning, metric, target, sprite, color]) => ({ id, name, meaning, metric, target, sprite, color, kind: 'milestone' }));

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
    return {
      lessons: Number(course.completedCount || 0),
      notes: noteCount(),
      projects: projectCount(),
      ...rhythmSnapshot(),
      completed: course.completed || {}
    };
  }

  function readEarned() {
    return readJSON(EARNED_KEY, {});
  }

  function achievementMetric(item, metrics) {
    return item.kind === 'capability' ? metrics.lessons : Number(metrics[item.metric] || 0);
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
      if (!earned[item.id] && achievementMetric(item, metrics) >= item.target) {
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

  function progressText(item, current, earnedAt) {
    if (earnedAt) return `Earned · ${stamp(earnedAt)}`;
    if (item.kind === 'capability' || item.metric === 'lessons') return `Locked · ${Math.min(current, item.target)} of ${item.target} lessons`;
    if (item.metric === 'totalSeconds' || item.metric === 'todaySeconds') {
      return `Locked · ${Math.min(Math.floor(current / 60), Math.floor(item.target / 60))} of ${Math.floor(item.target / 60)} minutes`;
    }
    return `Locked · ${Math.min(current, item.target)} of ${item.target}`;
  }

  function requirementText(item) {
    if (item.kind === 'capability' || item.metric === 'lessons') {
      return `Complete ${item.target} ${item.target === 1 ? 'lesson' : 'lessons'}`;
    }
    if (item.metric === 'totalSeconds' || item.metric === 'todaySeconds') {
      const minutes = Math.floor(item.target / 60);
      return `${minutes} focused ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
    if (item.metric === 'sessions') return `Return for ${item.target} learning sessions`;
    if (item.metric === 'notes') return 'Save one optional learning note';
    if (item.metric === 'projects') return 'Complete one practical project';
    return `Reach ${item.target}`;
  }

  function updateInspector(item) {
    if (!item) return;
    const { metrics, earned } = syncAwards();
    const current = achievementMetric(item, metrics);
    const earnedAt = earned[item.id];
    selectedDetailName.textContent = item.name;
    selectedMeaning.textContent = item.meaning;
    selectedRequirement.textContent = requirementText(item);
    selectedStatus.textContent = progressText(item, current, earnedAt);
    /* "Earned date appears here" was placeholder copy that every learner saw,
       because nothing is engraved until a badge is actually earned. Say what is
       true and what would change it. */
    selectedEarned.textContent = earnedAt
      ? `First earned ${stamp(earnedAt)}`
      : `Not engraved yet — ${requirementText(item)}`;
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
        <span class="turn-hint" aria-hidden="true">Drag to turn <b>↔</b></span>
      </button>
      <div class="achievement-copy">
        <strong>${item.name}</strong>
        <span>${item.meaning}</span>
        <small data-achievement-progress>Locked</small>
      </div>`;
  }

  function buildGrid(grid, items, className) {
    grid.innerHTML = items.map(item => `<article class="achievement-item ${className}" data-card="${item.id}" style="--accent:${item.color}">${objectMarkup(item)}</article>`).join('');
  }

  function normalizedDegrees(degrees) {
    return ((degrees % 360) + 360) % 360;
  }

  function faceFor(degrees) {
    const normalized = normalizedDegrees(degrees);
    return normalized >= 90 && normalized < 270 ? 'back' : 'front';
  }

  function rotationLabel(degrees) {
    const face = faceFor(degrees);
    const rounded = Math.round(degrees);
    if (Math.abs(normalizedDegrees(degrees)) < 2 || Math.abs(normalizedDegrees(degrees) - 360) < 2) return `Front · ${rounded}°`;
    if (Math.abs(normalizedDegrees(degrees) - 180) < 2) return `Back · ${rounded}°`;
    return `${face === 'back' ? 'Turning toward back' : 'Turning toward front'} · ${rounded}°`;
  }

  function motionMode() {
    const mode = document.documentElement.dataset.motion;
    if (mode === 'none' || mode === 'reduced' || mode === 'standard') return mode;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'standard';
  }

  /* One flip should read as one movement, so the duration follows the angle
     actually travelled: a 15deg arrow nudge is quick, a 180deg turn is not.
     Reduced motion keeps the turn but shortens it; "none" cuts to the face. */
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
  function applyLight(object, x, y) {
    const angle = y * RAD;
    const across = Math.max(-1.15, Math.min(1.15, -((.23 * Math.cos(angle)) + (1.04 * Math.sin(angle)))));
    const facing = Math.abs(Math.cos(angle));
    const style = object.style;
    style.setProperty('--shine-x', `${(across * 30).toFixed(2)}%`);
    style.setProperty('--shine-y', `${Math.max(-15, Math.min(12, -6 - (x * .9))).toFixed(2)}%`);
    style.setProperty('--shine-a', (.14 + (.46 * Math.sqrt(facing))).toFixed(3));
    style.setProperty('--sheen', `${(150 - (Math.sin(angle) * 28)).toFixed(1)}deg`);
    style.setProperty('--edge-lum', (.04 + (.26 * Math.abs(Math.sin(angle)))).toFixed(3));
  }

  function setPose(object, x, y, animate = true) {
    const pose = poses.get(object);
    if (!pose) return;
    const nextX = Math.max(-26, Math.min(26, x));
    const nextY = Math.max(-180, Math.min(180, y));
    const travel = Math.max(Math.abs(nextY - pose.y), Math.abs(nextX - pose.x) * .8);
    pose.x = nextX;
    pose.y = nextY;
    object.classList.toggle('is-turning', !animate);
    if (animate) object.style.setProperty('--turn-ms', `${turnDuration(travel)}ms`);
    object.style.setProperty('--rotate-x', `${pose.x}deg`);
    object.style.setProperty('--rotate-y', `${pose.y}deg`);
    applyLight(object, pose.x, pose.y);
    const face = faceFor(pose.y);
    object.dataset.face = face;
    object.setAttribute('aria-pressed', String(face === 'back'));
    if (object === activeObject) {
      rotation.value = String(pose.y);
      rotationValue.textContent = rotationLabel(pose.y);
    }
  }

  function selectObject(object) {
    activeObject = object;
    document.querySelectorAll('.achievement-item').forEach(card => card.classList.toggle('is-selected', card.contains(object)));
    const item = [...capabilities, ...milestones].find(entry => entry.id === object.dataset.achievement);
    selectedName.textContent = item?.name || 'badge';
    updateInspector(item);
    const pose = poses.get(object);
    if (pose) {
      rotation.value = String(pose.y);
      rotationValue.textContent = rotationLabel(pose.y);
    }
  }

  function snap(object, direction = 0) {
    const pose = poses.get(object);
    if (!pose) return;
    const next = direction
      /* A tap must land on an absolute face, not add another turn onto whatever
         a drag left behind. pose.y can sit well outside [-180,180] after a few
         drags, which is why "flip" stopped coming back to the front. */
      ? (faceFor(pose.y) === 'front' ? 180 : 0)
      : Math.max(-180, Math.min(180, Math.round(pose.y / 180) * 180));
    setPose(object, 0, next, true);
    object.classList.remove('is-turning');
  }

  function wireObject(object) {
    const pose = {
      x: 4,
      y: 0,
      startX: 0,
      startY: 0,
      startYRotation: 0,
      pointerId: null,
      intent: 'none',
      moved: false,
      ignoreClickUntil: 0
    };
    poses.set(object, pose);
    setPose(object, pose.x, pose.y, true);

    object.addEventListener('pointerdown', event => {
      selectObject(object);
      if (document.documentElement.dataset.motion === 'none') return;
      pose.pointerId = event.pointerId;
      pose.startX = event.clientX;
      pose.startY = event.clientY;
      pose.startYRotation = pose.y;
      pose.intent = event.pointerType === 'touch' ? 'pending' : 'rotate';
      pose.moved = false;
      if (pose.intent === 'rotate') object.setPointerCapture(event.pointerId);
    });

    object.addEventListener('focus', () => {
      selectObject(object);
    });

    object.addEventListener('pointermove', event => {
      if (pose.pointerId !== event.pointerId) return;
      const dx = event.clientX - pose.startX;
      const dy = event.clientY - pose.startY;
      if (pose.intent === 'pending' && Math.hypot(dx, dy) > 9) {
        if (Math.abs(dy) > Math.abs(dx) * 1.08) {
          pose.intent = 'scroll';
          pose.pointerId = null;
          return;
        }
        pose.intent = 'rotate';
        object.setPointerCapture(event.pointerId);
      }
      if (pose.intent !== 'rotate') return;
      if (Math.abs(dx) > 4) pose.moved = true;
      if (!pose.moved) return;
      event.preventDefault();
      /* The highlight follows the angle now, not the cursor, so there is no
         second lighting model to reconcile — and no layout read per move. */
      setPose(object, Math.max(-18, Math.min(18, 4 - dy * .16)), pose.startYRotation + dx * .88, false);
    });

    object.addEventListener('pointerup', event => {
      if (pose.pointerId !== event.pointerId) return;
      if (object.hasPointerCapture(event.pointerId)) object.releasePointerCapture(event.pointerId);
      pose.pointerId = null;
      if (pose.intent === 'rotate' && pose.moved) {
        pose.ignoreClickUntil = Date.now() + 450;
        snap(object);
      } else if (pose.intent !== 'scroll') {
        pose.ignoreClickUntil = Date.now() + 450;
        snap(object, 1);
      }
      pose.intent = 'none';
    });

    object.addEventListener('pointercancel', event => {
      if (pose.pointerId !== event.pointerId) return;
      pose.pointerId = null;
      pose.intent = 'none';
      snap(object);
    });

    object.addEventListener('click', () => {
      selectObject(object);
      if (Date.now() < pose.ignoreClickUntil) return;
      snap(object, 1);
    });

    object.addEventListener('keydown', event => {
      if (!['Enter', ' ', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      selectObject(object);
      pose.ignoreClickUntil = Date.now() + 500;
      const arrow = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
      /* With animation switched off there is nothing to see between the two
         faces, so an arrow turns straight to the next one rather than stepping
         invisibly 15deg at a time. */
      if (!arrow || motionMode() === 'none') snap(object, arrow || 1);
      else setPose(object, pose.x, pose.y + (arrow * 15), true);
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
      const progress = progressText(item, current, earnedAt);
      object.setAttribute('aria-label', `${item.name}. ${item.meaning} ${progress}. Press Enter to flip, use the arrow keys to turn, or drag horizontally. You can also use the rotation slider.`);
      card.querySelector('[data-earned-stamp]').textContent = earnedAt ? stamp(earnedAt) : `To earn · ${progress}`;
      card.querySelector('[data-achievement-progress]').textContent = progress;
      if (earnedAt && item.kind === 'capability') earnedCapabilities += 1;
      if (earnedAt && item.kind === 'milestone') earnedMilestones += 1;
    });
    capabilityCount.textContent = String(earnedCapabilities);
    milestoneCount.textContent = String(earnedMilestones);
    const selectedItem = activeObject && [...capabilities, ...milestones].find(entry => entry.id === activeObject.dataset.achievement);
    updateInspector(selectedItem);
  }

  buildGrid(capabilityGrid, capabilities, 'capability-item');
  buildGrid(milestoneGrid, milestones, 'milestone-item');
  document.querySelector('.milestone-vault')?.removeAttribute('open');
  document.querySelectorAll('.achievement-object').forEach(wireObject);
  selectObject(document.querySelector('.achievement-object'));

  rotation.addEventListener('input', () => {
    if (!activeObject) return;
    const pose = poses.get(activeObject);
    setPose(activeObject, pose?.x ?? 4, Number(rotation.value), false);
  });

  rotation.addEventListener('change', () => {
    if (!activeObject) return;
    activeObject.classList.remove('is-turning');
    const pose = poses.get(activeObject);
    setPose(activeObject, pose?.x ?? 4, Number(rotation.value), true);
  });

  showFront?.addEventListener('click', () => {
    if (!activeObject) return;
    const pose = poses.get(activeObject);
    setPose(activeObject, pose?.x ?? 4, 0, true);
    activeObject.focus();
  });

  showBack?.addEventListener('click', () => {
    if (!activeObject) return;
    const pose = poses.get(activeObject);
    setPose(activeObject, pose?.x ?? 4, 180, true);
    activeObject.focus();
  });

  window.addEventListener('learningai:rhythm', renderStatus);
  window.addEventListener('learningai:progress', renderStatus);
  window.addEventListener('storage', renderStatus);
  setInterval(renderStatus, 1000);
  renderStatus();
})();
