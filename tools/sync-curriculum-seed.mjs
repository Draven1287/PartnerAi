import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const lessonsSource = new URL('v2/lessons.js', root);
const seedTarget = new URL('coolify-backend/curriculum-seed.json', root);

const context = { window: {} };
vm.createContext(context);
vm.runInContext(readFileSync(lessonsSource, 'utf8'), context, {
  filename: 'v2/lessons.js',
  timeout: 1000
});

if (!Array.isArray(context.window.LESSONS) || context.window.LESSONS.length === 0) {
  throw new Error('v2/lessons.js did not define window.LESSONS');
}

const seed = {
  version: 'v2-2026-06-01',
  lessons: context.window.LESSONS
};

writeFileSync(seedTarget, `${JSON.stringify(seed, null, 2)}\n`);
console.log(`Wrote ${context.window.LESSONS.length} lessons to coolify-backend/curriculum-seed.json`);
