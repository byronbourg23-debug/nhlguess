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
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-base font-semibold tracking-tight">Opponents</h2>
      <form onSubmit={submit} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add opponent name"
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          ADD
        </button>
      </form>
      {hasAny && (
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset tracker? This deletes all opponents and rows.")) onReset();
          }}
          className="mt-3 w-full rounded-md border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-700 shadow-sm transition-colors hover:bg-red-100"
        >
          Clear ALL
        </button>
      )}
    </div>
  );
}
