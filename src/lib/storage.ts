import type { DeductionQuestionType, DeductionRow, Opponent } from "./types";

const KEY = "nhl-guess-helper:v1";
const DEFAULT_QUESTION_TYPE: DeductionQuestionType = "position";

export function loadOpponents(): Opponent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.opponents)) {
      return parsed.opponents.map(normalizeOpponent).filter(Boolean) as Opponent[];
    }
    return [];
  } catch {
    return [];
  }
}

export function saveOpponents(opponents: Opponent[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ opponents }));
  } catch {
    // ignore
  }
}

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function makeEmptyDeductionRow(): DeductionRow {
  return {
    id: makeId(),
    questionType: DEFAULT_QUESTION_TYPE,
    answer: "",
  };
}

function normalizeOpponent(value: unknown): Opponent | null {
  if (!value || typeof value !== "object") return null;

  const raw = value as {
    id?: unknown;
    name?: unknown;
    rows?: unknown;
  };
  const name = typeof raw.name === "string" && raw.name.trim() ? raw.name : "Opponent";
  const id = typeof raw.id === "string" && raw.id ? raw.id : makeId();
  const rows = Array.isArray(raw.rows)
    ? raw.rows.map(normalizeRow).filter(Boolean)
    : [];

  return {
    id,
    name,
    rows: rows.length > 0 ? (rows as DeductionRow[]) : [makeEmptyDeductionRow()],
  };
}

function normalizeRow(value: unknown): DeductionRow | null {
  if (!value || typeof value !== "object") return null;

  const raw = value as {
    id?: unknown;
    questionType?: unknown;
    customQuestionText?: unknown;
    answer?: unknown;
  };

  if (!isDeductionQuestionType(raw.questionType)) return null;

  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : makeId(),
    questionType: raw.questionType,
    customQuestionText:
      typeof raw.customQuestionText === "string" ? raw.customQuestionText : undefined,
    answer: typeof raw.answer === "string" ? raw.answer : "",
  };
}

function isDeductionQuestionType(value: unknown): value is DeductionQuestionType {
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
