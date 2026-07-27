/*
 * Lesson time model — how long lessons/chapter-N.mjs actually takes a first-time
 * teenage reader (roughly 13-18) who is meeting this material for the first time.
 *
 * Run:  node tools/estimate-lesson-time.mjs            # table + distribution
 *       node tools/estimate-lesson-time.mjs --json     # machine-readable
 *       node tools/estimate-lesson-time.mjs --apply    # rewrite "minutes" in source
 *       node tools/estimate-lesson-time.mjs --check    # fail if source drifts from model
 *
 * The model is deliberately explicit: every constant below is a stated assumption,
 * not a vibe. Change a constant, re-run, and every published duration moves with it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SOURCE_DIR = path.join(ROOT, 'lessons');

/* ---------------------------------------------------------------------------
 * 1. READING
 *
 * READ_WPM: 160 words per minute.
 *   Adults skimming familiar text run 250+ wpm, which is the number that produced
 *   the old flat "10 minutes". This audience is 13-18, reading unfamiliar
 *   non-fiction for comprehension, not for gist. Silent reading of new expository
 *   material in this age band is commonly placed in the 150-185 wpm range; 160 is
 *   the middle of that band and is the rate at which a reader can still answer a
 *   question about what they just read.
 *
 * REREAD_FACTOR: 1.15.
 *   A first-time reader does not move in a straight line. They stop on a term they
 *   have not met, back up half a sentence, and re-read the setup before answering.
 *   15% is a conservative allowance for that; it is applied to prose only, because
 *   re-scanning of answer options is already priced into the per-item costs below.
 * ------------------------------------------------------------------------- */
const READ_WPM = 160;
const REREAD_FACTOR = 1.15;

/* ---------------------------------------------------------------------------
 * 2. WRITING
 *
 * COMPOSE_WPM: 12 words per minute.
 *   Not typing speed. Teens transcribe at roughly 30-40 wpm, but these fields ask
 *   for an original decision written while still deciding it. Composition of new
 *   prose (think, type, re-read, fix) runs far below transcription; 12 wpm means a
 *   25-word answer takes about two minutes, which matches what "write a specific
 *   attempt of at least five different words" really costs a beginner.
 *
 * Expected written words per surface are structural, not guessed per lesson: a
 * promptRepair field wants a short decision, a toolkitSave field wants a phrase,
 * and a tryLive attempt grows with how many slots and stages its prompt contains.
 * ------------------------------------------------------------------------- */
const COMPOSE_WPM = 12;
const WORDS = {
  promptRepairField: 12,   // "Replace [x] without private details" -> a short clause
  toolkitSaveField: 6,     // a keepable phrase, e.g. "names, private messages"
  agentDesignRule: 15,     // "what must a person review, approve, or stop"
  tryLiveBase: 20,         // the floor attempt: gate demands 5+ words, real ones write ~20
  tryLivePerSlot: 6,       // each [bracketed slot] in the prompt is a thing to fill in
  tryLivePerStage: 20      // each STAGE marker is a separate thing to write out
};

/* ---------------------------------------------------------------------------
 * 3. INTERACTION (seconds), on top of reading the words
 *
 * These are deliberation costs, not click costs. Operating a <select> is ~2s; the
 * expensive part is a novice weighing three abstract buckets against one concrete
 * example. Each cost is split into a fixed step cost and a per-item cost so a
 * 6-item classify is priced above a 3-item one.
 * ------------------------------------------------------------------------- */
const COST = {
  // read-only steps: no input, but the learner is asked to hold a thought
  coldOpen:      { step: 15, item: 0 },
  reveal:        { step: 20, item: 0 },   // the mistake/control contrast is the point
  compare:       { step: 20, item: 0 },   // mentally diffing two panels

  // choice steps
  classify:      { step: 10, item: 12 },  // per item: weigh it against every bucket
  workflowChain: { step: 15, item: 18 },  // ordering: must hold the whole sequence
  exitCheck:     { step: 20, item: 10 },  // per option, plus commit and read feedback
  verify:        { step: 10, item: 10 },  // per checkbox: decide it is genuinely done
  agentDesign:   { step: 15, item: 15 },  // per permission grant/deny

  // writing steps price the deliberation here and the words via COMPOSE_WPM
  promptRepair:  { step: 20, item: 15 },  // per field, before any words are typed
  tryLive:       { step: 60, item: 0 },   // decide what to try + the control radio
  toolkitSave:   { step: 15, item: 8 }    // per field, plus the save action
};

