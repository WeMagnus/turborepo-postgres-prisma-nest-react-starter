# Project State – turborepo-postgres-prisma-nest-react-starter

> Living snapshot of the monorepo so the project can be resumed in a new conversation without losing context.

---

## 1) Tech Stack

- **Language**: TypeScript
- **Monorepo**: pnpm workspaces + Turborepo
- **Backend**: NestJS (Nest CLI watch in dev)
- **Frontend**: React + Vite
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma v7
- **Infrastructure (planned)**: Terraform
- **Node.js**: v24.x

---

## 2) Folder Structure

```
turborepo-postgres-prisma-nest-react-starter/
├─ apps/
│  ├─ api/              # NestJS backend
│  │  ├─ src/
│  │  │  ├─ prisma/
│  │  │  │  ├─ prisma.module.ts
│  │  │  │  └─ prisma.service.ts
│  │  │  ├─ app.controller.ts
│  │  │  ├─ app.module.ts
│  │  │  └─ main.ts
│  │  └─ package.json
│  └─ web/              # React frontend (Vite)
│     ├─ src/
│     └─ package.json
│
├─ packages/
│  └─ db/               # Shared Prisma package
│     ├─ prisma/
│     │  ├─ schema.prisma
│     │  └─ migrations/
│     ├─ prisma.config.ts
│     ├─ index.js
│     ├─ index.d.ts
│     └─ package.json
│
├─ turbo.json
├─ pnpm-workspace.yaml
├─ package.json
├─ .env                 # real secrets (gitignored)
├─ .env.example         # example env
└─ PROJECT_STATE.md     # this file
```

---

## 3) Environment Variable Strategy

### Root `.env` (single source of truth)

- All runtime secrets live in **root `.env`**
- File is **gitignored**
- `.env.example` documents required variables

Example:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
```

### Backend env loading

- Uses `@nestjs/config`
- Loaded explicitly from root:

```ts
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: join(process.cwd(), "../../.env"), // repo root .env
});
```

### Prisma env loading (Prisma v7)

- Prisma **does NOT** use `datasource.url` in `schema.prisma`
- Instead uses `prisma.config.ts`

```ts
import { defineConfig, env } from "prisma/config";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

const here = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(here, "../../.env");

const result = loadEnv({ path: envPath });
if (result.error) throw result.error;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
});
```

---

## 4) Prisma Setup Notes

- Prisma version: **v7.x**
- Adapter: `@prisma/adapter-pg`
- Database: Neon (Postgres)
- Prisma Client is generated once and **re-exported** via `@repo/db`
- Current schema has a single `User` model (id, email, createdAt)

### `packages/db` purpose

- Owns Prisma schema, migrations, and client
- Exported as workspace dependency
- Backend imports PrismaClient from `@repo/db`

```ts
import { PrismaClient } from "@repo/db";
```

### Migration commands

```bash
pnpm --filter @repo/db db:migrate
pnpm --filter @repo/db db:generate
pnpm --filter @repo/db db:studio
```

---

## 5) Backend (API) – Key Decisions

### API scripts (apps/api/package.json)

```json
"dev": "pnpm start:dev",
"start:dev": "nest start --watch --preserveWatchOutput",
"start:dev:nest": "nest start --watch",
"build": "nest build",
"typecheck": "tsc -p tsconfig.json --noEmit"
```

### PrismaService

- Extends PrismaClient
- Uses Prisma v7 adapter
- Connects/disconnects on module lifecycle
- CORS enabled in `main.ts` with `origin: true` and `credentials: true`

---

## 6) Frontend (Web)

- Vite + React
- Dev command ensures logs are visible and not cleared

```json
"dev": "vite --host localhost --port 5173 --clearScreen false --logLevel info"
```

---

## 7) Turborepo Setup

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalEnv": ["DATABASE_URL"],
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "lint": { "dependsOn": ["^lint"] },
    "typecheck": { "dependsOn": ["^typecheck"] },
    "db:generate": {
      "cache": true,
      "outputs": ["node_modules/.prisma/**"]
    }
  }
}
```

### Root dev script (IMPORTANT)

```json
"dev": "TURBO_UI=0 TURBO_LOG_ORDER=stream turbo run dev --filter=api --filter=web --output-logs=full"
```

#### Why:

- `TURBO_UI=0` → disables interactive UI (prevents screen clearing)
- `TURBO_LOG_ORDER=stream` → readable interleaved logs
- `--output-logs=full` → no log suppression

---

## 8) Known Issues & Fixes

- None recorded

---

## 9) Current Working State

After running:

```bash
pnpm dev
```

You see:

```
➜  Local:   http://localhost:5173/
➜  API:     http://localhost:3000
```

Both servers run concurrently and logs are stable.

---

## 10) Known Decisions (Do NOT re-litigate)

- One root `.env`
- Prisma v7 config-based datasource
- Nest CLI watch for backend dev
- Turbo used for orchestration, not UI
- No Docker yet
- No auth yet

---

## 11) Next Steps (Planned)

1. Create first real API module (Users)
2. Run initial Prisma migration
3. Connect frontend → backend fetch
4. Add CORS config
5. Add env validation
6. Introduce Terraform for Neon
7. Decide on auth strategy

---

## 12) How to Resume in a New Chat

Paste this file and say:

> "This is the current state of my monorepo. Continue from here."

Everything important is captured here.
