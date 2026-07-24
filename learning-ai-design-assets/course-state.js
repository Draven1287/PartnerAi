(function () {
  const PROGRESS_KEY = 'learningai-progress';
  const FIRST_LESSON_KEY = 'learningai-first-lesson-complete';
  const TOTAL = 50;

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function normalizeCompleted() {
    const progress = readJson(PROGRESS_KEY, { completed: {} });
    const completed = progress && typeof progress.completed === 'object' && progress.completed
      ? { ...progress.completed }
      : {};
    const first = readJson(FIRST_LESSON_KEY, null);
    if (first) {
      completed['chapter-1'] ||= {
        completedAt: first.completedAt || new Date().toISOString()
      };
    }
    return completed;
  }

  function lessonNumber(id) {
    const match = /^chapter-(\d+)$/.exec(String(id || ''));
    return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
  }

  function snapshot() {
    const lessons = Array.isArray(window.LESSONS) ? window.LESSONS : [];
    const completed = normalizeCompleted();
    const orderedIds = lessons.length
      ? lessons.map(lesson => lesson.id)
      : Array.from({ length: TOTAL }, (_, index) => `chapter-${index + 1}`);
    const completedIds = orderedIds.filter(id => completed[id]);
    const completedCount = Math.min(TOTAL, completedIds.length);
    const next = lessons.find(lesson => !completed[lesson.id]) || null;
    const nextNumber = next?.num || Math.min(TOTAL + 1, completedCount + 1);
    return {
      total: TOTAL,
      completed,
      completedIds,
      completedCount,
      percentage: Math.round((completedCount / TOTAL) * 100),
      next,
      nextNumber,
      isComplete: completedCount >= TOTAL,
      isDone(id) { return Boolean(completed[id]); },
      isUnlocked(lesson) {
        const number = typeof lesson === 'number' ? lesson : Number(lesson?.num || lessonNumber(lesson?.id || lesson));
        return number === 1 || number <= nextNumber;
      }
    };
  }

  function complete(lessonId, completedAt = new Date().toISOString()) {
    const progress = readJson(PROGRESS_KEY, { completed: {} });
    progress.completed ||= {};
    progress.completed[lessonId] ||= { completedAt };
    progress.savedAt = new Date().toISOString();
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    window.dispatchEvent(new CustomEvent('learningai:progress', { detail: snapshot() }));
    return snapshot();
  }

  window.LearningAICourseState = { snapshot, complete, key: PROGRESS_KEY };
})();
