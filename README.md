# next-supabase-scaffold

[![Quality gate status](https://sonarcloud.io/api/project_badges/measure?project=Agustin-Perezz_next-supabase-scaffold&metric=alert_status&token=488d382bfa2f8608447379c0b9438ba29f899556)](https://sonarcloud.io/summary/new_code?id=Agustin-Perezz_next-supabase-scaffold)

A production-ready [Next.js](https://nextjs.org) starter structured around Clean Architecture with strict layering — domain entities and Zod invariant schemas at the core, application use cases depending only on repository interfaces, infrastructure providing Supabase-backed implementations, and the App Router delivery layer composing per-request DI containers rather than module-level singletons. Dependencies point inward toward the domain, so framework and I/O concerns stay at the edges. The scaffold takes a shift-left approach to quality: linting, type checking, static analysis, and E2E tests run on every push and pull request so issues surface as early as possible in the development cycle.

## Tech Stack

| Area            | Choice                                        |
| --------------- | --------------------------------------------- |
| Framework       | Next.js 16 (App Router)                        |
| UI runtime      | React 19                                       |
| Language        | TypeScript (strict)                           |
| Components      | base-ui + shadcn                               |
| Styling         | Tailwind CSS v4                                |
| Forms           | react-hook-form + zod                          |
| Database        | Supabase (Postgres + Auth + Storage)           |
| Supabase client | `@supabase/ssr` (cookie-based SSR auth)        |
| Lint / Format   | Biome 2                                        |
| E2E             | Playwright (Chromium) + Monocart Reporter    |
| Monitoring      | Sentry (`@sentry/nextjs`)                      |
| Security scan   | Snyk (SARIF → GitHub Code Scanning)            |
| Code quality    | SonarCloud (static analysis + Quality Gate)    |
| Package manager | pnpm 9                                         |
| Git hooks       | Husky + nano-staged                            |

## Folder Structure

```
next-supabase-scaffold/
├── .github/
│   └── workflows/
│       └── ci.yml                # SonarQube, lint, typecheck, E2E, build, Snyk pipeline
├── docs/                         # Engineering guidelines
│   ├── 01_COMPONENT-PATTERNS.md
│   ├── 02_FRONTEND-FOLDER-STRUCTURE.md
│   ├── 03_TYPESCRIPT-STANDARDS.md
│   └── 04_ARCHITECTURE.md
├── public/                       # Static assets served at root
├── src/
│   ├── domain/                   # Pure entities + Zod invariant schemas (zero framework deps)
│   │   └── entities/
│   ├── application/              # Use cases, repository interfaces, request/response DTOs
│   │   └── use-cases/
│   ├── infrastructure/           # Supabase repos, DB row aliases, mappers (one per entity), generated types
│   │   └── database/
│   │       └── postgres/
│   ├── lib/
│   │   ├── containers/           # DI wiring (use cases ↔ concrete repositories)
│   │   ├── shared/
│   │   │   └── infrastructure/  # Supabase server/browser clients, env validation, auth helpers
│   │   └── utils.ts
│   ├── app/                      # App Router routes (pages, layouts, actions, proxy)
│   │   └── books/                # Sample Books feature (page, actions, components)
│   ├── components/
│   │   └── ui/                   # Reusable base-ui / shadcn primitives
│   └── proxy.ts                  # Session refresh via @supabase/ssr (formerly middleware.ts)
├── tests/                        # Playwright E2E specs + shared fixtures
├── playwright.config.ts          # Playwright config (monocart reporter, V8 coverage)
├── playwright.monocart-reporter.ts  # Monocart coverage + report config
├── biome.json                    # Linter & formatter config
├── sonar-project.properties       # SonarCloud analysis configuration
├── next.config.ts                # Next.js configuration
├── package.json
├── playwright.config.ts
└── tsconfig.json                 # Path alias: @/* -> ./src/*
```

See [`AGENTS.md`](./AGENTS.md) for the engineering conventions agents and contributors should follow.

## Setup

1. Copy `.env.example` to `.env.local` and fill in the values:

   ```bash
   cp .env.example .env.local
   ```

   Required environment variables (app crashes if missing — no defaults):

   | Variable                                | Description                          |
   | --------------------------------------- | ------------------------------------ |
   | `NEXT_PUBLIC_SUPABASE_URL`              | Supabase project URL                 |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`  | Supabase publishable (anon) key      |
   | `NEXT_PUBLIC_SENTRY_DSN`                | Sentry DSN (client + server)         |
   | `SENTRY_AUTH_TOKEN`                     | Sentry auth token for source map upload |
   | `SENTRY_ORG`                            | Sentry organization slug              |
   | `SENTRY_PROJECT`                        | Sentry project slug                   |

2. Install dependencies and Playwright browsers:

   ```bash
   pnpm install
   pnpm test:install
   ```

3. Start the dev server:

   ```bash
   pnpm dev
   ```

The app runs at [http://localhost:3000](http://localhost:3000).

### Supabase Local Development

```bash
supabase start                          # Start local Supabase stack
supabase db pull                         # Pull remote schema into a new local migration
supabase migration new <name>            # Create a blank migration file
supabase db push                         # Apply local migrations to the linked project
supabase gen types --typescript --project-id <ref>  # Regenerate src/infrastructure/database/postgres/database.types.ts
supabase stop                            # Stop local stack
```

## Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Start development server                  |
| `pnpm build`        | Production build                         |
| `pnpm start`        | Start production server                  |
| `pnpm lint`         | Run Biome lint & format checks           |
| `pnpm format`       | Auto-format with Biome                   |
| `pnpm typecheck`    | Run TypeScript type checking (`tsc --noEmit`) |
| `pnpm test`         | Reset DB + run Playwright E2E tests       |
| `pnpm test:ui`      | Reset DB + run Playwright in UI mode      |
| `pnpm test:ci`      | Run Playwright only (no DB reset, for CI) |
| `pnpm test:install` | Install Playwright Chromium browser       |
| `pnpm test:show-report`     | Open Monocart HTML test report   |
| `pnpm coverage:show-report` | Open V8 coverage report          |

## Architecture

This project follows Clean Architecture with strict layering. See [Architecture](./docs/04_ARCHITECTURE.md) for the full guide.

```
src/
├── domain/            # Pure entities + Zod invariant schemas (zero framework deps)
├── application/       # Use cases, repository interfaces, request/response DTOs
├── infrastructure/    # Supabase repos, DB row aliases, mappers (one per entity), generated types
├── lib/containers/    # DI wiring (use cases ↔ concrete repositories)
└── app/               # Delivery layer (Server Components, Server Actions, UI components)
```

## Testing

E2E tests use Playwright with V8 client-side coverage (Chromium only) and Monocart Reporter for HTML test + coverage reports.

### Prerequisites

Local Supabase must be running:

```bash
pnpm supabase:start
```

Copy `.env.test.example` to `.env.test` (or let `supabase start` generate defaults):

```bash
cp .env.test.example .env.test
```

### Test Structure

```
tests/
├── _shared/
│   ├── app-fixtures.ts              # Merged fixtures (coverage + supabase test client)
│   └── fixtures/
│       └── supabase-test-client.ts  # Supabase service client for seeding test data
├── books.test.ts                    # Books feature tests
└── smoke.test.ts                    # Smoke test
```

All tests import `test` and `expect` from `_shared/app-fixtures` (not directly from Playwright).

### Coverage Reports

| Format        | Path                                              |
| ------------- | ------------------------------------------------- |
| Monocart HTML | `./coverage/tests/monocart-report.html`           |
| V8 HTML       | `./coverage/tests/v8/index.html`                  |
| LCOV          | `./coverage/tests/lcov/code-coverage.lcov.info`   |
| Cobertura XML | `./coverage/tests/cobertura/code-coverage.cobertura.xml` |

## Git Hooks

[Husky](https://typicode.github.io/husky/) manages Git hooks:

- **pre-commit**: runs `nano-staged`, which executes `biome check --staged` on staged files.
- **pre-push**: runs `pnpm typecheck && pnpm test`.

Hooks are installed automatically via the `prepare` script when running `pnpm install`.

## CI (GitHub Actions)

The `.github/workflows/ci.yml` workflow runs on push to `main` and on pull requests:

1. **sonar** — SonarCloud static analysis + Quality Gate (runs first; gates all other jobs)
2. **lint** — Biome lint + TypeScript typecheck
3. **test** — E2E tests (Playwright + local Supabase + V8 coverage via Monocart Reporter)
4. **build** — Production build with Sentry source map upload (gated on lint + test)

A **snyk** job runs in parallel (gated on sonar), scanning dependencies for high-severity vulnerabilities and uploading the results as SARIF to GitHub Code Scanning. It is allowed to continue on error so findings do not block the pipeline.

```
sonar ──┬──> lint ──┐
        ├──> test ──┼──> build
        └──> snyk
```

### Required GitHub Configuration

Configure these in **Settings → Secrets and variables → Actions**.

**Secrets** (sensitive values):

| Secret              | Description                            |
| ------------------- | -------------------------------------- |
| `SONAR_TOKEN`       | SonarCloud analysis token               |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for source map upload |
| `SENTRY_ORG`        | Sentry organization slug               |
| `SENTRY_PROJECT`    | Sentry project slug                    |
| `SNYK_TOKEN`        | Snyk API token for vulnerability scans |

> **Note:** `SONAR_TOKEN` is the only SonarCloud secret you need to add manually. `GITHUB_TOKEN` is provided automatically by GitHub Actions. No `SONAR_HOST_URL` is required for SonarCloud.

**Variables** (public values, safe to expose):

| Variable                               | Description                     |
| -------------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `NEXT_PUBLIC_SENTRY_DSN`               | Sentry DSN (client + server)    |

## Documentation

- [Component Patterns](./docs/01_COMPONENT-PATTERNS.md)
- [Frontend Folder Structure](./docs/02_FRONTEND-FOLDER-STRUCTURE.md)
- [TypeScript Standards](./docs/03_TYPESCRIPT-STANDARDS.md)
- [Architecture](./docs/04_ARCHITECTURE.md)