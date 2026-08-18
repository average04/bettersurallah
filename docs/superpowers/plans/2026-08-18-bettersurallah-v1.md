# BetterSurallah v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the coming-soon page with BetterSurallah v1: a static Next.js site with live Supabase-backed transparency documents and projects, plus repo-file officials data.

**Architecture:** Next.js 16 App Router with `output: "export"` (fully static, Netlify). Client components query Supabase directly with the publishable key; RLS makes the database read-only to the public. Rarely-changing data (officials, stats) lives as typed TypeScript files in the repo.

**Tech Stack:** Next.js 16.3.1, React 19, Tailwind v4, TypeScript, @supabase/supabase-js v2, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-18-bettersurallah-v1-design.md`

## Global Constraints

- All app code lives in the `bettersurallah/` subfolder of the repo; run npm commands from there. Git commands run from repo root `d:\Projects\bettersurallah`.
- `next.config.ts` keeps `output: "export"` and `images: { unoptimized: true }`. Never add server-side rendering, API routes, or server actions.
- Supabase is queried ONLY from client components (`"use client"`). Only the publishable key is ever used: env vars `NEXT_PUBLIC_SUPABASE_URL=https://zxqpkcvirsddvbvkiqcj.supabase.co` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ln8Imc36zVI1jymTciA56A_RjMs83rp` (public by design).
- Design system (already in `app/globals.css`): tokens `--color-base` (white), `--color-mist` #eef3fb, `--color-ink` #0e0f12, `--color-ink-soft` #575d6b, `--color-blue` #0035ad, `--color-blue-deep` #002478, `--color-sky` #3d66d9; fonts `font-display` (Schibsted Grotesk) and default Public Sans; logo at `/logo.png` (800×244). Reuse existing utility classes `reveal`, `stitch`, `beacon`, `dotgrid`.
- Never mention or link Better Solano anywhere on the site.
- Images: where a photo is wanted, render a placeholder `<div>` (bg-mist, rounded, centered ink-soft label like "Photo coming soon") — the user will supply real images later.
- Currency uses `Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" })`.
- Follow `bettersurallah/AGENTS.md`: consult `node_modules/next/dist/docs/` if unsure about Next 16 APIs; keep its auto-generated block committed.
- Windows environment; prefer PowerShell-compatible commands.

## File Structure

```
netlify.toml                      (repo root — modify: add [build.environment])
bettersurallah/
  supabase/schema.sql             (new — tables + RLS)
  supabase/seed.sql               (new — 22 projects, 37 documents)
  .env.local                      (new, untracked — env vars)
  .env.example                    (new, committed — same keys, real values are public anyway)
  vitest.config.ts                (new)
  lib/types.ts                    (new — DB row types)
  lib/format.ts                   (new — peso format, grouping, years)
  lib/search.ts                   (new — officials search)
  lib/supabase.ts                 (new — client singleton)
  lib/queries.ts                  (new — fetchDocuments/fetchProjects/fetchLatestDocuments)
  data/officials.ts               (new — Official type + OFFICIALS array)
  data/stats.ts                   (new — MUNICIPAL_STATS)
  components/site-header.tsx      (new — logo + nav)
  components/site-footer.tsx      (new — disclaimer footer)
  components/data-states.tsx      (new — SkeletonRows/ErrorState/EmptyState)
  components/latest-documents.tsx (new — home page live widget)
  components/transparency-list.tsx(new — documents by category w/ year filter)
  components/projects-table.tsx   (new — projects table w/ status filter)
  components/officials-directory.tsx (new — searchable directory)
  app/layout.tsx                  (modify — wrap in header/footer, metadata template)
  app/page.tsx                    (rewrite — home)
  app/transparency/page.tsx       (new)
  app/projects/page.tsx           (new)
  app/officials/page.tsx          (new)
  app/about/page.tsx              (new)
  lib/format.test.ts              (new)
  lib/search.test.ts              (new)
```

---

### Task 1: Supabase schema + seed SQL (requires a user pause)

**Files:**
- Create: `bettersurallah/supabase/schema.sql`
- Create: `bettersurallah/supabase/seed.sql`

**Interfaces:**
- Produces: Supabase tables `public.documents` and `public.projects` (columns per schema below) with anon read-only RLS — Tasks 3, 6, 7, 8 query them.

- [ ] **Step 1: Write `bettersurallah/supabase/schema.sql`**

```sql
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
```

- [ ] **Step 2: Write `bettersurallah/supabase/seed.sql`** — projects part (all 22 rows from surallah.gov.ph/dilg-programs/, statuses as published there):

```sql
insert into public.projects (title, barangay, amount, funding_source, year, status, description) values
('Construction of Potable Water System', 'Buenavista', 1500000.00, 'BUB', 2014, 'completed', 'Bottom-Up Budgeting (BUB) - Water Supply'),
('Upgrading of NACI Water System', 'Naci', 500000.00, 'BUB', 2015, 'completed', 'Bottom-Up Budgeting (BUB) - Water Supply'),
('Construction of Potable Water System', 'Moloy', 1350000.00, 'BUB', 2015, 'completed', 'Bottom-Up Budgeting (BUB) - Water Supply'),
('Construction of Potable Water System', 'Talahik', 1350000.00, 'BUB', 2015, 'completed', 'Bottom-Up Budgeting (BUB) - Water Supply'),
('Construction of Potable Water System Level II', 'Tubi-Ala', 2000000.00, 'LGSF', 2014, 'completed', 'LGSF - Sagana at Ligtas na Tubig para sa Lahat (SALINTUBIG)'),
('Road Project in Purok Matinong-San Jose Road', 'Dajay', 1880000.00, 'BUB', 2014, 'completed', 'Bottom-Up Budgeting (BUB) - Local Access Road'),
('Concreting of Colongulo-Buenavista Road', 'Colongulo', 1300000.00, 'LGSF', 2016, 'completed', 'LGSF - Roads & Bridges'),
('Construction of Rosas-Moloy Road', 'Moloy', 2750000.00, 'LGSF', 2016, 'completed', 'LGSF - Roads & Bridges'),
('Construction of Potable Water System', 'Colongulo', 1000000.00, 'ADM', 2017, 'completed', 'Assistance to Disadvantaged Municipalities (ADM) - Water'),
('Construction of Potable Water System', 'Upper Sepaka', 2000000.00, 'ADM', 2017, 'completed', 'ADM - Water'),
('Concreting of Road', 'Moloy', 5000000.00, 'ADM', 2017, 'completed', 'ADM - Roads'),
('Concreting of Road', 'Talahik', 5000000.00, 'ADM', 2017, 'completed', 'ADM - Roads'),
('Concreting of Road', 'Libertad', 4066000.00, 'ADM', 2017, 'completed', 'ADM - Roads'),
('Local Access Road', 'Libertad', 7072500.00, 'AM', 2018, 'completed', 'Assistance to Municipalities (AM) - Local Access'),
('Local Access Road', 'Libertad', 2679500.00, 'AM', 2018, 'completed', 'AM - Local Access'),
('Local Access Road', 'Libertad', 1807501.00, 'AM', 2018, 'completed', 'AM - Local Access'),
('Local Access Road in Narra Street', 'Libertad', 6819600.00, 'AM', 2019, 'completed', 'AM - Local Access'),
('Local Road Access in Malvar Street', 'Libertad', 5887400.00, 'AM', 2019, 'completed', 'AM - Local Access'),
('Upgrading of PWS Level II to Level III', 'Moloy', 3500000.00, 'LGSF', 2020, 'ongoing', 'LGSF - SALINTUBIG'),
('Construction of Potable Water System Level II in Purok 2', 'Duengas', 5425820.00, 'LGSF', 2020, 'ongoing', 'LGSF - SALINTUBIG'),
('Construction of Potable Water System Level II at Lubol', 'Sepaka', 2898302.00, 'LGSF', 2020, 'ongoing', 'LGSF - SALINTUBIG'),
('Upgrading of Pardo de Tavera Street', 'Libertad', 11897000.00, 'AM', 2020, 'ongoing', 'AM - Local Access');
```