/* Per-step transition: click Next, page scrolls, focus lands on the new heading,
 * orient to what kind of step this now is. */
const STEP_TRANSITION_SEC = 6;

/* Per-lesson: arrive on the page, read title + core question + "Lesson N of 50",
 * and the completion beat at the end. */
const LESSON_OVERHEAD_SEC = 45;

const words = value => {
  if (!value) return 0;
  return String(value).trim().split(/\s+/).filter(Boolean).length;
};
const sumWords = (...values) => values.reduce((total, value) => total + words(value), 0);

/* Prose the learner reads to understand, vs. text they read to choose between.
 * Both are read at READ_WPM; only prose carries the re-read allowance. */
function stepText(step) {
  switch (step.kind) {
    case 'coldOpen':
      return { prose: sumWords(step.title, step.scenario, step.prompt), choice: 0 };
    case 'reveal':
      return { prose: sumWords(step.title, step.body, step.mistake, step.good), choice: 0 };
    case 'compare':
      return { prose: sumWords(step.title, step.weak, step.strong, step.why), choice: 0 };
    case 'classify':
      return {
        prose: sumWords(step.title, step.prompt, step.reveal),
        choice: sumWords(...step.buckets) + sumWords(...step.items.map(item => item.text))
      };
    case 'workflowChain':
      return {
        prose: sumWords(step.title, step.goal, step.note),
        choice: sumWords(...(step.choices || step.correct))
      };
    case 'exitCheck':
      return {
        prose: sumWords(step.title, step.question),
        // options are read; the feedback line of the one chosen is read too
        choice: sumWords(...step.options.map(option => option.text)) + words(step.options[0]?.feedback)
      };
    case 'verify':
      return { prose: sumWords(step.title, step.claim, step.note), choice: sumWords(...step.steps) };
    case 'promptRepair':
      return {
        prose: sumWords(step.title, step.weak, step.strong),
        choice: sumWords(...step.fields.map(f => (typeof f === 'string' ? f : `${f.label} ${f.placeholder || ''}`)))
      };
    case 'tryLive':
      return { prose: sumWords(step.title, step.prompt, step.note), choice: 0 };
    case 'agentDesign':
      return {
        prose: sumWords(step.title, step.goal, step.note),
        choice: sumWords(...step.tools.map(tool => tool.name))
      };
    case 'toolkitSave':
      return {
        prose: sumWords(step.title, step.cardType),
        choice: sumWords(...step.fields.map(f => `${f.label} ${f.placeholder || ''}`))
      };
    default:
      return { prose: sumWords(...Object.values(step).filter(v => typeof v === 'string')), choice: 0 };
  }
}

function stepItemCount(step) {
  switch (step.kind) {
    case 'classify':      return step.items.length;
    case 'workflowChain': return step.correct.length;   // one select per slot
    case 'exitCheck':     return step.options.length;
    case 'verify':        return step.steps.length;
    case 'promptRepair':  return step.fields.length;
    case 'agentDesign':   return step.tools.length;
    case 'toolkitSave':   return step.fields.length;
    default:              return 0;
  }
}

function stepWrittenWords(step) {
  switch (step.kind) {
    case 'promptRepair': return step.fields.length * WORDS.promptRepairField;
    case 'toolkitSave':  return step.fields.length * WORDS.toolkitSaveField;
    case 'agentDesign':  return WORDS.agentDesignRule;
    case 'tryLive': {
      const slots = (String(step.prompt).match(/\[[^\]]+\]/g) || []).length;
      const stages = (String(step.prompt).match(/\bSTAGE\s*\d/gi) || []).length;
      return WORDS.tryLiveBase + slots * WORDS.tryLivePerSlot + stages * WORDS.tryLivePerStage;
    }
    default: return 0;
  }
}

