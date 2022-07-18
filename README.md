# Vauntly Jobs Board

Job board web app for browsing, creating, and moderating job posts. Supports importing listings from Google Jobs (via SerpAPI), with auth, a Postgres data layer, and a Hasura GraphQL API.

**Repo:** <https://github.com/efosao/vauntly-legacy>

## Stack

- **Language:** TypeScript
- **App:** Next.js (Pages Router) + React + tRPC
- **UI:** Tailwind CSS
- **Data:** PostgreSQL + Prisma + Hasura
- **Auth:** Firebase
- **Import:** `google-search-results-nodejs` (SerpAPI Google Jobs)
  ~8,600 lines of tracked source (including lockfile and config). No AI/LLM
  features; not AI-written.

## Features

- Browse fresh job posts
- Create job posts
- Review pending posts
- User sign-in / profile
- Bulk import from Google Jobs SERP results

## Getting started

  Requires **Node 16** and **pnpm**.

  ```bash
  pnpm install
  pnpm pre:dev   # prisma generate
  pnpm dev
  ```

  App: [http://localhost:3000](http://localhost:3000)

### Useful scripts

  | Script | Purpose |
  |--------|---------|
  | `pnpm dev` | Generate Prisma client and start Next.js |
  | `pnpm build` | Production build |
  | `pnpm start` | Run production server |
  | `pnpm lint` / `pnpm fix` | Lint / auto-fix |
  | `pnpm import` | Run Google Jobs import (`src/import.mjs`) |

### Environment

  Configure at least:

- `DATABASE_URL` — PostgreSQL connection string (Prisma)
- Firebase client/admin credentials for auth
- SerpAPI key for job import (if using `pnpm import`)
- Hasura endpoint / admin secret (see `docker-compose.yaml` for local GraphQL
  engine)
  Hasura can be started with:

  ```bash
  docker compose up
  ```

  Console defaults to [http://localhost:8080](http://localhost:8080).

## Project layout

  pages/        Next.js routes and API
  components/   UI
  lib/          Shared client/server helpers
  prisma/       Schema and client
  hasura/       Hasura metadata
  src/          Import tooling

## License

  Private (`package.json`).

  ★ Insight ─────────────────────────────────────
  • Drop the stock create-next-app README; it says nothing about jobs, Hasura,
    or Firebase.
  • Keep secrets out of the README — your docker-compose.yaml has live DB/JWT
    values that should stay env-only.

  ─────────────────────────────────────────────────
