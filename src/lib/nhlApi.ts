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

const TEAM_META: Record<string, { conference: string; division: string; names: string[] }> = {
  ANA: { conference: "West", division: "Pacific", names: ["Anaheim Ducks", "Ducks"] },
  BOS: { conference: "East", division: "Atlantic", names: ["Boston Bruins", "Bruins"] },
  BUF: { conference: "East", division: "Atlantic", names: ["Buffalo Sabres", "Sabres"] },
  CAR: { conference: "East", division: "Metro", names: ["Carolina Hurricanes", "Hurricanes"] },
  CBJ: { conference: "East", division: "Metro", names: ["Columbus Blue Jackets", "Blue Jackets"] },
  CGY: { conference: "West", division: "Pacific", names: ["Calgary Flames", "Flames"] },
  CHI: { conference: "West", division: "Central", names: ["Chicago Blackhawks", "Blackhawks"] },
  COL: { conference: "West", division: "Central", names: ["Colorado Avalanche", "Avalanche"] },
  DAL: { conference: "West", division: "Central", names: ["Dallas Stars", "Stars"] },
  DET: { conference: "East", division: "Atlantic", names: ["Detroit Red Wings", "Red Wings"] },
  EDM: { conference: "West", division: "Pacific", names: ["Edmonton Oilers", "Oilers"] },
  FLA: { conference: "East", division: "Atlantic", names: ["Florida Panthers", "Panthers"] },
  LAK: { conference: "West", division: "Pacific", names: ["Los Angeles Kings", "Kings"] },
  MIN: { conference: "West", division: "Central", names: ["Minnesota Wild", "Wild"] },
  MTL: { conference: "East", division: "Atlantic", names: ["Montreal Canadiens", "Canadiens"] },
  NJD: { conference: "East", division: "Metro", names: ["New Jersey Devils", "Devils"] },
  NSH: { conference: "West", division: "Central", names: ["Nashville Predators", "Predators"] },
  NYI: { conference: "East", division: "Metro", names: ["New York Islanders", "Islanders"] },
  NYR: { conference: "East", division: "Metro", names: ["New York Rangers", "Rangers"] },
  OTT: { conference: "East", division: "Atlantic", names: ["Ottawa Senators", "Senators"] },
  PHI: { conference: "East", division: "Metro", names: ["Philadelphia Flyers", "Flyers"] },
  PIT: { conference: "East", division: "Metro", names: ["Pittsburgh Penguins", "Penguins"] },
  SEA: { conference: "West", division: "Pacific", names: ["Seattle Kraken", "Kraken"] },
  SJS: { conference: "West", division: "Pacific", names: ["San Jose Sharks", "Sharks"] },
  STL: { conference: "West", division: "Central", names: ["St. Louis Blues", "Blues"] },
  TBL: { conference: "East", division: "Atlantic", names: ["Tampa Bay Lightning", "Lightning"] },
  TOR: { conference: "East", division: "Atlantic", names: ["Toronto Maple Leafs", "Maple Leafs"] },
  UTA: { conference: "West", division: "Central", names: ["Utah Mammoth", "Mammoth"] },
  VAN: { conference: "West", division: "Pacific", names: ["Vancouver Canucks", "Canucks"] },
  VGK: { conference: "West", division: "Pacific", names: ["Vegas Golden Knights", "Golden Knights"] },
  WPG: { conference: "West", division: "Central", names: ["Winnipeg Jets", "Jets"] },
  WSH: { conference: "East", division: "Metro", names: ["Washington Capitals", "Capitals"] },
};

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

function getTeamMeta(team: string, abbrev?: string) {
  if (abbrev && TEAM_META[abbrev]) return TEAM_META[abbrev];
  return Object.values(TEAM_META).find((meta) => meta.names.includes(team));
}

function getTeamName(value: any): string {
  return (
    value?.teamName?.default ??
    value?.teamCommonName?.default ??
    value?.teamPlaceName?.default ??
    value?.teamAbbrev ??
    ""
  );
}

function getPreviousTeams(raw: any, currentTeam: string, currentTeamAbbrev?: string): string {
  if (!Array.isArray(raw?.seasonTotals)) return NA;

  const currentNames = new Set([
    currentTeam,
    currentTeamAbbrev,
    ...(currentTeamAbbrev && TEAM_META[currentTeamAbbrev]
      ? TEAM_META[currentTeamAbbrev].names
      : []),
  ].filter(Boolean));

  const previousTeams = raw.seasonTotals
    .map(getTeamName)
    .filter((team: string) => team && !currentNames.has(team));

  return Array.from(new Set(previousTeams)).join(", ") || NA;
}

export function normalizePlayerData(raw: any): NHLPlayer {
  const fullName =
    [raw?.firstName?.default, raw?.lastName?.default].filter(Boolean).join(" ") || NA;
  const teamAbbrev = raw?.teamAbbrev;
  const team =
    [raw?.fullTeamName?.default, teamAbbrev].find((v) => v) || NA;
  const teamMeta = typeof team === "string" ? getTeamMeta(team, teamAbbrev) : undefined;
  const position = raw?.position ?? NA;
  const sub = raw?.featuredStats?.regularSeason?.subSeason ?? {};
  const career = raw?.careerTotals?.regularSeason ?? {};
  const stats = { ...career, ...sub };

  const isGoalie = position === "G";

  const player: NHLPlayer = {
    id: raw?.playerId ?? 0,
    fullName,
    team: typeof team === "string" ? team : NA,
    conference: pick(raw?.conference?.name ?? raw?.conferenceAbbrev ?? teamMeta?.conference) as string,
    division: pick(raw?.division?.name ?? raw?.divisionAbbrev ?? teamMeta?.division) as string,
    position: pick(position) as string,
    jerseyNumber: pick(raw?.sweaterNumber),
    shootsCatches: pick(raw?.shootsCatches),
    previousTeams: getPreviousTeams(raw, typeof team === "string" ? team : NA, teamAbbrev),
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
