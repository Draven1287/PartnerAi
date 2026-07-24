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
const gatedKinds = new Set(['classify', 'promptRepair', 'biasSpot', 'agentDesign', 'workflowChain', 'tryLive', 'verify']);
const builtInKinds = new Set(['classify', 'promptRepair', 'biasSpot', 'agentDesign', 'workflowChain', 'verify']);
const safeUsePattern = /\b(?:private|privacy|personal (?:data|detail|information)|redact|remove (?:names|details)|made-up|invented example|do not (?:share|enter|paste)|data leaves|outside LearningAI|account number|password)\b/i;
const allText = value => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(allText).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(allText).join(' ');
  return '';
};
const decisionCount = step => {
  if (step.kind === 'classify') return step.items?.length || 0;
  if (step.kind === 'workflowChain') return step.correct?.length || 0;
  if (step.kind === 'promptRepair') return step.fields?.length || 0;
  if (step.kind === 'biasSpot') return step.biased?.length || 0;
  if (step.kind === 'agentDesign') return step.tools?.length || 0;
  if (step.kind === 'verify') return Math.max(1, step.steps?.length || 0);
  if (step.kind === 'tryLive') return 1;
  return 0;
};

for (const lesson of lessons) {
  const steps = Array.isArray(lesson.steps) ? lesson.steps : [];
  const exitIndex = steps.findIndex(step => step.kind === 'exitCheck');
  const beforeExit = exitIndex >= 0 ? steps.slice(0, exitIndex) : steps;
  const gates = beforeExit.filter(step => gatedKinds.has(step.kind));
  const builtIn = beforeExit.filter(step => builtInKinds.has(step.kind));
  const decisions = beforeExit.reduce((total, step) => total + decisionCount(step), 0);

  if (steps[0]?.kind !== 'coldOpen') failures.push(`${lesson.id}: the first step must be a concrete coldOpen.`);
  if (gates.length < 2) failures.push(`${lesson.id}: needs at least two gated learner actions before exitCheck.`);
  if (!builtIn.length) failures.push(`${lesson.id}: an external AI activity cannot be the only required evidence.`);
  if (decisions < 3) failures.push(`${lesson.id}: only ${decisions} meaningful pre-exit decisions; expected at least 3.`);
  if (exitIndex !== steps.length - 1) failures.push(`${lesson.id}: exitCheck must be the final step.`);
  if ((steps.filter(step => step.kind === 'exitCheck')).length !== 1) failures.push(`${lesson.id}: expected exactly one exitCheck.`);

  const firstLive = steps.findIndex(step => step.kind === 'tryLive');
  if (firstLive >= 0) {
    const safetyContext = allText(steps.slice(0, firstLive + 1));
    if (!safeUsePattern.test(safetyContext)) failures.push(`${lesson.id}: external AI appears before explicit safe-use or data-minimization guidance.`);
  }

  const exit = steps.at(-1);
  if (exit?.kind === 'exitCheck') {
    const options = exit.options || [];
    if (options.length < 3) failures.push(`${lesson.id}: exitCheck needs at least three defensible choices.`);
    if (options.filter(option => option.ok).length !== 1) failures.push(`${lesson.id}: exitCheck needs exactly one defensible best answer.`);
    if (options.some(option => !String(option.feedback || '').trim())) failures.push(`${lesson.id}: every exit choice needs explanatory feedback.`);
    const absoluteDistractors = options.filter(option => !option.ok && /\b(?:always|never|obviously|just trust|do whatever)\b/i.test(option.text || ''));
    if (absoluteDistractors.length > 1) warnings.push(`${lesson.id}: several exit distractors may be too easy or moralized.`);
  }

  if (!/\b(?:decision|decide|choose|check|verify|protect|control|consequence|responsib|permission|boundary|tradeoff)\b/i.test(allText(lesson))) {
    warnings.push(`${lesson.id}: agency or consequence language is difficult to find.`);
  }
}

console.log(`Teen-majority course audit: ${lessons.length} lessons`);
for (const failure of failures) console.log(`FAIL ${failure}`);
for (const warning of warnings) console.log(`WARN ${warning}`);
console.log(`Summary: ${failures.length} failure(s), ${warnings.length} warning(s).`);
if (failures.length) process.exit(1);
