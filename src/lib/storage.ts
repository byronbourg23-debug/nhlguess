import {
  CONFERENCE_OPTIONS,
  DIVISION_OPTIONS,
  HAND_OPTIONS,
  NATIONALITY_OPTIONS,
  POSITION_OPTIONS,
  TEAM_OPTIONS,
  createEmptyChecklist,
  isChecklistMark,
  type ChecklistOption,
} from "./checklist";
import type {
  ChecklistItemState,
  ChecklistMark,
  ExplicitChecklistState,
  Opponent,
  SavedSession,
} from "./types";

const KEY = "nhl-guess-helper:v1";
const SESSIONS_KEY = "nhl-guessing-helper-sessions";
const LEGACY_ROLE_OPTIONS = [
  { value: "top6", label: "Top 6" },
  { value: "top4", label: "Top 4" },
] as const;
const LEGACY_AGE_OPTIONS = [
  { value: "under-20", label: "Under 20" },
  { value: "20-24", label: "20-24" },
  { value: "25-29", label: "25-29" },
  { value: "30-34", label: "30-34" },
  { value: "35-plus", label: "35 and older" },
] as const;
const LEGACY_JERSEY_NUMBER_OPTIONS = [
  { value: "0-9", label: "0-9" },
  { value: "10-19", label: "10-19" },
  { value: "20-29", label: "20-29" },
  { value: "30-39", label: "30-39" },
  { value: "40-49", label: "40-49" },
  { value: "50-59", label: "50-59" },
  { value: "60-69", label: "60-69" },
  { value: "70-79", label: "70-79" },
  { value: "80-89", label: "80-89" },
  { value: "90-99", label: "90-99" },
] as const;

type NormalizedOpponentData = {
  explicitChecklist: ExplicitChecklistState;
  ageText: string;
  jerseyNumberText: string;
};

type LegacyQuestionType =
  | "position"
  | "team"
  | "conference"
  | "division"
  | "hand"
  | "top6"
  | "top4"
  | "country"
  | "age"
  | "jerseyNumber"
  | "other";

type LegacyDeductionRow = {
  questionType: LegacyQuestionType;
  customQuestionText?: string;
  answer: string;
};

export function loadOpponents(): Opponent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed && Array.isArray(parsed.opponents) ? normalizeOpponents(parsed.opponents) : [];
  } catch {
    return [];
  }
}

export function saveOpponents(opponents: Opponent[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ opponents: normalizeOpponents(opponents) }));
  } catch {
    // localStorage can be unavailable or full; the active UI should keep working.
  }
}

export function loadSavedSessions(): SavedSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const sessions: unknown[] = Array.isArray(parsed)
      ? parsed
      : parsed && Array.isArray(parsed.sessions)
        ? parsed.sessions
        : [];

    return sessions
      .map(normalizeSavedSession)
      .filter((session): session is SavedSession => Boolean(session))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

export function saveGameSession({
  sessionId,
  name,
  opponents,
}: {
  sessionId?: string;
  name: string;
  opponents: Opponent[];
}): SavedSession | null {
  if (typeof window === "undefined") return null;

  const trimmedName = name.trim();
  if (!trimmedName) return null;

  const sessions = loadSavedSessions();
  const now = new Date().toISOString();
  const existingIndex = findSessionIndex(sessions, sessionId, trimmedName);
  const existing = existingIndex >= 0 ? sessions[existingIndex] : null;
  const savedSession: SavedSession = {
    id: existing?.id ?? makeId(),
    name: trimmedName,
    opponents: normalizeOpponents(opponents),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const nextSessions =
    existingIndex >= 0
      ? sessions.map((session, index) => (index === existingIndex ? savedSession : session))
      : [savedSession, ...sessions];

  saveSavedSessions(nextSessions);
  return savedSession;
}

export function deleteSavedSession(sessionId: string): void {
  if (typeof window === "undefined") return;
  saveSavedSessions(loadSavedSessions().filter((session) => session.id !== sessionId));
}

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function normalizeOpponents(value: unknown): Opponent[] {
  if (!Array.isArray(value)) return [];
  return value.map(normalizeOpponent).filter((opponent): opponent is Opponent => Boolean(opponent));
}

function saveSavedSessions(sessions: SavedSession[]): void {
  try {
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify({ sessions }));
  } catch {
    // localStorage can be unavailable or full; the active UI should keep working.
  }
}

function findSessionIndex(sessions: SavedSession[], sessionId: string | undefined, name: string) {
  const byId = sessionId ? sessions.findIndex((session) => session.id === sessionId) : -1;
  if (byId >= 0) return byId;
  const lowerName = name.toLowerCase();
  return sessions.findIndex((session) => session.name.toLowerCase() === lowerName);
}

