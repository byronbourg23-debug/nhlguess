import {
  CONFERENCE_OPTIONS,
  DIVISION_OPTIONS,
  DIVISION_TO_CONFERENCE,
  HAND_OPTIONS,
  POSITION_OPTIONS,
  TEAM_GROUPS,
  TEAM_OPTIONS,
  TEAM_TO_DIVISION,
  createEmptyChecklist,
} from "./checklist";
import type {
  ChecklistMark,
  ChecklistRecordCategory,
  ChecklistState,
  DerivedChecklistState,
  ExplicitChecklistState,
  ResolvedChecklistMark,
} from "./types";

type SelectableMark = Exclude<ChecklistMark, "neutral">;

const EXCLUSIVE_GROUPS: ReadonlyArray<{
  category: ChecklistRecordCategory;
  values: readonly string[];
}> = [
  { category: "conference", values: CONFERENCE_OPTIONS.map((option) => option.value) },
  { category: "division", values: DIVISION_OPTIONS.map((option) => option.value) },
  { category: "team", values: TEAM_OPTIONS.map((option) => option.value) },
  { category: "hand", values: HAND_OPTIONS.map((option) => option.value) },
];

const POSITION_VALUES = POSITION_OPTIONS.map((option) => option.value);
const POSITION_COMPATIBILITY: Readonly<Record<string, readonly string[]>> = {
  F: ["F", "C", "LW", "RW"],
  C: ["C", "F"],
  LW: ["LW", "F"],
  RW: ["RW", "F"],
  D: ["D", "LD", "RD"],
  LD: ["LD", "D"],
  RD: ["RD", "D"],
  G: ["G"],
};
const POSITION_PARENT: Readonly<Record<string, string>> = {
  C: "F",
  LW: "F",
  RW: "F",
  LD: "D",
  RD: "D",
};
const POSITION_CHILDREN: Readonly<Record<string, readonly string[]>> = {
  F: ["C", "LW", "RW"],
  D: ["LD", "RD"],
};

export function updateExplicitChecklistMark(
  explicit: ExplicitChecklistState,
  category: ChecklistRecordCategory,
  value: string,
  selectedMark: SelectableMark,
): ExplicitChecklistState {
  const next = cloneChecklistState(explicit);
  const currentMark = next[category][value] ?? "neutral";

  if (
    category === "position" &&
    selectedMark === "yes" &&
    currentMark === "neutral" &&
    POSITION_CHILDREN[value]?.some((child) => next.position[child] === "yes")
  ) {
    clearExplicitYes(next.position, POSITION_CHILDREN[value]);
    return next;
  }

  const nextMark: ChecklistMark = currentMark === selectedMark ? "neutral" : selectedMark;
  next[category][value] = nextMark;

  if (category === "position" && nextMark === "neutral" && POSITION_CHILDREN[value]) {
    clearExplicitYes(next.position, POSITION_CHILDREN[value]);
  }

  if (nextMark === "yes") reconcileExplicitYes(next, category, value);
  if (nextMark === "no") reconcileExplicitNo(next, category, value);

  return next;
}

export function deriveChecklistState(explicit: ExplicitChecklistState): DerivedChecklistState {
  const derived = createEmptyChecklist();
  let changed = true;
  let pass = 0;

  const getMark = (category: ChecklistRecordCategory, value: string): ChecklistMark => {
    const explicitMark = explicit[category][value] ?? "neutral";
    return explicitMark !== "neutral" ? explicitMark : (derived[category][value] ?? "neutral");
  };

  const setDerived = (category: ChecklistRecordCategory, value: string, mark: SelectableMark) => {
    if ((explicit[category][value] ?? "neutral") !== "neutral") return;
    const current = derived[category][value] ?? "neutral";
    if (current !== "neutral") return;
    derived[category][value] = mark;
    changed = true;
  };

  while (changed && pass < 100) {
    changed = false;
    pass += 1;

    propagatePositions(getMark, setDerived);
    propagateGeography(getMark, setDerived);
    EXCLUSIVE_GROUPS.forEach(({ category, values }) =>
      propagateExclusiveGroup(category, values, getMark, setDerived),
    );
    propagateExclusiveGroup("position", ["F", "D", "G"], getMark, setDerived);
  }

  return derived;
}

