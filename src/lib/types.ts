export type ClueType = "known" | "ruled_out" | "maybe";

export interface Clue {
  id: string;
  text: string;
  type: ClueType;
  createdAt: number;
}

export interface Opponent {
  id: string;
  name: string;
  clues: Clue[];
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
  position: string;
  jerseyNumber: number | string;
  shootsCatches: string;
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
