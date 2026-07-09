import type { DeductionQuestionType, DeductionRow, Opponent, SavedSession } from "./types";

const KEY = "nhl-guess-helper:v1";
const SESSIONS_KEY = "nhl-guessing-helper-sessions";
const DEFAULT_QUESTION_TYPE: DeductionQuestionType = "position";

export function loadOpponents(): Opponent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.opponents)) {
      return normalizeOpponents(parsed.opponents);
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

export function loadSavedSessions(): SavedSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const sessions = Array.isArray(parsed)
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
  const nextSessions = loadSavedSessions().filter((session) => session.id !== sessionId);
  saveSavedSessions(nextSessions);
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

function normalizeOpponents(value: unknown): Opponent[] {
  if (!Array.isArray(value)) return [];
  return value.map(normalizeOpponent).filter((opponent): opponent is Opponent => Boolean(opponent));
}

function saveSavedSessions(sessions: SavedSession[]): void {
  try {
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify({ sessions }));
  } catch {
    // ignore
  }
}

function findSessionIndex(sessions: SavedSession[], sessionId: string | undefined, name: string) {
  const lowerName = name.toLowerCase();
  const byId = sessionId ? sessions.findIndex((session) => session.id === sessionId) : -1;
  if (byId >= 0) return byId;
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
    rows?: unknown;
  };
  const name = typeof raw.name === "string" && raw.name.trim() ? raw.name : "Opponent";
  const id = typeof raw.id === "string" && raw.id ? raw.id : makeId();
  const rows = Array.isArray(raw.rows) ? raw.rows.map(normalizeRow).filter(Boolean) : [];

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
