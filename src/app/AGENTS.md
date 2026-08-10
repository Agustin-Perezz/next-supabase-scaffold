# src/app/

Next.js App Router delivery layer.

- `page.tsx` = composition only — imports + arranges components, fetches server data. No logic, no inline styles.
- `actions.ts` = server actions + data fetchers (`"use server"`). Creates Supabase client per-request, calls container, returns data.
- `components/` = route-private components. Named with feature prefix (`BookCard`, not `Card`). 50-line hard limit per component, split at 40.
- `"use client"` only on leaf components that need hooks/events/browser APIs. Keep server/client boundary as low as possible.
- `hooks/` = route-private hooks. Promote to `src/hooks/` if used by 2+ routes.
- Import shared UI via `@/components/ui/*`, hooks via `@/hooks/*`, utils via `@/lib/*`.

Page shape — composition only, data fetched here and passed down:

```tsx
export default async function BooksPage() {
  const books = await getBooks();
  return (
    <main>
      <BookHeader />
      <BookCreateForm />
      <BookList books={books} />
    </main>
  );
}
```