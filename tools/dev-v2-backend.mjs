import { readFileSync } from 'node:fs';
import { createServer } from '../coolify-backend/server.mjs';
import { createFakeDb } from '../coolify-backend/fake-db.mjs';

process.env.NODE_ENV ||= 'development';
process.env.PORT ||= '8787';
process.env.SESSION_SECRET ||= 'local-dev-session-secret-that-is-long-enough';
process.env.ADMIN_EMAIL ||= 'aarav@shah.so';
process.env.ADMIN_PASSWORD ||= 'learning-ai-admin-pass';
process.env.CORS_ORIGINS ||= [
  'http://127.0.0.1:8787',
  'http://localhost:8787',
  'http://127.0.0.1:8123',
  'http://localhost:8123',
  'http://127.0.0.1:8127',
  'http://localhost:8127'
].join(',');

function levelForLesson(num) {
  if (num <= 9) return 'foundation';
  if (num <= 24) return 'explorer';
  return 'builder';
}

function loadSeedLessons() {
  const seed = JSON.parse(readFileSync(new URL('../coolify-backend/curriculum-seed.json', import.meta.url), 'utf8'));
  return (seed.lessons || []).map((lesson, index) => ({
    id: lesson.id,
    num: Number(lesson.num) || index + 1,
    arc: lesson.arc || '',
    title: lesson.title || '',
    moduleId: String(lesson.arc || 'orientation').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    levelId: levelForLesson(Number(lesson.num) || index + 1),
    coreQuestion: lesson.coreQuestion || '',
    blurb: lesson.blurb || '',
    status: lesson.stub ? 'draft' : 'published',
    stub: Boolean(lesson.stub),
    sortOrder: Number(lesson.num) || index + 1,
    minutes: Number(lesson.minutes) || 8,
    resources: Array.isArray(lesson.resources) ? lesson.resources : [],
    steps: Array.isArray(lesson.steps) ? lesson.steps.map((step, stepIndex) => ({
      stepId: `${lesson.id}-step-${stepIndex + 1}`,
      stepIndex,
      kind: step.kind || 'reveal',
      gated: ['classify', 'exitCheck', 'toolkitSave', 'promptRepair', 'biasSpot', 'agentDesign', 'workflowChain'].includes(step.kind),
      title: step.title || '',
      payload: step
    })) : []
  }));
}

const db = createFakeDb({ lessons: loadSeedLessons() });
const server = createServer({ db });
const port = Number(process.env.PORT);

server.listen(port, '127.0.0.1', () => {
  console.log(`Learning AI local V2 backend on http://127.0.0.1:${port}`);
  console.log(`Admin login: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`);
});
