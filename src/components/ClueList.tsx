import { useState } from "react";
import type { Clue, ClueType } from "../lib/types";

const styles: Record<ClueType, { title: string; chip: string; border: string }> = {
  known: {
    title: "Known / Yes",
    chip: "bg-green-100 text-green-800 border-green-200",
    border: "border-green-200",
  },
  ruled_out: {
    title: "Ruled Out / No",
    chip: "bg-red-100 text-red-800 border-red-200",
    border: "border-red-200",
  },
  maybe: {
    title: "Maybe / Unsure",
    chip: "bg-amber-100 text-amber-800 border-amber-200",
    border: "border-amber-200",
  },
};

interface Props {
  type: ClueType;
  clues: Clue[];
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export function ClueList({ type, clues, onEdit, onDelete }: Props) {
  const s = styles[type];
  return (
    <div className={`mt-3 rounded-md border ${s.border} p-2`}>
      <div className="mb-1 flex items-center justify-between">
        <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${s.chip}`}>
          {s.title}
        </span>
        <span className="text-xs text-muted-foreground">{clues.length}</span>
      </div>
      {clues.length === 0 ? (
        <div className="py-1 text-xs text-muted-foreground">None yet.</div>
      ) : (
        <ul className="divide-y divide-border">
          {clues.map((c) => (
            <ClueRow key={c.id} clue={c} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ClueRow({
  clue,
  onEdit,
  onDelete,
}: {
  clue: Clue;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(clue.text);

  if (editing) {
    return (
      <li className="flex items-center gap-2 py-2">
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm"
        />
        <button
          type="button"
          onClick={() => {
            const t = val.trim();
            if (t) onEdit(clue.id, t);
            setEditing(false);
          }}
          className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            setVal(clue.text);
            setEditing(false);
          }}
          className="rounded border border-border px-2 py-1 text-xs"
        >
          Cancel
        </button>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-2 py-2 text-sm">
      <span className="flex-1 break-words">{clue.text}</span>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded border border-border px-2 py-1 text-xs"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(clue.id)}
          className="rounded border border-border px-2 py-1 text-xs text-red-600"
        >
          ×
        </button>
      </div>
    </li>
  );
}
