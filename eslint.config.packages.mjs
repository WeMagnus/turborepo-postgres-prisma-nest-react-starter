import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export function createPackageEslintConfig(tsconfigRootDir) {
  return defineConfig([
    globalIgnores(["dist", ".turbo"]),
    {
      files: ["src/**/*.ts"],
      extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
      languageOptions: {
        globals: globals.node,
        sourceType: "module",
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
    },
  ]);
}
