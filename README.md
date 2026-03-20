# turborepo-postgres-prisma-nest-react-starter

TypeScript monorepo starter with NestJS API, React web app, PostgreSQL, and Prisma v7.

## Stack

- Monorepo: `pnpm` workspaces + Turborepo
- Backend: NestJS (`apps/api`)
- Frontend: React + Vite (`apps/web`)
- Database: PostgreSQL (Neon-compatible)
- Local dev DB: Docker Compose Postgres
- ORM: Prisma v7 (`packages/db`)
- Shared env validation: Zod (`packages/env`)

## Monorepo Layout

```text
.
├─ apps/
│  ├─ api/          # NestJS backend
│  └─ web/          # React + Vite frontend
├─ docker-compose.yml
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
- Docker with Compose support for the default local database flow

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

3. Start the local Postgres container:

```bash
pnpm db:up
```

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

Default local database:

- Postgres host: `localhost`
- Postgres port: `5432`
- Database: `app`
- Username: `postgres`
- Password: `postgres`

## Using Neon Instead

If you want to use Neon or another hosted Postgres instance, replace `DATABASE_URL` in `.env` with that connection string and skip `pnpm db:up`.

For Neon, the URL usually needs SSL enabled, for example with `sslmode=require`.

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

The default `.env.example` points at the local Docker database, but swapping to Neon is only a `DATABASE_URL` change.

## Common Commands

From repo root:

```bash
pnpm db:up       # start local postgres container
pnpm db:down     # stop containers
pnpm db:logs     # follow postgres logs
pnpm dev         # run api + web
pnpm build       # build all packages/apps
pnpm lint        # lint all
pnpm test        # run workspace tests
pnpm typecheck   # typecheck all
pnpm db:generate # prisma generate (@repo/db)
pnpm db:migrate  # prisma migrate dev (@repo/db)
pnpm db:studio   # prisma studio (@repo/db)
```

## CI

GitHub Actions runs the root validation flow on pushes and pull requests via [.github/workflows/ci.yml](.github/workflows/ci.yml):

```bash
pnpm db:generate
pnpm test
pnpm typecheck
pnpm build
```

The workflow injects placeholder `DATABASE_URL` and `VITE_API_URL` values so Prisma config and Vite env validation can run without a checked-in `.env`.

Run package-specific commands:

```bash
pnpm --filter api test
pnpm --filter web preview
pnpm --filter @repo/db db:deploy
```

To fully reset the local database volume:

```bash
docker compose down -v
```

## Notes

- Prisma uses config-based datasource (`packages/db/prisma.config.ts`), not `datasource.url` in `schema.prisma`.
- For project progress and handoff context, see `PROJECT_STATE.md`.
