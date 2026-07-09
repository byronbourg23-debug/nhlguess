import { useState } from "react";
import { CLUE_CATEGORY_OPTIONS } from "../lib/clueCategories";
import type { ClueCategory, ClueType } from "../lib/types";

interface Props {
  onAdd: (text: string, type: ClueType, category?: ClueCategory) => void;
}

export function ClueForm({ onAdd }: Props) {
  const [text, setText] = useState("");
  const [type, setType] = useState<ClueType>("known");
  const [category, setCategory] = useState<ClueCategory | "">("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    onAdd(t, type, category || undefined);
    setText("");
  }

  return (
    <form onSubmit={submit} className="mt-3 flex flex-col gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a clue (e.g. Canadian, Not on Oilers)"
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ClueType)}
          className="rounded-md border border-border bg-background px-2 py-2 text-sm"
        >
          <option value="known">Known / Yes</option>
          <option value="ruled_out">Ruled Out / No</option>
          <option value="maybe">Maybe / Unsure</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ClueCategory | "")}
          className="rounded-md border border-border bg-background px-2 py-2 text-sm"
        >
          <option value="">No category</option>
          {CLUE_CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
        >
          Add clue
        </button>
      </div>
    </form>
  );
}
