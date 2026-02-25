# AGENTS.md

Guidelines for coding agents working in this repository.

## Repository Summary

- Monorepo: `pnpm` workspaces + Turborepo
- Backend API: NestJS in `apps/api`
- Frontend: React + Vite in `apps/web`
- Database package: Prisma v7 in `packages/db`
- Shared env schemas/parsers: `packages/env`

## Canonical Commands

Run from repo root unless noted otherwise.

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

Package-targeted commands:

```bash
pnpm --filter api typecheck
pnpm --filter web typecheck
pnpm --filter api test
pnpm --filter @repo/db db:deploy
```

## Environment Rules

- Use one root `.env` as the single source of truth.
- Do not introduce per-app `.env` files unless explicitly requested.
- Keep `.env.example` in sync when env requirements change.
- Env validation must stay centralized in `@repo/env`:
  - `parseServerEnv` for API runtime
  - `parseDbEnv` for Prisma config
  - `parseClientEnv` for web/Vite usage

## Architecture Rules

- Prisma datasource is configured in `packages/db/prisma.config.ts` (Prisma v7 config-based flow).
- API should use `ConfigService` and validated env, not ad hoc `process.env` reads in feature code.
- Shared logic belongs in `packages/*` when it is used by both apps.
- Keep changes scoped: avoid broad refactors unless requested.

## Editing Rules

- Prefer minimal, targeted edits.
- Preserve existing patterns and naming conventions.
- Do not rewrite unrelated files.
- Do not remove comments/docs unless replacing with better, accurate content.
- Avoid introducing new dependencies unless needed for the task.

## Validation Before Commit

Run checks relevant to changed areas:

- API changed: `pnpm --filter api typecheck`
- Web changed: `pnpm --filter web typecheck`
- Cross-package or shared changes: `pnpm typecheck`
- Prisma/schema/config changed: run at least `pnpm db:generate`

If a check cannot run, report that clearly in the final summary.

## Commit Guidance

- Use clear, scoped commit messages (`feat:`, `fix:`, `chore:`, `docs:`).
- Keep commits focused on one logical change.
- Include docs updates when behavior, commands, or env requirements change.

## Safety Constraints

- Never commit secrets or real credentials.
- Never run destructive git commands (`reset --hard`, force checkout) unless explicitly requested.
- If unexpected external/unrelated file changes appear, stop and ask how to proceed.

## Handoff

When finishing substantial work:

- Summarize what changed and why.
- List exact verification commands run and outcomes.
- Mention follow-up steps only when they are natural next actions.
