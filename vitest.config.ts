import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(root, "./src"),
    },
  },
  test: {
    // The Clean Architecture core (use-cases, entity validation, mappers) is
    // framework-agnostic and runs in Node. No jsdom: keeps the suite fast and
    // avoids Server Component / RSC rendering constraints.
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage/unit",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      // Mirrors sonar.coverage.exclusions so the LCOV and the gate agree:
      // declarative boilerplate (DTOs, schemas, enums) is dropped from both,
      // so the gate targets logic, not volume.
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.spec.ts",
        "src/infrastructure/database/postgres/database.types.ts",
        "src/**/*.dto.ts",
        "src/**/*.schema.ts",
        "src/**/*.enum.ts",
        "src/components/ui/**",
        "src/hooks/useFileDropzone.ts",
        "src/lib/utils/dropzone-errors.ts",
        "src/instrumentation.ts",
        "src/sentry.*.config.ts",
        "src/app/**/layout.tsx",
        "src/app/**/loading.tsx",
        "src/app/**/error.tsx",
        "src/app/**/not-found.tsx",
        "src/app/**/route.ts",
        "src/proxy.ts",
      ],
    },
  },
});
