-- Learning AI — wipe all learner data for a clean launch slate.
-- Run ONCE in the Coolify Postgres console (or: psql "$DATABASE_URL" -f wipe.sql).
-- Deletes EVERY account, progress row, diagnostic, visit, and note; resets IDs to 1.
-- Irreversible — intended only before launch, while the data is test-only.
-- NOTE: this removes the admin account too. Afterward: sign up the admin email again,
-- then run make-admin.sql to re-promote it.

TRUNCATE users, progress, diagnostics, visits, notes RESTART IDENTITY CASCADE;