- [ ] **Step 3: Append the documents part to `seed.sql`** — 6 municipal + 31 barangay charter documents (exact URLs extracted from surallah.gov.ph/citizens-charter/):

```sql
insert into public.documents (title, category, year, source_url, description) values
('LGU Surallah Citizen''s Charter 2026 (1st edition)', 'citizens_charter', 2026, 'https://surallah.gov.ph/wp-content/uploads/2026/03/LGU-Surallah-Citizens-charter-2026-1st-edition_compressed.pdf', null),
('LGU Surallah Certificate of Compliance (COC) 2026', 'citizens_charter', 2026, 'https://surallah.gov.ph/wp-content/uploads/2026/03/LGU-SURALLAH-COC-2026.pdf', null),
('LGU Surallah Citizen''s Charter 2025', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/03/LGU-SURALLAH-CITIZEN-CHARTER-2025-.pdf', null),
('LGU Surallah Certificate of Compliance (COC) 2025', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/03/LGUSURALLAH_COC_20250328.pdf', null),
('LGU Surallah Citizen''s Charter Handbook 2024', 'citizens_charter', 2024, 'https://surallah.gov.ph/wp-content/uploads/2024/04/LGU-Surallah-Citizens-Charter-Handbook-2024.pdf', null),
('LGU Surallah Certificate of Compliance (COC) 2024', 'citizens_charter', 2024, 'https://surallah.gov.ph/wp-content/uploads/2024/10/SURALLAH_COC_20240404.pdf', null),
('Citizen''s Charter — Brgy. Buenavista', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/BUENAVESTA.pdf', null),
('COC — Brgy. Buenavista', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/Buenavesta-COC.pdf', null),
('Citizen''s Charter — Brgy. Canahay', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/CANAHAY.pdf', null),
('COC — Brgy. Canahay', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/canahay-COC.pdf', null),
('Citizen''s Charter — Brgy. Centrala', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/CENTRALA.pdf', null),
('COC — Brgy. Centrala', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/Centrala-COC.pdf', null),
('Citizen''s Charter — Brgy. Colongulo', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/COLONGULO-.pdf', null),
('COC — Brgy. Colongulo', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/Colongulo-COC.pdf', null),
('Citizen''s Charter — Brgy. Dajay', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/DAJAY.pdf', null),
('COC — Brgy. Dajay', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/DAJAY.COC_.pdf', null),
('Citizen''s Charter — Brgy. Duengas', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/DUENGAS.pdf', null),
('COC — Brgy. Duengas', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/Duengas-COC.pdf', null),
('Citizen''s Charter — Brgy. Lambontong', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/LAMBONTONG.pdf', null),
('Citizen''s Charter — Brgy. Lamian', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/LAMIAN.pdf', null),
('COC — Brgy. Lamian', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/LAMIAN-COC.pdf', null),
('Citizen''s Charter — Brgy. Lamsugod', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/LAMSUGOD.pdf', null),
('COC — Brgy. Lamsugod', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/LAMSUGOD-COC.pdf', null),
('Citizen''s Charter — Brgy. Libertad', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/LIBERTAD1.pdf', null),
('COC — Brgy. Libertad', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/Libertad.COC_.pdf', null),
('Citizen''s Charter — Brgy. Little Baguio', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/LITTLE-BAGUIO.pdf', null),
('Citizen''s Charter — Brgy. Moloy', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/MOLOY.pdf', null),
('COC — Brgy. Moloy', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/moloy-COC.pdf', null),
('Citizen''s Charter — Brgy. Naci', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/NACI.pdf', null),
('COC — Brgy. Naci', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/NACI-COC.pdf', null),
('Citizen''s Charter — Brgy. Talahik', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/TALAHIK.pdf', null),
('Citizen''s Charter — Brgy. Tubi-Alah', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/TUBI-ALAH.pdf', null),
('COC — Brgy. Tubi-Alah', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/Tubi-alah-COC.pdf', null),
('Citizen''s Charter — Brgy. Upper Sepaka', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/UPPER-SEPAKA.pdf', null),
('COC — Brgy. Upper Sepaka', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/Upper-sepaka-COC.pdf', null),
('Citizen''s Charter — Brgy. Veterans', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/VETERANS.pdf', null),
('COC — Brgy. Veterans', 'citizens_charter', 2025, 'https://surallah.gov.ph/wp-content/uploads/2025/06/VETERANS-COC.pdf', null);
```

- [ ] **Step 4: PAUSE — ask the user to run the SQL.** Tell them: open https://supabase.com/dashboard → project `zxqpkcvirsddvbvkiqcj` → SQL Editor → paste and run `schema.sql`, then `seed.sql`. Wait for their confirmation before continuing.

- [ ] **Step 5: Verify read access works (publishable key can read)**

Run:
```powershell
Invoke-RestMethod -Uri "https://zxqpkcvirsddvbvkiqcj.supabase.co/rest/v1/projects?select=id,title&limit=2" -Headers @{ apikey = "sb_publishable_ln8Imc36zVI1jymTciA56A_RjMs83rp" }
```
Expected: 2 project rows as JSON.

- [ ] **Step 6: Verify writes are rejected (RLS works)**

Run:
```powershell
try { Invoke-RestMethod -Method Post -Uri "https://zxqpkcvirsddvbvkiqcj.supabase.co/rest/v1/projects" -Headers @{ apikey = "sb_publishable_ln8Imc36zVI1jymTciA56A_RjMs83rp"; "Content-Type" = "application/json" } -Body '{"title":"hack test"}' } catch { $_.Exception.Response.StatusCode.value__ }
```
Expected: 401 or 403 (row-level security violation). If the insert succeeds, STOP — RLS is broken; re-check schema.sql ran fully.

