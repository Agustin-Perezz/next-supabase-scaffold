import { Input } from "@/shared/components/ui/input";

export function BookFormFields() {
  return (
    <>
      <Input type="text" name="title" placeholder="Title" className="flex-1" />
      <Input
        type="text"
        name="author"
        placeholder="Author"
        className="flex-1"
      />
    </>
  );
}
