import { existsSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;
const MIGRATION_VERSION = 9;
const CONTENT_VERSION = 'v2-2026-07-17';
const FREE_LESSON_NUMS = [1, 7, 11, 16, 21, 26, 31, 36, 41, 46];
const COURSE_LESSON_COUNT = 50;

const LESSONS = [
  ['chapter-1', 1, 'Orientation', 'Why AI matters - and why you stay in charge'],
  ['chapter-2', 2, 'Orientation', 'Your first useful AI conversation'],
  ['chapter-3', 3, 'Orientation', 'What AI actually is'],
  ['chapter-4', 4, 'Orientation', 'What an LLM is, without the magic'],
  ['chapter-5', 5, 'Orientation', 'Prompt repair: goal, context, constraints, format'],
  ['chapter-6', 6, 'Understanding', 'Data, training & patterns'],
  ['chapter-7', 7, 'Understanding', 'Context windows & memory'],
  ['chapter-8', 8, 'Understanding', 'Why AI hallucinates'],
  ['chapter-9', 9, 'Understanding', 'Models, tools & agents'],
  ['chapter-10', 10, 'Conversation & Prompting', 'Better follow-ups'],
  ['chapter-11', 11, 'Conversation & Prompting', 'Roles, formats & constraints'],
  ['chapter-12', 12, 'Conversation & Prompting', 'Getting AI to teach you'],
  ['chapter-13', 13, 'Judgment & Safety', 'Human agency'],
  ['chapter-14', 14, 'Judgment & Safety', 'Verification & sources'],
  ['chapter-15', 15, 'Judgment & Safety', 'Bias, fairness & perspective'],
  ['chapter-16', 16, 'Judgment & Safety', 'Privacy & personal data'],
  ['chapter-17', 17, 'Judgment & Safety', 'When not to use AI'],
  ['chapter-18', 18, 'Applying', 'Studying & school'],
  ['chapter-19', 19, 'Applying', 'Writing & research'],
  ['chapter-20', 20, 'Applying', 'Coding & debugging'],
  ['chapter-21', 21, 'Applying', 'Creative work'],
  ['chapter-22', 22, 'Applying', 'Personal productivity'],
  ['chapter-23', 23, 'Applying', 'Business & workflows'],
  ['chapter-24', 24, 'Applying', 'Teachers & classrooms'],
  ['chapter-25', 25, 'Building', 'From prompt to workflow'],
  ['chapter-26', 26, 'Building', 'Designing AI tools'],
  ['chapter-27', 27, 'Building', 'Intro to agents'],
  ['chapter-28', 28, 'Building', 'Voice agents & interfaces'],
  ['chapter-29', 29, 'Building', 'Evaluation & testing'],
  ['chapter-30', 30, 'Building', 'Build a capstone']
];

function emptyJson(value) {
  return value == null ? {} : value;
}

function rowUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role || 'learner',
    disabled: Boolean(row.disabled),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastActiveAt: row.last_active_at || '',
    deletedAt: row.deleted_at || ''
  };
}

function rowAdmin(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    role: 'admin',
    disabled: Boolean(row.disabled),
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at || ''
  };
}

function slug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function levelForLessonNum(num) {
  const n = Number(num) || 0;
  if (n >= 25) return 'builder';
  if (n >= 10) return 'explorer';
  return 'foundation';
}

function loadStaticLessons() {
  const fallback = LESSONS.map(([id, num, arc, title]) => ({
    id,
    num,
    arc,
    title,
    coreQuestion: '',
    blurb: '',
    minutes: 8,
    stub: true,
    resources: [],
    steps: []
  }));
  const seedFile = process.env.CURRICULUM_SEED_FILE
    ? pathToFileURL(process.env.CURRICULUM_SEED_FILE)
    : new URL('./curriculum-seed.json', import.meta.url);
  if (existsSync(seedFile)) {
    try {
      const parsed = JSON.parse(readFileSync(seedFile, 'utf8'));
      return Array.isArray(parsed.lessons) ? parsed.lessons : fallback;
    } catch {
      return fallback;
    }
  }

  const source = new URL('../v2/lessons.js', import.meta.url);
  if (!existsSync(source)) return fallback;
  try {
    const context = { window: {} };
    vm.createContext(context);
    vm.runInContext(readFileSync(source, 'utf8'), context, { filename: 'v2/lessons.js', timeout: 1000 });
    return Array.isArray(context.window.LESSONS) ? context.window.LESSONS : fallback;
  } catch {
    return fallback;
  }
}

function publicStepPayload(step) {
  const payload = { ...emptyJson(step) };
  delete payload.kind;
  return payload;
}