function normalizeSavedSession(value: unknown): SavedSession | null {
  if (!value || typeof value !== "object") return null;

  const raw = value as {
    id?: unknown;
    name?: unknown;
    opponents?: unknown;
    createdAt?: unknown;
    updatedAt?: unknown;
  };
  const name = typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : "";
  if (!name) return null;

  const createdAt = normalizeDate(raw.createdAt);
  const updatedAt = normalizeDate(raw.updatedAt) ?? createdAt ?? new Date().toISOString();

  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : makeId(),
    name,
    opponents: normalizeOpponents(raw.opponents),
    createdAt: createdAt ?? updatedAt,
    updatedAt,
  };
}

function normalizeDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : value;
}

function normalizeOpponent(value: unknown): Opponent | null {
  if (!value || typeof value !== "object") return null;

  const raw = value as {
    id?: unknown;
    name?: unknown;
    explicitChecklist?: unknown;
    checklist?: unknown;
    rows?: unknown;
    ageText?: unknown;
    jerseyNumberText?: unknown;
  };
  const name = typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : "Opponent";
  const normalized = raw.explicitChecklist
    ? normalizeChecklist(raw.explicitChecklist)
    : raw.checklist
      ? normalizeChecklist(raw.checklist)
      : migrateLegacyRows(raw.rows);

  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : makeId(),
    name,
    explicitChecklist: normalized.explicitChecklist,
    ageText: normalizeClueText(raw.ageText) || normalized.ageText,
    jerseyNumberText: normalizeClueText(raw.jerseyNumberText) || normalized.jerseyNumberText,
  };
}

function normalizeChecklist(value: unknown): NormalizedOpponentData {
  const empty = createEmptyChecklist();
  if (!value || typeof value !== "object") {
    return { explicitChecklist: empty, ageText: "", jerseyNumberText: "" };
  }

  const raw = value as Record<string, unknown>;
  const other = normalizeCustomItems(raw.other);
  migrateLegacyRoleMarks(other, raw.role);

  return {
    explicitChecklist: {
      position: normalizeMarkRecord(raw.position, empty.position),
      team: normalizeMarkRecord(raw.team, empty.team),
      conference: normalizeMarkRecord(raw.conference, empty.conference),
      division: normalizeMarkRecord(raw.division, empty.division),
      hand: normalizeMarkRecord(raw.hand, empty.hand),
      nationality: normalizeMarkRecord(raw.nationality, empty.nationality, true),
      other,
    },
    ageText: migrateLegacyMarkText(raw.age, LEGACY_AGE_OPTIONS),
    jerseyNumberText: migrateLegacyMarkText(raw.jerseyNumber, LEGACY_JERSEY_NUMBER_OPTIONS),
  };
}

function normalizeMarkRecord(
  value: unknown,
  defaults: Record<string, ChecklistMark>,
  allowCustom = false,
): Record<string, ChecklistMark> {
  const result = { ...defaults };
  if (!value || typeof value !== "object" || Array.isArray(value)) return result;

  Object.entries(value).forEach(([key, mark]) => {
    const normalizedKey = key.trim();
    if (normalizedKey && (allowCustom || normalizedKey in defaults) && isChecklistMark(mark)) {
      result[normalizedKey] = mark;
    }
  });
  return result;
}

function normalizeCustomItems(value: unknown): ChecklistItemState[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item): ChecklistItemState | null => {
      if (!item || typeof item !== "object") return null;
      const raw = item as { id?: unknown; label?: unknown; mark?: unknown };
      const label = typeof raw.label === "string" ? raw.label.trim() : "";
      if (!label) return null;
      return {
        id: typeof raw.id === "string" && raw.id ? raw.id : makeId(),
        label,
        mark: isChecklistMark(raw.mark) ? raw.mark : "neutral",
      };
    })
    .filter((item): item is ChecklistItemState => Boolean(item));
}

function migrateLegacyRoleMarks(items: ChecklistItemState[], value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;

  const marks = value as Record<string, unknown>;
  LEGACY_ROLE_OPTIONS.forEach((option) => {
    const mark = marks[option.value];
    if (mark === "yes" || mark === "no") upsertOtherItem(items, option.label, mark);
  });
}

function migrateLegacyMarkText(value: unknown, options: readonly ChecklistOption[]): string {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";

  const marks = value as Record<string, unknown>;
  const yesLabels = options
    .filter((option) => marks[option.value] === "yes")
    .map((option) => option.label);
  const noLabels = options
    .filter((option) => marks[option.value] === "no")
    .map((option) => option.label);

  return [yesLabels.join(", "), noLabels.length ? `Not ${noLabels.join(", ")}` : ""]
    .filter(Boolean)
    .join("; ");
}

function normalizeClueText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function upsertOtherItem(
  items: ChecklistItemState[],
  label: string,
  mark: Exclude<ChecklistMark, "neutral">,
) {
  const existing = items.find((item) => item.label.toLowerCase() === label.toLowerCase());
  if (existing) {
    if (existing.mark === "neutral") existing.mark = mark;
    return;
  }
  items.push({ id: makeId(), label, mark });
}

