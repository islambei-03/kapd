-- Выполните в Supabase: SQL Editor → Run
-- Добавляет функцию агрегированной статистики опроса для публичной страницы (anon может только EXECUTE, не читает сырые строки).

create or replace function public.survey_public_stats()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
with
pairs as (
  select r.id as rid,
         kv.key as qkey,
         kv.value as label
  from public.survey_responses r,
       lateral jsonb_each_text(r.answers) as kv
  where kv.key ~ '^[0-9]+$'
),
classified as (
  select rid,
         qkey,
         case
           when lower(label) like '%свой ответ%' then 'other'
           when lower(label) like '%ии%' then 'ai'
           when lower(label) like '%худож%' then 'human'
           when lower(label) like '%оба%' then 'both'
           else 'other'
         end as bucket
  from pairs
),
agg_overall as (
  select
    count(*) filter (where bucket = 'ai') as ai,
    count(*) filter (where bucket = 'human') as human,
    count(*) filter (where bucket = 'both') as both,
    count(*) filter (where bucket = 'other') as other
  from classified
),
agg_by_q as (
  select qkey,
         count(*) filter (where bucket = 'ai') as ai,
         count(*) filter (where bucket = 'human') as human,
         count(*) filter (where bucket = 'both') as both,
         count(*) filter (where bucket = 'other') as other
  from classified
  group by qkey
),
by_question as (
  select coalesce(jsonb_object_agg(
           qkey,
           jsonb_build_object(
             'ai', ai,
             'human', human,
             'both', both,
             'other', other
           )
         ), '{}'::jsonb) as obj
  from agg_by_q
)
select jsonb_build_object(
  'total_responses', (select count(*)::int from public.survey_responses),
  'overall', (
    select jsonb_build_object(
      'ai', ai,
      'human', human,
      'both', both,
      'other', other
    )
    from agg_overall
  ),
  'by_question', (select obj from by_question)
);
$$;

comment on function public.survey_public_stats() is 'Агрегаты опроса для публичных диаграмм (без доступа к сырым ответам).';

grant execute on function public.survey_public_stats() to anon, authenticated;
