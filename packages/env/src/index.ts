import { z } from "zod";

/**
 * Server/runtime env (Nest).
 */
export const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

/**
 * Prisma/DB CLI env (keep it minimal).
 */
export const dbEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
});

/**
 * Client env (Vite exposes only VITE_* to the browser).
 */
export const clientEnvSchema = z.object({
  VITE_API_URL: z.string().url(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type DbEnv = z.infer<typeof dbEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

function formatZodError(prefix: string, error: z.ZodError) {
  console.error(prefix);
  console.error(error.format());
}

export function parseServerEnv(env: Record<string, unknown>): ServerEnv {
  const parsed = serverEnvSchema.safeParse(env);
  if (!parsed.success) {
    formatZodError("❌ Invalid server environment variables", parsed.error);
    throw new Error("Invalid server environment variables");
  }
  return parsed.data;
}

export function parseDbEnv(env: Record<string, unknown>): DbEnv {
  const parsed = dbEnvSchema.safeParse(env);
  if (!parsed.success) {
    formatZodError("❌ Invalid DB environment variables", parsed.error);
    throw new Error("Invalid DB environment variables");
  }
  return parsed.data;
}

export function parseClientEnv(env: Record<string, unknown>): ClientEnv {
  const parsed = clientEnvSchema.safeParse(env);
  if (!parsed.success) {
    // In the browser this will show in console
    formatZodError("❌ Invalid client environment variables", parsed.error);
    throw new Error("Invalid client environment variables");
  }
  return parsed.data;
}
