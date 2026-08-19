<p align="center">
  <img src="bettersurallah/public/logo.png" alt="BetterSurallah.org" width="420">
</p>

# BetterSurallah

An independent, citizen-built transparency website for the **Municipality of Surallah, South Cotabato, Philippines** — public documents, government projects, and the people in office, gathered in one place and made easy to read.

> **Independence note:** BetterSurallah is not affiliated with, endorsed by, or operated by the Municipal Government of Surallah. Every document links back to its official source so anyone can verify it.

## What's on the site

| Page | What it shows |
|---|---|
| **Home** | Municipal quick stats and the latest published documents |
| **/transparency** | Public documents (citizen's charters, and eventually budgets, COA audits, disclosures) grouped by category, filterable by category and year |
| **/projects** | Government projects with amounts, funding sources, year, and status — sortable and filterable |
| **/officials** | Searchable directory: mayor, vice mayor, Sangguniang Bayan, department heads (with office phone numbers), and all 17 barangay captains |
| **/about** | What the site is, who runs it, and where the data comes from |

## How it works

- **Next.js 16** (App Router, TypeScript, Tailwind v4) built as a **fully static export** — no servers.
- **Supabase (Postgres)** stores the content that changes often (`documents`, `projects`). The browser reads it live with the publishable key; **Row-Level Security allows `SELECT` only**, so the database is read-only to the public. Content edits happen in the Supabase dashboard and appear on the site on refresh — no rebuild needed.
- Rarely-changing data (officials, municipal stats) lives as typed files in [`bettersurallah/data/`](bettersurallah/data/) and is edited through git.
- **Netlify** deploys automatically from `main` (settings in [`netlify.toml`](netlify.toml): base `bettersurallah`, publish `out`).

## Repository layout

```
bettersurallah/        The Next.js app
  app/                 Pages (App Router)
  components/          UI components
  data/                Officials + stats (repo-managed content)
  lib/                 Supabase client, queries, formatting, search
  supabase/            schema.sql (tables + RLS) and seed.sql
docs/superpowers/      Design spec and implementation plan
netlify.toml           Netlify build settings + public env vars
```

## Development

```bash
cd bettersurallah
npm install
cp .env.example .env.local   # public Supabase URL + publishable key
npm run dev                  # http://localhost:3000
```

Checks: `npm run test` (Vitest), `npm run lint`, `npm run build` (static export to `out/`).

## Data sources

- [Municipality of Surallah official website](https://surallah.gov.ph/)
- [DILG Full Disclosure Policy Portal](https://fdpp.dilg.gov.ph/)
- [Commission on Audit](https://www.coa.gov.ph/)

Spotted something wrong or outdated? Open an issue.
