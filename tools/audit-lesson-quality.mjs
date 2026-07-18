import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const context = { window: {} };
vm.createContext(context);
vm.runInContext(readFileSync(new URL('../v2/lessons.js', import.meta.url), 'utf8'), context, {
  filename: 'v2/lessons.js',
  timeout: 1500
});

const lessons = context.window.LESSONS || [];
const failures = [];
const warnings = [];
const fail = (lesson, rule, detail) => failures.push({ lesson: lesson.num, id: lesson.id, rule, detail });
const warn = (lesson, rule, detail) => warnings.push({ lesson: lesson.num, id: lesson.id, rule, detail });
const text = value => typeof value === 'string' ? value.trim() : '';
const wordCount = value => text(value).split(/\s+/).filter(Boolean).length;
const allText = value => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(allText).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(allText).join(' ');
  return '';
};

for (const lesson of lessons) {
  const steps = Array.isArray(lesson.steps) ? lesson.steps : [];
  const corpus = allText(lesson);
  let teachingWords = 0;
  if (!/^chapter-\d+$/.test(lesson.id)) fail(lesson, 'stable-id', 'Lesson ID must remain chapter-N.');
  if (text(lesson.title).length < 4) fail(lesson, 'title', 'Title is missing or too short.');
  if (text(lesson.coreQuestion).length < 30) fail(lesson, 'core-question', 'Core question needs a real learner-facing tension.');
  if (text(lesson.blurb).length < 45) warn(lesson, 'blurb', 'Blurb may be too thin to promise a concrete experience.');
  if (/\b(?:lorem ipsum|tbd|todo|insert (?:copy|text)|sample content|feature one)\b/i.test(corpus)) fail(lesson, 'placeholder-copy', 'Unresolved placeholder copy found.');
  if (!/\b(?:you decide|your decision|you choose|you check|verify|your judgment|you judge|you own|stay in charge|keep control|human)\b/i.test(corpus)) {
    warn(lesson, 'agency-language', 'No explicit learner-control phrase found.');
  }

  const exits = steps.filter(step => step.kind === 'exitCheck');
  if (exits.length !== 1) fail(lesson, 'exit-count', `Expected one exitCheck; found ${exits.length}.`);
  for (const [index, step] of steps.entries()) {
    const at = `${step.kind || 'unknown'} step ${index + 1}`;
    const teachingBlocks = [step.scenario, step.prompt, step.body, step.note, step.claim, step.mistake, step.good].filter(value => text(value));
    teachingWords += teachingBlocks.reduce((sum, value) => sum + wordCount(value), 0);
    const longestBlock = Math.max(0, ...teachingBlocks.map(wordCount));
    if (longestBlock > 200) warn(lesson, 'reading-load', `${at} has a ${longestBlock}-word block; split or tighten it for screen reading.`);
    if (!text(step.title)) fail(lesson, 'step-title', `${at} has no title.`);
    if (step.kind === 'coldOpen') {
      if (text(step.scenario).length < 100) fail(lesson, 'cold-open-specificity', `${at} needs a specific scene, not a headline.`);
      if (text(step.prompt).length < 25) fail(lesson, 'cold-open-prompt', `${at} needs a learner-facing question.`);
    }
    if (step.kind === 'reveal') {
      if (text(step.body).length < 160) fail(lesson, 'mechanism', `${at} needs a substantive mechanism explanation.`);
      if (text(step.mistake).length < 20 || text(step.good).length < 20) fail(lesson, 'contrast', `${at} needs both failure and control contrasts.`);
    }
    if (step.kind === 'tryLive') {
      if (text(step.prompt).length < 70) fail(lesson, 'real-practice', `${at} needs a runnable prompt with enough context.`);
      if (text(step.note).length < 45) fail(lesson, 'practice-instruction', `${at} needs concrete fill-in or safety guidance.`);
    }
    if (step.kind === 'classify') {
      if (!Array.isArray(step.buckets) || step.buckets.length < 2) fail(lesson, 'classify-buckets', `${at} needs at least two buckets.`);
      if (!Array.isArray(step.items) || step.items.length < 3) fail(lesson, 'classify-items', `${at} needs at least three decisions.`);
      for (const item of step.items || []) {
        if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer >= (step.buckets || []).length) fail(lesson, 'classify-answer', `${at} has an invalid answer index.`);
        if (text(item.text).length < 8) fail(lesson, 'classify-copy', `${at} has a thin classification item.`);
      }
      if (text(step.reveal).length < 25) fail(lesson, 'classify-feedback', `${at} needs explanatory success feedback.`);
    }
    if (step.kind === 'exitCheck') {
      if (text(step.question).length < 35) fail(lesson, 'exit-question', `${at} needs a transfer question, not recall trivia.`);
      if (!Array.isArray(step.options) || step.options.length < 3) fail(lesson, 'exit-options', `${at} needs at least three options.`);
      const correct = (step.options || []).filter(option => option.ok === true).length;
      if (correct !== 1) fail(lesson, 'exit-correctness', `${at} must have exactly one defensible correct answer; found ${correct}.`);
      for (const option of step.options || []) {
        if (text(option.text).length < 15 || text(option.feedback).length < 20) fail(lesson, 'exit-feedback', `${at} has a thin option or feedback explanation.`);
      }
    }
    if (step.kind === 'toolkitSave' && (!Array.isArray(step.fields) || !step.fields.length)) fail(lesson, 'optional-notes', `${at} has no savable fields.`);
    if (step.kind === 'verify' && (!Array.isArray(step.steps) || step.steps.length < 2)) fail(lesson, 'verification-sequence', `${at} needs an independent checking sequence.`);
  }
  if (teachingWords > 650) warn(lesson, 'lesson-load', `${teachingWords} teaching words may exceed the promised lesson time.`);
}

const rhythms = new Map();
for (const lesson of lessons) {
  const rhythm = lesson.steps.map(step => step.kind).join(' > ');
  rhythms.set(rhythm, [...(rhythms.get(rhythm) || []), lesson.num]);
}
const [mostRepeatedRhythm, repeatedLessons = []] = [...rhythms.entries()].sort((a, b) => b[1].length - a[1].length)[0] || [];
if (repeatedLessons.length > 15) {
  warnings.push({ lesson: 'course', id: 'course', rule: 'interaction-variety', detail: `${repeatedLessons.length} lessons share the same rhythm (${mostRepeatedRhythm}).` });
}

const courseCorpus = lessons.map(allText).join(' ');
for (const [label, pattern] of [
  ['privacy', /\b(?:private|privacy|personal data|password)\b/i],
  ['anti-anthropomorphism', /\b(?:not a mind|not sentient|predicts? (?:the )?(?:next|likely)|no feelings|does not think)\b/i],
  ['verification', /\b(?:verify|independent source|check the source|source says)\b/i],
  ['human-control', /\b(?:stay in charge|human judgment|you decide|keep control|your decision)\b/i]
]) {
  if (!pattern.test(courseCorpus)) failures.push({ lesson: 'course', id: 'course', rule: label, detail: `Course-wide ${label} language is missing.` });
}

console.log(`Learning AI lesson-quality audit: ${lessons.length} lessons`);
console.log(`Architecture: ${rhythms.size} distinct lesson rhythms; most-reused rhythm appears ${repeatedLessons.length} time(s).`);
for (const item of failures) console.log(`FAIL ${item.id} ${item.rule}: ${item.detail}`);
for (const item of warnings) console.log(`WARN ${item.id} ${item.rule}: ${item.detail}`);
console.log(`Summary: ${failures.length} failure(s), ${warnings.length} warning(s).`);
if (failures.length) process.exit(1);