export function createDb(options = {}) {
  const connectionString = options.connectionString || process.env.DATABASE_URL;
  const poolConfig = connectionString ? { connectionString } : {
    host: options.host || process.env.POSTGRES_HOST || '127.0.0.1',
    port: Number(options.port || process.env.POSTGRES_PORT || 5432),
    database: options.database || process.env.POSTGRES_DB || 'learningai',
    user: options.user || process.env.POSTGRES_USER || 'learningai',
    password: options.password || process.env.POSTGRES_PASSWORD
  };
  if (!connectionString && !poolConfig.password) {
    throw new Error('DATABASE_URL or POSTGRES_PASSWORD is required for the Learning AI backend');
  }

  const pool = new Pool({
    ...poolConfig,
    ssl: String(process.env.DATABASE_SSL || '').toLowerCase() === 'true' ? { rejectUnauthorized: false } : undefined,
    max: Number(process.env.PG_POOL_MAX || 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: Number(process.env.PG_CONNECT_TIMEOUT_MS || 10_000),
    statement_timeout: Number(process.env.PG_STATEMENT_TIMEOUT_MS || 15_000),
    query_timeout: Number(process.env.PG_QUERY_TIMEOUT_MS || 20_000)
  });

  async function query(text, params = []) {
    return pool.query(text, params);
  }

  async function transaction(fn) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn((text, params = []) => client.query(text, params));
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async function init() {
    await query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    await query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version integer PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`);

    const current = await query('SELECT max(version)::int AS version FROM schema_migrations');
    const version = current.rows[0]?.version || 0;
    if (version < 1) await migrateV1();
    if (version < 2) await migrateV2();
    if (version < 3) await migrateV3();
    if (version < 4) await migrateV4();
    if (version < 5) await migrateV5();
    if (version < 6) await migrateV6();
    if (version < 7) await migrateV7();
    if (version < 8) await migrateV8();
  if (version < 9) await migrateV9();
    await seedLessons();
    await seedAdmin();
    await importLegacyJsonStore();
  }

  async function migrateV1() {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email text NOT NULL UNIQUE,
        password_hash text NOT NULL,
        display_name text NOT NULL,
        role text NOT NULL DEFAULT 'learner',
        disabled boolean NOT NULL DEFAULT false,
        email_verified_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        last_active_at timestamptz,
        deleted_at timestamptz
      );

      -- The first Railway test backend created a smaller users table before
      -- schema_migrations existed. Repair that table in place so existing test
      -- accounts are preserved and the versioned schema can take over.
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'learner',
        ADD COLUMN IF NOT EXISTS disabled boolean NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS email_verified_at timestamptz,
        ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now(),
        ADD COLUMN IF NOT EXISTS last_active_at timestamptz,
        ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

      CREATE TABLE IF NOT EXISTS user_profiles (
        user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        learner_stage text,
        goal text,
        confidence text,
        learning_style text,
        concern text,
        focus_area text,
        consent_json jsonb NOT NULL DEFAULT '{}'::jsonb,
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email text NOT NULL UNIQUE,
        password_hash text NOT NULL,
        disabled boolean NOT NULL DEFAULT false,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        last_login_at timestamptz
      );

      CREATE TABLE IF NOT EXISTS sessions (
        token_hash text PRIMARY KEY,
        kind text NOT NULL CHECK (kind IN ('learner', 'admin')),
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        admin_user_id uuid REFERENCES admin_users(id) ON DELETE CASCADE,
        csrf_token_hash text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        last_seen_at timestamptz NOT NULL DEFAULT now(),
        expires_at timestamptz NOT NULL,
        CHECK ((kind = 'learner' AND user_id IS NOT NULL AND admin_user_id IS NULL) OR (kind = 'admin' AND admin_user_id IS NOT NULL AND user_id IS NULL))
      );

      CREATE TABLE IF NOT EXISTS lessons (
        id text PRIMARY KEY,
        num integer NOT NULL UNIQUE,
        arc text NOT NULL,
        title text NOT NULL,
        minutes_estimate integer NOT NULL DEFAULT 8,
        content_version text NOT NULL DEFAULT 'v2-2026-06-01'
      );

      CREATE TABLE IF NOT EXISTS lesson_steps (
        lesson_id text NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
        step_index integer NOT NULL,
        kind text NOT NULL,
        gated boolean NOT NULL DEFAULT false,
        content_version text NOT NULL DEFAULT 'v2-2026-06-01',
        PRIMARY KEY (lesson_id, step_index)
      );

      CREATE TABLE IF NOT EXISTS assessment_attempts (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        started_at timestamptz NOT NULL DEFAULT now(),
        completed_at timestamptz,
        score_raw numeric,
        score_percent numeric,
        route text,
        level text,
        content_version text NOT NULL DEFAULT 'v2-2026-06-01'
      );

      CREATE TABLE IF NOT EXISTS assessment_responses (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        attempt_id uuid NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
        question_key text,
        category text,
        selected_value text,
        selected_label text,
        score numeric,
        free_text text
      );

      CREATE TABLE IF NOT EXISTS assessment_results (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        attempt_id uuid NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
        level text,
        focus_area text,
        primary_goal text,
        learning_style text,
        main_concern text,
        calculated_json jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS learner_state (
        user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        current_lesson_id text REFERENCES lessons(id),
        current_step_index integer NOT NULL DEFAULT 0,
        last_assessment_result_id uuid REFERENCES assessment_results(id),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS lesson_progress (
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lesson_id text NOT NULL REFERENCES lessons(id),
        status text NOT NULL DEFAULT 'started',
        started_at timestamptz NOT NULL DEFAULT now(),
        completed_at timestamptz,
        percent numeric NOT NULL DEFAULT 0,
        last_step_index integer NOT NULL DEFAULT 0,
        updated_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (user_id, lesson_id)
      );

      CREATE TABLE IF NOT EXISTS lesson_step_progress (
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lesson_id text NOT NULL REFERENCES lessons(id),
        step_index integer NOT NULL,
        status text NOT NULL DEFAULT 'seen',
        first_seen_at timestamptz NOT NULL DEFAULT now(),
        completed_at timestamptz,
        PRIMARY KEY (user_id, lesson_id, step_index)
      );

      CREATE TABLE IF NOT EXISTS interaction_answers (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lesson_id text NOT NULL REFERENCES lessons(id),
        step_index integer NOT NULL,
        interaction_kind text NOT NULL,
        answer_json jsonb NOT NULL DEFAULT '{}'::jsonb,
        correct boolean,
        attempt_number integer NOT NULL DEFAULT 1,
        content_version text NOT NULL DEFAULT 'v2-2026-06-01',
        answered_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS toolkit_cards (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lesson_id text REFERENCES lessons(id),
        card_type text NOT NULL,
        title text,
        fields_json jsonb NOT NULL DEFAULT '{}'::jsonb,
        source_key text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        archived_at timestamptz,
        UNIQUE (user_id, source_key)
      );

      CREATE TABLE IF NOT EXISTS learning_minutes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES users(id) ON DELETE SET NULL,
        lesson_id text REFERENCES lessons(id),
        display_name text,
        name_key text,
        date date NOT NULL DEFAULT current_date,
        minutes integer NOT NULL CHECK (minutes > 0 AND minutes <= 300),
        source text NOT NULL DEFAULT 'frontend',
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS page_visits (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        path text NOT NULL,
        referrer text,
        visited_at timestamptz NOT NULL DEFAULT now(),
        duration_seconds integer
      );

      CREATE TABLE IF NOT EXISTS audit_events (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        admin_user_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
        event_name text NOT NULL,
        target_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
        payload jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash text NOT NULL UNIQUE,
        created_at timestamptz NOT NULL DEFAULT now(),
        expires_at timestamptz NOT NULL,
        used_at timestamptz
      );

      CREATE TABLE IF NOT EXISTS legacy_imports (
        source text PRIMARY KEY,
        imported_at timestamptz NOT NULL DEFAULT now(),
        imported_counts jsonb NOT NULL DEFAULT '{}'::jsonb
      );

      CREATE INDEX IF NOT EXISTS users_last_active_idx ON users(last_active_at);
      CREATE INDEX IF NOT EXISTS sessions_user_seen_idx ON sessions(user_id, last_seen_at DESC);
      CREATE INDEX IF NOT EXISTS page_visits_visited_at_idx ON page_visits(visited_at DESC);
      CREATE INDEX IF NOT EXISTS page_visits_user_idx ON page_visits(user_id, visited_at DESC);
      CREATE INDEX IF NOT EXISTS page_visits_path_idx ON page_visits(path, visited_at DESC);
      CREATE INDEX IF NOT EXISTS lesson_progress_completed_idx ON lesson_progress(user_id, completed_at);
      CREATE INDEX IF NOT EXISTS interaction_user_step_idx ON interaction_answers(user_id, lesson_id, step_index, answered_at DESC);
      CREATE INDEX IF NOT EXISTS interaction_difficulty_idx ON interaction_answers(lesson_id, step_index, correct);
      CREATE INDEX IF NOT EXISTS assessment_user_idx ON assessment_attempts(user_id, completed_at DESC);
      CREATE INDEX IF NOT EXISTS toolkit_user_idx ON toolkit_cards(user_id, created_at DESC);
      CREATE INDEX IF NOT EXISTS minutes_user_date_idx ON learning_minutes(user_id, date);
      CREATE INDEX IF NOT EXISTS audit_events_name_idx ON audit_events(event_name, created_at DESC);
    `);
    await query('INSERT INTO schema_migrations(version) VALUES (1) ON CONFLICT DO NOTHING');
  }

  async function migrateV2() {
    await query(`
      CREATE TABLE IF NOT EXISTS curriculum_modules (
        id text PRIMARY KEY,
        title text NOT NULL,
        sort_order integer NOT NULL,
        status text NOT NULL DEFAULT 'published',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      ALTER TABLE lessons
        ADD COLUMN IF NOT EXISTS module_id text REFERENCES curriculum_modules(id),
        ADD COLUMN IF NOT EXISTS core_question text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS blurb text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
        ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS published_version text NOT NULL DEFAULT 'v2-2026-06-01',
        ADD COLUMN IF NOT EXISTS resources_json jsonb NOT NULL DEFAULT '[]'::jsonb;

      ALTER TABLE lesson_steps
        ADD COLUMN IF NOT EXISTS step_id text,
        ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS payload_json jsonb NOT NULL DEFAULT '{}'::jsonb;

      CREATE INDEX IF NOT EXISTS lessons_module_order_idx ON lessons(module_id, sort_order);
      CREATE INDEX IF NOT EXISTS lesson_steps_order_idx ON lesson_steps(lesson_id, sort_order);
    `);
    await query('INSERT INTO schema_migrations(version) VALUES (2) ON CONFLICT DO NOTHING');
  }

  async function migrateV3() {
    await query(`
      CREATE TABLE IF NOT EXISTS quiz_submissions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lesson_id text NOT NULL REFERENCES lessons(id),
        step_index integer NOT NULL,
        quiz_key text,
        answer_json jsonb NOT NULL DEFAULT '{}'::jsonb,
        correct boolean,
        feedback text,
        submitted_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS activity_completions (
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lesson_id text NOT NULL REFERENCES lessons(id),
        step_index integer NOT NULL,
        activity_kind text NOT NULL,
        activity_key text,
        payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
        completed_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (user_id, lesson_id, step_index, activity_kind)
      );

      CREATE INDEX IF NOT EXISTS quiz_submissions_user_idx ON quiz_submissions(user_id, lesson_id, submitted_at DESC);
      CREATE INDEX IF NOT EXISTS quiz_submissions_difficulty_idx ON quiz_submissions(lesson_id, step_index, correct);
      CREATE INDEX IF NOT EXISTS activity_completions_user_idx ON activity_completions(user_id, lesson_id, completed_at DESC);
    `);
    await query('INSERT INTO schema_migrations(version) VALUES (3) ON CONFLICT DO NOTHING');
  }

  async function migrateV4() {
    await query(`
      CREATE TABLE IF NOT EXISTS ai_feedback_requests (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lesson_id text REFERENCES lessons(id),
        step_index integer,
        request_type text NOT NULL,
        prompt_json jsonb NOT NULL DEFAULT '{}'::jsonb,
        status text NOT NULL DEFAULT 'queued',
        created_at timestamptz NOT NULL DEFAULT now(),
        resolved_at timestamptz
      );

      CREATE TABLE IF NOT EXISTS project_reviews (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title text NOT NULL,
        project_url text,
        artifact_json jsonb NOT NULL DEFAULT '{}'::jsonb,
        status text NOT NULL DEFAULT 'queued',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS tutor_sessions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lesson_id text REFERENCES lessons(id),
        topic text NOT NULL,
        status text NOT NULL DEFAULT 'open',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS tutor_messages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id uuid NOT NULL REFERENCES tutor_sessions(id) ON DELETE CASCADE,
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role text NOT NULL CHECK (role IN ('learner', 'assistant', 'admin')),
        content text NOT NULL,
        metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS progress_insights (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        insight_type text NOT NULL,
        title text NOT NULL,
        body text NOT NULL,
        payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now(),
        read_at timestamptz
      );

      CREATE INDEX IF NOT EXISTS ai_feedback_user_idx ON ai_feedback_requests(user_id, created_at DESC);
      CREATE INDEX IF NOT EXISTS ai_feedback_status_idx ON ai_feedback_requests(status, created_at DESC);
      CREATE INDEX IF NOT EXISTS project_reviews_user_idx ON project_reviews(user_id, created_at DESC);
      CREATE INDEX IF NOT EXISTS tutor_sessions_user_idx ON tutor_sessions(user_id, updated_at DESC);
      CREATE INDEX IF NOT EXISTS tutor_messages_session_idx ON tutor_messages(session_id, created_at ASC);
      CREATE INDEX IF NOT EXISTS progress_insights_user_idx ON progress_insights(user_id, created_at DESC);
    `);
    await query('INSERT INTO schema_migrations(version) VALUES (4) ON CONFLICT DO NOTHING');
  }

  async function migrateV5() {
    await query(`
      CREATE TABLE IF NOT EXISTS curriculum_tracks (
        id text PRIMARY KEY,
        title text NOT NULL,
        description text NOT NULL DEFAULT '',
        sort_order integer NOT NULL DEFAULT 0,
        status text NOT NULL DEFAULT 'published',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS curriculum_levels (
        id text PRIMARY KEY,
        title text NOT NULL,
        description text NOT NULL DEFAULT '',
        sort_order integer NOT NULL DEFAULT 0,
        status text NOT NULL DEFAULT 'published',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      ALTER TABLE curriculum_modules
        ADD COLUMN IF NOT EXISTS track_id text REFERENCES curriculum_tracks(id);

      ALTER TABLE lessons
        ADD COLUMN IF NOT EXISTS level_id text REFERENCES curriculum_levels(id);

      CREATE INDEX IF NOT EXISTS curriculum_modules_track_idx ON curriculum_modules(track_id, sort_order);
      CREATE INDEX IF NOT EXISTS lessons_level_order_idx ON lessons(level_id, sort_order);
    `);
    await query('INSERT INTO schema_migrations(version) VALUES (5) ON CONFLICT DO NOTHING');
  }

  async function migrateV6() {
    await query(`
      CREATE TABLE IF NOT EXISTS access_products (
        id text PRIMARY KEY,
        title text NOT NULL,
        description text NOT NULL DEFAULT '',
        billing_mode text NOT NULL CHECK (billing_mode IN ('free', 'one_time', 'subscription')),
        status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'retired')),
        metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS user_entitlements (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id text NOT NULL REFERENCES access_products(id),
        grant_type text NOT NULL CHECK (grant_type IN ('purchase', 'admin', 'legacy', 'scholarship', 'subscription')),
        status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'refunded', 'revoked')),
        provider text,
        external_customer_id text,
        external_reference text,
        starts_at timestamptz NOT NULL DEFAULT now(),
        ends_at timestamptz,
        metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE (user_id, product_id, external_reference)
      );

      CREATE TABLE IF NOT EXISTS payment_events (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        provider text NOT NULL,
        provider_event_id text NOT NULL,
        event_type text NOT NULL,
        status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processed', 'ignored', 'failed')),
        payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
        error_text text,
        received_at timestamptz NOT NULL DEFAULT now(),
        processed_at timestamptz,
        UNIQUE (provider, provider_event_id)
      );

      CREATE INDEX IF NOT EXISTS user_entitlements_active_idx
        ON user_entitlements(user_id, product_id, status, starts_at, ends_at);
      CREATE INDEX IF NOT EXISTS payment_events_status_idx
        ON payment_events(status, received_at);
    `);
    await query(`INSERT INTO access_products(id, title, description, billing_mode, status, metadata_json)
      VALUES
        ('core-50', 'Core 50', 'Permanent access to all 50 authored lessons, corrections, accessibility improvements, and learner-owned records.', 'one_time', 'draft', '{"permanent":true}'::jsonb),
        ('continuum', 'Continuum', 'Optional recurring value only when reviewed updates, new scenarios, coached practice, or team pathways can be sustained.', 'subscription', 'draft', '{"removesCoreOnCancel":false}'::jsonb)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        billing_mode = EXCLUDED.billing_mode,
        metadata_json = EXCLUDED.metadata_json,
        updated_at = now()`);
    await query('INSERT INTO schema_migrations(version) VALUES (6) ON CONFLICT DO NOTHING');
  }

  async function migrateV7() {
    await query(`
      CREATE UNIQUE INDEX IF NOT EXISTS interaction_transfer_id_unique
        ON interaction_answers(user_id, lesson_id, step_index, (answer_json->>'__clientTransferId'))
        WHERE answer_json ? '__clientTransferId';
      CREATE UNIQUE INDEX IF NOT EXISTS quiz_transfer_id_unique
        ON quiz_submissions(user_id, lesson_id, step_index, (answer_json->>'__clientTransferId'))
        WHERE answer_json ? '__clientTransferId';
    `);
    await query('INSERT INTO schema_migrations(version) VALUES (7) ON CONFLICT DO NOTHING');
  }

  async function migrateV8() {
    await query(`
      ALTER TABLE learning_minutes
        ADD COLUMN IF NOT EXISTS client_session_id text;
      CREATE UNIQUE INDEX IF NOT EXISTS learning_minutes_client_session_unique
        ON learning_minutes(user_id, client_session_id)
        WHERE user_id IS NOT NULL AND client_session_id IS NOT NULL;
    `);
    await query('INSERT INTO schema_migrations(version) VALUES (8) ON CONFLICT DO NOTHING');
  }

  /* Site feedback: what a learner thinks of the course. Distinct from
     ai_feedback_requests, which is feedback ON a learner's work. Four closed
     answers so the console can count them, and two free-text fields for the
     things a fixed list never anticipates.

     ON DELETE CASCADE, so deleting an account really does take the feedback
     with it. That loses a data point, which is the right trade: a learner who
     asks to be forgotten should not still be in the charts. */
  async function migrateV9() {
    await query(`
      CREATE TABLE IF NOT EXISTS site_feedback (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        going text NOT NULL,
        hardest text NOT NULL,
        snag text NOT NULL,
        recommend text NOT NULL,
        snag_detail text,
        comment text,
        lessons_done integer NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS site_feedback_created_idx ON site_feedback(created_at DESC);
      CREATE INDEX IF NOT EXISTS site_feedback_user_idx ON site_feedback(user_id, created_at DESC);
    `);
    await query('INSERT INTO schema_migrations(version) VALUES (9) ON CONFLICT DO NOTHING');
  }

  async function seedLessons() {
    const lessons = loadStaticLessons();
    await query(`INSERT INTO curriculum_tracks(id, title, description, sort_order, status)
      VALUES ('core-ai-literacy', 'Core AI Literacy', 'The main Learning AI path from beginner understanding to useful AI workflows.', 1, 'published')
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        sort_order = EXCLUDED.sort_order,
        status = EXCLUDED.status,
        updated_at = now()`);
    const levels = [
      ['foundation', 'Foundation', 'Understand what AI is, how to talk to it, and why the human stays in charge.', 1],
      ['explorer', 'Explorer', 'Use AI with judgment across conversation, verification, safety, and applied work.', 2],
      ['builder', 'Builder', 'Design workflows, tools, agents, evaluations, and a capstone project.', 3]
    ];
    for (const [id, title, description, sortOrder] of levels) {
      await query(`INSERT INTO curriculum_levels(id, title, description, sort_order, status)
        VALUES ($1, $2, $3, $4, 'published')
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          sort_order = EXCLUDED.sort_order,
          status = EXCLUDED.status,
          updated_at = now()`, [id, title, description, sortOrder]);
    }

    const moduleTitles = [...new Set(lessons.map(lesson => lesson.arc).filter(Boolean))];
    for (const [index, title] of moduleTitles.entries()) {
      await query(`INSERT INTO curriculum_modules(id, title, track_id, sort_order, status, updated_at)
        VALUES ($1, $2, 'core-ai-literacy', $3, 'published', now())
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          track_id = EXCLUDED.track_id,
          sort_order = EXCLUDED.sort_order,
          status = EXCLUDED.status,
          updated_at = now()`, [
        slug(title),
        title,
        index + 1
      ]);
    }

    for (const lesson of lessons) {
      const moduleId = slug(lesson.arc);
      const status = lesson.stub ? 'locked' : 'published';
      await query(`INSERT INTO lessons(id, num, arc, title, module_id, level_id, core_question, blurb, status, sort_order, minutes_estimate, published_version, resources_json)
        VALUES ($1, $2, $3, $4, NULLIF($5, ''), $6, $7, $8, $9, $10, $11, $12, $13::jsonb)
        ON CONFLICT (id) DO UPDATE SET
          num = EXCLUDED.num,
          arc = EXCLUDED.arc,
          title = EXCLUDED.title,
          module_id = EXCLUDED.module_id,
          level_id = EXCLUDED.level_id,
          core_question = EXCLUDED.core_question,
          blurb = EXCLUDED.blurb,
          status = EXCLUDED.status,
          sort_order = EXCLUDED.sort_order,
          minutes_estimate = EXCLUDED.minutes_estimate,
          published_version = EXCLUDED.published_version,
          resources_json = EXCLUDED.resources_json
        WHERE NOT EXISTS (
          SELECT 1 FROM audit_events ae
          WHERE ae.event_name IN ('curriculum_lesson_create', 'curriculum_lesson_update')
            AND ae.payload->>'lessonId' = lessons.id
        )`, [
        lesson.id,
        Number(lesson.num) || 0,
        String(lesson.arc || ''),
        String(lesson.title || ''),
        moduleId,
        levelForLessonNum(lesson.num),
        String(lesson.coreQuestion || ''),
        String(lesson.blurb || ''),
        status,
        Number(lesson.num) || 0,
        Number(lesson.minutes) || 8,
        CONTENT_VERSION,
        JSON.stringify(Array.isArray(lesson.resources) ? lesson.resources : [])
      ]);

      const stepsEdited = await query(`SELECT 1 FROM audit_events
        WHERE event_name = 'curriculum_steps_replace'
          AND payload->>'lessonId' = $1
        LIMIT 1`, [lesson.id]);
      if (!stepsEdited.rows.length) {
        const steps = Array.isArray(lesson.steps) ? lesson.steps : [];
        await query('DELETE FROM lesson_steps WHERE lesson_id = $1 AND step_index >= $2', [lesson.id, steps.length]);
        for (const [index, step] of steps.entries()) {
          await query(`INSERT INTO lesson_steps(lesson_id, step_index, kind, gated, content_version, step_id, title, sort_order, payload_json)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)
            ON CONFLICT (lesson_id, step_index) DO UPDATE SET
              kind = EXCLUDED.kind,
              gated = EXCLUDED.gated,
              content_version = EXCLUDED.content_version,
              step_id = EXCLUDED.step_id,
              title = EXCLUDED.title,
              sort_order = EXCLUDED.sort_order,
              payload_json = EXCLUDED.payload_json`, [
            lesson.id,
            index,
            String(step.kind || 'reveal'),
            ['classify', 'exitCheck', 'promptRepair', 'biasSpot', 'agentDesign', 'workflowChain', 'tryLive', 'verify'].includes(step.kind),
            CONTENT_VERSION,
            `${lesson.id}-step-${index + 1}`,
            String(step.title || ''),
            index,
            JSON.stringify(publicStepPayload(step))
          ]);
        }
      }
    }
  }

  async function importLegacyJsonStore() {
    const defaultImport = process.env.NODE_ENV === 'production' ? 'false' : 'true';
    if (String(process.env.IMPORT_LEGACY_JSON_STORE || defaultImport).toLowerCase() !== 'true') return;
    const source = process.env.LEGACY_STORE_FILE || '/app/data/learning-ai-store.json';
    if (!existsSync(source)) return;
    const already = await query('SELECT source FROM legacy_imports WHERE source = $1', [source]);
    if (already.rows.length) return;
    let legacy;
    try {
      legacy = JSON.parse(readFileSync(source, 'utf8'));
    } catch {
      return;
    }
    const counts = { users: 0, assessments: 0, progress: 0, interactions: 0, toolkit: 0, minutes: 0 };
    for (const user of Array.isArray(legacy.users) ? legacy.users : []) {
      if (!user?.id || !user?.email || !user?.passwordHash) continue;
      await query(`INSERT INTO users(id, email, password_hash, display_name, disabled, created_at, updated_at, last_active_at)
        VALUES ($1, $2, $3, $4, $5, COALESCE($6::timestamptz, now()), COALESCE($7::timestamptz, now()), $8::timestamptz)
        ON CONFLICT (id) DO NOTHING`, [
        user.id,
        String(user.email).toLowerCase(),
        user.passwordHash,
        user.displayName || String(user.email).split('@')[0],
        Boolean(user.disabled),
        user.createdAt || null,
        user.updatedAt || null,
        user.lastActiveAt || null
      ]);
      await query('INSERT INTO user_profiles(user_id) VALUES ($1) ON CONFLICT DO NOTHING', [user.id]);
      counts.users += 1;
    }
    for (const row of Array.isArray(legacy.assessments) ? legacy.assessments : []) {
      if (!row?.userId) continue;
      await saveAssessment(row.userId, row.payload || {});
      counts.assessments += 1;
    }
    for (const row of Array.isArray(legacy.progress) ? legacy.progress : []) {
      if (!row?.userId || !row?.lessonId) continue;
      await saveProgress(row.userId, { lessonId: row.lessonId, currentStep: row.currentStep || row.lastStepIndex || 0, completed: Boolean(row.completedAt) });
      counts.progress += 1;
    }
    for (const row of Array.isArray(legacy.interactions) ? legacy.interactions : []) {
      if (!row?.userId || !row?.lessonId) continue;
      await saveInteraction(row.userId, { lessonId: row.lessonId, stepIndex: row.stepIndex, stepKind: row.stepKind, payload: row.payload || {}, correct: row.correct });
      counts.interactions += 1;
    }
    for (const row of Array.isArray(legacy.toolkit) ? legacy.toolkit : []) {
      if (!row?.userId) continue;
      await saveToolkit(row.userId, { id: row.id, cardType: row.cardType || row.type || 'Toolkit card', lessonId: row.lessonId || '', title: row.title || '', payload: row.payload || row.fields || {} });
      counts.toolkit += 1;
    }
    for (const row of Array.isArray(legacy.minutes) ? legacy.minutes : []) {
      if (!row?.minutes) continue;
      await addMinutes({ userId: row.userId || null, name: row.name || 'Anonymous', nameKey: row.nameKey || 'anonymous', minutes: row.minutes, lessonId: row.lessonId || null, source: 'legacy-json-import' });
      counts.minutes += 1;
    }
    await query('INSERT INTO legacy_imports(source, imported_counts) VALUES ($1, $2::jsonb) ON CONFLICT DO NOTHING', [source, JSON.stringify(counts)]);
  }

  async function seedAdmin() {
    const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const plain = String(process.env.ADMIN_PASSWORD || '');
    const configuredHash = String(process.env.ADMIN_PASSWORD_HASH || '');
    if (!email || (!plain && !configuredHash)) return;
    const passwordHash = configuredHash || await bcrypt.hash(plain, 12);
    if (String(process.env.ADMIN_BOOTSTRAP_UPDATE || '').toLowerCase() === 'true') {
      await query(`INSERT INTO admin_users(email, password_hash)
        VALUES ($1, $2)
        ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = now()`, [email, passwordHash]);
      return;
    }
    await query(`INSERT INTO admin_users(email, password_hash)
      VALUES ($1, $2)
      ON CONFLICT (email) DO NOTHING`, [email, passwordHash]);
  }

  async function health() {
    const result = await query('SELECT max(version)::int AS version FROM schema_migrations');
    return { dbStatus: 'ok', migrationVersion: result.rows[0]?.version || 0 };
  }

  async function createUser({ email, passwordHash, displayName }) {
    const result = await query(`INSERT INTO users(email, password_hash, display_name, last_active_at)
      VALUES ($1, $2, $3, now()) RETURNING *`, [email, passwordHash, displayName]);
    await query('INSERT INTO user_profiles(user_id) VALUES ($1) ON CONFLICT DO NOTHING', [result.rows[0].id]);
    return rowUser(result.rows[0]);
  }

  async function findUserByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL', [email]);
    return result.rows[0] || null;
  }

  async function findUserById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL', [id]);
    return rowUser(result.rows[0]);
  }

  async function updateUserProfile({ userId, displayName }) {
    return transaction(async tx => {
      const current = await tx('SELECT display_name FROM users WHERE id = $1 AND deleted_at IS NULL FOR UPDATE', [userId]);
      if (!current.rows[0]) return null;
      const previousDisplayName = current.rows[0].display_name || '';
      const result = await tx('UPDATE users SET display_name = $2, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *', [userId, displayName]);
      if (previousDisplayName !== displayName) {
        await tx('INSERT INTO audit_events(event_name, target_user_id, payload) VALUES ($1, $2, $3::jsonb)', [
          'profile_name_change',
          userId,
          JSON.stringify({ previousDisplayName, displayName, source: 'learner' })
        ]);
      }
      return rowUser(result.rows[0]);
    });
  }

  async function deleteUserAccount(userId) {
    return transaction(async tx => {
      const current = await tx('SELECT id FROM users WHERE id = $1 AND deleted_at IS NULL FOR UPDATE', [userId]);
      if (!current.rows[0]) return false;
      // These two tables intentionally retain operational history when an
      // admin disables an account, so remove their learner-linked rows before
      // the hard delete. All other learner tables cascade from users.
      await tx('DELETE FROM learning_minutes WHERE user_id = $1', [userId]);
      await tx('DELETE FROM audit_events WHERE target_user_id = $1', [userId]);
      await tx('DELETE FROM users WHERE id = $1', [userId]);
      return true;
    });
  }

  async function findAdminByEmail(email) {
    const result = await query('SELECT * FROM admin_users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async function findAdminById(id) {
    const result = await query('SELECT * FROM admin_users WHERE id = $1', [id]);
    return rowAdmin(result.rows[0]);
  }

  async function createSession({ kind, userId = null, adminUserId = null, tokenHash, csrfTokenHash, expiresAt }) {
    await query(`INSERT INTO sessions(kind, user_id, admin_user_id, token_hash, csrf_token_hash, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6)`, [kind, userId, adminUserId, tokenHash, csrfTokenHash, expiresAt]);
    if (kind === 'admin') await query('UPDATE admin_users SET last_login_at = now(), updated_at = now() WHERE id = $1', [adminUserId]);
  }

  async function createPasswordResetToken({ email, tokenHash, expiresAt }) {
    const user = await findUserByEmail(email);
    if (!user || user.disabled) return null;
    await query('UPDATE password_reset_tokens SET used_at = now() WHERE user_id = $1 AND used_at IS NULL', [user.id]);
    await query(`INSERT INTO password_reset_tokens(user_id, token_hash, expires_at)
      VALUES ($1, $2, $3)`, [user.id, tokenHash, expiresAt]);
    return { userId: user.id };
  }

  async function confirmPasswordReset({ tokenHash, passwordHash }) {
    return transaction(async tx => {
      const token = await tx(`SELECT prt.id, prt.user_id
        FROM password_reset_tokens prt
        JOIN users u ON u.id = prt.user_id
        WHERE prt.token_hash = $1
          AND prt.used_at IS NULL
          AND prt.expires_at > now()
          AND u.disabled = false
          AND u.deleted_at IS NULL
        FOR UPDATE`, [tokenHash]);
      const row = token.rows[0];
      if (!row) return false;
      await tx('UPDATE users SET password_hash = $2, updated_at = now() WHERE id = $1', [row.user_id, passwordHash]);
      await tx('UPDATE password_reset_tokens SET used_at = now() WHERE id = $1', [row.id]);
      await tx('DELETE FROM sessions WHERE user_id = $1', [row.user_id]);
      return true;
    });
  }

  async function deleteSession(tokenHash) {
    if (!tokenHash) return;
    await query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash]);
  }

  async function rotateCsrf(tokenHash, csrfTokenHash) {
    await query('UPDATE sessions SET csrf_token_hash = $2, last_seen_at = now() WHERE token_hash = $1 AND expires_at > now()', [tokenHash, csrfTokenHash]);
  }

  async function sessionForToken(kind, tokenHash) {
    if (!tokenHash) return null;
    await query('DELETE FROM sessions WHERE expires_at <= now()');
    const result = await query('SELECT * FROM sessions WHERE token_hash = $1 AND kind = $2 AND expires_at > now()', [tokenHash, kind]);
    const session = result.rows[0];
    if (!session) return null;
    await query('UPDATE sessions SET last_seen_at = now() WHERE token_hash = $1', [tokenHash]);
    if (kind === 'learner') {
      const user = await findUserById(session.user_id);
      if (!user || user.disabled) return null;
      await touchUser(user.id);
      return { session, user };
    }
    const admin = await findAdminById(session.admin_user_id);
    if (!admin || admin.disabled) return null;
    return { session, admin };
  }

  async function touchUser(userId) {
    await query('UPDATE users SET last_active_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL', [userId]);
  }

  async function saveAssessment(userId, payload) {
    const p = emptyJson(payload);
    const scoreRaw = Number.isFinite(Number(p.scoreRaw ?? p.score)) ? Number(p.scoreRaw ?? p.score) : null;
    const scorePercent = Number.isFinite(Number(p.scorePercent ?? p.score)) ? Number(p.scorePercent ?? p.score) : null;
    const level = String(p.level || p.route || p.stage || '').slice(0, 120) || null;
    const route = String(p.route || p.level || '').slice(0, 120) || null;
    const attempt = await query(`INSERT INTO assessment_attempts(user_id, completed_at, score_raw, score_percent, route, level)
      VALUES ($1, now(), $2, $3, $4, $5) RETURNING id`, [userId, scoreRaw, scorePercent, route, level]);
    const attemptId = attempt.rows[0].id;

    const responses = Array.isArray(p.responses) ? p.responses : Array.isArray(p.answers) ? p.answers : [];
    for (const response of responses.slice(0, 80)) {
      await query(`INSERT INTO assessment_responses(attempt_id, question_key, category, selected_value, selected_label, score, free_text)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
        attemptId,
        String(response.key || response.questionKey || '').slice(0, 120) || null,
        String(response.category || '').slice(0, 120) || null,
        String(response.value || response.selectedValue || '').slice(0, 240) || null,
        String(response.label || response.selectedLabel || '').slice(0, 500) || null,
        Number.isFinite(Number(response.score)) ? Number(response.score) : null,
        String(response.freeText || response.text || '').slice(0, 2000) || null
      ]);
    }

    const result = await query(`INSERT INTO assessment_results(attempt_id, level, focus_area, primary_goal, learning_style, main_concern, calculated_json)
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb) RETURNING id`, [
      attemptId,
      level,
      String(p.focusArea || p.focus_area || '').slice(0, 160) || null,
      String(p.primaryGoal || p.goal || '').slice(0, 160) || null,
      String(p.learningStyle || p.learning_style || '').slice(0, 160) || null,
      String(p.mainConcern || p.concern || '').slice(0, 160) || null,
      JSON.stringify(p)
    ]);

    await query(`INSERT INTO learner_state(user_id, last_assessment_result_id, updated_at)
      VALUES ($1, $2, now())
      ON CONFLICT (user_id) DO UPDATE SET last_assessment_result_id = EXCLUDED.last_assessment_result_id, updated_at = now()`, [userId, result.rows[0].id]);
    await touchUser(userId);
  }

  async function saveProgress(userId, { lessonId, currentStep = 0, completed = false }) {
    const lesson = String(lessonId || '').trim();
    const step = Math.max(0, Number(currentStep) || 0);
    const status = completed ? 'completed' : 'started';
    const percent = completed ? 100 : Math.min(99, Math.max(1, Math.round((step + 1) * 12)));
    await query(`INSERT INTO lesson_progress(user_id, lesson_id, status, completed_at, percent, last_step_index, updated_at)
      VALUES ($1, $2, $3, CASE WHEN $4 THEN now() ELSE NULL END, $5, $6, now())
      ON CONFLICT (user_id, lesson_id) DO UPDATE SET
        status = CASE WHEN $4 THEN 'completed' ELSE lesson_progress.status END,
        completed_at = CASE WHEN $4 THEN COALESCE(lesson_progress.completed_at, now()) ELSE lesson_progress.completed_at END,
        percent = GREATEST(lesson_progress.percent, EXCLUDED.percent),
        last_step_index = GREATEST(lesson_progress.last_step_index, EXCLUDED.last_step_index),
        updated_at = now()`, [userId, lesson, status, completed, percent, step]);
    await query(`INSERT INTO lesson_step_progress(user_id, lesson_id, step_index, status, completed_at)
      VALUES ($1, $2, $3, $4, CASE WHEN $5 THEN now() ELSE NULL END)
      ON CONFLICT (user_id, lesson_id, step_index) DO UPDATE SET
        status = CASE WHEN $5 THEN 'completed' ELSE lesson_step_progress.status END,
        completed_at = CASE WHEN $5 THEN COALESCE(lesson_step_progress.completed_at, now()) ELSE lesson_step_progress.completed_at END`, [userId, lesson, step, completed ? 'completed' : 'seen', completed]);
    await query(`INSERT INTO learner_state(user_id, current_lesson_id, current_step_index, updated_at)
      VALUES ($1, $2, $3, now())
      ON CONFLICT (user_id) DO UPDATE SET current_lesson_id = $2, current_step_index = GREATEST(learner_state.current_step_index, $3), updated_at = now()`, [userId, lesson, step]);
    await touchUser(userId);
  }

  async function saveInteraction(userId, { lessonId, stepIndex = 0, stepKind = '', payload = {}, correct = null }) {
    const lesson = String(lessonId || '').trim();
    const step = Math.max(0, Number(stepIndex) || 0);
    const clientTransferId = String(payload?.__clientTransferId || '').slice(0, 200);
    if (clientTransferId) {
      const existing = await query(`SELECT 1 FROM interaction_answers
        WHERE user_id = $1 AND lesson_id = $2 AND step_index = $3
          AND answer_json->>'__clientTransferId' = $4
        LIMIT 1`, [userId, lesson, step, clientTransferId]);
      if (existing.rowCount) return;
    }
    const count = await query('SELECT count(*)::int AS count FROM interaction_answers WHERE user_id = $1 AND lesson_id = $2 AND step_index = $3', [userId, lesson, step]);
    await query(`INSERT INTO interaction_answers(user_id, lesson_id, step_index, interaction_kind, answer_json, correct, attempt_number)
      VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
      ON CONFLICT DO NOTHING`, [
      userId,
      lesson,
      step,
      String(stepKind || 'interaction').slice(0, 80),
      JSON.stringify(emptyJson(payload)),
      typeof correct === 'boolean' ? correct : null,
      (count.rows[0]?.count || 0) + 1
    ]);
    await query(`INSERT INTO lesson_step_progress(user_id, lesson_id, step_index, status, completed_at)
      VALUES ($1, $2, $3, 'completed', now())
      ON CONFLICT (user_id, lesson_id, step_index) DO UPDATE SET status = 'completed', completed_at = COALESCE(lesson_step_progress.completed_at, now())`, [userId, lesson, step]);
    await touchUser(userId);
  }

  async function saveQuizAnswer(userId, { lessonId, stepIndex = 0, quizKey = '', answer = {}, correct = null, feedback = '' }) {
    const lesson = String(lessonId || '').trim();
    const step = Math.max(0, Number(stepIndex) || 0);
    const clientTransferId = String(answer?.__clientTransferId || '').slice(0, 200);
    if (clientTransferId) {
      const existing = await query(`SELECT 1 FROM quiz_submissions
        WHERE user_id = $1 AND lesson_id = $2 AND step_index = $3
          AND answer_json->>'__clientTransferId' = $4
        LIMIT 1`, [userId, lesson, step, clientTransferId]);
      if (existing.rowCount) return;
    }
    await query(`INSERT INTO quiz_submissions(user_id, lesson_id, step_index, quiz_key, answer_json, correct, feedback)
      VALUES ($1, $2, $3, NULLIF($4, ''), $5::jsonb, $6, NULLIF($7, ''))
      ON CONFLICT DO NOTHING`, [
      userId,
      lesson,
      step,
      String(quizKey || '').slice(0, 120),
      JSON.stringify(emptyJson(answer)),
      typeof correct === 'boolean' ? correct : null,
      String(feedback || '').slice(0, 1000)
    ]);
    await saveInteraction(userId, {
      lessonId: lesson,
      stepIndex: step,
      stepKind: 'quiz',
      payload: { quizKey, answer, feedback },
      correct
    });
  }

  async function completeActivity(userId, { lessonId, stepIndex = 0, activityKind = 'activity', activityKey = '', payload = {} }) {
    const lesson = String(lessonId || '').trim();
    const step = Math.max(0, Number(stepIndex) || 0);
    const kind = String(activityKind || 'activity').slice(0, 80);
    await query(`INSERT INTO activity_completions(user_id, lesson_id, step_index, activity_kind, activity_key, payload_json, completed_at)
      VALUES ($1, $2, $3, $4, NULLIF($5, ''), $6::jsonb, now())
      ON CONFLICT (user_id, lesson_id, step_index, activity_kind) DO UPDATE SET
        activity_key = EXCLUDED.activity_key,
        payload_json = EXCLUDED.payload_json,
        completed_at = now()`, [
      userId,
      lesson,
      step,
      kind,
      String(activityKey || '').slice(0, 120),
      JSON.stringify(emptyJson(payload))
    ]);
    await query(`INSERT INTO lesson_step_progress(user_id, lesson_id, step_index, status, completed_at)
      VALUES ($1, $2, $3, 'completed', now())
      ON CONFLICT (user_id, lesson_id, step_index) DO UPDATE SET status = 'completed', completed_at = COALESCE(lesson_step_progress.completed_at, now())`, [userId, lesson, step]);
    await query(`INSERT INTO learner_state(user_id, current_lesson_id, current_step_index, updated_at)
      VALUES ($1, $2, $3, now())
      ON CONFLICT (user_id) DO UPDATE SET current_lesson_id = $2, current_step_index = GREATEST(learner_state.current_step_index, $3), updated_at = now()`, [userId, lesson, step]);
    await touchUser(userId);
  }

  async function saveToolkit(userId, { id = '', cardType, lessonId = null, title = '', payload = {}, fields = null }) {
    const sourceKey = id ? String(id).slice(0, 120) : null;
    const result = await query(`INSERT INTO toolkit_cards(user_id, lesson_id, card_type, title, fields_json, source_key)
      VALUES ($1, NULLIF($2, ''), $3, NULLIF($4, ''), $5::jsonb, $6)
      ON CONFLICT (user_id, source_key) DO UPDATE SET
        card_type = EXCLUDED.card_type,
        title = EXCLUDED.title,
        fields_json = EXCLUDED.fields_json,
        updated_at = now(),
        archived_at = NULL
      RETURNING id`, [
      userId,
      String(lessonId || ''),
      String(cardType || 'Toolkit card').slice(0, 120),
      String(title || cardType || '').slice(0, 180),
      JSON.stringify(fields || payload || {}),
      sourceKey
    ]);
    await touchUser(userId);
    return result.rows[0].id;
  }

  async function archiveToolkit(userId, id) {
    const result = await query(`UPDATE toolkit_cards
      SET archived_at = now(), updated_at = now()
      WHERE user_id = $1 AND archived_at IS NULL AND (id::text = $2 OR source_key = $2)
      RETURNING id`, [userId, String(id || '').slice(0, 120)]);
    if (result.rowCount) await touchUser(userId);
    return result.rowCount > 0;
  }

  async function addMinutes({ userId = null, name, nameKey, minutes, lessonId = null, source = 'frontend', clientSessionId = null }) {
    const result = await query(`INSERT INTO learning_minutes(user_id, lesson_id, display_name, name_key, minutes, source, client_session_id)
      VALUES ($1, NULLIF($2, ''), $3, $4, $5, $6, NULLIF($7, ''))
      ON CONFLICT (user_id, client_session_id)
        WHERE user_id IS NOT NULL AND client_session_id IS NOT NULL
      DO NOTHING
      RETURNING id`, [
      userId,
      String(lessonId || ''),
      name,
      nameKey,
      Math.round(Number(minutes)),
      source,
      String(clientSessionId || '').slice(0, 120)
    ]);
    if (userId && result.rowCount) await touchUser(userId);
    return result.rowCount > 0;
  }

  async function recordVisit(userId, { path = '/', referrer = '', durationSeconds = null }) {
    await query(`INSERT INTO page_visits(user_id, path, referrer, duration_seconds)
      VALUES ($1, $2, NULLIF($3, ''), $4)`, [userId, String(path).slice(0, 500), String(referrer).slice(0, 500), Number.isFinite(Number(durationSeconds)) ? Number(durationSeconds) : null]);
    await touchUser(userId);
  }

  async function importLocal(userId, payload) {
    const completed = payload?.progress?.completed || payload?.completed || {};
    for (const [lessonId, value] of Object.entries(completed)) {
      if (/^chapter-\d+$/.test(lessonId)) await saveProgress(userId, { lessonId, currentStep: 999, completed: true, completedAt: value?.completedAt });
    }
    const toolkit = Array.isArray(payload?.toolkit) ? payload.toolkit : [];
    for (const card of toolkit.slice(0, 100)) {
      await saveToolkit(userId, {
        id: card.id || `${card.lessonId || 'unknown'}-${card.createdAt || JSON.stringify(card).slice(0, 40)}`,
        cardType: card.type || card.cardType || 'Toolkit card',
        lessonId: card.lessonId || '',
        title: card.title || card.type || card.cardType || '',
        payload: card.fields || card.payload || card
      });
    }
  }

  async function curriculum({ includeDrafts = true } = {}) {
    const tracks = await query(`SELECT id, title, description, sort_order, status
      FROM curriculum_tracks
      ORDER BY sort_order ASC, title ASC`);
    const levels = await query(`SELECT id, title, description, sort_order, status
      FROM curriculum_levels
      ORDER BY sort_order ASC, title ASC`);
    const modules = await query(`SELECT id, title, track_id, sort_order, status
      FROM curriculum_modules
      ORDER BY sort_order ASC, title ASC`);
    const lessons = await query(`SELECT id, num, arc, title, module_id, level_id, core_question, blurb, status,
        sort_order, minutes_estimate, published_version, resources_json
      FROM lessons
      ORDER BY sort_order ASC, num ASC`);
    const steps = await query(`SELECT lesson_id, step_index, step_id, kind, gated, title, payload_json,
        sort_order, content_version
      FROM lesson_steps
      ORDER BY lesson_id ASC, sort_order ASC, step_index ASC`);

    const stepsByLesson = new Map();
    for (const row of steps.rows) {
      const list = stepsByLesson.get(row.lesson_id) || [];
      list.push({
        stepId: row.step_id || `${row.lesson_id}-step-${row.step_index + 1}`,
        stepIndex: row.step_index,
        kind: row.kind,
        gated: row.gated,
        title: row.title,
        sortOrder: row.sort_order,
        contentVersion: row.content_version,
        payload: row.payload_json || {}
      });
      stepsByLesson.set(row.lesson_id, list);
    }

    const lessonRows = lessons.rows.map(row => ({
      id: row.id,
      num: row.num,
      arc: row.arc,
      title: row.title,
      moduleId: row.module_id || '',
      levelId: row.level_id || levelForLessonNum(row.num),
      coreQuestion: row.core_question,
      blurb: row.blurb,
      status: row.status,
      stub: row.status !== 'published',
      sortOrder: row.sort_order,
      minutes: row.minutes_estimate,
      publishedVersion: row.published_version,
      resources: Array.isArray(row.resources_json) ? row.resources_json : [],
      steps: stepsByLesson.get(row.id) || []
    }));
    const visibleLessons = includeDrafts ? lessonRows : lessonRows.filter(lesson => lesson.status === 'published');
    const visibleModuleIds = new Set(visibleLessons.map(lesson => lesson.moduleId || slug(lesson.arc)));
    const visibleModules = includeDrafts ? modules.rows : modules.rows.filter(row => visibleModuleIds.has(row.id));

    const lessonsByModule = new Map();
    for (const lesson of visibleLessons) {
      const key = lesson.moduleId || slug(lesson.arc);
      const list = lessonsByModule.get(key) || [];
      list.push(lesson);
      lessonsByModule.set(key, list);
    }

    return {
      version: CONTENT_VERSION,
      tracks: tracks.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        sortOrder: row.sort_order,
        status: row.status,
        modules: visibleModules.filter(module => (module.track_id || 'core-ai-literacy') === row.id).map(module => module.id)
      })),
      levels: levels.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        sortOrder: row.sort_order,
        status: row.status,
        lessons: visibleLessons.filter(lesson => lesson.levelId === row.id).map(lesson => lesson.id)
      })),
      modules: visibleModules.map(row => ({
        id: row.id,
        title: row.title,
        trackId: row.track_id || 'core-ai-literacy',
        sortOrder: row.sort_order,
        status: row.status,
        lessons: lessonsByModule.get(row.id) || []
      })),
      lessons: visibleLessons
    };
  }

  async function curriculumLesson(lessonId, options = {}) {
    const all = await curriculum(options);
    return all.lessons.find(lesson => lesson.id === lessonId) || null;
  }

  async function adminCreateLesson({ adminUserId, lesson }) {
    const next = await query('SELECT COALESCE(max(num), 0)::int + 1 AS num FROM lessons');
    const requestedNum = Number(lesson.num);
    const num = lesson.num != null && Number.isInteger(requestedNum) ? requestedNum : next.rows[0].num;
    const lessonId = lesson.id || `chapter-${num}`;
    const conflict = await query('SELECT id FROM lessons WHERE id = $1 OR num = $2 LIMIT 1', [lessonId, num]);
    if (conflict.rows.length) return null;
    const arc = String(lesson.arc || 'Draft').slice(0, 120);
    const moduleId = slug(arc);
    if (moduleId) {
      await query(`INSERT INTO curriculum_modules(id, title, track_id, sort_order, status, updated_at)
        VALUES ($1, $2, 'core-ai-literacy', COALESCE((SELECT max(sort_order) + 1 FROM curriculum_modules), 1), 'published', now())
        ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, updated_at = now()`, [moduleId, arc]);
    }
    const result = await query(`INSERT INTO lessons(id, num, arc, title, module_id, level_id, core_question, blurb, status, sort_order, minutes_estimate, published_version, resources_json)
      VALUES ($1, $2, $3, $4, NULLIF($5, ''), $6, $7, $8, $9, $10, $11, $12, $13::jsonb)
      RETURNING id`, [
      lessonId,
      num,
      arc,
      String(lesson.title || 'Untitled lesson').slice(0, 180),
      moduleId,
      lesson.levelId || levelForLessonNum(num),
      String(lesson.coreQuestion || '').slice(0, 240),
      String(lesson.blurb || '').slice(0, 360),
      lesson.status || 'draft',
      Number.isFinite(Number(lesson.sortOrder)) ? Number(lesson.sortOrder) : num,
      Number.isFinite(Number(lesson.minutes)) ? Math.max(1, Math.min(60, Math.round(Number(lesson.minutes)))) : 8,
      CONTENT_VERSION,
      JSON.stringify(Array.isArray(lesson.resources) ? lesson.resources : [])
    ]);
    await audit({ adminUserId, eventName: 'curriculum_lesson_create', payload: { lessonId: result.rows[0].id, num } });
    return curriculumLesson(result.rows[0].id);
  }

  async function adminUpdateLesson({ adminUserId, lessonId, patch }) {
    const existing = await query('SELECT * FROM lessons WHERE id = $1', [lessonId]);
    const current = existing.rows[0];
    if (!current) return null;

    const arc = patch.arc == null ? current.arc : String(patch.arc).slice(0, 120);
    const moduleId = slug(arc);
    if (moduleId) {
      await query(`INSERT INTO curriculum_modules(id, title, track_id, sort_order, status, updated_at)
        VALUES ($1, $2, 'core-ai-literacy', COALESCE((SELECT max(sort_order) + 1 FROM curriculum_modules), 1), 'published', now())
        ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, updated_at = now()`, [moduleId, arc]);
    }

    const resources = Array.isArray(patch.resources) ? patch.resources.slice(0, 20).map(resource => ({
      label: String(resource.label || '').slice(0, 160),
      url: String(resource.url || '').slice(0, 500)
    })).filter(resource => resource.label && /^https:\/\//i.test(resource.url)) : current.resources_json;

    await query(`UPDATE lessons SET
        title = $2,
        arc = $3,
        module_id = NULLIF($4, ''),
        core_question = $5,
        blurb = $6,
        status = $7,
        sort_order = $8,
        minutes_estimate = $9,
        resources_json = $10::jsonb,
        level_id = $11
      WHERE id = $1`, [
      lessonId,
      patch.title == null ? current.title : String(patch.title).slice(0, 180),
      arc,
      moduleId,
      patch.coreQuestion == null ? current.core_question : String(patch.coreQuestion).slice(0, 240),
      patch.blurb == null ? current.blurb : String(patch.blurb).slice(0, 360),
      patch.status == null ? current.status : String(patch.status),
      Number.isFinite(Number(patch.sortOrder)) ? Number(patch.sortOrder) : current.sort_order,
      Number.isFinite(Number(patch.minutes)) ? Math.max(1, Math.min(60, Math.round(Number(patch.minutes)))) : current.minutes_estimate,
      JSON.stringify(resources || []),
      patch.levelId == null ? current.level_id || levelForLessonNum(current.num) : String(patch.levelId)
    ]);
    await audit({ adminUserId, eventName: 'curriculum_lesson_update', payload: { lessonId } });
    return curriculumLesson(lessonId);
  }

  async function adminReplaceLessonSteps({ adminUserId, lessonId, steps }) {
    const existing = await query('SELECT id FROM lessons WHERE id = $1', [lessonId]);
    if (!existing.rows.length) return null;
    const rows = steps.slice(0, 80).map((step, index) => ({
      stepIndex: Number.isFinite(Number(step.stepIndex)) ? Math.max(0, Math.round(Number(step.stepIndex))) : index,
      kind: String(step.kind || 'reveal').slice(0, 80),
      gated: Boolean(step.gated),
      stepId: String(step.stepId || `${lessonId}-step-${index + 1}`).slice(0, 160),
      title: String(step.title || step.payload?.title || '').slice(0, 180),
      payload: emptyJson(step.payload),
      sortOrder: Number.isFinite(Number(step.sortOrder)) ? Math.round(Number(step.sortOrder)) : index
    })).sort((a, b) => a.sortOrder - b.sortOrder || a.stepIndex - b.stepIndex);

    await transaction(async tx => {
      await tx('DELETE FROM lesson_steps WHERE lesson_id = $1', [lessonId]);
      for (const [index, step] of rows.entries()) {
        await tx(`INSERT INTO lesson_steps(lesson_id, step_index, kind, gated, content_version, step_id, title, sort_order, payload_json)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)`, [
          lessonId,
          index,
          step.kind,
          step.gated,
          CONTENT_VERSION,
          step.stepId,
          step.title,
          index,
          JSON.stringify(step.payload)
        ]);
      }
    });
    await audit({ adminUserId, eventName: 'curriculum_steps_replace', payload: { lessonId, stepCount: rows.length } });
    return curriculumLesson(lessonId);
  }

  async function adminPublishCurriculum({ adminUserId, lessonId = null }) {
    const version = `v2-${new Date().toISOString().slice(0, 10)}`;
    let result;
    if (lessonId) {
      result = await query(`UPDATE lessons
        SET status = 'published', published_version = $2
        WHERE id = $1 RETURNING id`, [lessonId, version]);
    } else {
      result = await query(`UPDATE lessons
        SET status = 'published', published_version = $1
        WHERE status = 'draft' RETURNING id`, [version]);
    }
    await audit({ adminUserId, eventName: 'curriculum_publish', payload: { lessonId, version, lessonCount: result.rowCount } });
    return { version, lessonCount: result.rowCount };
  }

  async function accessForUser(userId) {
    const [entitlements, lessonRows] = await Promise.all([
      query(`SELECT ue.product_id, ue.grant_type, ue.status, ue.starts_at, ue.ends_at,
          ue.provider, ue.external_reference, ap.title, ap.billing_mode
        FROM user_entitlements ue
        JOIN access_products ap ON ap.id = ue.product_id
        WHERE ue.user_id = $1
          AND ue.status = 'active'
          AND ue.starts_at <= now()
          AND (ue.ends_at IS NULL OR ue.ends_at > now())
        ORDER BY ue.created_at ASC`, [userId]),
      query(`SELECT id, num FROM lessons WHERE status = 'published' ORDER BY num ASC`)
    ]);
    const active = entitlements.rows.map(row => ({
      productId: row.product_id,
      title: row.title,
      billingMode: row.billing_mode,
      grantType: row.grant_type,
      startsAt: row.starts_at,
      endsAt: row.ends_at || null
    }));
    const coreOwned = active.some(item => item.productId === 'core-50');
    const continuumActive = active.some(item => item.productId === 'continuum');
    const freeLessonIds = lessonRows.rows.filter(row => FREE_LESSON_NUMS.includes(row.num)).map(row => row.id);
    const enforcementEnabled = String(process.env.ENFORCE_COURSE_ACCESS || '').toLowerCase() === 'true';
    const allowedLessonIds = enforcementEnabled && !coreOwned
      ? freeLessonIds
      : lessonRows.rows.map(row => row.id);
    return {
      model: 'learn-first-permanent-core',
      enforcementEnabled,
      accessMode: enforcementEnabled ? (coreOwned ? 'core-owner' : 'free-path') : 'preview',
      coreOwned,
      continuumActive,
      freeLessonIds,
      allowedLessonIds,
      entitlements: active,
      promises: {
        coreIsPermanent: true,
        subscriptionRequiredForCore: false,
        cancellingContinuumRemovesCore: false,
        lessonsContainSalesGates: false
      }
    };
  }

  async function stateForUser(userId) {
    const user = await findUserById(userId);
    const assessment = await query(`SELECT ar.calculated_json, ar.created_at, ar.level, ar.focus_area, ar.primary_goal, ar.learning_style, ar.main_concern
      FROM assessment_results ar JOIN assessment_attempts aa ON aa.id = ar.attempt_id
      WHERE aa.user_id = $1 ORDER BY ar.created_at DESC LIMIT 1`, [userId]);
    const progress = await query('SELECT lesson_id, last_step_index, completed_at, updated_at FROM lesson_progress WHERE user_id = $1 ORDER BY lesson_id', [userId]);
    const toolkit = await query(`SELECT id, card_type, lesson_id, title, fields_json, created_at, updated_at
      FROM toolkit_cards WHERE user_id = $1 AND archived_at IS NULL ORDER BY updated_at DESC LIMIT 100`, [userId]);
    const minutes = await query('SELECT COALESCE(sum(minutes), 0)::int AS total_minutes, count(*)::int AS entries FROM learning_minutes WHERE user_id = $1', [userId]);
    const learnerState = await query('SELECT current_lesson_id, current_step_index, updated_at FROM learner_state WHERE user_id = $1', [userId]);
    return {
      user,
      access: await accessForUser(userId),
      assessment: assessment.rows[0] ? { ...assessment.rows[0].calculated_json, updatedAt: assessment.rows[0].created_at } : null,
      learnerState: learnerState.rows[0] || null,
      progress: progress.rows.map(row => ({ lessonId: row.lesson_id, currentStep: row.last_step_index, completedAt: row.completed_at || '', updatedAt: row.updated_at })),
      toolkit: toolkit.rows.map(row => ({ id: row.id, cardType: row.card_type, lessonId: row.lesson_id, title: row.title, payload: row.fields_json, createdAt: row.created_at, updatedAt: row.updated_at })),
      minutes: { totalMinutes: minutes.rows[0].total_minutes, entries: minutes.rows[0].entries }
    };
  }

  async function dashboardForUser(userId) {
    const [state, course, quizTotals, activityTotals] = await Promise.all([
      stateForUser(userId),
      curriculum({ includeDrafts: false }),
      query('SELECT count(*)::int AS count, count(CASE WHEN correct = false THEN 1 END)::int AS incorrect FROM quiz_submissions WHERE user_id = $1', [userId]),
      query('SELECT count(*)::int AS count, max(completed_at) AS last_completed_at FROM activity_completions WHERE user_id = $1', [userId])
    ]);
    const completed = new Set((state.progress || []).filter(row => row.completedAt).map(row => row.lessonId));
    const authoredLessons = course.lessons.filter(lesson => !lesson.stub);
    const nextLesson = authoredLessons.find(lesson => !completed.has(lesson.id)) || null;
    const completedLessons = authoredLessons.filter(lesson => completed.has(lesson.id)).length;
    const modules = course.modules.map(module => {
      const lessons = module.lessons.filter(lesson => !lesson.stub);
      const completedInModule = lessons.filter(lesson => completed.has(lesson.id)).length;
      return {
        id: module.id,
        title: module.title,
        completedLessons: completedInModule,
        totalLessons: lessons.length
      };
    });
    return {
      user: state.user,
      access: state.access,
      assessment: state.assessment,
      currentLesson: state.learnerState?.current_lesson_id || nextLesson?.id || '',
      currentStep: state.learnerState?.current_step_index || 0,
      nextLesson,
      completedLessons,
      totalLessons: authoredLessons.length,
      completionPercent: authoredLessons.length ? Math.round((completedLessons / authoredLessons.length) * 100) : 0,
      minutes: state.minutes,
      toolkitCount: state.toolkit.length,
      quizSubmissions: quizTotals.rows[0]?.count || 0,
      incorrectQuizSubmissions: quizTotals.rows[0]?.incorrect || 0,
      completedActivities: activityTotals.rows[0]?.count || 0,
      lastActivityCompletedAt: activityTotals.rows[0]?.last_completed_at || '',
      modules
    };
  }

  /* One row per submission. A learner may answer more than once — a view
     three lessons in and one at lesson forty are different data points, and
     silently overwriting the first would hide exactly the change worth seeing. */
  async function createSiteFeedback(userId, entry) {
    const result = await query(`INSERT INTO site_feedback(
        user_id, going, hardest, snag, recommend, snag_detail, comment, lessons_done)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, created_at`, [
      userId, entry.going, entry.hardest, entry.snag, entry.recommend,
      entry.snagDetail || null, entry.comment || null, Number(entry.lessonsDone) || 0
    ]);
    return { id: result.rows[0].id, createdAt: result.rows[0].created_at };
  }

  const feedbackTally = async column => {
    // Column is never caller-supplied: the four names are fixed below.
    const result = await query(
      `SELECT ${column} AS value, count(*)::int AS count FROM site_feedback GROUP BY 1 ORDER BY 2 DESC`);
    return result.rows.map(row => ({ value: row.value, count: row.count }));
  };

  /* Everything the console needs in one round trip: the four tallies it draws,
     the free text it lists, and the counts that give those numbers a scale. */
  async function siteFeedbackSummary({ limit = 40 } = {}) {
    const [going, hardest, snag, recommend, totals, recent] = await Promise.all([
      feedbackTally('going'),
      feedbackTally('hardest'),
      feedbackTally('snag'),
      feedbackTally('recommend'),
      query(`SELECT count(*)::int AS responses,
                    count(DISTINCT user_id)::int AS learners,
                    max(created_at) AS latest,
                    avg(lessons_done)::float AS mean_lessons
             FROM site_feedback`),
      query(`SELECT sf.id, sf.going, sf.hardest, sf.snag, sf.recommend, sf.snag_detail,
                    sf.comment, sf.lessons_done, sf.created_at, u.display_name, u.email
             FROM site_feedback sf JOIN users u ON u.id = sf.user_id
             WHERE (sf.snag_detail IS NOT NULL AND sf.snag_detail <> '')
                OR (sf.comment IS NOT NULL AND sf.comment <> '')
             ORDER BY sf.created_at DESC LIMIT $1`, [Math.min(Number(limit) || 40, 200)])
    ]);
    const row = totals.rows[0] || {};
    return {
      responses: row.responses || 0,
      learners: row.learners || 0,
      latest: row.latest || null,
      meanLessons: row.mean_lessons == null ? null : Math.round(row.mean_lessons * 10) / 10,
      tallies: { going, hardest, snag, recommend },
      written: recent.rows.map(item => ({
        id: item.id,
        going: item.going,
        hardest: item.hardest,
        snag: item.snag,
        recommend: item.recommend,
        snagDetail: item.snag_detail || '',
        comment: item.comment || '',
        lessonsDone: item.lessons_done,
        createdAt: item.created_at,
        displayName: item.display_name || '',
        email: item.email || ''
      }))
    };
  }

  async function createFeedbackRequest(userId, { lessonId = null, stepIndex = null, requestType = 'feedback', prompt = {} }) {
    const result = await query(`INSERT INTO ai_feedback_requests(user_id, lesson_id, step_index, request_type, prompt_json)
      VALUES ($1, NULLIF($2, ''), $3, $4, $5::jsonb) RETURNING id, status, created_at`, [
      userId,
      String(lessonId || ''),
      Number.isInteger(stepIndex) ? stepIndex : null,
      String(requestType || 'feedback').slice(0, 80),
      JSON.stringify(emptyJson(prompt))
    ]);
    await touchUser(userId);
    return {
      id: result.rows[0].id,
      status: result.rows[0].status,
      createdAt: result.rows[0].created_at
    };
  }

  async function createProjectReview(userId, { title, projectUrl = '', artifact = {} }) {
    const result = await query(`INSERT INTO project_reviews(user_id, title, project_url, artifact_json)
      VALUES ($1, $2, NULLIF($3, ''), $4::jsonb) RETURNING id, status, created_at`, [
      userId,
      String(title || 'Untitled project').slice(0, 180),
      String(projectUrl || '').slice(0, 500),
      JSON.stringify(emptyJson(artifact))
    ]);
    await touchUser(userId);
    return {
      id: result.rows[0].id,
      status: result.rows[0].status,
      createdAt: result.rows[0].created_at
    };
  }

  async function createTutorSession(userId, { lessonId = null, topic }) {
    const result = await query(`INSERT INTO tutor_sessions(user_id, lesson_id, topic)
      VALUES ($1, NULLIF($2, ''), $3) RETURNING id, topic, status, created_at`, [
      userId,
      String(lessonId || ''),
      String(topic || 'AI learning help').slice(0, 180)
    ]);
    await touchUser(userId);
    return {
      id: result.rows[0].id,
      topic: result.rows[0].topic,
      status: result.rows[0].status,
      createdAt: result.rows[0].created_at
    };
  }

  async function addTutorMessage(userId, { sessionId, role = 'learner', content, metadata = {} }) {
    const session = await query('SELECT id FROM tutor_sessions WHERE id = $1 AND user_id = $2', [sessionId, userId]);
    if (!session.rows.length) return null;
    const result = await query(`INSERT INTO tutor_messages(session_id, user_id, role, content, metadata_json)
      VALUES ($1, $2, $3, $4, $5::jsonb) RETURNING id, created_at`, [
      sessionId,
      userId,
      role,
      String(content || '').slice(0, 4000),
      JSON.stringify(emptyJson(metadata))
    ]);
    await query('UPDATE tutor_sessions SET updated_at = now() WHERE id = $1', [sessionId]);
    await touchUser(userId);
    return {
      id: result.rows[0].id,
      createdAt: result.rows[0].created_at
    };
  }

  async function progressInsights(userId) {
    const result = await query(`SELECT id, insight_type, title, body, payload_json, created_at, read_at
      FROM progress_insights
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50`, [userId]);
    return result.rows.map(row => ({
      id: row.id,
      insightType: row.insight_type,
      title: row.title,
      body: row.body,
      payload: row.payload_json,
      createdAt: row.created_at,
      readAt: row.read_at || ''
    }));
  }

  async function adminAiRequests() {
    const feedback = await query(`SELECT afr.id, afr.request_type, afr.status, afr.created_at, u.email, u.display_name
      FROM ai_feedback_requests afr
      JOIN users u ON u.id = afr.user_id
      ORDER BY afr.created_at DESC
      LIMIT 100`);
    const reviews = await query(`SELECT pr.id, pr.title, pr.status, pr.created_at, u.email, u.display_name
      FROM project_reviews pr
      JOIN users u ON u.id = pr.user_id
      ORDER BY pr.created_at DESC
      LIMIT 100`);
    const sessions = await query(`SELECT ts.id, ts.topic, ts.status, ts.updated_at, u.email, u.display_name
      FROM tutor_sessions ts
      JOIN users u ON u.id = ts.user_id
      ORDER BY ts.updated_at DESC
      LIMIT 100`);
    return {
      feedbackRequests: feedback.rows.map(row => ({ id: row.id, requestType: row.request_type, status: row.status, createdAt: row.created_at, email: row.email, displayName: row.display_name })),
      projectReviews: reviews.rows.map(row => ({ id: row.id, title: row.title, status: row.status, createdAt: row.created_at, email: row.email, displayName: row.display_name })),
      tutorSessions: sessions.rows.map(row => ({ id: row.id, topic: row.topic, status: row.status, updatedAt: row.updated_at, email: row.email, displayName: row.display_name }))
    };
  }

  async function leaderboard() {
    const result = await query(`SELECT
        COALESCE(max(lower(u.display_name)), max(learning_minutes.name_key), 'anonymous') AS name_key,
        COALESCE(max(u.display_name), max(learning_minutes.display_name), 'Anonymous') AS name,
        COALESCE(sum(minutes), 0)::int AS total_minutes,
        count(*)::int AS entries,
        max(learning_minutes.created_at) AS last_submitted_at
      FROM learning_minutes
      LEFT JOIN users u ON u.id = learning_minutes.user_id
      GROUP BY COALESCE(learning_minutes.user_id::text, learning_minutes.name_key, lower(learning_minutes.display_name), 'anonymous')
      ORDER BY total_minutes DESC, name ASC`);
    return result.rows.map(row => ({ name: row.name, nameKey: row.name_key, totalMinutes: row.total_minutes, entries: row.entries, lastSubmittedAt: row.last_submitted_at || '' }));
  }

  async function adminLearners() {
    const result = await query(`WITH minute_totals AS (
        SELECT user_id, COALESCE(sum(minutes), 0)::int AS total_minutes FROM learning_minutes WHERE user_id IS NOT NULL GROUP BY user_id
      ), visit_totals AS (
        SELECT user_id,
          count(*)::int AS visit_count,
          count(DISTINCT date(visited_at))::int AS active_days
        FROM page_visits GROUP BY user_id
      ), progress_totals AS (
        SELECT user_id,
          count(*)::int AS started_lessons,
          count(CASE WHEN completed_at IS NOT NULL THEN 1 END)::int AS completed_lessons
        FROM lesson_progress GROUP BY user_id
      ), interaction_totals AS (
        SELECT user_id, count(*)::int AS interactions FROM interaction_answers GROUP BY user_id
      ), toolkit_totals AS (
        SELECT user_id,
          count(*)::int AS toolkit_cards,
          count(*) FILTER (WHERE lower(card_type) = 'saved note')::int AS saved_note_count,
          max(updated_at) AS last_toolkit_saved_at
        FROM toolkit_cards WHERE archived_at IS NULL GROUP BY user_id
      ), name_change_totals AS (
        SELECT target_user_id AS user_id,
          count(*)::int AS name_change_count,
          max(created_at) AS last_name_changed_at
        FROM audit_events
        WHERE target_user_id IS NOT NULL
          AND event_name IN ('profile_name_change', 'account_rename')
        GROUP BY target_user_id
      )
      SELECT u.id, u.email, u.display_name, u.disabled, u.created_at, u.last_active_at,
        COALESCE(mt.total_minutes, 0)::int AS total_minutes,
        COALESCE(vt.visit_count, 0)::int AS visit_count,
        COALESCE(vt.active_days, 0)::int AS active_days,
        COALESCE(pt.started_lessons, 0)::int AS started_lessons,
        COALESCE(pt.completed_lessons, 0)::int AS completed_lessons,
        COALESCE(it.interactions, 0)::int AS interactions,
        COALESCE(tt.toolkit_cards, 0)::int AS toolkit_cards,
        COALESCE(tt.saved_note_count, 0)::int AS saved_note_count,
        tt.last_toolkit_saved_at,
        COALESCE(nct.name_change_count, 0)::int AS name_change_count,
        nct.last_name_changed_at,
        ls.current_lesson_id,
        ls.current_step_index
      FROM users u
      LEFT JOIN minute_totals mt ON mt.user_id = u.id
      LEFT JOIN visit_totals vt ON vt.user_id = u.id
      LEFT JOIN progress_totals pt ON pt.user_id = u.id
      LEFT JOIN interaction_totals it ON it.user_id = u.id
      LEFT JOIN toolkit_totals tt ON tt.user_id = u.id
      LEFT JOIN name_change_totals nct ON nct.user_id = u.id
      LEFT JOIN learner_state ls ON ls.user_id = u.id
      WHERE u.deleted_at IS NULL
      ORDER BY u.last_active_at DESC NULLS LAST, u.created_at DESC`);
    return result.rows.map(row => ({
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      disabled: row.disabled,
      createdAt: row.created_at,
      lastActiveAt: row.last_active_at || '',
      totalMinutes: row.total_minutes,
      visitCount: row.visit_count,
      activeDays: row.active_days,
      startedLessons: row.started_lessons,
      completedLessons: row.completed_lessons,
      completionPercent: Math.round((row.completed_lessons / COURSE_LESSON_COUNT) * 100),
      interactions: row.interactions,
      toolkitCards: row.toolkit_cards,
      savedNoteCount: row.saved_note_count,
      lastToolkitSavedAt: row.last_toolkit_saved_at || '',
      nameChangeCount: row.name_change_count,
      lastNameChangedAt: row.last_name_changed_at || '',
      currentLesson: row.current_lesson_id || '',
      currentStep: row.current_step_index || 0
    }));
  }

  async function adminVisitAnalytics() {
    const labelsByDow = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayRows = await query(`SELECT EXTRACT(ISODOW FROM visited_at)::int AS dow, count(*)::int AS count
      FROM page_visits
      WHERE visited_at >= now() - interval '7 days'
      GROUP BY dow`);
    const dayCounts = new Map(dayRows.rows.map(row => [Number(row.dow), Number(row.count) || 0]));
    const visitsByDay = labelsByDow.map((label, index) => ({ label, count: dayCounts.get(index + 1) || 0 }));

    const weekRows = await query(`SELECT date_trunc('week', visited_at)::date AS week_start, count(*)::int AS count
      FROM page_visits
      WHERE visited_at >= now() - interval '8 weeks'
      GROUP BY week_start
      ORDER BY week_start ASC`);
    const weekMap = new Map(weekRows.rows.map(row => [new Date(row.week_start).toISOString().slice(0, 10), Number(row.count) || 0]));
    const visitsByWeek = [];
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const day = start.getUTCDay() || 7;
    start.setUTCDate(start.getUTCDate() - day + 1 - (7 * 7));
    for (let index = 0; index < 8; index++) {
      const key = start.toISOString().slice(0, 10);
      visitsByWeek.push({ label: index === 7 ? 'Now' : `${8 - index}w`, count: weekMap.get(key) || 0 });
      start.setUTCDate(start.getUTCDate() + 7);
    }

    const userRows = await query(`WITH per_user AS (
        SELECT user_id,
          count(*)::int AS visit_count,
          count(DISTINCT date(visited_at))::int AS active_days,
          min(visited_at) AS first_seen,
          max(visited_at) AS last_seen
        FROM page_visits
        WHERE user_id IS NOT NULL
        GROUP BY user_id
      ), returned_7 AS (
        SELECT DISTINCT pv.user_id
        FROM page_visits pv
        JOIN per_user pu ON pu.user_id = pv.user_id
        WHERE pv.visited_at > pu.first_seen
          AND pv.visited_at <= pu.first_seen + interval '7 days'
      )
      SELECT
        count(*) FILTER (WHERE pu.visit_count = 1)::int AS once,
        count(*) FILTER (WHERE pu.visit_count > 1 AND pu.active_days < 3)::int AS weekly,
        count(*) FILTER (WHERE pu.active_days >= 3 AND pu.active_days < 5)::int AS weekly2,
        count(*) FILTER (WHERE pu.active_days >= 5)::int AS daily,
        COALESCE(avg(EXTRACT(EPOCH FROM (pu.last_seen - pu.first_seen)) / 86400 / NULLIF(pu.active_days - 1, 0)), 0)::numeric(10,1) AS avg_gap_days,
        count(r7.user_id)::int AS returned_within_7,
        count(*)::int AS learner_count
      FROM per_user pu
      LEFT JOIN returned_7 r7 ON r7.user_id = pu.user_id`);
    const stats = userRows.rows[0] || {};
    const learnerCount = Number(stats.learner_count) || 0;

    return {
      visitsByDay,
      visitsByWeek,
      returnBuckets: {
        daily: Number(stats.daily) || 0,
        weekly2: Number(stats.weekly2) || 0,
        weekly: Number(stats.weekly) || 0,
        once: Number(stats.once) || 0
      },
      avgGapDays: Number(stats.avg_gap_days) || 0,
      returnedWithin7: learnerCount ? Math.round(((Number(stats.returned_within_7) || 0) / learnerCount) * 100) : 0
    };
  }

  async function adminLearner(id) {
    const state = await stateForUser(id);
    if (!state.user) return null;
    const visits = await query('SELECT path, referrer, visited_at, duration_seconds FROM page_visits WHERE user_id = $1 ORDER BY visited_at DESC LIMIT 50', [id]);
    const interactions = await query(`SELECT lesson_id, step_index, interaction_kind, correct, answered_at FROM interaction_answers
      WHERE user_id = $1 ORDER BY answered_at DESC LIMIT 100`, [id]);
    const questionnaire = await query(`SELECT resp.question_key, resp.category, resp.selected_value, resp.selected_label, resp.score, resp.free_text,
        aa.completed_at, aa.score_percent, ar.level, ar.calculated_json
      FROM assessment_attempts aa
      LEFT JOIN assessment_results ar ON ar.attempt_id = aa.id
      LEFT JOIN assessment_responses resp ON resp.attempt_id = aa.id
      WHERE aa.user_id = $1
        AND aa.id = (SELECT id FROM assessment_attempts WHERE user_id = $1 ORDER BY completed_at DESC LIMIT 1)
      ORDER BY resp.category ASC, resp.question_key ASC`, [id]);
    const nameChanges = await query(`SELECT event_name, payload, created_at
      FROM audit_events
      WHERE target_user_id = $1
        AND event_name IN ('profile_name_change', 'account_rename')
      ORDER BY created_at DESC
      LIMIT 50`, [id]);
    const nameChangeCounts = await query(`SELECT
        count(*)::int AS total,
        count(*) FILTER (WHERE event_name = 'profile_name_change' OR payload->>'source' = 'learner')::int AS learner_total,
        count(*) FILTER (WHERE event_name = 'account_rename' OR payload->>'source' = 'admin')::int AS admin_total
      FROM audit_events
      WHERE target_user_id = $1
        AND event_name IN ('profile_name_change', 'account_rename')`, [id]);
    const nameChangeRows = nameChanges.rows.map(row => ({
      eventName: row.event_name,
      source: row.payload?.source || (row.event_name === 'account_rename' ? 'admin' : 'learner'),
      previousDisplayName: row.payload?.previousDisplayName || row.payload?.oldDisplayName || '',
      displayName: row.payload?.displayName || row.payload?.newDisplayName || '',
      changedAt: row.created_at
    }));
    return {
      ...state,
      visits: visits.rows,
      interactions: interactions.rows,
      nameChangeStats: {
        count: nameChangeCounts.rows[0]?.total || 0,
        learnerCount: nameChangeCounts.rows[0]?.learner_total || 0,
        adminCount: nameChangeCounts.rows[0]?.admin_total || 0,
        lastChangedAt: nameChangeRows[0]?.changedAt || '',
        recent: nameChangeRows.slice(0, 20)
      },
      questionnaireResponses: questionnaire.rows.map(row => ({
        questionKey: row.question_key,
        category: row.category,
        selectedValue: row.selected_value,
        selectedLabel: row.selected_label,
        score: row.score,
        freeText: row.free_text,
        ageRange: row.calculated_json?.ageRange || 'unknown',
        level: row.level,
        scorePercent: row.score_percent,
        completedAt: row.completed_at
      }))
    };
  }

  function summarizeAssessmentAnalytics(rows) {
    const byQuestion = new Map();
    const byAnswer = new Map();
    const byAge = new Map();
    const attemptIds = new Set();
    for (const row of rows) {
      if (row.attemptId) attemptIds.add(row.attemptId);
      const ageRange = row.ageRange || 'unknown';
      const score = Number(row.score);
      const scorePercent = Number(row.scorePercent);
      const questionKey = row.questionKey || row.category || 'unknown';
      const answerLabel = row.selectedLabel || row.selectedValue || 'No answer';
      const q = byQuestion.get(questionKey) || { questionKey, category: row.category || '', responses: 0, scoreTotal: 0, scored: 0 };
      q.responses += 1;
      if (Number.isFinite(score)) { q.scoreTotal += score; q.scored += 1; }
      byQuestion.set(questionKey, q);

      const answerKey = `${questionKey}::${row.selectedValue || answerLabel}::${ageRange}`;
      const a = byAnswer.get(answerKey) || { questionKey, category: row.category || '', selectedValue: row.selectedValue || '', selectedLabel: answerLabel, ageRange, responses: 0, scoreTotal: 0, scored: 0 };
      a.responses += 1;
      if (Number.isFinite(score)) { a.scoreTotal += score; a.scored += 1; }
      byAnswer.set(answerKey, a);

      if (row.attemptId && !byAge.get(ageRange)?.attemptIds?.has(row.attemptId)) {
        const ag = byAge.get(ageRange) || { ageRange, attempts: 0, scoreTotal: 0, scored: 0, attemptIds: new Set() };
        ag.attemptIds.add(row.attemptId);
        ag.attempts += 1;
        if (Number.isFinite(scorePercent)) { ag.scoreTotal += scorePercent; ag.scored += 1; }
        byAge.set(ageRange, ag);
      }
    }
    const totalResponses = rows.length || 1;
    const totalAttempts = attemptIds.size || 1;
    const mapStats = item => ({
      ...item,
      averageScore: item.scored ? Math.round((item.scoreTotal / item.scored) * 10) / 10 : null,
      percentage: Math.round((item.responses / totalResponses) * 100)
    });
    return {
      summaryByQuestion: [...byQuestion.values()].map(mapStats).sort((a, b) => a.category.localeCompare(b.category) || a.questionKey.localeCompare(b.questionKey)),
      summaryByAnswer: [...byAnswer.values()].map(mapStats).sort((a, b) => b.responses - a.responses || a.questionKey.localeCompare(b.questionKey)),
      summaryByAge: [...byAge.values()].map(item => ({
        ageRange: item.ageRange,
        attempts: item.attempts,
        averageScorePercent: item.scored ? Math.round((item.scoreTotal / item.scored) * 10) / 10 : null,
        percentage: Math.round((item.attempts / totalAttempts) * 100)
      })).sort((a, b) => b.attempts - a.attempts)
    };
  }

  async function adminAssessmentAnalytics() {
    const attempts = await query(`SELECT aa.id, aa.user_id, u.email, u.display_name, aa.completed_at, aa.score_percent, ar.level,
        COALESCE(ar.calculated_json->>'ageRange', 'unknown') AS age_range
      FROM assessment_attempts aa
      JOIN users u ON u.id = aa.user_id
      LEFT JOIN assessment_results ar ON ar.attempt_id = aa.id
      WHERE u.deleted_at IS NULL
      ORDER BY aa.completed_at DESC NULLS LAST
      LIMIT 500`);
    const responses = await query(`SELECT aa.id AS attempt_id, aa.user_id, u.email, u.display_name, aa.completed_at, aa.score_percent,
        ar.level, COALESCE(ar.calculated_json->>'ageRange', 'unknown') AS age_range,
        resp.question_key, resp.category, resp.selected_value, resp.selected_label, resp.score, resp.free_text
      FROM assessment_responses resp
      JOIN assessment_attempts aa ON aa.id = resp.attempt_id
      JOIN users u ON u.id = aa.user_id
      LEFT JOIN assessment_results ar ON ar.attempt_id = aa.id
      WHERE u.deleted_at IS NULL
      ORDER BY aa.completed_at DESC NULLS LAST, resp.category ASC, resp.question_key ASC
      LIMIT 5000`);
    const responseRows = responses.rows.map(row => ({
      attemptId: row.attempt_id,
      userId: row.user_id,
      email: row.email,
      displayName: row.display_name,
      completedAt: row.completed_at,
      scorePercent: row.score_percent,
      level: row.level,
      ageRange: row.age_range,
      questionKey: row.question_key,
      category: row.category,
      selectedValue: row.selected_value,
      selectedLabel: row.selected_label,
      score: row.score,
      freeText: row.free_text
    }));
    return {
      attempts: attempts.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        email: row.email,
        displayName: row.display_name,
        completedAt: row.completed_at,
        scorePercent: row.score_percent,
        level: row.level,
        ageRange: row.age_range
      })),
      responses: responseRows,
      ...summarizeAssessmentAnalytics(responseRows)
    };
  }

  async function lessonAnalytics() {
    const result = await query(`SELECT l.id AS lesson_id, l.num, l.arc, l.title,
        count(DISTINCT lp.user_id)::int AS learners_started,
        count(DISTINCT CASE WHEN lp.completed_at IS NOT NULL THEN lp.user_id END)::int AS learners_completed,
        count(DISTINCT ia.id)::int AS interactions,
        count(DISTINCT CASE WHEN ia.correct = false THEN ia.id END)::int AS incorrect_answers,
        -- 'epoch' is only a floor so GREATEST has something to compare. A lesson
        -- nobody has touched would otherwise report 1970-01-01, which reads as
        -- "December 31, 1969" west of UTC. NULLIF turns that back into no date.
        NULLIF(
          max(GREATEST(COALESCE(lp.updated_at, 'epoch'::timestamptz), COALESCE(ia.answered_at, 'epoch'::timestamptz))),
          'epoch'::timestamptz
        ) AS last_activity_at
      FROM lessons l
      LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id
      LEFT JOIN interaction_answers ia ON ia.lesson_id = l.id
      GROUP BY l.id
      ORDER BY l.num ASC`);
    const difficult = await query(`SELECT lesson_id, step_index, interaction_kind,
        count(*)::int AS attempts,
        count(CASE WHEN correct = false THEN 1 END)::int AS incorrect
      FROM interaction_answers
      WHERE correct IS NOT NULL
      GROUP BY lesson_id, step_index, interaction_kind
      HAVING count(CASE WHEN correct = false THEN 1 END) > 0
      ORDER BY incorrect DESC, attempts DESC, lesson_id ASC, step_index ASC`);
    const difficultByLesson = new Map();
    for (const row of difficult.rows) {
      const list = difficultByLesson.get(row.lesson_id) || [];
      if (list.length < 3) {
        list.push({
          stepIndex: row.step_index,
          kind: row.interaction_kind,
          attempts: row.attempts,
          incorrect: row.incorrect,
          incorrectRate: row.attempts ? Math.round((row.incorrect / row.attempts) * 100) : 0
        });
      }
      difficultByLesson.set(row.lesson_id, list);
    }
    return result.rows.map(row => ({
      lessonId: row.lesson_id,
      num: row.num,
      arc: row.arc,
      title: row.title,
      learnersStarted: row.learners_started,
      learnersCompleted: row.learners_completed,
      interactions: row.interactions,
      incorrectAnswers: row.incorrect_answers,
      lastActivityAt: row.last_activity_at || '',
      difficultSteps: difficultByLesson.get(row.lesson_id) || []
    }));
  }

  async function accountAction({ adminUserId, userId, action, displayName, newPassword }) {
    const current = await query('SELECT display_name FROM users WHERE id = $1 AND deleted_at IS NULL', [userId]);
    const previousDisplayName = current.rows[0]?.display_name || '';
    if (action === 'disable') await query('UPDATE users SET disabled = true, updated_at = now() WHERE id = $1', [userId]);
    if (action === 'enable') await query('UPDATE users SET disabled = false, updated_at = now() WHERE id = $1', [userId]);
    if (action === 'rename') await query('UPDATE users SET display_name = $2, updated_at = now() WHERE id = $1', [userId, displayName]);
    if (action === 'delete') {
      await query("UPDATE users SET deleted_at = now(), disabled = true, email = concat(id::text, '-deleted@deleted.local'), updated_at = now() WHERE id = $1", [userId]);
      await query('DELETE FROM sessions WHERE user_id = $1', [userId]);
    }
    if (action === 'resetPassword') {
      await query('UPDATE users SET password_hash = $2, updated_at = now() WHERE id = $1', [userId, await bcrypt.hash(newPassword, 12)]);
      await query('DELETE FROM sessions WHERE user_id = $1', [userId]);
    }
    await audit({
      adminUserId,
      eventName: `account_${action}`,
      targetUserId: userId,
      payload: action === 'rename'
        ? { previousDisplayName, displayName, source: 'admin' }
        : { displayName: displayName || null }
    });
  }

  async function audit({ adminUserId = null, eventName, targetUserId = null, payload = {} }) {
    await query('INSERT INTO audit_events(admin_user_id, event_name, target_user_id, payload) VALUES ($1, $2, $3, $4::jsonb)', [adminUserId, eventName, targetUserId, JSON.stringify(payload)]);
  }

  async function exportLearners() {
    return adminLearners();
  }

  async function exportAssessmentResponses() {
    const analytics = await adminAssessmentAnalytics();
    return analytics.responses;
  }

  async function close() {
    await pool.end();
  }

  return {
    init,
    health,
    close,
    createUser,
    updateUserProfile,
    deleteUserAccount,
    findUserByEmail,
    findUserById,
    findAdminByEmail,
    findAdminById,
    createSession,
    createPasswordResetToken,
    confirmPasswordReset,
    deleteSession,
    rotateCsrf,
    sessionForToken,
    saveAssessment,
    saveProgress,
    saveInteraction,
    saveQuizAnswer,
    completeActivity,
    saveToolkit,
    archiveToolkit,
    addMinutes,
    recordVisit,
    importLocal,
    curriculum,
    curriculumLesson,
    accessForUser,
    dashboardForUser,
    createSiteFeedback,
    siteFeedbackSummary,
    createFeedbackRequest,
    createProjectReview,
    createTutorSession,
    addTutorMessage,
    progressInsights,
    adminAiRequests,
    adminCreateLesson,
    adminUpdateLesson,
    adminReplaceLessonSteps,
    adminPublishCurriculum,
    stateForUser,
    leaderboard,
    adminLearners,
    adminLearner,
    adminAssessmentAnalytics,
    adminVisitAnalytics,
    lessonAnalytics,
    accountAction,
    audit,
    exportLearners,
    exportAssessmentResponses
  };
}

export { MIGRATION_VERSION };
