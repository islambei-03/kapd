-- Выполните в Supabase: SQL Editor → New query → Run
-- После этого: Database → Replication → включите publication для survey_responses (или выполните блок ниже)

create extension if not exists "pgcrypto";

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  answers jsonb not null default '{}'::jsonb
);

comment on table public.survey_responses is 'Ответы опроса «Капитанская дочка» с сайта';

create index if not exists survey_responses_created_at_idx
  on public.survey_responses (created_at desc);

alter table public.survey_responses enable row level security;

-- Любой посетитель может отправить ответ (anon + залогиненные)
drop policy if exists "survey_insert_public" on public.survey_responses;
create policy "survey_insert_public"
  on public.survey_responses
  for insert
  to anon, authenticated
  with check (true);

-- Читать ответы могут только залогиненные пользователи (админка по email/password)
drop policy if exists "survey_select_authenticated" on public.survey_responses;
create policy "survey_select_authenticated"
  on public.survey_responses
  for select
  to authenticated
  using (true);

-- Realtime (если таблица уже в publication — строка выдаст ошибку, её можно игнорировать)
alter publication supabase_realtime add table public.survey_responses;

-- Дальше вручную:
-- 1) Authentication → Users → Add user — создайте админа (email + пароль).
-- 2) При необходимости отключите «Confirm email» для проекта или подтвердите почту админа.
