import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { parseClientEnv } from "@repo/env";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envDir = resolve(__dirname, "../../");

export default defineConfig(({ mode }) => {
  const env = parseClientEnv(loadEnv(mode, envDir, ""));

  return {
    plugins: [react()],
    envDir,
    server: {
      host: "localhost",
      port: env.VITE_PORT,
    },
    clearScreen: false,
    logLevel: "info",
  };
});
