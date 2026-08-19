# BetterSurallah — app

The Next.js 16 app behind BetterSurallah. See the [repository README](../README.md) for the full project overview, architecture, and data model.

## Quick start

```bash
npm install
cp .env.example .env.local   # public Supabase URL + publishable key
npm run dev                  # http://localhost:3000
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run test` | Vitest unit tests (`lib/*.test.ts`) |
| `npm run lint` | ESLint |
| `npm run build` | Static export to `out/` (what Netlify deploys) |

## Notes

- `next.config.ts` uses `output: "export"` — keep the site fully static: no SSR, API routes, or server actions.
- Supabase is queried only from client components with the publishable key; the database is read-only to the public via RLS (see [`supabase/schema.sql`](supabase/schema.sql)).
- Database content (documents, projects) is edited in the Supabase dashboard; officials/stats live in [`data/`](data/) and are edited via git.