export function resolveChecklistMark(
  explicitMark: ChecklistMark = "neutral",
  derivedMark: ChecklistMark = "neutral",
): ResolvedChecklistMark {
  if (explicitMark !== "neutral") return { mark: explicitMark, source: "explicit" };
  if (derivedMark !== "neutral") return { mark: derivedMark, source: "derived" };
  return { mark: "neutral", source: "neutral" };
}

export function getEffectiveChecklistState(
  explicit: ExplicitChecklistState,
  derived: DerivedChecklistState,
): ChecklistState {
  return {
    position: mergeMarkRecords(explicit.position, derived.position),
    team: mergeMarkRecords(explicit.team, derived.team),
    conference: mergeMarkRecords(explicit.conference, derived.conference),
    division: mergeMarkRecords(explicit.division, derived.division),
    hand: mergeMarkRecords(explicit.hand, derived.hand),
    nationality: mergeMarkRecords(explicit.nationality, derived.nationality),
    other: explicit.other.map((item) => ({ ...item })),
  };
}

function propagatePositions(
  getMark: (category: ChecklistRecordCategory, value: string) => ChecklistMark,
  setDerived: (category: ChecklistRecordCategory, value: string, mark: SelectableMark) => void,
) {
  POSITION_VALUES.forEach((value) => {
    const mark = getMark("position", value);
    if (mark === "yes") {
      const compatible = new Set(POSITION_COMPATIBILITY[value] ?? [value]);
      POSITION_VALUES.forEach((otherValue) => {
        if (!compatible.has(otherValue)) setDerived("position", otherValue, "no");
      });
      const parent = POSITION_PARENT[value];
      if (parent) setDerived("position", parent, "yes");
    }

    if (mark === "no" && value === "F") {
      ["C", "LW", "RW"].forEach((child) => setDerived("position", child, "no"));
    }
    if (mark === "no" && value === "D") {
      ["LD", "RD"].forEach((child) => setDerived("position", child, "no"));
    }
  });
}

function propagateGeography(
  getMark: (category: ChecklistRecordCategory, value: string) => ChecklistMark,
  setDerived: (category: ChecklistRecordCategory, value: string, mark: SelectableMark) => void,
) {
  CONFERENCE_OPTIONS.forEach(({ value: conference }) => {
    const mark = getMark("conference", conference);
    TEAM_GROUPS.forEach((group) => {
      if (mark === "yes" && group.conference !== conference) {
        setDerived("division", group.label, "no");
        group.teams.forEach((team) => setDerived("team", team.value, "no"));
      }
      if (mark === "no" && group.conference === conference) {
        setDerived("division", group.label, "no");
        group.teams.forEach((team) => setDerived("team", team.value, "no"));
      }
    });
  });

  DIVISION_OPTIONS.forEach(({ value: division }) => {
    const mark = getMark("division", division);
    const conference = DIVISION_TO_CONFERENCE[division];
    if (mark === "yes") {
      setDerived("conference", conference, "yes");
      TEAM_GROUPS.forEach((group) => {
        if (group.label !== division) {
          group.teams.forEach((team) => setDerived("team", team.value, "no"));
        }
      });
    }
    if (mark === "no") {
      const group = TEAM_GROUPS.find((item) => item.label === division);
      group?.teams.forEach((team) => setDerived("team", team.value, "no"));
    }
  });

  TEAM_OPTIONS.forEach(({ value: team }) => {
    if (getMark("team", team) !== "yes") return;
    const division = TEAM_TO_DIVISION[team];
    if (division) setDerived("division", division, "yes");
  });
}

function propagateExclusiveGroup(
  category: ChecklistRecordCategory,
  values: readonly string[],
  getMark: (category: ChecklistRecordCategory, value: string) => ChecklistMark,
  setDerived: (category: ChecklistRecordCategory, value: string, mark: SelectableMark) => void,
) {
  const yesValues = values.filter((value) => getMark(category, value) === "yes");
  if (yesValues.length > 0) {
    values.forEach((value) => {
      if (!yesValues.includes(value)) setDerived(category, value, "no");
    });
    return;
  }

  const remainingValues = values.filter((value) => getMark(category, value) !== "no");
  if (remainingValues.length === 1) setDerived(category, remainingValues[0], "yes");
}

