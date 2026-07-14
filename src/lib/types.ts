export type ChecklistMark = "neutral" | "yes" | "no";

export interface ChecklistItemState {
  id: string;
  label: string;
  mark: ChecklistMark;
}

export interface ChecklistState {
  position: Record<string, ChecklistMark>;
  team: Record<string, ChecklistMark>;
  conference: Record<string, ChecklistMark>;
  division: Record<string, ChecklistMark>;
  hand: Record<string, ChecklistMark>;
  role: Record<string, ChecklistMark>;
  nationality: Record<string, ChecklistMark>;
  age: Record<string, ChecklistMark>;
  jerseyNumber: Record<string, ChecklistMark>;
  other: ChecklistItemState[];
}

export type ExplicitChecklistState = ChecklistState;
export type DerivedChecklistState = ChecklistState;
export type ChecklistRecordCategory = Exclude<keyof ChecklistState, "other">;
export type ChecklistMarkSource = "neutral" | "explicit" | "derived";

export interface ResolvedChecklistMark {
  mark: ChecklistMark;
  source: ChecklistMarkSource;
}

export interface Opponent {
  id: string;
  name: string;
  explicitChecklist: ExplicitChecklistState;
}

export interface SavedSession {
  id: string;
  name: string;
  opponents: Opponent[];
  createdAt: string;
  updatedAt: string;
}

export interface GoalieStats {
  gamesPlayed: number | string;
  wins: number | string;
  losses: number | string;
  savePercentage: number | string;
  goalsAgainstAverage: number | string;
  shutouts: number | string;
}

export interface NHLPlayer {
  id: number;
  fullName: string;
  team: string;
  conference: string;
  division: string;
  position: string;
  jerseyNumber: number | string;
  shootsCatches: string;
  previousTeams: string;
  height: string;
  weight: string;
  age: number | string;
  birthDate: string;
  birthCity: string;
  birthCountry: string;
  gamesPlayed: number | string;
  goals: number | string;
  assists: number | string;
  points: number | string;
  plusMinus: number | string;
  penaltyMinutes: number | string;
  goalieStats?: GoalieStats;
}
