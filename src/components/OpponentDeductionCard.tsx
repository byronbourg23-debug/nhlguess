import { Check, ChevronsDownUp, ChevronsUpDown, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CONFERENCE_OPTIONS,
  DIVISION_OPTIONS,
  HAND_OPTIONS,
  NATIONALITY_OPTIONS,
  POSITION_OPTIONS,
  TEAM_GROUPS,
  TEAM_OPTIONS,
  TEAM_TO_DIVISION,
  type ChecklistOption,
} from "../lib/checklist";
import {
  deriveChecklistState,
  getEffectiveChecklistState,
  resolveChecklistMark,
  updateExplicitChecklistMark,
} from "../lib/checklistLogic";
import { makeId } from "../lib/storage";
import type {
  ChecklistItemState,
  ChecklistMark,
  ChecklistMarkSource,
  ChecklistRecordCategory,
  Opponent,
} from "../lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";

interface Props {
  opponent: Opponent;
  onUpdate: (opponent: Opponent) => void;
  onDelete: (id: string) => void;
}

const STATIC_NATIONALITIES: Set<string> = new Set(
  NATIONALITY_OPTIONS.map((option) => option.value),
);
const TOP_LEVEL_CATEGORIES = [
  "position",
  "conference",
  "division",
  "team",
  "hand",
  "nationality",
  "age",
  "jersey-number",
  "other",
];
const PRIMARY_POSITION_OPTIONS: readonly ChecklistOption[] = [
  { value: "F", label: "Forward" },
  { value: "D", label: "D" },
  { value: "G", label: "Goalie" },
];
const FORWARD_POSITION_OPTIONS = POSITION_OPTIONS.filter((option) =>
  ["LW", "C", "RW"].includes(option.value),
);
const DEFENSE_POSITION_OPTIONS = POSITION_OPTIONS.filter((option) =>
  ["LD", "RD"].includes(option.value),
);
const POSITION_SUMMARY_ORDER = ["F", "LW", "C", "RW", "D", "LD", "RD", "G"];

