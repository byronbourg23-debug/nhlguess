import { Check, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import {
  AGE_OPTIONS,
  CONFERENCE_OPTIONS,
  DIVISION_OPTIONS,
  HAND_OPTIONS,
  JERSEY_NUMBER_OPTIONS,
  NATIONALITY_OPTIONS,
  POSITION_OPTIONS,
  ROLE_OPTIONS,
  TEAM_GROUPS,
  type ChecklistOption,
} from "../lib/checklist";
import { makeId } from "../lib/storage";
import type {
  ChecklistItemState,
  ChecklistMark,
  ChecklistRecordCategory,
  Opponent,
  OpponentChecklist,
} from "../lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface Props {
  opponent: Opponent;
  onUpdate: (opponent: Opponent) => void;
  onDelete: (id: string) => void;
}

const STATIC_NATIONALITIES: Set<string> = new Set(
  NATIONALITY_OPTIONS.map((option) => option.value),
);

export function OpponentDeductionCard({ opponent, onUpdate, onDelete }: Props) {
  const [customNationality, setCustomNationality] = useState("");
  const [customItem, setCustomItem] = useState("");

  function setRecordMark(
    category: ChecklistRecordCategory,
    value: string,
    selectedMark: Exclude<ChecklistMark, "neutral">,
  ) {
    const record = opponent.checklist[category];
    const nextMark = record[value] === selectedMark ? "neutral" : selectedMark;
    const checklist = {
      ...opponent.checklist,
      [category]: { ...record, [value]: nextMark },
    } as OpponentChecklist;
    onUpdate({ ...opponent, checklist });
  }

  function addNationality(event: React.FormEvent) {
    event.preventDefault();
    const label = customNationality.trim();
    if (!label) return;

    const existing = Object.keys(opponent.checklist.nationality).find(
      (item) => item.toLowerCase() === label.toLowerCase(),
    );
    if (!existing) {
      onUpdate({
        ...opponent,
        checklist: {
          ...opponent.checklist,
          nationality: { ...opponent.checklist.nationality, [label]: "neutral" },
        },
      });
    }
    setCustomNationality("");
  }

  function deleteNationality(label: string) {
    const nextNationality = { ...opponent.checklist.nationality };
    delete nextNationality[label];
    onUpdate({
      ...opponent,
      checklist: { ...opponent.checklist, nationality: nextNationality },
    });
  }

  function addOtherItem(event: React.FormEvent) {
    event.preventDefault();
    const label = customItem.trim();
    if (!label) return;
    onUpdate({
      ...opponent,
      checklist: {
        ...opponent.checklist,
        other: [...opponent.checklist.other, { id: makeId(), label, mark: "neutral" }],
      },
    });
    setCustomItem("");
  }

  function setOtherMark(id: string, selectedMark: Exclude<ChecklistMark, "neutral">) {
    onUpdate({
      ...opponent,
      checklist: {
        ...opponent.checklist,
        other: opponent.checklist.other.map((item) =>
          item.id === id
            ? { ...item, mark: item.mark === selectedMark ? "neutral" : selectedMark }
            : item,
        ),
      },
    });
  }

  function deleteOtherItem(id: string) {
    onUpdate({
      ...opponent,
      checklist: {
        ...opponent.checklist,
        other: opponent.checklist.other.filter((item) => item.id !== id),
      },
    });
  }

  return (
    <article className="min-w-0 rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="min-w-0 break-words text-base font-semibold tracking-tight">
          {opponent.name}
        </h3>
        <button
          type="button"
          onClick={() => {
            if (confirm(`Remove ${opponent.name}?`)) onDelete(opponent.id);
          }}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-700 shadow-sm transition-colors hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Remove
        </button>
      </div>

      <Accordion type="multiple" className="mt-3 border-t border-border">
        <ChecklistSection
          value="position"
          title="Position"
          marks={Object.values(opponent.checklist.position)}
        >
          <ChecklistRows
            options={POSITION_OPTIONS}
            marks={opponent.checklist.position}
            onMark={(value, mark) => setRecordMark("position", value, mark)}
          />
        </ChecklistSection>

        <ChecklistSection value="team" title="Team" marks={Object.values(opponent.checklist.team)}>
          <div className="space-y-5">
            {TEAM_GROUPS.map((group) => (
              <div key={group.label}>
                <h4 className="mb-2 text-xs font-bold uppercase text-muted-foreground">
                  {group.label}
                </h4>
                <ChecklistRows
                  options={group.teams}
                  marks={opponent.checklist.team}
                  onMark={(value, mark) => setRecordMark("team", value, mark)}
                />
              </div>
            ))}
          </div>
        </ChecklistSection>

        <ChecklistSection
          value="conference"
          title="Conference"
          marks={Object.values(opponent.checklist.conference)}
        >
          <ChecklistRows
            options={CONFERENCE_OPTIONS}
            marks={opponent.checklist.conference}
            onMark={(value, mark) => setRecordMark("conference", value, mark)}
          />
        </ChecklistSection>

        <ChecklistSection
          value="division"
          title="Division"
          marks={Object.values(opponent.checklist.division)}
        >
          <ChecklistRows
            options={DIVISION_OPTIONS}
            marks={opponent.checklist.division}
            onMark={(value, mark) => setRecordMark("division", value, mark)}
          />
        </ChecklistSection>

        <ChecklistSection value="hand" title="Hand" marks={Object.values(opponent.checklist.hand)}>
          <ChecklistRows
            options={HAND_OPTIONS}
            marks={opponent.checklist.hand}
            onMark={(value, mark) => setRecordMark("hand", value, mark)}
          />
        </ChecklistSection>

        <ChecklistSection
          value="role"
          title="Line / Role"
          marks={Object.values(opponent.checklist.role)}
        >
          <ChecklistRows
            options={ROLE_OPTIONS}
            marks={opponent.checklist.role}
            onMark={(value, mark) => setRecordMark("role", value, mark)}
          />
        </ChecklistSection>

        <ChecklistSection
          value="nationality"
          title="Country / Nationality"
          marks={Object.values(opponent.checklist.nationality)}
        >
          <ChecklistRows
            options={NATIONALITY_OPTIONS}
            marks={opponent.checklist.nationality}
            onMark={(value, mark) => setRecordMark("nationality", value, mark)}
          />
          {Object.entries(opponent.checklist.nationality)
            .filter(([label]) => !STATIC_NATIONALITIES.has(label))
            .map(([label, mark]) => (
              <ChecklistRow
                key={label}
                label={label}
                mark={mark}
                onMark={(nextMark) => setRecordMark("nationality", label, nextMark)}
                onDelete={() => deleteNationality(label)}
              />
            ))}
          <AddItemForm
            value={customNationality}
            onChange={setCustomNationality}
            onSubmit={addNationality}
            inputLabel="Custom nationality"
            placeholder="Custom nationality"
          />
        </ChecklistSection>

        <ChecklistSection value="age" title="Age" marks={Object.values(opponent.checklist.age)}>
          <ChecklistRows
            options={AGE_OPTIONS}
            marks={opponent.checklist.age}
            onMark={(value, mark) => setRecordMark("age", value, mark)}
          />
        </ChecklistSection>

        <ChecklistSection
          value="jersey-number"
          title="Jersey Number"
          marks={Object.values(opponent.checklist.jerseyNumber)}
        >
          <ChecklistRows
            options={JERSEY_NUMBER_OPTIONS}
            marks={opponent.checklist.jerseyNumber}
            onMark={(value, mark) => setRecordMark("jerseyNumber", value, mark)}
          />
        </ChecklistSection>

        <ChecklistSection
          value="other"
          title="Other"
          marks={opponent.checklist.other.map((item) => item.mark)}
        >
          {opponent.checklist.other.map((item) => (
            <CustomChecklistRow
              key={item.id}
              item={item}
              onMark={(mark) => setOtherMark(item.id, mark)}
              onDelete={() => deleteOtherItem(item.id)}
            />
          ))}
          <AddItemForm
            value={customItem}
            onChange={setCustomItem}
            onSubmit={addOtherItem}
            inputLabel="Custom checklist item"
            placeholder="Custom checklist item"
          />
        </ChecklistSection>
      </Accordion>
    </article>
  );
}

