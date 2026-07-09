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
    <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold">{opponent.name}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addRow}
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Remove ${opponent.name}?`)) onDelete(opponent.id);
            }}
            className="rounded-md border border-border px-3 py-2 text-sm text-red-600"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-2 font-semibold">Question</th>
              <th className="py-2 pr-2 font-semibold">Answer</th>
              <th className="py-2 text-right font-semibold"> </th>
            </tr>
          </thead>
          <tbody>
            {opponent.rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="py-2 pr-2 align-top">
                  <div className="flex flex-col gap-2">
                    <select
                      value={row.questionType}
                      onChange={(e) =>
                        updateQuestionType(row.id, e.target.value as DeductionQuestionType)
                      }
                      className="w-full rounded-md border border-border bg-background px-2 py-2"
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
                        onChange={(e) =>
                          updateRow(row.id, { customQuestionText: e.target.value })
                        }
                        placeholder="Custom question"
                        className="w-full rounded-md border border-border bg-background px-2 py-2"
                      />
                    ) : null}
                  </div>
                </td>
                <td className="py-2 pr-2 align-top">
                  <AnswerInput row={row} onChange={(answer) => updateRow(row.id, { answer })} />
                </td>
                <td className="py-2 text-right align-top">
                  <button
                    type="button"
                    onClick={() => deleteRow(row.id)}
                    className="rounded border border-border px-2 py-2 text-xs text-red-600"
                    aria-label="Delete row"
                  >
                    x
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnswerInput({
  row,
  onChange,
}: {
  row: DeductionRow;
  onChange: (answer: string) => void;
}) {
  const options = ANSWER_OPTIONS[row.questionType];

  if (options) {
    return (
      <select
        value={row.answer}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-2 py-2"
      >
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
      className="w-full rounded-md border border-border bg-background px-2 py-2"
    />
  );
}
