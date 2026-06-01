# Emil — Portfolio Monorepo

Turborepo monorepo for [emilshr.com](https://emilshr.com) (portfolio + Payload CMS) and [burntclutchproject.com](https://burntclutchproject.com) (Journeys travel blog). Dependency versions are centralized in the [pnpm catalog](https://pnpm.io/catalogs) (`pnpm-workspace.yaml`).

## Repository layout

```
.
├── apps/
│   ├── portfolio/          # Next.js 16 + Payload CMS 3 (emilshr.com)
│   │   ├── src/            # App routes, collections, blocks, components
│   │   ├── scripts/        # Seed script
│   │   ├── seed-data/      # Markdown seed content
│   │   ├── tests/          # Vitest + Playwright
│   │   └── .env.example    # Portfolio env vars
│   └── journeys/           # Next.js 16 travel blog (burntclutchproject.com)
│       ├── app/            # Minimal App Router surface
│       └── .env.example    # Payload API URL for SDK
├── packages/
│   └── payload-types/      # Shared Payload-generated types (@repo/payload-types)
├── turbo.json              # Turborepo task pipeline
├── pnpm-workspace.yaml     # Workspace globs + dependency catalog
└── package.json            # Root scripts (orchestrates via turbo)
```

### Apps

| Package     | Path              | Port (dev) | Role |
|------------|-------------------|------------|------|
| `portfolio` | `apps/portfolio`  | 3000       | Main site, Payload admin, MongoDB, media |
| `journeys`  | `apps/journeys`   | 3001       | Travel blog; reads CMS via `@payloadcms/sdk` |

### Shared types

Payload types are generated once from the portfolio CMS config and written to `packages/payload-types/payload-types.ts`. Both apps import types from `@repo/payload-types`.

- **Generate types:** `pnpm generate:types` (runs `payload generate:types` in `portfolio`)
- **Config output path:** `apps/portfolio/src/payload.config.ts` → `packages/payload-types/payload-types.ts`
- After adding collections/globals in Payload, regenerate types before using them in `journeys`.

### Dependency catalog

Shared versions live under `catalog:` in `pnpm-workspace.yaml`. Workspace packages reference them as `"next": "catalog:"` instead of pinning versions per `package.json`. To bump a dependency everywhere, change it once in the catalog and run `pnpm install`.

## Stack

- **Monorepo:** Turborepo + pnpm workspaces
- **CMS:** Payload 3 + MongoDB (`portfolio` only)
- **Frontend:** Next.js 16 (Chiri design on portfolio)
- **Media:** Cloudflare R2 (optional; local `public/media` fallback)

## Prerequisites

- Node.js `^18.20.2` or `>=20.9.0`
- pnpm `^9` / `^10` / `^11` (repo pins `pnpm@10.12.4` via `packageManager`)
- Docker (for local MongoDB)

## Development

```bash
# MongoDB (portfolio)
docker compose up -d

# Env (portfolio CMS)
cp apps/portfolio/.env.example apps/portfolio/.env

# Install from repo root
pnpm install

# Run one app
pnpm dev:portfolio    # http://localhost:3000 — admin at /admin
pnpm dev:journeys     # http://localhost:3001

# Or run all dev servers
pnpm dev
```

### Common root commands

| Command | Description |
|---------|-------------|
| `pnpm dev:portfolio` | Portfolio + Payload dev server |
| `pnpm dev:journeys` | Journeys dev server |
| `pnpm build` | Production build (all apps via Turbo) |
| `pnpm build --filter=portfolio` | Build portfolio only |
| `pnpm check-types` | Typecheck all packages |
| `pnpm lint` | ESLint all packages |
| `pnpm generate:types` | Regenerate `@repo/payload-types` |
| `pnpm payload` | Payload CLI in portfolio |
| `pnpm seed` | Seed portfolio DB from `seed-data/` |

## Seed content (portfolio)

```bash
pnpm seed -- --fresh
```

Populates posts, experiences, about, and homepage from `apps/portfolio/seed-data/`.

## Environment variables

- **Portfolio:** `apps/portfolio/.env.example` — `MONGODB_URI`, `PAYLOAD_SECRET`, R2, seed admin, etc.
- **Journeys:** `apps/journeys/.env.example` — `PAYLOAD_API_URL` (portfolio REST API base)

## Deploy (Vercel Hobby + MongoDB Atlas M0)

Two separate [Vercel](https://vercel.com) projects from this monorepo. Each app has a [`vercel.json`](apps/portfolio/vercel.json) with install/build commands from the repo root.

| App | Vercel root | Domain | Config |
|-----|-------------|--------|--------|
| `portfolio` | `apps/portfolio` | emilshr.com | [`apps/portfolio/.env.example`](apps/portfolio/.env.example) |
| `journeys` | `apps/journeys` | burntclutchproject.com | [`apps/journeys/.env.example`](apps/journeys/.env.example) |

**Vercel project settings (both):** Node.js 22.x; enable **Include source files outside of the Root Directory** (for `packages/payload-types`).

**Portfolio env (production):** `MONGODB_URI` (Atlas SRV), `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, R2 vars (required — no local disk on Vercel), Resend, `JOURNEYS_SITE_URL`, `JOURNEYS_REVALIDATE_URL`, `REVALIDATE_SECRET`.

**Journeys env (production):** `PAYLOAD_API_URL=https://emilshr.com/api`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_MEDIA_BASE_URL=https://emilshr.com`, `REVALIDATE_SECRET`.

**MongoDB:** Migrate off Railway with `mongodump` / `mongorestore` to a free Atlas M0 cluster, then set `MONGODB_URI` on the portfolio project.

**Seed:** Run `pnpm seed` locally against Atlas; the deployed `/next/seed` route exceeds the Hobby 10s function limit.

## Debugging tips (agents)

1. **Wrong Next/Turbopack root:** Both apps set `turbopack.root` to the monorepo root in `next.config.ts`. If builds fail to resolve `next`, check that setting before changing `node_modules` layout.
2. **Missing Payload types:** Run `pnpm generate:types` after schema changes. Import from `@repo/payload-types`, not a local `src/payload-types.ts`.
3. **Type errors on `declare module 'payload'`:** `packages/payload-types/index.ts` must keep `import 'payload'` so augmentation resolves.
4. **Filter by package name:** Turbo filters use `package.json` `name` fields: `portfolio`, `journeys`, `@repo/payload-types`.
5. **Payload skills:** See `AGENTS.md` and `.agents/skills/payload/` for CMS-specific work.
