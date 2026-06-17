-- Learning AI — Postgres schema
-- Run once against the Coolify Postgres:  psql "$DATABASE_URL" -f schema.sql

create extension if not exists "pgcrypto";   -- for gen_random_uuid()

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,
  display_name  text not null,
  age_range     text,
  is_admin      boolean not null default false,
  created_at    timestamptz not null default now()
);

create table if not exists diagnostics (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references users(id) on delete cascade,
  answers   jsonb not null,            -- { definition:3, capability:2, ... } (option RANK 0-3)
  score     int  not null,             -- 0-100
  level     text not null,             -- Foundation | Explorer | Builder
  taken_at  timestamptz not null default now()
);
create index if not exists diagnostics_user on diagnostics(user_id);

create table if not exists progress (
  user_id        uuid primary key references users(id) on delete cascade,
  current_lesson int  not null default 1,
  completed      jsonb not null default '[]',   -- [1,2,3...] -> mosaic fill = length
  updated_at     timestamptz not null default now()
);

create table if not exists visits (
  id         bigserial primary key,
  user_id    uuid not null references users(id) on delete cascade,
  started_at timestamptz not null default now()
);
create index if not exists visits_user_time on visits(user_id, started_at);

create table if not exists notes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users(id) on delete cascade,
  lesson     int,
  card_type  text,
  fields     jsonb not null default '[]',   -- [{label,value}]
  created_at timestamptz not null default now()
);
create index if not exists notes_user on notes(user_id);

-- existing feature, kept as-is
create table if not exists minutes (
  id         bigserial primary key,
  name       text,
  minutes    int,
  consent    boolean default false,
  created_at timestamptz not null default now()
);
