import type { Opponent } from "./types";

const KEY = "nhl-guess-helper:v1";

export function loadOpponents(): Opponent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.opponents)) return parsed.opponents;
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