- [ ] **Step 7: Commit**

```powershell
cd d:\Projects\bettersurallah
git add bettersurallah/supabase
git commit -m "Add Supabase schema and seed data (22 projects, 37 documents)"
```

---

### Task 2: Test tooling, types, and format helpers (TDD)

**Files:**
- Create: `bettersurallah/vitest.config.ts`, `bettersurallah/lib/types.ts`, `bettersurallah/lib/format.ts`, `bettersurallah/lib/format.test.ts`
- Modify: `bettersurallah/package.json` (add test script + vitest devDependency)

**Interfaces:**
- Produces: types `TransparencyDocument`, `GovernmentProject`, `DocumentCategory`, `ProjectStatus`, `FundingSource` (lib/types.ts); functions `formatPeso(amount: number | null): string`, `CATEGORY_LABELS: Record<DocumentCategory, string>`, `groupByCategory(docs: TransparencyDocument[]): [DocumentCategory, TransparencyDocument[]][]`, `documentYears(docs: TransparencyDocument[]): number[]` (lib/format.ts). Tasks 6–8 consume all of these.

- [ ] **Step 1: Install vitest**

```powershell
cd d:\Projects\bettersurallah\bettersurallah
npm install --save-dev vitest
```

- [ ] **Step 2: Create `vitest.config.ts` and add script**

```ts
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: { include: ["**/*.test.ts"], environment: "node" },
});
```

In `package.json` scripts add: `"test": "vitest run"`.

- [ ] **Step 3: Create `lib/types.ts`**

```ts
export type DocumentCategory =
  | "budget"
  | "coa_audit"
  | "full_disclosure"
  | "procurement"
  | "citizens_charter"
  | "other";

export interface TransparencyDocument {
  id: number;
  title: string;
  category: DocumentCategory;
  year: number | null;
  source_url: string | null;
  file_url: string | null;
  description: string | null;
  created_at: string;
}

export type ProjectStatus = "planned" | "ongoing" | "completed" | "unknown";

export type FundingSource =
  | "BUB"
  | "LGSF"
  | "ADM"
  | "AM"
  | "local"
  | "national"
  | "other";

export interface GovernmentProject {
  id: number;
  title: string;
  barangay: string | null;
  amount: number | null;
  funding_source: FundingSource | null;
  year: number | null;
  status: ProjectStatus;
  description: string | null;
  created_at: string;
}
```

- [ ] **Step 4: Write the failing tests in `lib/format.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { CATEGORY_LABELS, documentYears, formatPeso, groupByCategory } from "./format";
import type { TransparencyDocument } from "./types";

function doc(overrides: Partial<TransparencyDocument>): TransparencyDocument {
  return {
    id: 1,
    title: "Doc",
    category: "other",
    year: null,
    source_url: null,
    file_url: null,
    description: null,
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("formatPeso", () => {
  it("formats amounts as Philippine pesos", () => {
    expect(formatPeso(1500000)).toBe("₱1,500,000.00");
  });
  it("renders a dash for null", () => {
    expect(formatPeso(null)).toBe("—");
  });
});

describe("groupByCategory", () => {
  it("groups in fixed category order and skips empty categories", () => {
    const docs = [
      doc({ id: 1, category: "citizens_charter" }),
      doc({ id: 2, category: "budget" }),
      doc({ id: 3, category: "budget" }),
    ];
    const groups = groupByCategory(docs);
    expect(groups.map(([c]) => c)).toEqual(["budget", "citizens_charter"]);
    expect(groups[0][1]).toHaveLength(2);
  });
});

describe("documentYears", () => {
  it("returns unique years, newest first, ignoring nulls", () => {
    const docs = [
      doc({ id: 1, year: 2024 }),
      doc({ id: 2, year: 2026 }),
      doc({ id: 3, year: 2024 }),
      doc({ id: 4, year: null }),
    ];
    expect(documentYears(docs)).toEqual([2026, 2024]);
  });
});

describe("CATEGORY_LABELS", () => {
  it("labels every category", () => {
    expect(CATEGORY_LABELS.coa_audit).toBe("COA Audit Reports");
    expect(Object.keys(CATEGORY_LABELS)).toHaveLength(6);
  });
});
```

- [ ] **Step 5: Run tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `./format` module not found.

- [ ] **Step 6: Create `lib/format.ts`**

```ts
import type { DocumentCategory, TransparencyDocument } from "./types";

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  budget: "Budget",
  coa_audit: "COA Audit Reports",
  full_disclosure: "Full Disclosure",
  procurement: "Procurement",
  citizens_charter: "Citizen's Charter",
  other: "Other Documents",
};

const CATEGORY_ORDER: DocumentCategory[] = [
  "budget",
  "coa_audit",
  "full_disclosure",
  "procurement",
  "citizens_charter",
  "other",
];

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

export function formatPeso(amount: number | null): string {
  return amount === null ? "—" : peso.format(amount);
}

export function groupByCategory(
  docs: TransparencyDocument[],
): [DocumentCategory, TransparencyDocument[]][] {
  return CATEGORY_ORDER.map(
    (category) =>
      [category, docs.filter((d) => d.category === category)] as [
        DocumentCategory,
        TransparencyDocument[],
      ],
  ).filter(([, list]) => list.length > 0);
}

export function documentYears(docs: TransparencyDocument[]): number[] {
  const years = docs
    .map((d) => d.year)
    .filter((y): y is number => y !== null);
  return [...new Set(years)].sort((a, b) => b - a);
}
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm run test`
Expected: PASS (5 tests). If the peso test fails on the symbol, print the actual output and adjust the EXPECTATION only if Node renders "PHP" instead of "₱" (then use `.toContain("1,500,000.00")`) — do not change the formatter.

- [ ] **Step 8: Commit**

```powershell
cd d:\Projects\bettersurallah
git add bettersurallah/vitest.config.ts bettersurallah/lib bettersurallah/package.json bettersurallah/package-lock.json
git commit -m "Add vitest, DB row types, and formatting helpers"
```

---

### Task 3: Supabase client, queries, and env wiring

**Files:**
- Create: `bettersurallah/lib/supabase.ts`, `bettersurallah/lib/queries.ts`, `bettersurallah/.env.local`, `bettersurallah/.env.example`
- Modify: `netlify.toml` (repo root)

**Interfaces:**
- Consumes: types from Task 2.
- Produces: `fetchDocuments(): Promise<TransparencyDocument[]>`, `fetchLatestDocuments(limit?: number): Promise<TransparencyDocument[]>`, `fetchProjects(): Promise<GovernmentProject[]>` (lib/queries.ts). Tasks 6–8 consume these.