export function OpponentDeductionCard({ opponent, onUpdate, onDelete }: Props) {
  const [customNationality, setCustomNationality] = useState("");
  const [customItem, setCustomItem] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedTeamDivisions, setExpandedTeamDivisions] = useState<string[]>([]);
  const [showRuledOutTeams, setShowRuledOutTeams] = useState(false);
  const explicitChecklist = opponent.explicitChecklist;
  const { derivedChecklist, effectiveChecklist } = useMemo(() => {
    const derived = deriveChecklistState(explicitChecklist);
    return {
      derivedChecklist: derived,
      effectiveChecklist: getEffectiveChecklistState(explicitChecklist, derived),
    };
  }, [explicitChecklist]);
  const selectedTeam = TEAM_OPTIONS.find(
    (option) => effectiveChecklist.team[option.value] === "yes",
  );
  const selectedTeamDivision = selectedTeam ? TEAM_TO_DIVISION[selectedTeam.value] : undefined;

  function setRecordMark(
    category: ChecklistRecordCategory,
    value: string,
    selectedMark: Exclude<ChecklistMark, "neutral">,
  ) {
    const nextChecklist = updateExplicitChecklistMark(
      explicitChecklist,
      category,
      value,
      selectedMark,
    );

    if (
      category === "team" &&
      nextChecklist.team[value] === "yes" &&
      expandedCategories.includes("team")
    ) {
      const division = TEAM_TO_DIVISION[value];
      if (division) {
        setExpandedTeamDivisions((current) =>
          current.includes(division) ? current : [...current, division],
        );
      }
    }

    onUpdate({ ...opponent, explicitChecklist: nextChecklist });
  }

  function setClueText(field: "ageText" | "jerseyNumberText", value: string) {
    onUpdate({ ...opponent, [field]: value });
  }

  function trimClueText(field: "ageText" | "jerseyNumberText") {
    const trimmed = opponent[field].trim();
    if (trimmed !== opponent[field]) setClueText(field, trimmed);
  }

  function handleCategoryChange(nextCategories: string[]) {
    const teamWasClosed = !expandedCategories.includes("team");
    setExpandedCategories(nextCategories);
    if (teamWasClosed && nextCategories.includes("team") && selectedTeamDivision) {
      setExpandedTeamDivisions((current) =>
        current.includes(selectedTeamDivision) ? current : [...current, selectedTeamDivision],
      );
    }
  }

  function expandAll() {
    setExpandedCategories([...TOP_LEVEL_CATEGORIES]);
    if (selectedTeamDivision) {
      setExpandedTeamDivisions((current) =>
        current.includes(selectedTeamDivision) ? current : [...current, selectedTeamDivision],
      );
    }
  }

  function collapseAll() {
    setExpandedCategories([]);
    setExpandedTeamDivisions([]);
  }

  function addNationality(event: React.FormEvent) {
    event.preventDefault();
    const label = customNationality.trim();
    if (!label) return;

    const existing = Object.keys(explicitChecklist.nationality).find(
      (item) => item.toLowerCase() === label.toLowerCase(),
    );
    if (!existing) {
      onUpdate({
        ...opponent,
        explicitChecklist: {
          ...explicitChecklist,
          nationality: { ...explicitChecklist.nationality, [label]: "neutral" },
        },
      });
    }
    setCustomNationality("");
  }

  function deleteNationality(label: string) {
    const nextNationality = { ...explicitChecklist.nationality };
    delete nextNationality[label];
    onUpdate({
      ...opponent,
      explicitChecklist: { ...explicitChecklist, nationality: nextNationality },
    });
  }

  function addOtherItem(event: React.FormEvent) {
    event.preventDefault();
    const label = customItem.trim();
    if (!label) return;
    onUpdate({
      ...opponent,
      explicitChecklist: {
        ...explicitChecklist,
        other: [...explicitChecklist.other, { id: makeId(), label, mark: "neutral" }],
      },
    });
    setCustomItem("");
  }

  function setOtherMark(id: string, selectedMark: Exclude<ChecklistMark, "neutral">) {
    onUpdate({
      ...opponent,
      explicitChecklist: {
        ...explicitChecklist,
        other: explicitChecklist.other.map((item) =>
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
      explicitChecklist: {
        ...explicitChecklist,
        other: explicitChecklist.other.filter((item) => item.id !== id),
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

      <div
        className="mt-3 flex flex-wrap gap-2"
        role="group"
        aria-label={`${opponent.name} checklist display controls`}
      >
        <button
          type="button"
          onClick={expandAll}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <ChevronsUpDown className="h-4 w-4" aria-hidden="true" />
          Expand All
        </button>
        <button
          type="button"
          onClick={collapseAll}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <ChevronsDownUp className="h-4 w-4" aria-hidden="true" />
          Collapse All
        </button>
      </div>

      <Accordion
        type="multiple"
        value={expandedCategories}
        onValueChange={handleCategoryChange}
        className="mt-3 border-t border-border"
      >
        <ChecklistSection
          value="position"
          title="Position"
          summaryLabels={getSelectedOptionLabels(
            POSITION_OPTIONS,
            effectiveChecklist.position,
            POSITION_SUMMARY_ORDER,
          )}
        >
          <ChecklistRows
            options={PRIMARY_POSITION_OPTIONS}
            explicitMarks={explicitChecklist.position}
            derivedMarks={derivedChecklist.position}
            onMark={(value, mark) => setRecordMark("position", value, mark)}
          />
          {effectiveChecklist.position.F === "yes" ? (
            <PositionSubtypeSection title="Forward">
              <ChecklistRows
                options={FORWARD_POSITION_OPTIONS}
                explicitMarks={explicitChecklist.position}
                derivedMarks={derivedChecklist.position}
                onMark={(value, mark) => setRecordMark("position", value, mark)}
              />
            </PositionSubtypeSection>
          ) : null}
          {effectiveChecklist.position.D === "yes" ? (
            <PositionSubtypeSection title="Defense">
              <ChecklistRows
                options={DEFENSE_POSITION_OPTIONS}
                explicitMarks={explicitChecklist.position}
                derivedMarks={derivedChecklist.position}
                onMark={(value, mark) => setRecordMark("position", value, mark)}
              />
            </PositionSubtypeSection>
          ) : null}
        </ChecklistSection>

        <ChecklistSection
          value="conference"
          title="Conference"
          summaryLabels={getSelectedOptionLabels(CONFERENCE_OPTIONS, effectiveChecklist.conference)}
        >
          <ChecklistRows
            options={CONFERENCE_OPTIONS}
            explicitMarks={explicitChecklist.conference}
            derivedMarks={derivedChecklist.conference}
            onMark={(value, mark) => setRecordMark("conference", value, mark)}
          />
        </ChecklistSection>

        <ChecklistSection
          value="division"
          title="Division"
          summaryLabels={getSelectedOptionLabels(DIVISION_OPTIONS, effectiveChecklist.division)}
        >
          <ChecklistRows
            options={DIVISION_OPTIONS}
            explicitMarks={explicitChecklist.division}
            derivedMarks={derivedChecklist.division}
            onMark={(value, mark) => setRecordMark("division", value, mark)}
          />
        </ChecklistSection>

        <ChecklistSection
          value="team"
          title="Team"
          summaryLabels={getSelectedOptionLabels(TEAM_OPTIONS, effectiveChecklist.team)}
        >
          <div className="mb-2 flex items-center gap-2 py-1">
            <Checkbox
              id={`show-ruled-out-teams-${opponent.id}`}
              checked={showRuledOutTeams}
              onCheckedChange={(checked) => setShowRuledOutTeams(checked === true)}
            />
            <label
              htmlFor={`show-ruled-out-teams-${opponent.id}`}
              className="cursor-pointer text-sm font-medium"
            >
              Show ruled-out teams
            </label>
          </div>
          <Accordion
            type="multiple"
            value={expandedTeamDivisions}
            onValueChange={setExpandedTeamDivisions}
            className="border-t border-border"
          >
            {TEAM_GROUPS.map((group) => {
              const visibleTeams = group.teams.filter((team) => {
                const resolved = resolveChecklistMark(
                  explicitChecklist.team[team.value],
                  derivedChecklist.team[team.value],
                );
                return showRuledOutTeams || resolved.mark !== "no" || resolved.source !== "derived";
              });
              if (visibleTeams.length === 0) return null;

              return (
                <TeamDivisionSection
                  key={group.label}
                  value={group.label}
                  title={group.label}
                  summaryLabels={getSelectedOptionLabels(group.teams, effectiveChecklist.team)}
                >
                  <ChecklistRows
                    options={visibleTeams}
                    explicitMarks={explicitChecklist.team}
                    derivedMarks={derivedChecklist.team}
                    onMark={(value, mark) => setRecordMark("team", value, mark)}
                  />
                </TeamDivisionSection>
              );
            })}
          </Accordion>
        </ChecklistSection>

        <ChecklistSection
          value="hand"
          title="Hand"
          summaryLabels={getSelectedOptionLabels(HAND_OPTIONS, effectiveChecklist.hand)}
        >
          <ChecklistRows
            options={HAND_OPTIONS}
            explicitMarks={explicitChecklist.hand}
            derivedMarks={derivedChecklist.hand}
            onMark={(value, mark) => setRecordMark("hand", value, mark)}
          />
        </ChecklistSection>

        <ChecklistSection
          value="nationality"
          title="Country / Nationality"
          summaryLabels={getNationalitySummaryLabels(effectiveChecklist.nationality)}
        >
          <ChecklistRows
            options={NATIONALITY_OPTIONS}
            explicitMarks={explicitChecklist.nationality}
            derivedMarks={derivedChecklist.nationality}
            onMark={(value, mark) => setRecordMark("nationality", value, mark)}
          />
          {Object.entries(explicitChecklist.nationality)
            .filter(([label]) => !STATIC_NATIONALITIES.has(label))
            .map(([label, explicitMark]) => {
              const resolved = resolveChecklistMark(
                explicitMark,
                derivedChecklist.nationality[label],
              );
              return (
                <ChecklistRow
                  key={label}
                  label={label}
                  mark={resolved.mark}
                  source={resolved.source}
                  onMark={(nextMark) => setRecordMark("nationality", label, nextMark)}
                  onDelete={() => deleteNationality(label)}
                />
              );
            })}
          <AddItemForm
            value={customNationality}
            onChange={setCustomNationality}
            onSubmit={addNationality}
            inputLabel="Custom nationality"
            placeholder="Custom nationality"
          />
        </ChecklistSection>

        <ChecklistSection
          value="age"
          title="Age"
          summaryLabels={opponent.ageText.trim() ? [opponent.ageText.trim()] : []}
        >
          <ClueTextField
            label="Age clue"
            value={opponent.ageText}
            placeholder="Enter age or age clue"
            onChange={(value) => setClueText("ageText", value)}
            onBlur={() => trimClueText("ageText")}
          />
        </ChecklistSection>

        <ChecklistSection
          value="jersey-number"
          title="Jersey Number"
          summaryLabels={opponent.jerseyNumberText.trim() ? [opponent.jerseyNumberText.trim()] : []}
        >
          <ClueTextField
            label="Jersey number clue"
            value={opponent.jerseyNumberText}
            placeholder="Enter number or number clue"
            onChange={(value) => setClueText("jerseyNumberText", value)}
            onBlur={() => trimClueText("jerseyNumberText")}
          />
        </ChecklistSection>

        <ChecklistSection
          value="other"
          title="Other"
          summaryLabels={uniqueLabels(
            explicitChecklist.other.filter((item) => item.mark === "yes").map((item) => item.label),
          )}
        >
          {explicitChecklist.other.map((item) => (
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
  summaryLabels,
  children,
}: {
  value: string;
  title: string;
  summaryLabels: string[];
  children: React.ReactNode;
}) {
  const summary = uniqueLabels(summaryLabels).join(", ");

  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="group gap-3 py-3.5 hover:no-underline">
        <span className="grid min-w-0 flex-1 gap-0.5 pr-1 text-left">
          <span className="font-semibold">{title}</span>
          {summary ? (
            <span className="min-w-0 whitespace-normal break-words text-xs font-medium text-emerald-700 group-data-[state=open]:hidden">
              {summary}
            </span>
          ) : null}
        </span>
      </AccordionTrigger>
      <AccordionContent className="pb-3">{children}</AccordionContent>
    </AccordionItem>
  );
}

function PositionSubtypeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-3 border-l-2 border-border pl-3">
      <h4 className="pb-1 text-xs font-bold uppercase text-muted-foreground">{title}</h4>
      {children}
    </section>
  );
}

function TeamDivisionSection({
  value,
  title,
  summaryLabels,
  children,
}: {
  value: string;
  title: string;
  summaryLabels: string[];
  children: React.ReactNode;
}) {
  const summary = uniqueLabels(summaryLabels).join(", ");
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="group gap-3 py-3 hover:no-underline">
        <span className="min-w-0 flex-1 break-words text-left font-semibold">
          {title}
          {summary ? (
            <span className="font-medium text-emerald-700 group-data-[state=open]:hidden">
              {` - ${summary}`}
            </span>
          ) : null}
        </span>
      </AccordionTrigger>
      <AccordionContent className="pb-2 pl-2">{children}</AccordionContent>
    </AccordionItem>
  );
}

function ClueTextField({
  label,
  value,
  placeholder,
  onChange,
  onBlur,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <div className="py-1">
      <label className="sr-only">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-label={label}
        className="min-h-11 w-full min-w-0 rounded-md border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function getSelectedOptionLabels(
  options: readonly ChecklistOption[],
  marks: Record<string, ChecklistMark>,
  order = options.map((option) => option.value),
): string[] {
  const optionsByValue = new Map(options.map((option) => [option.value, option.label]));
  return uniqueLabels(
    order
      .filter((value) => marks[value] === "yes")
      .map((value) => optionsByValue.get(value))
      .filter((label): label is string => Boolean(label)),
  );
}

function getNationalitySummaryLabels(marks: Record<string, ChecklistMark>): string[] {
  const standardLabels = getSelectedOptionLabels(NATIONALITY_OPTIONS, marks);
  const customLabels = Object.entries(marks)
    .filter(([value, mark]) => !STATIC_NATIONALITIES.has(value) && mark === "yes")
    .map(([value]) => value);
  return uniqueLabels([...standardLabels, ...customLabels]);
}

function uniqueLabels(labels: string[]): string[] {
  const seen = new Set<string>();
  return labels
    .map((label) => label.trim())
    .filter((label) => {
      const key = label.toLocaleLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function ChecklistRows({
  options,
  explicitMarks,
  derivedMarks,
  onMark,
}: {
  options: readonly ChecklistOption[];
  explicitMarks: Record<string, ChecklistMark>;
  derivedMarks: Record<string, ChecklistMark>;
  onMark: (value: string, mark: Exclude<ChecklistMark, "neutral">) => void;
}) {
  return (
    <div className="divide-y divide-border">
      {options.map((option) => {
        const resolved = resolveChecklistMark(
          explicitMarks[option.value],
          derivedMarks[option.value],
        );
        return (
          <ChecklistRow
            key={option.value}
            label={option.label}
            mark={resolved.mark}
            source={resolved.source}
            onMark={(mark) => onMark(option.value, mark)}
          />
        );
      })}
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
  return (
    <ChecklistRow
      label={item.label}
      mark={item.mark}
      source={item.mark === "neutral" ? "neutral" : "explicit"}
      onMark={onMark}
      onDelete={onDelete}
    />
  );
}

function ChecklistRow({
  label,
  mark,
  source,
  onMark,
  onDelete,
}: {
  label: string;
  mark: ChecklistMark;
  source: ChecklistMarkSource;
  onMark: (mark: Exclude<ChecklistMark, "neutral">) => void;
  onDelete?: () => void;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 py-2">
      <span className="flex min-w-0 flex-wrap items-center gap-1.5 break-words pr-1 text-sm font-medium">
        <span>{label}</span>
        {source === "derived" ? (
          <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
            Auto
          </span>
        ) : null}
      </span>
      <div className="flex shrink-0 items-center gap-1">
        <MarkButton
          label={label}
          kind="yes"
          selected={mark === "yes"}
          source={source}
          onClick={() => onMark("yes")}
        />
        <MarkButton
          label={label}
          kind="no"
          selected={mark === "no"}
          source={source}
          onClick={() => onMark("no")}
        />
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
  source,
  onClick,
}: {
  label: string;
  kind: "yes" | "no";
  selected: boolean;
  source: ChecklistMarkSource;
  onClick: () => void;
}) {
  const isYes = kind === "yes";
  const stateClass = selected
    ? source === "derived"
      ? isYes
        ? "border-emerald-400 bg-emerald-50 text-emerald-800"
        : "border-red-400 bg-red-50 text-red-800"
      : isYes
        ? "border-emerald-700 bg-emerald-600 text-white"
        : "border-red-700 bg-red-600 text-white"
    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground";
  const title =
    selected && source === "derived"
      ? `${label} was automatically marked as ${kind}`
      : `Mark ${label} as ${kind}`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`Mark ${label} as ${kind}`}
      title={title}
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
