export type DeductionQuestionType =
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

export interface DeductionRow {
  id: string;
  questionType: DeductionQuestionType;
  customQuestionText?: string;
  answer: string;
}

export interface Opponent {
  id: string;
  name: string;
  rows: DeductionRow[];
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
