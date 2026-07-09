import { useState } from "react";
import type { Clue, ClueCategory, ClueType, Opponent } from "../lib/types";
import { ClueForm } from "./ClueForm";
import { ClueList } from "./ClueList";
import { QuickClueButtons } from "./QuickClueButtons";
import { makeId } from "../lib/storage";

interface Props {
  opponent: Opponent;
  onUpdate: (o: Opponent) => void;
  onDelete: (id: string) => void;
}

export function OpponentDeductionCard({ opponent, onUpdate, onDelete }: Props) {
  const [renaming, setRenaming] = useState(false);
  const [nameVal, setNameVal] = useState(opponent.name);

  function addClue(text: string, type: ClueType, category?: ClueCategory) {
    const clue: Clue = { id: makeId(), text, type, category, createdAt: Date.now() };
    onUpdate({ ...opponent, clues: [clue, ...opponent.clues] });
  }
  function editClue(id: string, text: string) {
    onUpdate({
      ...opponent,
      clues: opponent.clues.map((c) => (c.id === id ? { ...c, text } : c)),
    });
  }
  function deleteClue(id: string) {
    onUpdate({ ...opponent, clues: opponent.clues.filter((c) => c.id !== id) });
  }

  const known = opponent.clues.filter((c) => c.type === "known");
  const ruled = opponent.clues.filter((c) => c.type === "ruled_out");
  const maybe = opponent.clues.filter((c) => c.type === "maybe");

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        {renaming ? (
          <div className="flex flex-1 gap-2">
            <input
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                const t = nameVal.trim();
                if (t) onUpdate({ ...opponent, name: t });
                setRenaming(false);
              }}
              className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-base font-semibold">{opponent.name}'s Mystery Player</h3>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  setNameVal(opponent.name);
                  setRenaming(true);
                }}
                className="rounded border border-border px-2 py-1 text-xs"
              >
                Rename
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Remove ${opponent.name}?`)) onDelete(opponent.id);
                }}
                className="rounded border border-border px-2 py-1 text-xs text-red-600"
              >
                Remove
              </button>
            </div>
          </>
        )}
      </div>

      <QuickClueButtons onAdd={addClue} />
      <ClueForm onAdd={addClue} />

      <ClueList type="known" clues={known} onEdit={editClue} onDelete={deleteClue} />
      <ClueList type="ruled_out" clues={ruled} onEdit={editClue} onDelete={deleteClue} />
      <ClueList type="maybe" clues={maybe} onEdit={editClue} onDelete={deleteClue} />
    </div>
  );
}
