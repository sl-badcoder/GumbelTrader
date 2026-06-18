create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists game_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  game_id text not null,
  score integer not null,
  attempts integer not null,
  correct integer not null,
  duration_seconds integer not null,
  accuracy real not null,
  settings_json jsonb,
  details_json jsonb,
  created_at timestamptz not null default now()
);

create index if not exists game_results_user_game_idx on game_results(user_id, game_id);
create index if not exists game_results_game_score_idx on game_results(game_id, score desc, created_at asc);
