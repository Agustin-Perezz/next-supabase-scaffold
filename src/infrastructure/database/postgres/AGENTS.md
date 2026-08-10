# src/infrastructure/database/postgres/

Supabase repository implementations, DB types, and mappers.

- `database.types.ts` is **generated** — never edit by hand. Regenerate via `pnpm supabase:gen-types`.
- `entities/` — DB row type aliases, one per entity.
- `mappers/` — flat, one file per entity. `toDomain(row)` + `toPersistence(entity)`. Any repo that touches an entity imports the same mapper. Never nest mappers by relationship.
- `repositories/` — implement use-case interfaces from `src/application/`. Supabase client passed via DI.
- Repositories call mappers to convert DB rows ↔ domain entities.

Mapper shape:

```ts
export const bookMapper = {
  toDomain(row: BookRow): Book { return Book.create({ id: row.id, ... }); },
  toPersistence(book: Book): BookInsert { const p = book.toObject(); return { id: p.id, created_at: p.createdAt, ... }; },
};
```