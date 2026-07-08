import { useEffect, useRef, useState } from "react";
import type { Opponent } from "../lib/types";
import { loadOpponents, makeId, saveOpponents } from "../lib/storage";
import { OpponentSetup } from "./OpponentSetup";
import { OpponentDeductionCard } from "./OpponentDeductionCard";

export function DeductionTracker() {
  const [opponents, setOpponents] = useState<Opponent[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    setOpponents(loadOpponents());
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    saveOpponents(opponents);
  }, [opponents]);

  function addOpponent(name: string) {
    setOpponents((prev) => [...prev, { id: makeId(), name, clues: [] }]);
  }
  function updateOpponent(o: Opponent) {
    setOpponents((prev) => prev.map((p) => (p.id === o.id ? o : p)));
  }
  function deleteOpponent(id: string) {
    setOpponents((prev) => prev.filter((p) => p.id !== id));
  }
  function reset() {
    setOpponents([]);
  }

  return (
    <div className="flex flex-col gap-4">
      <OpponentSetup onAdd={addOpponent} onReset={reset} hasAny={opponents.length > 0} />
      {opponents.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Add opponents to start tracking clues.
        </div>
      ) : (
        opponents.map((o) => (
          <OpponentDeductionCard
            key={o.id}
            opponent={o}
            onUpdate={updateOpponent}
            onDelete={deleteOpponent}
          />
        ))
      )}
    </div>
  );
}
