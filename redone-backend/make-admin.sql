-- Make a user an admin (run AFTER they've created a normal account).
-- Usage:  psql "$DATABASE_URL" -v email="aarav@example.com" -f make-admin.sql
--   or edit the email below and run:  psql "$DATABASE_URL" -f make-admin.sql

update users
set is_admin = true
where email = lower(coalesce(:'email', 'CHANGE-ME@example.com'));

-- verify
select email, display_name, is_admin from users where is_admin = true;