- [ ] **Step 1: Install supabase-js**

```powershell
cd d:\Projects\bettersurallah\bettersurallah
npm install @supabase/supabase-js
```

- [ ] **Step 2: Create both env files** (`.env.local` untracked, `.env.example` committed — identical content; these values are public by design):

```
NEXT_PUBLIC_SUPABASE_URL=https://zxqpkcvirsddvbvkiqcj.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ln8Imc36zVI1jymTciA56A_RjMs83rp
```

- [ ] **Step 3: Add the same values to `netlify.toml`** (repo root) so Netlify builds get them:

```toml
[build]
  base = "bettersurallah"
  command = "npm run build"
  publish = "out"

[build.environment]
  NEXT_PUBLIC_SUPABASE_URL = "https://zxqpkcvirsddvbvkiqcj.supabase.co"
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ln8Imc36zVI1jymTciA56A_RjMs83rp"
```

- [ ] **Step 4: Create `lib/supabase.ts`**

```ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  );
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
```

- [ ] **Step 5: Create `lib/queries.ts`**

```ts
import { supabase } from "./supabase";
import type { GovernmentProject, TransparencyDocument } from "./types";

export async function fetchDocuments(): Promise<TransparencyDocument[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("year", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as TransparencyDocument[];
}

export async function fetchLatestDocuments(
  limit = 5,
): Promise<TransparencyDocument[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as TransparencyDocument[];
}

export async function fetchProjects(): Promise<GovernmentProject[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("year", { ascending: false, nullsFirst: false })
    .order("id", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as GovernmentProject[];
}
```

- [ ] **Step 6: Verify against the live database with a throwaway script**

Create `bettersurallah/scripts/smoke-queries.mjs` (delete after this step):

```js
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://zxqpkcvirsddvbvkiqcj.supabase.co",
  "sb_publishable_ln8Imc36zVI1jymTciA56A_RjMs83rp",
);
const { data: projects, error: pErr } = await supabase.from("projects").select("id");
const { data: docs, error: dErr } = await supabase.from("documents").select("id");
if (pErr || dErr) throw new Error(String(pErr?.message ?? dErr?.message));
console.log(`projects: ${projects.length}, documents: ${docs.length}`);
```

Run: `node scripts/smoke-queries.mjs`
Expected: `projects: 22, documents: 37`. Then delete the script.

- [ ] **Step 7: Verify build still passes**

Run: `npm run build`
Expected: compiles, all routes static.

- [ ] **Step 8: Commit**

```powershell
cd d:\Projects\bettersurallah
git add netlify.toml bettersurallah/lib bettersurallah/.env.example bettersurallah/package.json bettersurallah/package-lock.json
git commit -m "Add Supabase client, typed queries, and env wiring"
```

---

### Task 4: Officials and stats data files + search (TDD)

**Files:**
- Create: `bettersurallah/data/officials.ts`, `bettersurallah/data/stats.ts`, `bettersurallah/lib/search.ts`, `bettersurallah/lib/search.test.ts`

**Interfaces:**
- Produces: `Official` interface `{ name: string; position: string; group: OfficialGroup; detail?: string; phone?: string; unverified?: boolean }` with `OfficialGroup = "executive" | "sangguniang_bayan" | "department_head" | "barangay_captain"`; `OFFICIALS: Official[]`; `GROUP_LABELS: Record<OfficialGroup, string>`; `MUNICIPAL_STATS`; `searchOfficials(officials: Official[], query: string): Official[]`. Tasks 6 and 9 consume these.

- [ ] **Step 1: Try to verify current Vice Mayor and SB roster.** Use WebSearch/WebFetch for "Surallah South Cotabato vice mayor 2025 election results". If a name is confirmed by a reliable source (COMELEC, Rappler/GMA/PhilStar election results pages), include it. If not confirmable, OMIT the vice mayor entry entirely and add `unverified: true` to all SB entries. Never guess a name.

- [ ] **Step 2: Write the failing test `lib/search.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { searchOfficials } from "./search";
import type { Official } from "@/data/officials";

const sample: Official[] = [
  { name: "Ely T. Todoc", position: "Municipal Budget Officer", group: "department_head", phone: "2383-100" },
  { name: "Haddy S. Glamado", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Buenavista" },
];

describe("searchOfficials", () => {
  it("returns everyone for an empty query", () => {
    expect(searchOfficials(sample, "  ")).toHaveLength(2);
  });
  it("matches name case-insensitively", () => {
    expect(searchOfficials(sample, "todoc")).toHaveLength(1);
  });
  it("matches position and detail", () => {
    expect(searchOfficials(sample, "budget")[0].name).toBe("Ely T. Todoc");
    expect(searchOfficials(sample, "buenavista")[0].name).toBe("Haddy S. Glamado");
  });
  it("returns empty for no match", () => {
    expect(searchOfficials(sample, "zzz")).toHaveLength(0);
  });
});
```

- [ ] **Step 3: Run tests to verify the new file fails** (`npm run test` → FAIL, module not found)

- [ ] **Step 4: Create `lib/search.ts`**

```ts
import type { Official } from "@/data/officials";

export function searchOfficials(
  officials: Official[],
  query: string,
): Official[] {
  const q = query.trim().toLowerCase();
  if (!q) return officials;
  return officials.filter((o) =>
    [o.name, o.position, o.detail ?? "", o.phone ?? ""].some((field) =>
      field.toLowerCase().includes(q),
    ),
  );
}
```

- [ ] **Step 5: Create `data/officials.ts`** with this exact structure and content (append the vice mayor from Step 1 if verified; committee chairmanships from the official standing-committees page; phones from the official directory):

