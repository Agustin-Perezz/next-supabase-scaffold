# tests/

- E2E = Playwright. Server runs on port 3100 (not 3000). `pnpm test` runs `supabase db reset` first.
- Unit = Vitest. No Supabase needed. `pnpm test:unit`.
- `tests/_shared/fixtures/supabase-test-client.ts` uses service role key (bypasses RLS). Fallback port 55321.
- Playwright config reads `.env.test` for Supabase URL + keys.
- CI reads ports dynamically from `supabase status -o env` — no hardcoding.