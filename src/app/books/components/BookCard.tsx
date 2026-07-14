import type { Book } from "@/domain/entities/book.entity";

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  return (
    <li className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="font-medium">{book.title}</p>
        <p className="text-sm text-zinc-500">{book.author}</p>
      </div>
    </li>
  );
}
