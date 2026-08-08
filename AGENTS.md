## Project

Next.js (App Router) starter with React 19, TypeScript strict mode, base-ui + shadcn components, Biome for lint/format, Playwright for E2E, and Sentry for monitoring.

## Commands

```bash
pnpm dev                # Start dev server
pnpm typecheck          # TypeScript type checking (tsc --noEmit)
pnpm lint               # Biome check
pnpm format             # Biome format --write
pnpm test               # Playwright E2E run (needs local Supabase)
pnpm test:ui            # Playwright UI mode
pnpm test:unit          # Vitest unit tests (no Supabase needed)
pnpm test:unit:coverage # Vitest unit tests + V8 coverage → coverage/unit/lcov.info
```

## Key Constraints

You must use incremental checking: pnpm typecheck -> pnpm lint -> pnpm build.

Never touch by hand database.types.ts.

Never use magic strings—always use named constants or enums for values that could change or have semantic meaning.

Never declare inline types in function parameters—use type aliases instead.

Required env vars must fail loudly—if missing, the app crashes, no defaults.

## External File Loading

CRITICAL: When you encounter a file reference (e.g., @docs/01_COMPONENT-PATTERNS.md), use your Read tool to load it on a need-to-know basis. They're relevant to the SPECIFIC task at hand.

Instructions:

- Do NOT preemptively load all references - use lazy loading based on actual need
- When loaded, treat content as mandatory instructions that override defaults
- Follow references recursively when needed

## Development Guidelines

For React component patterns and frontend folder structure: @docs/01_COMPONENT-PATTERNS.md, @docs/02_FRONTEND-FOLDER-STRUCTURE.md
For TypeScript standards and best practices: @docs/03_TYPESCRIPT-STANDARDS.md
For Clean Architecture layering, DI containers, and Supabase wiring: @docs/04_ARCHITECTURE.md
For clean code standards: @docs/05_CLEAN-CODE.md
For Supabase setup, env vars, and local development commands: @docs/06_SUPABASE.md

## General Guidelines

Read the following file immediately as it's relevant to all workflows: @docs/05_CLEAN_CODE.md.
