import { defineConfig } from "vitest/config";

/**
 * Standalone Vitest config, deliberately NOT extending vite.config.ts.
 *
 * vite.config.ts replaces the whole `process` global via `define` so the IIFE
 * widget bundle can run in a browser. Reusing that config under Vitest would
 * shadow Node's real `process` inside the test workers and break the runner.
 * The build config is left untouched; this file only describes the test run.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    exclude: ["node_modules/**", "dist/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/utils/**/*.ts", "src/i18n/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    },
  },
});