function ChecklistSection({
  value,
  title,
  marks,
  children,
}: {
  value: string;
  title: string;
  marks: ChecklistMark[];
  children: React.ReactNode;
}) {
  const yesCount = marks.filter((mark) => mark === "yes").length;
  const noCount = marks.filter((mark) => mark === "no").length;

  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="gap-3 py-3.5 hover:no-underline">
        <span className="flex min-w-0 flex-1 items-center justify-between gap-2 pr-1">
          <span className="font-semibold">{title}</span>
          {yesCount || noCount ? (
            <span className="shrink-0 text-xs font-normal text-muted-foreground">
              {yesCount ? `${yesCount} yes` : ""}
              {yesCount && noCount ? " / " : ""}
              {noCount ? `${noCount} no` : ""}
            </span>
          ) : null}
        </span>
      </AccordionTrigger>
      <AccordionContent className="pb-3">{children}</AccordionContent>
    </AccordionItem>
  );
}

function ChecklistRows({
  options,
  marks,
  onMark,
}: {
  options: readonly ChecklistOption[];
  marks: Record<string, ChecklistMark>;
  onMark: (value: string, mark: Exclude<ChecklistMark, "neutral">) => void;
}) {
  return (
    <div className="divide-y divide-border">
      {options.map((option) => (
        <ChecklistRow
          key={option.value}
          label={option.label}
          mark={marks[option.value] ?? "neutral"}
          onMark={(mark) => onMark(option.value, mark)}
        />
      ))}
    </div>
  );
}

