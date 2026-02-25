import { parseClientEnv } from "@repo/env";

export const env = parseClientEnv(import.meta.env as Record<string, unknown>);
