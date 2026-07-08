import { useState } from "react";

interface Props {
  onAdd: (name: string) => void;
  onReset: () => void;
  hasAny: boolean;
}

export function OpponentSetup({ onAdd, onReset, hasAny }: Props) {
  const [name, setName] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = name.trim();
    if (!t) return;
    onAdd(t);
    setName("");
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-base font-semibold">Opponents</h2>
      <form onSubmit={submit} className="mt-2 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add opponent name"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
        >
          Add
        </button>
      </form>
      {hasAny && (
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset tracker? This deletes all opponents and clues.")) onReset();
          }}
          className="mt-3 w-full rounded-md border border-red-300 px-3 py-2 text-sm text-red-600"
        >
          Reset Tracker
        </button>
      )}
    </div>
  );
}
