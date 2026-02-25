import { defineConfig, env } from "prisma/config";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { parseDbEnv } from "@repo/env";
import { existsSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(here, "../../.env");

if (existsSync(envPath)) {
  const { error } = loadEnv({ path: envPath });
  if (error) throw error;
}

parseDbEnv(process.env);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
});
