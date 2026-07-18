import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SOURCE_DIR = path.join(ROOT, 'lessons');
const OUTPUT = path.join(ROOT, 'v2', 'lessons.js');
const SEED_OUTPUT = path.join(ROOT, 'coolify-backend', 'curriculum-seed.json');
const CONTENT_VERSION = 'v2-2026-07-17-craft1';
const CHECK_ONLY = process.argv.includes('--check');

const arcs = (await import(pathToFileURL(path.join(SOURCE_DIR, '_arcs.mjs')).href)).default;
const files = fs.readdirSync(SOURCE_DIR).filter(file => /^chapter-\d+\.mjs$/.test(file));
const lessons = [];

for (const file of files) {
  const lesson = (await import(pathToFileURL(path.join(SOURCE_DIR, file)).href)).default;
  if (lesson?.num) lessons.push(lesson);
}

lessons.sort((a, b) => a.num - b.num);
const expected = Array.from({ length: 50 }, (_, index) => index + 1);
const nums = lessons.map(lesson => lesson.num);
const missing = expected.filter(num => !nums.includes(num));
const duplicates = nums.filter((num, index) => nums.indexOf(num) !== index);

if (missing.length || duplicates.length || lessons.length !== 50 || Object.keys(arcs).length !== 10) {
  throw new Error(`Invalid curriculum: ${lessons.length} lessons, ${Object.keys(arcs).length} arcs, missing [${missing}], duplicates [${duplicates}]`);
}

const output = `/* Learning AI V2 — lesson data. AUTO-GENERATED from ../lessons/chapter-N.mjs. */\n(function(){\n  window.V2_ARCS = ${JSON.stringify(arcs, null, 2)};\n  window.LESSONS = ${JSON.stringify(lessons, null, 2)};\n})();\n`;

const seedOutput = `${JSON.stringify({ version: CONTENT_VERSION, lessons }, null, 2)}\n`;

if (CHECK_ONLY) {
  const mismatches = [];
  if (!fs.existsSync(OUTPUT) || fs.readFileSync(OUTPUT, 'utf8') !== output) mismatches.push(path.relative(ROOT, OUTPUT));
  if (!fs.existsSync(SEED_OUTPUT) || fs.readFileSync(SEED_OUTPUT, 'utf8') !== seedOutput) mismatches.push(path.relative(ROOT, SEED_OUTPUT));
  if (mismatches.length) {
    throw new Error(`Generated curriculum is stale: ${mismatches.join(', ')}. Run node tools/build-lessons.mjs.`);
  }
  console.log(`Curriculum outputs match ${lessons.length} repository lessons across ${Object.keys(arcs).length} arcs.`);
} else {
  fs.writeFileSync(OUTPUT, output);
  fs.writeFileSync(SEED_OUTPUT, seedOutput);
  console.log(`Built ${OUTPUT} and ${SEED_OUTPUT}: ${lessons.length} lessons across ${Object.keys(arcs).length} arcs.`);
}
