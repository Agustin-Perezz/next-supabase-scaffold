import { Button } from "@/components/ui/button";
import { createBook } from "../actions";
import { BookFormFields } from "./BookFormFields";

export function BookCreateForm() {
  return (
    <form action={createBook} className="mt-6 flex gap-2">
      <BookFormFields />
      <Button type="submit">Add</Button>
    </form>
  );
}
