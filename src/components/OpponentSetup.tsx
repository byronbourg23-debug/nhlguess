import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  onAdd: (name: string) => void;
  onReset: () => void;
  hasAny: boolean;
}

export function OpponentSetup({ onAdd, onReset, hasAny }: Props) {
  const [name, setName] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onAdd(trimmedName);
    setName("");
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-base font-semibold tracking-tight">Opponents</h2>
      <form onSubmit={submit} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="opponent-name">
          Opponent name
        </label>
        <input
          id="opponent-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Opponent name"
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-bold uppercase text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          ADD
        </button>
      </form>
      {hasAny ? (
        <button
          type="button"
          onClick={() => {
            if (
              confirm(
                "Clear all active opponents and checklist marks? Saved sessions will not be deleted.",
              )
            ) {
              onReset();
            }
          }}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-700 shadow-sm transition-colors hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Clear ALL
        </button>
      ) : null}
    </div>
  );
}