export function measureLesson(lesson) {
  let readSec = 0;
  let interactSec = 0;
  let writeSec = 0;
  const byKind = {};

  for (const step of lesson.steps) {
    const { prose, choice } = stepText(step);
    const cost = COST[step.kind] || { step: 15, item: 10 };
    const items = stepItemCount(step);
    const written = stepWrittenWords(step);

    const read = ((prose * REREAD_FACTOR) + choice) / READ_WPM * 60;
    const interact = cost.step + cost.item * items + STEP_TRANSITION_SEC;
    const write = written / COMPOSE_WPM * 60;

    readSec += read;
    interactSec += interact;
    writeSec += write;
    byKind[step.kind] = (byKind[step.kind] || 0) + read + interact + write;
  }

  const totalSec = readSec + interactSec + writeSec + LESSON_OVERHEAD_SEC;
  return {
    num: lesson.num,
    id: lesson.id,
    title: lesson.title,
    arc: lesson.arc,
    claimed: Number(lesson.minutes) || 0,
    steps: lesson.steps.length,
    proseWords: lesson.steps.reduce((n, s) => n + stepText(s).prose, 0),
    choiceWords: lesson.steps.reduce((n, s) => n + stepText(s).choice, 0),
    writtenWords: lesson.steps.reduce((n, s) => n + stepWrittenWords(s), 0),
    readMin: readSec / 60,
    interactMin: (interactSec + LESSON_OVERHEAD_SEC) / 60,
    writeMin: writeSec / 60,
    exactMin: totalSec / 60,
    /* Round to the nearest whole minute. No flattening to a house number: if a
     * lesson measures 13, it is published as 13. Floor of 5 guards nothing real
     * in this curriculum but keeps a degenerate lesson from advertising 0. */
    modelMinutes: Math.max(5, Math.round(totalSec / 60)),
    byKind
  };
}

export async function loadLessons() {
  const files = fs.readdirSync(SOURCE_DIR).filter(file => /^chapter-\d+\.mjs$/.test(file));
  const lessons = [];
  for (const file of files) {
    const lesson = (await import(pathToFileURL(path.join(SOURCE_DIR, file)).href)).default;
    if (lesson?.num) lessons.push(lesson);
  }
  return lessons.sort((a, b) => a.num - b.num);
}

export async function measureAll() {
  return (await loadLessons()).map(measureLesson);
}

/* ---------------------------------------------------------------------------
 * lesson-one.html is the bespoke free first lesson. It is not in lessons/, so it
 * is measured from its own markup with the same constants: same reading rate,
 * same re-read allowance, same per-step transition and lesson overhead. It has
 * no free-text fields at all, so its whole cost is reading plus choosing.
 * ------------------------------------------------------------------------- */
const LESSON_ONE = path.join(ROOT, 'learning-ai-design-assets', 'lesson-one.html');