function migrateLegacyRows(value: unknown): NormalizedOpponentData {
  const checklist = createEmptyChecklist();
  let ageText = "";
  let jerseyNumberText = "";
  if (!Array.isArray(value)) {
    return { explicitChecklist: checklist, ageText, jerseyNumberText };
  }

  value.map(normalizeLegacyRow).forEach((row) => {
    if (!row || !row.answer.trim()) return;

    switch (row.questionType) {
      case "position":
        markMatchingOption(checklist.position, POSITION_OPTIONS, row.answer);
        break;
      case "team":
        markMatchingOption(checklist.team, TEAM_OPTIONS, row.answer);
        break;
      case "conference":
        markMatchingOption(checklist.conference, CONFERENCE_OPTIONS, row.answer);
        break;
      case "division":
        markMatchingOption(
          checklist.division,
          DIVISION_OPTIONS,
          row.answer.toLowerCase() === "metro" ? "Metropolitan" : row.answer,
        );
        break;
      case "hand":
        markMatchingOption(checklist.hand, HAND_OPTIONS, normalizeLegacyHand(row.answer));
        break;
      case "top6":
        migrateLegacyRoleRow(checklist.other, "Top 6", row.answer);
        break;
      case "top4":
        migrateLegacyRoleRow(checklist.other, "Top 4", row.answer);
        break;
      case "country":
        migrateNationality(checklist.nationality, row.answer);
        break;
      case "age":
        ageText = row.answer.trim();
        break;
      case "jerseyNumber":
        jerseyNumberText = row.answer.trim();
        break;
      case "other": {
        const item = migrateLegacyOther(row);
        const duplicate = checklist.other.find(
          (existing) => existing.label.toLowerCase() === item.label.toLowerCase(),
        );
        if (!duplicate) checklist.other.push(item);
        else if (duplicate.mark === "neutral") duplicate.mark = item.mark;
        break;
      }
    }
  });

  return { explicitChecklist: checklist, ageText, jerseyNumberText };
}

function normalizeLegacyRow(value: unknown): LegacyDeductionRow | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as {
    questionType?: unknown;
    customQuestionText?: unknown;
    answer?: unknown;
  };
  if (!isLegacyQuestionType(raw.questionType)) return null;
  return {
    questionType: raw.questionType,
    customQuestionText:
      typeof raw.customQuestionText === "string" ? raw.customQuestionText : undefined,
    answer: typeof raw.answer === "string" ? raw.answer : "",
  };
}

function markMatchingOption(
  record: Record<string, ChecklistMark>,
  options: readonly ChecklistOption[],
  answer: string,
) {
  const normalized = answer.trim().toLowerCase();
  const option = options.find(
    (item) => item.value.toLowerCase() === normalized || item.label.toLowerCase() === normalized,
  );
  if (option) record[option.value] = "yes";
}

function migrateNationality(record: Record<string, ChecklistMark>, answer: string) {
  const normalized = answer.trim().toLowerCase();
  const known = NATIONALITY_OPTIONS.find(
    (item) => item.value.toLowerCase() === normalized || item.label.toLowerCase() === normalized,
  );
  if (known) {
    record[known.value] = "yes";
  } else if (answer.trim()) {
    record[answer.trim()] = "yes";
  }
}

function normalizeLegacyHand(answer: string) {
  const normalized = answer.trim().toLowerCase();
  if (normalized === "left") return "L";
  if (normalized === "right") return "R";
  return answer;
}

function legacyYesNoMark(answer: string): ChecklistMark {
  const normalized = answer.trim().toLowerCase();
  if (normalized === "yes") return "yes";
  if (normalized === "no") return "no";
  return "neutral";
}

function migrateLegacyRoleRow(items: ChecklistItemState[], label: string, answer: string) {
  const mark = legacyYesNoMark(answer);
  if (mark === "yes" || mark === "no") upsertOtherItem(items, label, mark);
}

function migrateLegacyOther(row: LegacyDeductionRow): ChecklistItemState {
  const question = row.customQuestionText?.trim() || "Other";
  const mark = legacyYesNoMark(row.answer);
  return {
    id: makeId(),
    label: mark === "neutral" && row.answer.trim() ? `${question}: ${row.answer.trim()}` : question,
    mark,
  };
}

function isLegacyQuestionType(value: unknown): value is LegacyQuestionType {
  return (
    value === "position" ||
    value === "team" ||
    value === "conference" ||
    value === "division" ||
    value === "hand" ||
    value === "top6" ||
    value === "top4" ||
    value === "country" ||
    value === "age" ||
    value === "jerseyNumber" ||
    value === "other"
  );
}
