# BetterSurallah v1 — Design Spec

**Date:** 2026-08-18
**Status:** Approved scope, pending user review of this spec

## What this is

BetterSurallah (bettersurallah.org) is an independent, citizen-built transparency site for the Municipality of Surallah, South Cotabato. v1 replaces the current coming-soon page with the first real version, focused on the gaps the official site (surallah.gov.ph) does not fill: transparency documents, a searchable officials directory, and a government projects tracker.

## Goals

- Publish transparency documents (budgets, COA audits, full-disclosure items, citizen's charters) organized by category and year.
- Provide a searchable, text-based directory of municipal officials, department heads, and barangay captains.
- Track government projects with amounts, funding sources, and status — starting from the 22 known DILG projects (2014–2020, ₱77.7M total).
- Content that changes often is editable in the Supabase dashboard with changes visible on the site immediately (no rebuild).

## Non-goals (v1)

- No admin panel (v2 candidate; dashboard editing is the v1 workflow).
- No user accounts, comments, or submissions.
- No news/blog section.
- No decision yet on mirroring document PDFs in Supabase Storage (schema keeps both `source_url` and `file_url` so either works later).

## Architecture

- **App:** the existing Next.js 16 app (`bettersurallah/`), App Router, Tailwind v4, static export (`output: "export"`), deployed on Netlify via the existing `netlify.toml`. No server, no Netlify functions.
- **Live data:** the browser queries Supabase directly using `@supabase/supabase-js` with the publishable key. Security = Row-Level Security read-only policies. The secret key is never used in the app.
- **Stable data:** officials, about content, and municipal stats live as typed data files in the repo (they change rarely — elections/reshuffles); edits go through git like code.

**Supabase project:** `https://zxqpkcvirsddvbvkiqcj.supabase.co`
Env vars (public by design, set in `.env.local` and Netlify): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Pages

| Route | Content | Data source |
|---|---|---|
| `/` | Hero (logo, mission), quick stats, latest documents (5 newest), links to sections | stats: repo file; latest docs: Supabase |
| `/transparency` | Documents grouped by category, filterable by category + year | Supabase `documents` |
| `/officials` | Mayor, Vice Mayor, SB members w/ committee chairmanships, 24 department heads w/ office phones, 17 barangay captains; client-side text search | repo file `data/officials.ts` |
| `/projects` | Sortable/filterable table: title, barangay, amount, funding source, year, status | Supabase `projects` |
| `/about` | What BetterSurallah is, independence disclaimer (NOT the LGU), data sources, contact | static JSX |

Design language: existing white + royal blue theme (`#0035AD` from logo), Schibsted Grotesk + Public Sans, logo lockup in header. Same visual system as the coming-soon page.

## Database schema

```sql
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
-- No insert/update/delete policies: the publishable key is read-only by construction.
```

Indexes: none beyond primary keys for v1 — both tables are small (tens to hundreds of rows) and read as full lists; filters run client-side.

## Data seeding

- `projects`: the 22 DILG water/road projects (2014–2020) extracted from surallah.gov.ph/dilg-programs/.
- `documents`: Citizen's Charter PDFs (municipal 2024/2025/2026 + per-barangay) linked from surallah.gov.ph; budget/FDP documents from DILG FDPP portal and COA audit reports as found.
- `data/officials.ts`: Mayor Pedro "Cano" Matinong Jr., Vice Mayor, 11 SB members + committee chairmanships (from standing-committees page), 24 department heads + office phone numbers (from directory), 17 barangay captains. Mostly extracted already and saved in project memory. **Known gap:** the Vice Mayor's name and the exact current SB roster aren't in text on the official site (images only) — verify from COMELEC results/news during seeding and mark any unverified entry as such rather than guessing.

Seeding is done via SQL insert scripts kept in the repo (`supabase/seed.sql`) so the data is reproducible.

## Error handling & UX states

Every Supabase-reading section has three states:
- **Loading:** skeleton rows in the site's mist-blue.
- **Error:** plain message ("Couldn't load documents — retry") with a retry button; site chrome and repo-file content still render.
- **Empty:** honest empty state ("No documents in this category yet").

Officials page has no network dependency and always renders.

## Testing

- Unit tests for pure logic: currency/number formatting, grouping documents by category/year, officials search filter (Vitest).
- Supabase client wrapped in one module (`lib/supabase.ts`) with typed query functions; components consume typed results.
- RLS verification during setup: attempt an insert with the publishable key and confirm it is rejected.
- `npm run build` + lint as CI gate (existing Netlify build).

## Deferred decisions

- Document PDF mirroring in Supabase Storage (schema ready via `file_url`).
- Admin panel (v2; would use Supabase Auth + secret-key-backed functions).
- Custom domain wiring (bettersurallah.org) on Netlify.

## Success criteria

- All five pages live on Netlify, fully static, reading live Supabase data.
- Editing a row in the Supabase dashboard is visible on the site after a refresh, with no rebuild.
- Publishable key cannot write (verified).
- Seeded: ≥22 projects, ≥20 documents, complete officials directory.