function CustomChecklistRow({
  item,
  onMark,
  onDelete,
}: {
  item: ChecklistItemState;
  onMark: (mark: Exclude<ChecklistMark, "neutral">) => void;
  onDelete: () => void;
}) {
  return <ChecklistRow label={item.label} mark={item.mark} onMark={onMark} onDelete={onDelete} />;
}

function ChecklistRow({
  label,
  mark,
  onMark,
  onDelete,
}: {
  label: string;
  mark: ChecklistMark;
  onMark: (mark: Exclude<ChecklistMark, "neutral">) => void;
  onDelete?: () => void;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 py-2">
      <span className="min-w-0 break-words pr-1 text-sm font-medium">{label}</span>
      <div className="flex shrink-0 items-center gap-1">
        <MarkButton
          label={label}
          kind="yes"
          selected={mark === "yes"}
          onClick={() => onMark("yes")}
        />
        <MarkButton label={label} kind="no" selected={mark === "no"} onClick={() => onMark("no")} />
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${label}`}
            title={`Delete ${label}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 transition-colors hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function MarkButton({
  label,
  kind,
  selected,
  onClick,
}: {
  label: string;
  kind: "yes" | "no";
  selected: boolean;
  onClick: () => void;
}) {
  const isYes = kind === "yes";
  const stateClass = selected
    ? isYes
      ? "border-emerald-700 bg-emerald-600 text-white"
      : "border-red-700 bg-red-600 text-white"
    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`Mark ${label} as ${kind}`}
      title={`Mark ${label} as ${kind}`}
      className={`inline-flex h-11 min-w-14 items-center justify-center gap-1 rounded-md border px-2 text-xs font-bold transition-colors ${stateClass}`}
    >
      {isYes ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <X className="h-4 w-4" aria-hidden="true" />
      )}
      {isYes ? "Yes" : "No"}
    </button>
  );
}

function AddItemForm({
  value,
  onChange,
  onSubmit,
  inputLabel,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  inputLabel: string;
  placeholder: string;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-3 flex min-w-0 flex-col gap-2 sm:flex-row">
      <label className="sr-only">{inputLabel}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={inputLabel}
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
  );
}
