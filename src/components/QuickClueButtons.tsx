import { useState } from "react";
import { CLUE_CATEGORY_OPTIONS } from "../lib/clueCategories";
import type { ClueCategory, ClueType } from "../lib/types";

interface QuickOption {
  label: string;
  known: string;
  ruledOut: string;
}

const OPTIONS: QuickOption[] = [
  { label: "Forward", known: "Forward", ruledOut: "Not a forward" },
  { label: "Defenseman", known: "Defenseman", ruledOut: "Not a defenseman" },
  { label: "Goalie", known: "Goalie", ruledOut: "Not a goalie" },
  { label: "Canadian", known: "Canadian", ruledOut: "Not Canadian" },
  { label: "American", known: "American", ruledOut: "Not American" },
  { label: "Eastern Conf", known: "Eastern Conference", ruledOut: "Not in Eastern Conference" },
  { label: "Western Conf", known: "Western Conference", ruledOut: "Not in Western Conference" },
  { label: "Left shot", known: "Shoots left", ruledOut: "Does not shoot left" },
  { label: "Right shot", known: "Shoots right", ruledOut: "Does not shoot right" },
  { label: "Over 30", known: "Over 30 years old", ruledOut: "Not over 30" },
  { label: "Under 25", known: "Under 25 years old", ruledOut: "Not under 25" },
];

interface Props {
  onAdd: (text: string, type: ClueType, category?: ClueCategory) => void;
}

export function QuickClueButtons({ onAdd }: Props) {
  const [active, setActive] = useState<QuickOption | null>(null);
  const [category, setCategory] = useState<ClueCategory | "">("");

  function pick(type: ClueType) {
    if (!active) return;
    const text =
      type === "known"
        ? active.known
        : type === "ruled_out"
          ? active.ruledOut
          : `Maybe ${active.known.toLowerCase()}`;
    onAdd(text, type, category || undefined);
    setActive(null);
    setCategory("");
  }

  return (
    <div className="mt-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Quick clues
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {OPTIONS.map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => setActive(o)}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:bg-accent"
          >
            {o.label}
          </button>
        ))}
      </div>

      {active && (
        <div className="mt-2 rounded-md border border-border bg-muted p-2">
          <div className="text-xs text-muted-foreground">
            Add "{active.label}" as:
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ClueCategory | "")}
            className="mt-2 w-full rounded-md border border-border bg-background px-2 py-2 text-xs"
          >
            <option value="">No category</option>
            {CLUE_CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => pick("known")}
              className="rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white"
            >
              Known / Yes
            </button>
            <button
              type="button"
              onClick={() => pick("ruled_out")}
              className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white"
            >
              Ruled Out / No
            </button>
            <button
              type="button"
              onClick={() => pick("maybe")}
              className="rounded bg-amber-500 px-3 py-1.5 text-xs font-medium text-white"
            >
              Maybe
            </button>
            <button
              type="button"
              onClick={() => {
                setActive(null);
                setCategory("");
              }}
              className="rounded border border-border px-3 py-1.5 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