```ts
export type OfficialGroup =
  | "executive"
  | "sangguniang_bayan"
  | "department_head"
  | "barangay_captain";

export interface Official {
  name: string;
  position: string;
  group: OfficialGroup;
  detail?: string;
  phone?: string;
  unverified?: boolean;
}

export const GROUP_LABELS: Record<OfficialGroup, string> = {
  executive: "Executive",
  sangguniang_bayan: "Sangguniang Bayan",
  department_head: "Department Heads & Offices",
  barangay_captain: "Barangay Captains",
};

export const OFFICIALS: Official[] = [
  { name: 'Pedro "Cano" M. Matinong Jr.', position: "Municipal Mayor", group: "executive", phone: "2383-578" },
  // Vice Mayor: add here ONLY if verified in Task 4 Step 1.

  { name: "Hon. Beltran L. Armada", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Finance, Budget & Appropriation; Rules; Infrastructure, Housing & Land Use" },
  { name: "Hon. Ian Cristopher B. Escleto", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Women, Children & Family; Trade, Investment & Livelihood" },
  { name: "Hon. Reynaldo S. Costan", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Justice & Human Rights" },
  { name: "Hon. Filipina D. Peñol", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Youth & Sports Development" },
  { name: "Hon. Chris P. Valdevieso", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Agriculture & Environment; Tourism, Culture & Arts; Transportation" },
  { name: "Hon. Resuli O. Villanueva", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Police & Drug-Related Matters; Health, Sanitation & Nutrition" },
  { name: "Hon. Floyd Ross D. Rosal", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Social Services; Education; Games & Amusements" },
  { name: "Hon. Harold B. Eslabon", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Good Governance & Anti-Corruption" },
  { name: "Hon. Romulo B. Solivio Jr.", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Communication & Energy" },
  { name: "Hon. Ronald F. Talfan", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Cultural Minority" },
  { name: "Hon. Renato B. Susbilla", position: "SB Member (Liga ng mga Barangay President)", group: "sangguniang_bayan", detail: "Chair: Barangay Affairs" },

  { name: "Benjamin S. Datinguinoo", position: "Municipal Administrator", group: "department_head", phone: "2383-578" },
  { name: "Dionel C. Calibayan", position: "Chief of Staff, Office of the Mayor", group: "department_head" },
  { name: "Josephine C. Portogalete", position: "Municipal Agriculturist", group: "department_head", phone: "2383-496" },
  { name: "Elisa M. Alferes", position: "SB Secretary", group: "department_head", phone: "2385-046" },
  { name: "Jesus B. Cariño", position: "Municipal Human Resource Management Officer", group: "department_head", phone: "2383-592" },
  { name: "Joyce A. Lubaton", position: "Municipal Planning & Development Coordinator", group: "department_head", phone: "2383-759" },
  { name: "Engr. Gemma J. Burgos", position: "Municipal Civil Registrar", group: "department_head", phone: "2383-981" },
  { name: "Ely T. Todoc", position: "Municipal Budget Officer", group: "department_head", phone: "2383-100" },
  { name: "Aida B. Baylas, CPA", position: "Municipal Accountant", group: "department_head", phone: "2383-328" },
  { name: "Edward B. Barrios", position: "Municipal Treasurer", group: "department_head", phone: "2383-483" },
  { name: "Leonardo B. Ballon, EnP", position: "MDRRM Officer", group: "department_head", phone: "2383-911" },
  { name: "Dr. Neil T. Crespo", position: "Municipal Health Officer", group: "department_head", phone: "2383-485" },
  { name: "Engr. Roldan M. Eusoya", position: "MENR Officer", group: "department_head", phone: "2383-983" },
  { name: "Andrew Ian B. Dormitorio", position: "MEEMO Manager", group: "department_head", phone: "2383-033" },
  { name: "Leonardo A. Mondejar", position: "Municipal Assessor", group: "department_head", phone: "2383-414" },
  { name: "Engr. Lerny D. Pajonar, EnP", position: "Municipal Engineer", group: "department_head", phone: "2383-583" },
  { name: "Marietta C. Discaya", position: "BAC Secretariat Head", group: "department_head", phone: "2383-262" },
  { name: "Rhoda Leaf G. Catoto, RSW", position: "MSWD Officer", group: "department_head", phone: "2383-009" },
  { name: "Arnold B. Sequito", position: "Business & Licensing Officer", group: "department_head", phone: "2383-925" },
  { name: "Mary Grace C. Cabaya", position: "Management Audit Analyst III", group: "department_head" },
  { name: "Cherish Love M. Eslabon", position: "PESO Manager", group: "department_head", phone: "2383-107" },
  { name: "Maylyn P. Diesto", position: "Senior Tourism Operations Officer", group: "department_head", phone: "2383-997" },
  { name: "Kristine B. Tanucan", position: "Community Development Information Officer", group: "department_head", phone: "2383-143" },
  { name: "Remelyn E. Cataloctocan", position: "Acting General Services Officer", group: "department_head", phone: "2383-715" },

  { name: "Haddy S. Glamado", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Buenavista" },
  { name: "Rita P. Escorido", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Canahay" },
  { name: "Oscar B. Bubongan", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Centrala" },
  { name: "Rizalito L. Ello Jr.", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Colongulo" },
  { name: "Christopher B. Lazo", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Dajay" },
  { name: "Vilma B. Herbilla", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Duengas" },
  { name: "Letecia A. Pedroso", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Lambontong" },
  { name: "Rolly Marmito", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Lamian" },
  { name: "Anthony B. Baladjay", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Lamsugod" },
  { name: "Renato B. Susbilla", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Libertad" },
  { name: "Dionel C. Calibayan", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Little Baguio" },
  { name: "Efraem E. Fulgencio", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Moloy" },
  { name: "Angelo P. Casas", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Naci" },
  { name: "Arnold L. Buriel", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Talahik" },
  { name: "Bertito P. Allas", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Tubi-Alah" },
  { name: "Edon P. Ambas", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Upper Sepaka" },
  { name: "Anita M. Fernando", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Veterans" },
];
```

Roster note: this is as published on surallah.gov.ph (16th Municipal Council era). If Step 1 could not verify it is current, ALSO add to the officials page (Task 9) the caption: "As listed on the official municipal website; roster verification in progress."

- [ ] **Step 6: Create `data/stats.ts`**

```ts
export const MUNICIPAL_STATS = {
  population: 89340,
  populationCensusYear: 2020,
  barangays: 17,
  landAreaHectares: 31110,
  foundedYear: 1961,
} as const;
```

- [ ] **Step 7: Run tests to verify they pass** (`npm run test` → PASS, 9 tests total)

- [ ] **Step 8: Commit**

```powershell
cd d:\Projects\bettersurallah
git add bettersurallah/data bettersurallah/lib
git commit -m "Add officials/stats data files and officials search"
```

---

### Task 5: Site chrome — header, footer, data-state components

**Files:**
- Create: `bettersurallah/components/site-header.tsx`, `bettersurallah/components/site-footer.tsx`, `bettersurallah/components/data-states.tsx`
- Modify: `bettersurallah/app/layout.tsx`

**Interfaces:**
- Produces: `<SiteHeader />`, `<SiteFooter />` (used by layout); `SkeletonRows({ count?: number })`, `ErrorState({ message, onRetry }: { message: string; onRetry: () => void })`, `EmptyState({ message }: { message: string })` — Tasks 6–8 consume the state components.

