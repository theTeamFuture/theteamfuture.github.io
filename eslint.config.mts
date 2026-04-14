import { includeIgnoreFile } from "@eslint/compat";
import { defineConfig } from "eslint/config";
import path from "node:path";

// Configs
import astro from "eslint-plugin-astro";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import ts from "typescript-eslint";
import unocss from "@unocss/eslint-config/flat";

// https://eslint.org/docs/latest/use/configure
export default defineConfig(
  includeIgnoreFile(path.join(import.meta.dirname, ".gitignore")),
  js.configs.recommended,
  ts.configs.recommended,
  unocss,
  ...astro.configs.recommended,
  prettier,
  {
    rules: { "no-undef": "off" },
  },
);