export function measureLessonOne() {
  const raw = fs.readFileSync(LESSON_ONE, 'utf8');
  const markup = raw.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  const sections = [...markup.matchAll(/<section class="step[^"]*" data-step="(\d+)">([\s\S]*?)<\/section>/g)];
  if (sections.length !== 7) throw new Error(`lesson-one.html: expected 7 steps, found ${sections.length}`);

  /* Text the learner reads that is not in the static markup: the decision
   * feedback line revealed under each of the 4 choices, and the two extra
   * context variants revealed by clicking Teacher and Your team. */
  const feedbackWords = words((raw.match(/const feedback=\{[\s\S]*?\};/)?.[0] || '').replace(/[^ -~’—“”]/g, ' '));
  const arenaWords = words((raw.match(/const arenaCopy=\{[\s\S]*?\};/)?.[0] || '').replace(/[^ -~’—“”]/g, ' '));

  /* Which model cost each bespoke step behaves like. */
  const steps = sections.map(([, num, body]) => {
    const text = body.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
    return {
      num: Number(num),
      words: words(text),
      options: (body.match(/class="option"/g) || []).length,
      contexts: (body.match(/class="context-button/g) || []).length
    };
  });

  const plan = [
    { step: 1, kind: 'coldOpen',      items: 0, extraWords: 0 },
    // 4 decision cards, one choice each, feedback revealed under every choice
    { step: 2, kind: 'exitCheck',     items: 4, extraWords: feedbackWords * 0.8, repeat: 4 },
    { step: 3, kind: 'reveal',        items: 0, extraWords: 0 },
    { step: 4, kind: 'reveal',        items: 0, extraWords: 0 },
    // clicking through 3 contexts and comparing the outputs
    { step: 5, kind: 'compare',       items: 0, extraWords: arenaWords * 0.67 },
    // two gated checks that must actually be right
    { step: 6, kind: 'exitCheck',     items: 3, repeat: 2, extraWords: 0 },
    { step: 7, kind: 'toolkitSave',   items: 1, extraWords: 0 }
  ];

  let readSec = 0;
  let interactSec = 0;
  const breakdown = [];
  for (const entry of plan) {
    const found = steps.find(s => s.num === entry.step);
    const cost = COST[entry.kind];
    const repeat = entry.repeat || 1;
    const read = ((found.words * REREAD_FACTOR) + entry.extraWords) / READ_WPM * 60;
    const interact = repeat * (cost.step + cost.item * entry.items) + STEP_TRANSITION_SEC;
    readSec += read;
    interactSec += interact;
    breakdown.push({ step: entry.step, kind: entry.kind, words: found.words, read, interact });
  }

  const totalSec = readSec + interactSec + LESSON_OVERHEAD_SEC;
  return {
    id: 'lesson-one',
    title: 'Use AI Safely Once (free first lesson)',
    steps: steps.length,
    proseWords: steps.reduce((n, s) => n + s.words, 0),
    readMin: readSec / 60,
    interactMin: (interactSec + LESSON_OVERHEAD_SEC) / 60,
    writeMin: 0,
    exactMin: totalSec / 60,
    modelMinutes: Math.max(5, Math.round(totalSec / 60)),
    breakdown
  };
}

/* Every published duration outside lessons/ that this model owns. Each entry is
 * a file, the regex that isolates the number, and how to write it back, so
 * --apply and --check stay in agreement by construction. */
const CATALOG = path.join(ROOT, 'learning-ai-design-assets', 'lessons.html');
/* The Focus page estimates what fits a planned session and has to quote the same
 * length for Lesson 01 as the catalog does, or the two pages disagree about the
 * lesson they both link to. Same literal, same owner. */
const FOCUS = path.join(ROOT, 'learning-ai-design-assets', 'focus.js');
function derivedTargets(lessonOneMinutes) {
  return [
    {
      file: LESSON_ONE,
      label: 'lesson-one.html "About N minutes"',
      pattern: /(<strong>About )(\d+)( minutes<\/strong>)/,
      value: lessonOneMinutes
    },
    {
      file: CATALOG,
      label: 'lessons.html LESSON_ONE_MINUTES',
      pattern: /(const LESSON_ONE_MINUTES=)(\d+)(;)/,
      value: lessonOneMinutes
    },
    {
      file: FOCUS,
      label: 'focus.js LESSON_ONE_MINUTES',
      pattern: /(const LESSON_ONE_MINUTES=)(\d+)(;)/,
      value: lessonOneMinutes
    }
  ];
}

/* --apply rewrites only the "minutes" line of each source file, plus the two
 * derived literals above. Nothing else in any file is touched. */
function applyToSource(results, lessonOneMinutes) {
  let changed = 0;
  for (const result of results) {
    const file = path.join(SOURCE_DIR, `chapter-${result.num}.mjs`);
    const before = fs.readFileSync(file, 'utf8');
    if (!/"minutes":\s*\d+/.test(before)) throw new Error(`No minutes field in ${file}`);
    const after = before.replace(/("minutes":\s*)\d+/, `$1${result.modelMinutes}`);
    if (after !== before) { fs.writeFileSync(file, after); changed += 1; }
  }
  for (const target of derivedTargets(lessonOneMinutes)) {
    const before = fs.readFileSync(target.file, 'utf8');
    if (!target.pattern.test(before)) throw new Error(`Could not find ${target.label}`);
    const after = before.replace(target.pattern, `$1${target.value}$3`);
    if (after !== before) { fs.writeFileSync(target.file, after); changed += 1; }
  }
  return changed;
}

function checkDerived(lessonOneMinutes) {
  const drift = [];
  for (const target of derivedTargets(lessonOneMinutes)) {
    const found = fs.readFileSync(target.file, 'utf8').match(target.pattern);
    if (!found) drift.push(`${target.label} is missing`);
    else if (Number(found[2]) !== target.value) drift.push(`${target.label} says ${found[2]}, model says ${target.value}`);
  }
  return drift;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const results = await measureAll();
  const total = results.reduce((sum, r) => sum + r.modelMinutes, 0);
  const claimedTotal = results.reduce((sum, r) => sum + r.claimed, 0);

  if (process.argv.includes('--lesson-one')) {
    const one = measureLessonOne();
    console.log(`lesson-one.html: ${one.proseWords} visible words across ${one.steps} steps`);
    for (const b of one.breakdown) {
      console.log(`  step ${b.step} (${b.kind}): ${String(b.words).padStart(4)} words · read ${(b.read / 60).toFixed(1)}m · interact ${(b.interact / 60).toFixed(1)}m`);
    }
    console.log(`  read ${one.readMin.toFixed(1)}m + interact ${one.interactMin.toFixed(1)}m = ${one.exactMin.toFixed(1)}m -> publish ${one.modelMinutes} minutes`);
  } else if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ total, claimedTotal, results, lessonOne: measureLessonOne() }, null, 2));
  } else if (process.argv.includes('--apply')) {
    const changed = applyToSource(results, measureLessonOne().modelMinutes);
    console.log(`Applied model minutes to ${changed} file(s). Course total: ${total} minutes.`);
    console.log('Now run: node tools/build-lessons.mjs');
  } else if (process.argv.includes('--check')) {
    const one = measureLessonOne();
    const drift = results
      .filter(r => r.claimed !== r.modelMinutes)
      .map(r => `${r.id} claims ${r.claimed}, model says ${r.modelMinutes}`)
      .concat(checkDerived(one.modelMinutes));
    if (drift.length) throw new Error(`${drift.length} published duration(s) drift from the time model: ${drift.join('; ')}`);
    console.log(`All ${results.length} lessons plus lesson-one.html (${one.modelMinutes} min) match the time model. ` +
      `Course total: ${total} minutes.`);
  } else {
    console.log(`Model: ${READ_WPM} wpm reading x${REREAD_FACTOR} re-read, ${COMPOSE_WPM} wpm composing, ` +
      `${LESSON_OVERHEAD_SEC}s lesson overhead, ${STEP_TRANSITION_SEC}s per step transition.\n`);
    console.log('  #  claimed  model   read  interact  write   words  title');
    for (const r of results) {
      const flag = r.modelMinutes > r.claimed ? '+' : r.modelMinutes < r.claimed ? '-' : ' ';
      console.log(
        `${String(r.num).padStart(3)}  ${String(r.claimed).padStart(7)}  ${String(r.modelMinutes).padStart(5)}${flag} ` +
        `${r.readMin.toFixed(1).padStart(6)}  ${r.interactMin.toFixed(1).padStart(8)}  ${r.writeMin.toFixed(1).padStart(5)}  ` +
        `${String(r.proseWords + r.choiceWords).padStart(5)}  ${r.title}`
      );
    }
    const delta = results.map(r => r.modelMinutes - r.claimed);
    const under = delta.filter(d => d >= 2).length;
    const over = delta.filter(d => d <= -2).length;
    const ok = delta.filter(d => Math.abs(d) < 2).length;
    console.log(`\nClaimed total ${claimedTotal} min -> model total ${total} min ` +
      `(${(total / 60).toFixed(1)} h vs ${(claimedTotal / 60).toFixed(1)} h)`);
    console.log(`Within 1 min: ${ok} · understated by 2+: ${under} · overstated by 2+: ${over}`);
    const sorted = [...results].sort((a, b) => (b.modelMinutes - b.claimed) - (a.modelMinutes - a.claimed));
    console.log('\nWorst understated:');
    for (const r of sorted.slice(0, 10)) console.log(`  ${r.num}. ${r.title}: ${r.claimed} -> ${r.modelMinutes} (+${r.modelMinutes - r.claimed})`);
    console.log('Worst overstated:');
    for (const r of sorted.slice(-5).reverse()) console.log(`  ${r.num}. ${r.title}: ${r.claimed} -> ${r.modelMinutes} (${r.modelMinutes - r.claimed})`);
    const mins = results.map(r => r.modelMinutes);
    console.log(`\nSpread: ${Math.min(...mins)}-${Math.max(...mins)} min, median ${mins.slice().sort((a, b) => a - b)[25]}`);
  }
}