- [ ] **Step 1: Create `components/site-header.tsx`**

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/transparency", label: "Transparency" },
  { href: "/projects", label: "Projects" },
  { href: "/officials", label: "Officials" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="relative z-10 border-b border-ink/10 bg-base">
      <div className="h-1.5 w-full bg-blue" />
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-10">
        <Link href="/">
          <Image src="/logo.png" alt="BetterSurallah.org" width={131} height={40} priority className="h-10 w-auto" />
        </Link>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-1">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  active ? "bg-blue text-white" : "text-ink-soft hover:bg-mist hover:text-blue"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create `components/site-footer.tsx`**

```tsx
export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-ink/10 bg-base">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 sm:px-10">
        <p className="text-sm font-semibold text-ink">
          BetterSurallah is an independent, citizen-run initiative. It is not
          affiliated with the Municipal Government of Surallah.
        </p>
        <div className="flex flex-col gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BetterSurallah · A community initiative</p>
          <p>Surallah, South Cotabato, Philippines</p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Create `components/data-states.tsx`**

```tsx
export function SkeletonRows({ count = 6 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-mist" />
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-mist/50 p-6 text-center">
      <p className="text-sm text-ink-soft">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-deep"
      >
        Retry
      </button>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-ink/20 p-6 text-center text-sm text-ink-soft">
      {message}
    </div>
  );
}
```

- [ ] **Step 4: Update `app/layout.tsx`** — keep fonts/globals import; change metadata and body:

```tsx
import type { Metadata, Viewport } from "next";
import { Public_Sans, Schibsted_Grotesk } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BetterSurallah — Transparency for Surallah, South Cotabato",
    template: "%s · BetterSurallah",
  },
  description:
    "An independent, citizen-built window into how Surallah works — transparency documents, officials, and government projects in one place.",
};

export const viewport: Viewport = {
  themeColor: "#0035ad",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${schibsted.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify build** (`npm run build` → passes; home page still renders inside new chrome — the old coming-soon content will look doubled with two blue bars until Task 6 rewrites it; that is expected and acceptable at this checkpoint)

- [ ] **Step 6: Commit**

```powershell
cd d:\Projects\bettersurallah
git add bettersurallah/components bettersurallah/app/layout.tsx
git commit -m "Add site chrome: header nav, footer, data-state components"
```

---

### Task 6: Home page

**Files:**
- Create: `bettersurallah/components/latest-documents.tsx`
- Rewrite: `bettersurallah/app/page.tsx`

**Interfaces:**
- Consumes: `fetchLatestDocuments` (Task 3), `CATEGORY_LABELS` (Task 2), `MUNICIPAL_STATS` (Task 4), state components (Task 5).

- [ ] **Step 1: Create `components/latest-documents.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/data-states";
import { CATEGORY_LABELS } from "@/lib/format";
import { fetchLatestDocuments } from "@/lib/queries";
import type { TransparencyDocument } from "@/lib/types";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; docs: TransparencyDocument[] };

export function LatestDocuments() {
  const [state, setState] = useState<State>({ status: "loading" });

  const load = useCallback(() => {
    setState({ status: "loading" });
    fetchLatestDocuments(5)
      .then((docs) => setState({ status: "ready", docs }))
      .catch((e: Error) => setState({ status: "error", message: e.message }));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (state.status === "loading") return <SkeletonRows count={5} />;
  if (state.status === "error")
    return <ErrorState message="Couldn't load the latest documents." onRetry={load} />;
  if (state.docs.length === 0)
    return <EmptyState message="No documents published yet." />;

  return (
    <ul className="flex flex-col divide-y divide-ink/10">
      {state.docs.map((doc) => (
        <li key={doc.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
          <a
            href={doc.file_url ?? doc.source_url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ink transition-colors hover:text-blue"
          >
            {doc.title}
          </a>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
            {CATEGORY_LABELS[doc.category]}
            {doc.year ? ` · ${doc.year}` : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Rewrite `app/page.tsx`**

```tsx
import Link from "next/link";
import { LatestDocuments } from "@/components/latest-documents";
import { MUNICIPAL_STATS } from "@/data/stats";

const SECTIONS = [
  {
    href: "/transparency",
    title: "Transparency",
    text: "Budgets, audits, and public documents — collected and easy to find.",
  },
  {
    href: "/projects",
    title: "Projects",
    text: "Government projects with amounts, funding sources, and status.",
  },
  {
    href: "/officials",
    title: "Officials",
    text: "Who runs Surallah — searchable, from mayor to barangay captains.",
  },
];

const STATS = [
  { value: MUNICIPAL_STATS.population.toLocaleString("en-PH"), label: `Population (${MUNICIPAL_STATS.populationCensusYear} census)` },
  { value: String(MUNICIPAL_STATS.barangays), label: "Barangays" },
  { value: MUNICIPAL_STATS.landAreaHectares.toLocaleString("en-PH"), label: "Hectares" },
  { value: String(MUNICIPAL_STATS.foundedYear), label: "Founded" },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_80%_-10%,var(--mist)_0%,transparent_60%)]" />
        <div className="dotgrid absolute inset-0 opacity-[0.05]" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-20 sm:px-10">
        <p className="reveal flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-blue">
          <span className="h-px w-10 bg-blue/50" />
          Para sa Surallah · South Cotabato
        </p>
        <h1 className="reveal mt-6 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-ink" style={{ animationDelay: "0.1s" }}>
          See how Surallah <span className="text-blue">works</span>.
        </h1>
        <p className="reveal mt-6 max-w-xl text-lg leading-8 text-ink-soft" style={{ animationDelay: "0.2s" }}>
          An independent, citizen-built window into our municipality — public
          documents, government projects, and the people behind them, gathered
          in one place and made easy to read.
        </p>

        <dl className="reveal mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4" style={{ animationDelay: "0.3s" }}>
          {STATS.map((s) => (
            <div key={s.label} className="border-l-2 border-blue/30 pl-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{s.label}</dt>
              <dd className="mt-1 font-display text-3xl font-bold text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="relative z-10 mx-auto grid w-full max-w-6xl gap-4 px-6 pb-16 sm:grid-cols-3 sm:px-10">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-xl border border-ink/10 bg-base p-6 transition-colors hover:border-blue/40"
          >
            <h2 className="font-display text-xl font-bold text-ink group-hover:text-blue">{s.title} →</h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{s.text}</p>
          </Link>
        ))}
      </section>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 sm:px-10">
        <h2 className="font-display text-2xl font-bold text-ink">Latest documents</h2>
        <div className="mt-4">
          <LatestDocuments />
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Verify in dev server** — run `npm run dev`, open http://localhost:3000, confirm: hero + 4 stats render immediately, latest-documents section shows skeletons then 5 real rows from Supabase. Stop dev server.

- [ ] **Step 4: Verify build** (`npm run build` → passes)

- [ ] **Step 5: Commit**

```powershell
cd d:\Projects\bettersurallah
git add bettersurallah/app/page.tsx bettersurallah/components/latest-documents.tsx
git commit -m "Replace coming-soon page with v1 home"
```

---

### Task 7: Transparency page

**Files:**
- Create: `bettersurallah/components/transparency-list.tsx`, `bettersurallah/app/transparency/page.tsx`

**Interfaces:**
- Consumes: `fetchDocuments` (Task 3), `CATEGORY_LABELS`, `groupByCategory`, `documentYears` (Task 2), state components (Task 5).

- [ ] **Step 1: Create `components/transparency-list.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/data-states";
import { CATEGORY_LABELS, documentYears, groupByCategory } from "@/lib/format";
import { fetchDocuments } from "@/lib/queries";
import type { TransparencyDocument } from "@/lib/types";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; docs: TransparencyDocument[] };

export function TransparencyList() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [year, setYear] = useState<number | "all">("all");

  const load = useCallback(() => {
    setState({ status: "loading" });
    fetchDocuments()
      .then((docs) => setState({ status: "ready", docs }))
      .catch((e: Error) => setState({ status: "error", message: e.message }));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const docs = state.status === "ready" ? state.docs : [];
  const years = useMemo(() => documentYears(docs), [docs]);
  const visible = useMemo(
    () => (year === "all" ? docs : docs.filter((d) => d.year === year)),
    [docs, year],
  );
  const groups = useMemo(() => groupByCategory(visible), [visible]);

  if (state.status === "loading") return <SkeletonRows count={8} />;
  if (state.status === "error")
    return <ErrorState message="Couldn't load documents." onRetry={load} />;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip label="All years" active={year === "all"} onClick={() => setYear("all")} />
        {years.map((y) => (
          <FilterChip key={y} label={String(y)} active={year === y} onClick={() => setYear(y)} />
        ))}
      </div>

      {groups.length === 0 && <EmptyState message="No documents for this filter yet." />}

      {groups.map(([category, list]) => (
        <section key={category}>
          <h2 className="flex items-baseline gap-3 font-display text-2xl font-bold text-ink">
            {CATEGORY_LABELS[category]}
            <span className="text-sm font-semibold text-ink-soft">{list.length}</span>
          </h2>
          <ul className="mt-4 flex flex-col divide-y divide-ink/10 rounded-xl border border-ink/10 bg-base px-5">
            {list.map((doc) => (
              <li key={doc.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{doc.title}</p>
                  {doc.description && (
                    <p className="mt-0.5 text-sm text-ink-soft">{doc.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-4 text-sm font-semibold">
                  {doc.year && <span className="text-ink-soft">{doc.year}</span>}
                  {doc.source_url && (
                    <a href={doc.source_url} target="_blank" rel="noopener noreferrer" className="text-blue hover:text-blue-deep">
                      Official source ↗
                    </a>
                  )}
                  {doc.file_url && (
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-blue hover:text-blue-deep">
                      Copy ↗
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? "border-blue bg-blue text-white"
          : "border-ink/15 text-ink-soft hover:border-blue/40 hover:text-blue"
      }`}
    >
      {label}
    </button>
  );
}
```

- [ ] **Step 2: Create `app/transparency/page.tsx`**

```tsx
import type { Metadata } from "next";
import { TransparencyList } from "@/components/transparency-list";

