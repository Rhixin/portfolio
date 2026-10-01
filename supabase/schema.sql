-- Admin-editable portfolio: projects & experience
-- See docs/superpowers/specs/2026-10-01-admin-portfolio-cms-design.md

create extension if not exists pgcrypto;

create table if not exists public.projects (
  id text primary key,
  title text not null,
  category text[] not null default '{}',
  description text,
  images text[] not null default '{}',
  technology text[] not null default '{}',
  github text,
  demo text,
  video text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  logo text,
  name text not null,
  additional text,
  type text check (type in ('Full-time', 'Part-time', 'Internship', 'Contract')),
  year text,
  duration text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.experience enable row level security;

drop policy if exists "Public read access" on public.projects;
create policy "Public read access" on public.projects for select using (true);

drop policy if exists "Public read access" on public.experience;
create policy "Public read access" on public.experience for select using (true);

-- Writes (insert/update/delete) are only ever done server-side via the
-- service_role key, which bypasses RLS entirely, so no write policies
-- are defined here.

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read for project-images" on storage.objects;
create policy "Public read for project-images"
  on storage.objects for select
  using (bucket_id = 'project-images');
