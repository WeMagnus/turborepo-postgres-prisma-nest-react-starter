# turborepo-postgres-prisma-nest-react-starter

TypeScript monorepo starter with NestJS API, React web app, PostgreSQL, and Prisma v7.

## Stack

- Monorepo: `pnpm` workspaces + Turborepo
- Backend: NestJS (`apps/api`)
- Frontend: React + Vite (`apps/web`)
- Database: PostgreSQL (Neon-compatible)
- ORM: Prisma v7 (`packages/db`)
- Shared env validation: Zod (`packages/env`)

## Monorepo Layout

```text
.
├─ apps/
│  ├─ api/          # NestJS backend
│  └─ web/          # React + Vite frontend
├─ packages/
│  ├─ db/           # Prisma schema, migrations, client export
│  └─ env/          # Shared env schemas/parsers
├─ .env.example
├─ package.json
└─ turbo.json
```

## Prerequisites

- Node.js `>=22` (24.x recommended)
- `pnpm` (project uses `pnpm@10.13.1`)
- PostgreSQL database URL

Enable pnpm with Corepack if needed:

```bash
corepack enable
corepack prepare pnpm@10.13.1 --activate
```

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Create local env file:

```bash
cp .env.example .env
```

3. Set values in `.env`:

- `DATABASE_URL` for your Postgres instance
- optional `PORT`, `VITE_PORT` if defaults are not desired

4. Initialize Prisma artifacts:

```bash
pnpm db:generate
pnpm db:migrate
```

5. Run API + web together:

```bash
pnpm dev
```

Expected local URLs:

- Web: `http://localhost:5173`
- API: `http://localhost:3000`

## Environment Strategy

Single root `.env` is the source of truth for all apps/packages.

Required variables:

- `DATABASE_URL` (server/db)
- `VITE_API_URL` (client)

Optional with defaults:

- `NODE_ENV` defaults to `development`
- `PORT` defaults to `3000`
- `VITE_PORT` defaults to `5173`

Validation is centralized in `@repo/env` and used by API bootstrap, Prisma config, and web startup/config.

## Common Commands

From repo root:

```bash
pnpm dev         # run api + web
pnpm build       # build all packages/apps
pnpm lint        # lint all
pnpm typecheck   # typecheck all
pnpm db:generate # prisma generate (@repo/db)
pnpm db:migrate  # prisma migrate dev (@repo/db)
pnpm db:studio   # prisma studio (@repo/db)
```

Run package-specific commands:

```bash
pnpm --filter api test
pnpm --filter web preview
pnpm --filter @repo/db db:deploy
```

## Notes

- Prisma uses config-based datasource (`packages/db/prisma.config.ts`), not `datasource.url` in `schema.prisma`.
- For project progress and handoff context, see `PROJECT_STATE.md`.
