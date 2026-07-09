import type { DeductionQuestionType, DeductionRow, Opponent } from "../lib/types";
import { makeEmptyDeductionRow } from "../lib/storage";

const QUESTION_OPTIONS: { label: string; value: DeductionQuestionType }[] = [
  { label: "Position", value: "position" },
  { label: "Team", value: "team" },
  { label: "Conference", value: "conference" },
  { label: "Division", value: "division" },
  { label: "Hand", value: "hand" },
  { label: "Top 6", value: "top6" },
  { label: "Top 4", value: "top4" },
  { label: "Country/Nationality", value: "country" },
  { label: "Age", value: "age" },
  { label: "Jersey Number", value: "jerseyNumber" },
  { label: "Other", value: "other" },
];

const ANSWER_OPTIONS: Partial<Record<DeductionQuestionType, string[]>> = {
  position: ["LW", "C", "RW", "LD", "RD", "F", "D", "G"],
  team: [
    "Ducks",
    "Bruins",
    "Sabres",
    "Flames",
    "Hurricanes",
    "Blackhawks",
    "Avalanche",
    "Blue Jackets",
    "Stars",
    "Red Wings",
    "Oilers",
    "Panthers",
    "Kings",
    "Wild",
    "Canadiens",
    "Predators",
    "Devils",
    "Islanders",
    "Rangers",
    "Senators",
    "Flyers",
    "Penguins",
    "Sharks",
    "Kraken",
    "Blues",
    "Lightning",
    "Maple Leafs",
    "Utah Mammoth",
    "Canucks",
    "Golden Knights",
    "Capitals",
    "Jets",
  ],
  conference: ["East", "West"],
  division: ["Pacific", "Atlantic", "Metro", "Central"],
  hand: ["L", "R"],
  top6: ["Yes", "No"],
  top4: ["Yes", "No"],
  country: [
    "Canadian",
    "American",
    "Swedish",
    "Finnish",
    "Russian",
    "Czech",
    "Slovak",
    "German",
    "Swiss",
    "Other",
  ],
};

interface Props {
  opponent: Opponent;
  onUpdate: (o: Opponent) => void;
  onDelete: (id: string) => void;
}

const addButtonClass =
  "inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-emerald-700";

const dangerButtonClass =
  "inline-flex items-center justify-center rounded-md border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-700 shadow-sm transition-colors hover:bg-red-100";

const fieldClass =
  "w-full min-w-0 rounded-md border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-ring";

export function OpponentDeductionCard({ opponent, onUpdate, onDelete }: Props) {
  function addRow() {
    onUpdate({ ...opponent, rows: [...opponent.rows, makeEmptyDeductionRow()] });
  }

  function updateRow(rowId: string, patch: Partial<DeductionRow>) {
    onUpdate({
      ...opponent,
      rows: opponent.rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
    });
  }

  function updateQuestionType(rowId: string, questionType: DeductionQuestionType) {
    updateRow(rowId, {
      questionType,
      customQuestionText: questionType === "other" ? "" : undefined,
      answer: "",
    });
  }

  function deleteRow(rowId: string) {
    onUpdate({ ...opponent, rows: opponent.rows.filter((row) => row.id !== rowId) });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="min-w-0 text-base font-semibold tracking-tight">{opponent.name}</h3>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={addRow} className={addButtonClass}>
            ADD
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Remove ${opponent.name}?`)) onDelete(opponent.id);
            }}
            className={dangerButtonClass}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.75rem] gap-3 border-b border-border pb-2 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground sm:grid">
          <div>Question</div>
          <div>Answer</div>
          <div aria-hidden="true" />
        </div>
        <div className="divide-y divide-border">
          {opponent.rows.map((row) => (
            <div
              key={row.id}
              className="grid min-w-0 gap-3 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.75rem] sm:items-start"
            >
              <div className="min-w-0">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground sm:hidden">
                  Question
                </label>
                <div className="flex min-w-0 flex-col gap-2">
                  <select
                    value={row.questionType}
                    onChange={(e) =>
                      updateQuestionType(row.id, e.target.value as DeductionQuestionType)
                    }
                    className={fieldClass}
                  >
                    {QUESTION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {row.questionType === "other" ? (
                    <input
                      type="text"
                      value={row.customQuestionText ?? ""}
                      onChange={(e) => updateRow(row.id, { customQuestionText: e.target.value })}
                      placeholder="Custom question"
                      className={fieldClass}
                    />
                  ) : null}
                </div>
              </div>
              <div className="min-w-0">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground sm:hidden">
                  Answer
                </label>
                <AnswerInput row={row} onChange={(answer) => updateRow(row.id, { answer })} />
              </div>
              <div className="flex justify-end sm:justify-center">
                <button
                  type="button"
                  onClick={() => deleteRow(row.id)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-red-300 bg-red-50 text-sm font-bold leading-none text-red-700 shadow-sm transition-colors hover:bg-red-100"
                  aria-label="Delete row"
                >
                  x
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnswerInput({ row, onChange }: { row: DeductionRow; onChange: (answer: string) => void }) {
  const options = ANSWER_OPTIONS[row.questionType];

  if (options) {
    return (
      <select value={row.answer} onChange={(e) => onChange(e.target.value)} className={fieldClass}>
        <option value="">Select answer</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type="text"
      value={row.answer}
      onChange={(e) => onChange(e.target.value)}
      placeholder={row.questionType === "other" ? "Answer" : "Answer"}
      className={fieldClass}
    />
  );
}
