## Supabase

This project uses Supabase (Postgres + Auth + Storage) wired via `@supabase/ssr` for cookie-based auth in the Next.js App Router.

Required env vars (app crashes if missing — no defaults):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Local development:

```bash
supabase start             # Start local Supabase stack
supabase db pull           # Pull remote schema into a new local migration
supabase migration new <name>  # Create a blank migration file
supabase db push           # Apply local migrations to the linked project
supabase gen types --typescript --project-id <ref>  # Regenerate src/infrastructure/database/postgres/database.types.ts
supabase stop              # Stop local stack
```