export const metadata: Metadata = {
  title: "Transparency",
  description:
    "Public documents of the Municipality of Surallah — budgets, audits, citizen's charters, and disclosures.",
};

export default function TransparencyPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue">Public documents</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">Transparency</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Official documents of the Municipality of Surallah, collected in one
        place. Every entry links to its source so you can verify it yourself.
      </p>
      <div className="mt-10">
        <TransparencyList />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify in dev server** — `/transparency` shows the Citizen's Charter group with 37 documents, year chips (2026, 2025, 2024) filter correctly.

- [ ] **Step 4: Verify build** (`npm run build`)

- [ ] **Step 5: Commit**

```powershell
cd d:\Projects\bettersurallah
git add bettersurallah/app/transparency bettersurallah/components/transparency-list.tsx
git commit -m "Add transparency documents page"
```

---

### Task 8: Projects page

**Files:**
- Create: `bettersurallah/components/projects-table.tsx`, `bettersurallah/app/projects/page.tsx`

**Interfaces:**
- Consumes: `fetchProjects` (Task 3), `formatPeso` (Task 2), types (Task 2), state components (Task 5).

- [ ] **Step 1: Create `components/projects-table.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/data-states";
import { formatPeso } from "@/lib/format";
import { fetchProjects } from "@/lib/queries";
import type { GovernmentProject, ProjectStatus } from "@/lib/types";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; projects: GovernmentProject[] };

const STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: "Planned",
  ongoing: "Ongoing",
  completed: "Completed",
  unknown: "Unknown",
};

const STATUS_STYLES: Record<ProjectStatus, string> = {
  completed: "bg-blue text-white",
  ongoing: "bg-mist text-blue border border-blue/30",
  planned: "border border-ink/20 text-ink-soft",
  unknown: "border border-ink/10 text-ink-soft",
};

export function ProjectsTable() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");

  const load = useCallback(() => {
    setState({ status: "loading" });
    fetchProjects()
      .then((projects) => setState({ status: "ready", projects }))
      .catch((e: Error) => setState({ status: "error", message: e.message }));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const projects = state.status === "ready" ? state.projects : [];
  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.status === filter)),
    [projects, filter],
  );
  const total = useMemo(
    () => visible.reduce((sum, p) => sum + (p.amount ?? 0), 0),
    [visible],
  );

  if (state.status === "loading") return <SkeletonRows count={10} />;
  if (state.status === "error")
    return <ErrorState message="Couldn't load projects." onRetry={load} />;

  const statuses: (ProjectStatus | "all")[] = ["all", "completed", "ongoing", "planned", "unknown"];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              filter === s
                ? "border-blue bg-blue text-white"
                : "border-ink/15 text-ink-soft hover:border-blue/40 hover:text-blue"
            }`}
          >
            {s === "all" ? "All" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState message="No projects with this status yet." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink/10">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-mist/60 text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Barangay</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Fund</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink">{p.title}</p>
                    {p.description && <p className="mt-0.5 text-xs text-ink-soft">{p.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{p.barangay ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{p.year ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{p.funding_source ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-semibold text-ink">{formatPeso(p.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[p.status]}`}>
                      {STATUS_LABELS[p.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-mist/60 font-semibold text-ink">
                <td className="px-4 py-3" colSpan={4}>
                  Total ({visible.length} {visible.length === 1 ? "project" : "projects"})
                </td>
                <td className="px-4 py-3 text-right">{formatPeso(total)}</td>
                <td className="px-4 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `app/projects/page.tsx`**

```tsx
import type { Metadata } from "next";
import { ProjectsTable } from "@/components/projects-table";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Government projects in Surallah, South Cotabato — amounts, funding sources, and status.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue">Where the money goes</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">Projects</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Government projects in Surallah with amounts, funding sources, and
        status — starting with DILG-funded projects published by the
        municipality, and growing as new records are added.
      </p>
      <div className="mt-10">
        <ProjectsTable />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify in dev server** — `/projects` shows 22 rows, total ₱77,683,623.00 on "All", status filters work.

- [ ] **Step 4: Verify build** (`npm run build`)

- [ ] **Step 5: Commit**

```powershell
cd d:\Projects\bettersurallah
git add bettersurallah/app/projects bettersurallah/components/projects-table.tsx
git commit -m "Add projects tracker page"
```

---

### Task 9: Officials page, About page, final verification

**Files:**
- Create: `bettersurallah/components/officials-directory.tsx`, `bettersurallah/app/officials/page.tsx`, `bettersurallah/app/about/page.tsx`

**Interfaces:**
- Consumes: `OFFICIALS`, `GROUP_LABELS`, `Official`, `OfficialGroup` (Task 4), `searchOfficials` (Task 4), `MUNICIPAL_STATS` (Task 4).

- [ ] **Step 1: Create `components/officials-directory.tsx`**

```tsx
"use client";

import { useMemo, useState } from "react";
import { GROUP_LABELS, OFFICIALS, type OfficialGroup } from "@/data/officials";
import { searchOfficials } from "@/lib/search";

const GROUP_ORDER: OfficialGroup[] = [
  "executive",
  "sangguniang_bayan",
  "department_head",
  "barangay_captain",
];

export function OfficialsDirectory() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchOfficials(OFFICIALS, query), [query]);

  return (
    <div className="flex flex-col gap-10">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, position, office, or barangay…"
        aria-label="Search officials"
        className="w-full max-w-xl rounded-full border border-ink/15 bg-base px-5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-blue"
      />

      {results.length === 0 && (
        <p className="text-sm text-ink-soft">No officials match “{query}”.</p>
      )}

      {GROUP_ORDER.map((group) => {
        const list = results.filter((o) => o.group === group);
        if (list.length === 0) return null;
        return (
          <section key={group}>
            <h2 className="flex items-baseline gap-3 font-display text-2xl font-bold text-ink">
              {GROUP_LABELS[group]}
              <span className="text-sm font-semibold text-ink-soft">{list.length}</span>
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((o) => (
                <li key={`${o.name}-${o.position}`} className="rounded-xl border border-ink/10 bg-base p-4">
                  <p className="font-semibold text-ink">{o.name}</p>
                  <p className="mt-0.5 text-sm text-blue">{o.position}</p>
                  {o.detail && <p className="mt-1 text-xs leading-5 text-ink-soft">{o.detail}</p>}
                  {o.phone && (
                    <p className="mt-1 text-xs font-semibold text-ink-soft">☎ (083) {o.phone}</p>
                  )}
                  {o.unverified && (
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft/70">
                      Verification in progress
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create `app/officials/page.tsx`** (include the roster caption if Task 4 Step 1 could not verify):

```tsx
import type { Metadata } from "next";
import { OfficialsDirectory } from "@/components/officials-directory";

export const metadata: Metadata = {
  title: "Officials",
  description:
    "Searchable directory of Surallah's municipal officials, department heads, and barangay captains.",
};

export default function OfficialsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue">Who runs Surallah</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">Officials</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Municipal officials, department heads, and barangay captains — as
        published by the Municipality of Surallah, searchable as text for the
        first time.
      </p>
      <div className="mt-10">
        <OfficialsDirectory />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `app/about/page.tsx`**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "What BetterSurallah is, who runs it, and where the data comes from.",
};

const SOURCES = [
  { name: "Municipality of Surallah official website", url: "https://surallah.gov.ph/" },
  { name: "DILG Full Disclosure Policy Portal", url: "https://fdpp.dilg.gov.ph/" },
  { name: "Commission on Audit annual audit reports", url: "https://www.coa.gov.ph/" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue">About</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">
        What is BetterSurallah?
      </h1>

      <div className="mt-8 flex flex-col gap-6 text-lg leading-8 text-ink-soft">
        <p>
          BetterSurallah is an independent, citizen-built website that gathers
          public information about the Municipality of Surallah, South
          Cotabato — transparency documents, government projects, and the
          people in office — and makes it easy to find, read, and verify.
        </p>
        <p className="rounded-xl border border-blue/20 bg-mist/50 p-5 text-base leading-7">
          <strong className="text-ink">Independence note:</strong> this site is
          not affiliated with, endorsed by, or operated by the Municipal
          Government of Surallah or any of its offices. Every document links
          back to its official source so you can check it yourself.
        </p>
        <div aria-hidden="true" className="flex h-56 items-center justify-center rounded-xl bg-mist text-sm font-semibold text-ink-soft">
          Photo coming soon
        </div>
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold text-ink">Where the data comes from</h2>
      <ul className="mt-4 flex flex-col gap-2">
        {SOURCES.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue hover:text-blue-deep">
              {s.name} ↗
            </a>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 font-display text-2xl font-bold text-ink">Corrections</h2>
      <p className="mt-3 text-lg leading-8 text-ink-soft">
        Spotted something wrong or outdated? Contact details are coming soon —
        for now, corrections land in the next update.
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Full verification**

Run: `npm run test` → all tests pass.
Run: `npm run lint` → clean.
Run: `npm run build` → all routes (`/`, `/transparency`, `/projects`, `/officials`, `/about`, `/icon.png`) prerendered static; `out/` contains all five HTML pages.
Run dev server once and click through all five pages; confirm Supabase sections load real data and officials search filters live.

- [ ] **Step 5: Commit and push**

```powershell
cd d:\Projects\bettersurallah
git add bettersurallah/app bettersurallah/components
git commit -m "Add officials directory and about page"
git push origin main
```

- [ ] **Step 6: Confirm Netlify deploy** — after push, the Netlify build should go green (env vars come from netlify.toml). Ask the user to confirm the live URL renders the new site, or check it via the site's public URL if known.

---

## Self-review notes

- Spec coverage: schema+RLS+seed (Task 1), env/queries (Task 3), officials/stats repo files (Task 4), all five pages (Tasks 6–9), three UX states (Task 5 components used in 6–8), RLS write-rejection verification (Task 1 Step 6), tests (Tasks 2, 4), placeholder image (About page), VM verification gap (Task 4 Step 1). Custom domain + document mirroring + admin panel: deferred per spec.
- The coming-soon page's `WeaveBand`/stitch elements are dropped with the page.tsx rewrite in Task 6; unused CSS utilities (`stitch`, `beacon`) may remain in globals.css harmlessly — do not delete them, the About/home may reuse later.
- Type/interface names are consistent across tasks (`TransparencyDocument`, `GovernmentProject`, `Official`, `fetchDocuments`, `fetchLatestDocuments`, `fetchProjects`, `searchOfficials`, `CATEGORY_LABELS`, `GROUP_LABELS`, `MUNICIPAL_STATS`).