function reconcileExplicitYes(
  state: ExplicitChecklistState,
  category: ChecklistRecordCategory,
  value: string,
) {
  const exclusiveGroup = EXCLUSIVE_GROUPS.find((group) => group.category === category);
  if (exclusiveGroup) clearOtherExplicitYes(state[category], exclusiveGroup.values, value);

  if (category === "position") {
    const compatible = new Set(POSITION_COMPATIBILITY[value] ?? [value]);
    POSITION_VALUES.forEach((position) => {
      if (!compatible.has(position) && state.position[position] === "yes") {
        state.position[position] = "neutral";
      }
    });
    const parent = POSITION_PARENT[value];
    if (parent && state.position[parent] === "no") state.position[parent] = "neutral";
  }

  if (category === "team") {
    const division = TEAM_TO_DIVISION[value];
    if (!division) return;
    clearOtherExplicitYes(
      state.division,
      DIVISION_OPTIONS.map((option) => option.value),
      division,
    );
    if (state.division[division] === "no") state.division[division] = "neutral";
    reconcileConferenceRequirement(state, DIVISION_TO_CONFERENCE[division]);
  }

  if (category === "division") {
    TEAM_OPTIONS.forEach((team) => {
      if (TEAM_TO_DIVISION[team.value] !== value && state.team[team.value] === "yes") {
        state.team[team.value] = "neutral";
      }
    });
    reconcileConferenceRequirement(
      state,
      DIVISION_TO_CONFERENCE[value as keyof typeof DIVISION_TO_CONFERENCE],
    );
  }

  if (category === "conference") {
    TEAM_GROUPS.forEach((group) => {
      if (group.conference === value) return;
      if (state.division[group.label] === "yes") state.division[group.label] = "neutral";
      group.teams.forEach((team) => {
        if (state.team[team.value] === "yes") state.team[team.value] = "neutral";
      });
    });
  }
}

function reconcileExplicitNo(
  state: ExplicitChecklistState,
  category: ChecklistRecordCategory,
  value: string,
) {
  if (category === "position" && value === "F") {
    clearExplicitYes(state.position, ["C", "LW", "RW"]);
  }
  if (category === "position" && value === "D") {
    clearExplicitYes(state.position, ["LD", "RD"]);
  }

  if (category === "division") {
    TEAM_OPTIONS.forEach((team) => {
      if (TEAM_TO_DIVISION[team.value] === value && state.team[team.value] === "yes") {
        state.team[team.value] = "neutral";
      }
    });
  }

  if (category === "conference") {
    TEAM_GROUPS.forEach((group) => {
      if (group.conference !== value) return;
      if (state.division[group.label] === "yes") state.division[group.label] = "neutral";
      group.teams.forEach((team) => {
        if (state.team[team.value] === "yes") state.team[team.value] = "neutral";
      });
    });
  }
}

function reconcileConferenceRequirement(state: ExplicitChecklistState, requiredConference: string) {
  CONFERENCE_OPTIONS.forEach(({ value }) => {
    if (value !== requiredConference && state.conference[value] === "yes") {
      state.conference[value] = "neutral";
    }
  });
  if (state.conference[requiredConference] === "no") {
    state.conference[requiredConference] = "neutral";
  }
}

function clearOtherExplicitYes(
  record: Record<string, ChecklistMark>,
  values: readonly string[],
  selectedValue: string,
) {
  values.forEach((value) => {
    if (value !== selectedValue && record[value] === "yes") record[value] = "neutral";
  });
}

function clearExplicitYes(record: Record<string, ChecklistMark>, values: readonly string[]) {
  values.forEach((value) => {
    if (record[value] === "yes") record[value] = "neutral";
  });
}

function cloneChecklistState(state: ExplicitChecklistState): ExplicitChecklistState {
  return {
    position: { ...state.position },
    team: { ...state.team },
    conference: { ...state.conference },
    division: { ...state.division },
    hand: { ...state.hand },
    nationality: { ...state.nationality },
    other: state.other.map((item) => ({ ...item })),
  };
}

function mergeMarkRecords(
  explicit: Record<string, ChecklistMark>,
  derived: Record<string, ChecklistMark>,
): Record<string, ChecklistMark> {
  const values = new Set([...Object.keys(explicit), ...Object.keys(derived)]);
  return Object.fromEntries(
    Array.from(values, (value) => [
      value,
      resolveChecklistMark(explicit[value], derived[value]).mark,
    ]),
  );
}
