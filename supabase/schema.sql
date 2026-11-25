-- ============================================================
-- WebNovels Supabase Schema
-- 在 Supabase Dashboard → SQL Editor 中执行此文件
-- ============================================================

-- 启用必要扩展
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 小说元数据表
-- ------------------------------------------------------------
create table if not exists public.novels (
  id            bigint primary key,            -- 对应 _novels/<id>
  slug          text unique,
  title         text not null,
  author        text default '',
  description   text,
  excerpt       text,
  body          text,
  cover_image   text,
  genre         text,
  genres        text[] default '{}',
  subgenres     text[] default '{}',
  featured      boolean default false,
  views         integer default 0,
  rating        numeric default 4.0,
  rating_count  integer default 0,
  status        text default 'Ongoing',
  completed     boolean default false,
  chapter_count integer default 0,
  appname       text,
  token         text,
  last_updated  timestamptz,
  created_at    timestamptz default now()
);

comment on table public.novels is '小说元数据（不含正文内容，正文保留在 Jekyll 静态文件中用于 SEO）';

-- 常用查询索引
create index if not exists novels_genre_idx      on public.novels (genre);
create index if not exists novels_featured_idx   on public.novels (featured) where featured = true;
create index if not exists novels_views_idx      on public.novels (views desc);
create index if not exists novels_rating_idx     on public.novels (rating desc);
create index if not exists novels_last_updated_idx on public.novels (last_updated desc);
create index if not exists novels_completed_idx  on public.novels (completed) where completed = true;

-- 全文搜索索引（用于 title / description / genre）
create index if not exists novels_search_idx on public.novels
  using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(genre, '')));

-- ------------------------------------------------------------
-- 章节内容表（可选，用于未来动态章节页）
-- ------------------------------------------------------------
create table if not exists public.chapters (
  id              bigserial primary key,
  novel_id        bigint not null references public.novels(id) on delete cascade,
  chapter_number  integer not null,
  title           text,
  content         text,
  created_at      timestamptz default now(),
  unique (novel_id, chapter_number)
);

create index if not exists chapters_novel_idx on public.chapters (novel_id, chapter_number);

-- ------------------------------------------------------------
-- 分类表
-- ------------------------------------------------------------
create table if not exists public.genres (
  name        text primary key,
  slug        text unique,
  description text
);

insert into public.genres (name, slug, description) values
  ('Realistic',   'realistic',   'Realistic fiction novels with contemporary settings and authentic characters.'),
  ('Romance',     'romance',     'Heartwarming romance stories about love, relationships, and emotional journeys.'),
  ('Betrayal',    'betrayal',    'Tales of betrayal, revenge, and the consequences of broken trust.'),
  ('Rebirth',     'rebirth',     'Rebirth and reincarnation stories where protagonists get a second chance at life.'),
  ('Billionaire', 'billionaire', 'Billionaire romance and power-dynamics stories featuring wealthy protagonists.')
on conflict (name) do nothing;

-- ============================================================
-- Row Level Security (RLS)
-- 策略：anon 角色只能 SELECT，不能 INSERT/UPDATE/DELETE
-- 数据写入通过 service_role key 在本地脚本中完成
-- ============================================================
alter table public.novels   enable row level security;
alter table public.chapters enable row level security;
alter table public.genres   enable row level security;

-- novels: 公开只读
drop policy if exists "novels_select_anon" on public.novels;
create policy "novels_select_anon"
  on public.novels for select
  to anon, authenticated
  using (true);

-- chapters: 公开只读
drop policy if exists "chapters_select_anon" on public.chapters;
create policy "chapters_select_anon"
  on public.chapters for select
  to anon, authenticated
  using (true);

-- genres: 公开只读
drop policy if exists "genres_select_anon" on public.genres;
create policy "genres_select_anon"
  on public.genres for select
  to anon, authenticated
  using (true);

-- ============================================================
-- 视图：供 search/ranking 直接使用的精简字段
-- ============================================================
create or replace view public.novel_listing as
select
  id, slug, title, author, genre, genres, subgenres,
  description, excerpt, cover_image, featured,
  views, rating, rating_count, status, completed,
  chapter_count, last_updated
from public.novels;

grant select on public.novel_listing to anon, authenticated;
