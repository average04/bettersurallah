-- BetterSurallah v1 schema. Run in the Supabase SQL editor.
create table public.documents (
  id bigint generated always as identity primary key,
  title text not null,
  category text not null check (category in
    ('budget','coa_audit','full_disclosure','procurement','citizens_charter','other')),
  year smallint,
  source_url text,
  file_url text,
  description text,
  created_at timestamptz not null default now()
);

create table public.projects (
  id bigint generated always as identity primary key,
  title text not null,
  barangay text,
  amount numeric(14,2),
  funding_source text check (funding_source in
    ('BUB','LGSF','ADM','AM','local','national','other')),
  year smallint,
  status text not null default 'unknown' check (status in
    ('planned','ongoing','completed','unknown')),
  description text,
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;
alter table public.projects enable row level security;

create policy "public read documents" on public.documents
  for select to anon using (true);
create policy "public read projects" on public.projects
  for select to anon using (true);
