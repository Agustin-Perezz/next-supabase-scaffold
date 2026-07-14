# next-supabase-scaffold

A production-ready [Next.js](https://nextjs.org) starter built on the App Router with React 19, TypeScript strict mode, base-ui + shadcn components, Tailwind CSS v4, Biome for lint/format, Playwright for E2E, Sentry for monitoring, and Supabase (Postgres + Auth + Storage) wired via `@supabase/ssr`. The scaffold follows Clean Architecture with strict layering — domain, application, infrastructure, and delivery — and a shift-left approach: linting, type checking, security scanning, and E2E tests run on every push and pull request so issues are caught as early as possible in the development cycle.

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
| E2E             | Playwright (Chromium)                          |
| Monitoring      | Sentry (`@sentry/nextjs`)                      |
| Security scan   | Snyk (SARIF → GitHub Code Scanning)            |
| Package manager | pnpm 9                                         |
| Git hooks       | Husky + nano-staged                            |

## Folder Structure

```
next-supabase-scaffold/
├── .github/
│   └── workflows/
│       └── ci.yml                # Lint, typecheck, E2E, build pipeline
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
├── tests/                        # Playwright E2E specs
├── biome.json                    # Linter & formatter config
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
| `pnpm test`         | Run Playwright E2E tests                 |
| `pnpm test:ui`      | Run Playwright with interactive UI       |
| `pnpm test:install` | Install Playwright Chromium browser      |

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

## Git Hooks

[Husky](https://typicode.github.io/husky/) manages Git hooks:

- **pre-commit**: runs `nano-staged`, which executes `biome check --staged` on staged files.
- **pre-push**: runs `pnpm typecheck && pnpm test`.

Hooks are installed automatically via the `prepare` script when running `pnpm install`.

## CI (GitHub Actions)

The `.github/workflows/ci.yml` workflow runs on push to `main` and on pull requests:

1. Lint (Biome)
2. Typecheck (`tsc --noEmit`)
3. E2E tests (Playwright, Chromium only)
4. Build (`next build` with Sentry source map upload)

A `snyk` job runs in parallel, scanning dependencies for high-severity vulnerabilities and uploading the results as SARIF to GitHub Code Scanning. It is allowed to continue on error so findings do not block the pipeline.

### Required GitHub Configuration

Configure these in **Settings → Secrets and variables → Actions**.

**Secrets** (sensitive values):

| Secret              | Description                            |
| ------------------- | -------------------------------------- |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for source map upload |
| `SENTRY_ORG`        | Sentry organization slug               |
| `SENTRY_PROJECT`    | Sentry project slug                    |
| `SNYK_TOKEN`        | Snyk API token for vulnerability scans |

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