import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, ROOT), 'utf8');

// The four shared practice behaviours reflected in current Anthropic, OpenAI,
// and Khan beginner pathways. This is an audit vocabulary, not borrowed copy.
const ARC_COMPETENCIES = {
  'First Contact': ['discern'],
  'How It Works': ['discern', 'diligence'],
  'Talking to AI': ['describe', 'delegate'],
  'Trust & Everyday AI': ['discern', 'diligence'],
  'Prompting Craft': ['describe', 'discern'],
  'Judgment & Safety': ['discern', 'diligence'],
  'AI & Being Human': ['discern', 'diligence'],
  'AI for Real Life': ['delegate', 'discern', 'diligence'],
  'Building with AI': ['describe', 'delegate', 'diligence'],
  'Becoming a Builder': ['delegate', 'discern', 'diligence']
};

const lessons = [];
for (let number = 1; number <= 50; number += 1) {
  const module = await import(new URL(`../lessons/chapter-${number}.mjs`, import.meta.url));
  lessons.push(module.default);
}

assert.equal(lessons.length, 50, 'Expected all 50 source lessons');
const coverage = new Map([['describe', 0], ['delegate', 0], ['discern', 0], ['diligence', 0]]);
for (const [index, lesson] of lessons.entries()) {
  assert.equal(lesson.id, `chapter-${index + 1}`, `Unstable ID at lesson ${index + 1}`);
  const competencies = ARC_COMPETENCIES[lesson.arc];
  assert.ok(competencies?.length, `${lesson.id} has no benchmark competency mapping`);
  for (const competency of competencies) coverage.set(competency, coverage.get(competency) + 1);
}
for (const [competency, count] of coverage) {
  assert.ok(count >= 10, `${competency} is underrepresented: ${count} lessons`);
}

const evidenceChecks = [
  ['chapter-14', /home address and school name/i, 'teen privacy guidance'],
  ['chapter-18', /make me try first, then coach me/i, 'attempt-before-help practice'],
  ['chapter-25', /audit trail, not private thoughts/i, 'checkable work rather than hidden-reasoning theater'],
  ['chapter-30', /the work is the learning/i, 'learning-work boundary'],
  ['chapter-34', /wait for my answer before saying anything/i, 'quiz-before-answer practice'],
  ['chapter-35', /rewrite each circled phrase in your own words/i, 'authorship practice'],
  ['chapter-43', /ask the teacher or your manager BEFORE you submit/i, 'school and workplace policy check'],
  ['chapter-46', /least access/i, 'agent permission boundary'],
  ['chapter-47', /SAFETY LIMIT/i, 'capstone stop-sign'],
  ['chapter-48', /a real person, not the AI/i, 'human transfer evidence']
];

for (const [id, pattern, label] of evidenceChecks) {
  const lesson = lessons.find(candidate => candidate.id === id);
  assert.ok(lesson, `Missing ${id}`);
  assert.match(JSON.stringify(lesson), pattern, `${id} lost ${label}`);
}

const privacy = read('privacy.html');
assert.match(privacy, /For learners ages 13–17/, 'Minor-facing privacy guidance is missing');
assert.match(privacy, /outside AI service/i, 'External-service boundary is missing');

console.log('Learning AI curriculum-principles audit passed');
console.log([...coverage].map(([name, count]) => `${name}:${count}`).join(' · '));
console.log(`${evidenceChecks.length} cross-course agency, integrity, safety, and transfer checks`);
