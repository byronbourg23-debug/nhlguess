import {
  AGE_OPTIONS,
  CONFERENCE_OPTIONS,
  DIVISION_OPTIONS,
  HAND_OPTIONS,
  JERSEY_NUMBER_OPTIONS,
  NATIONALITY_OPTIONS,
  POSITION_OPTIONS,
  ROLE_OPTIONS,
  TEAM_OPTIONS,
  createEmptyChecklist,
  isChecklistMark,
  type ChecklistOption,
} from "./checklist";
import type {
  ChecklistItemState,
  ChecklistMark,
  Opponent,
  OpponentChecklist,
  SavedSession,
} from "./types";

const KEY = "nhl-guess-helper:v1";
const SESSIONS_KEY = "nhl-guessing-helper-sessions";

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
    window.localStorage.setItem(KEY, JSON.stringify({ opponents }));
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
    checklist?: unknown;
    rows?: unknown;
  };
  const name = typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : "Opponent";

  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : makeId(),
    name,
    checklist: raw.checklist ? normalizeChecklist(raw.checklist) : migrateLegacyRows(raw.rows),
  };
}

function normalizeChecklist(value: unknown): OpponentChecklist {
  const empty = createEmptyChecklist();
  if (!value || typeof value !== "object") return empty;

  const raw = value as Partial<Record<keyof OpponentChecklist, unknown>>;
  return {
    position: normalizeMarkRecord(raw.position, empty.position),
    team: normalizeMarkRecord(raw.team, empty.team),
    conference: normalizeMarkRecord(raw.conference, empty.conference),
    division: normalizeMarkRecord(raw.division, empty.division),
    hand: normalizeMarkRecord(raw.hand, empty.hand),
    role: normalizeMarkRecord(raw.role, empty.role),
    nationality: normalizeMarkRecord(raw.nationality, empty.nationality, true),
    age: normalizeMarkRecord(raw.age, empty.age),
    jerseyNumber: normalizeMarkRecord(raw.jerseyNumber, empty.jerseyNumber),
    other: normalizeCustomItems(raw.other),
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

function migrateLegacyRows(value: unknown): OpponentChecklist {
  const checklist = createEmptyChecklist();
  if (!Array.isArray(value)) return checklist;

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
        checklist.role.top6 = legacyYesNoMark(row.answer);
        break;
      case "top4":
        checklist.role.top4 = legacyYesNoMark(row.answer);
        break;
      case "country":
        migrateNationality(checklist.nationality, row.answer);
        break;
      case "age": {
        const range = legacyAgeRange(row.answer);
        if (range) checklist.age[range] = "yes";
        break;
      }
      case "jerseyNumber": {
        const range = legacyJerseyRange(row.answer);
        if (range) checklist.jerseyNumber[range] = "yes";
        break;
      }
      case "other":
        checklist.other.push(migrateLegacyOther(row));
        break;
    }
  });

  return checklist;
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

function legacyAgeRange(answer: string): string | null {
  const direct = AGE_OPTIONS.find(
    (option) =>
      option.value.toLowerCase() === answer.trim().toLowerCase() ||
      option.label.toLowerCase() === answer.trim().toLowerCase(),
  );
  if (direct) return direct.value;

  const age = Number.parseInt(answer, 10);
  if (!Number.isFinite(age)) return null;
  if (age < 20) return "under-20";
  if (age <= 24) return "20-24";
  if (age <= 29) return "25-29";
  if (age <= 34) return "30-34";
  return "35-plus";
}

function legacyJerseyRange(answer: string): string | null {
  const direct = JERSEY_NUMBER_OPTIONS.find(
    (option) =>
      option.value.toLowerCase() === answer.trim().toLowerCase() ||
      option.label.toLowerCase() === answer.trim().toLowerCase(),
  );
  if (direct) return direct.value;

  const number = Number.parseInt(answer, 10);
  if (!Number.isFinite(number) || number < 0 || number > 99) return null;
  return `${Math.floor(number / 10) * 10}-${Math.floor(number / 10) * 10 + 9}`;
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
