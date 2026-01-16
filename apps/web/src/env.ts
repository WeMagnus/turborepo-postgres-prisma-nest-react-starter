import { parseClientEnv } from "@repo/env";

export const env = parseClientEnv(
  import.meta.env as unknown as Record<string, unknown>
);
