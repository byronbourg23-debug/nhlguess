import type { NHLPlayer, GoalieStats } from "./types";

export interface SearchResult {
  playerId: string;
  name: string;
  teamAbbrev?: string;
  positionCode?: string;
}

export async function searchPlayers(term: string): Promise<SearchResult[]> {
  const url = `https://search.d3.nhle.com/api/v1/search/player?culture=en-us&limit=20&q=${encodeURIComponent(
    term
  )}&active=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("search failed");
  const data = (await res.json()) as Array<{
    playerId: string;
    name: string;
    teamAbbrev?: string;
    positionCode?: string;
  }>;
  return data.map((p) => ({
    playerId: p.playerId,
    name: p.name,
    teamAbbrev: p.teamAbbrev,
    positionCode: p.positionCode,
  }));
}

export async function getPlayerDetails(playerId: string | number): Promise<any> {
  const id = String(playerId).trim();

  if (!/^\d+$/.test(id)) {
    throw new Error("invalid player id");
  }

  const res = await fetch(`/api/nhl/player/${id}`);
  if (!res.ok) throw new Error("details failed");
  return res.json();
}

const NA = "N/A" as const;

function pick<T>(v: T | undefined | null, fallback: any = NA): T | typeof NA {
  return v === undefined || v === null || v === "" ? fallback : v;
}

function calcAge(birthDate?: string): number | string {
  if (!birthDate) return NA;
  const b = new Date(birthDate);
  if (isNaN(b.getTime())) return NA;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}

function fmtHeight(inches?: number): string {
  if (!inches) return NA;
  const f = Math.floor(inches / 12);
  const i = inches % 12;
  return `${f}'${i}"`;
}

export function normalizePlayerData(raw: any): NHLPlayer {
  const fullName =
    [raw?.firstName?.default, raw?.lastName?.default].filter(Boolean).join(" ") || NA;
  const team =
    [raw?.fullTeamName?.default, raw?.teamAbbrev].find((v) => v) || NA;
  const position = raw?.position ?? NA;
  const sub = raw?.featuredStats?.regularSeason?.subSeason ?? {};
  const career = raw?.careerTotals?.regularSeason ?? {};
  const stats = { ...career, ...sub };

  const isGoalie = position === "G";

  const player: NHLPlayer = {
    id: raw?.playerId ?? 0,
    fullName,
    team: typeof team === "string" ? team : NA,
    position: pick(position) as string,
    jerseyNumber: pick(raw?.sweaterNumber),
    shootsCatches: pick(raw?.shootsCatches),
    height: fmtHeight(raw?.heightInInches),
    weight: raw?.weightInPounds ? `${raw.weightInPounds} lbs` : NA,
    age: calcAge(raw?.birthDate),
    birthDate: pick(raw?.birthDate) as string,
    birthCity: pick(raw?.birthCity?.default) as string,
    birthCountry: pick(raw?.birthCountry) as string,
    gamesPlayed: pick(stats.gamesPlayed),
    goals: pick(stats.goals),
    assists: pick(stats.assists),
    points: pick(stats.points),
    plusMinus: pick(stats.plusMinus),
    penaltyMinutes: pick(stats.pim),
  };

  if (isGoalie) {
    const gs: GoalieStats = {
      gamesPlayed: pick(stats.gamesPlayed),
      wins: pick(stats.wins),
      losses: pick(stats.losses),
      savePercentage: pick(stats.savePctg),
      goalsAgainstAverage: pick(stats.goalsAgainstAvg),
      shutouts: pick(stats.shutouts),
    };
    player.goalieStats = gs;
  }

  return player;
}
