import type { GoalieStats, NHLPlayer, PreviousTeamEntry } from "./types";

export interface SearchResult {
  playerId: string;
  name: string;
  teamAbbrev?: string;
  positionCode?: string;
}

interface LocalizedValue {
  default?: string;
}

interface StatTotals {
  gamesPlayed?: number;
  goals?: number;
  assists?: number;
  points?: number;
  plusMinus?: number;
  pim?: number;
  wins?: number;
  losses?: number;
  savePctg?: number;
  goalsAgainstAvg?: number;
  shutouts?: number;
}

interface TeamSeasonTotal {
  teamName?: LocalizedValue;
  teamCommonName?: LocalizedValue;
  teamPlaceName?: LocalizedValue;
  teamAbbrev?: string | LocalizedValue;
  leagueAbbrev?: string;
  leagueName?: LocalizedValue;
  league?: string | LocalizedValue;
  season?: number | string;
  sequence?: number;
  gameTypeId?: number;
}

interface NHLApiPlayer {
  playerId?: number;
  firstName?: LocalizedValue;
  lastName?: LocalizedValue;
  teamAbbrev?: string;
  fullTeamName?: LocalizedValue;
  conference?: { name?: string };
  conferenceAbbrev?: string;
  division?: { name?: string };
  divisionAbbrev?: string;
  position?: string;
  sweaterNumber?: number;
  shootsCatches?: string;
  seasonTotals?: TeamSeasonTotal[];
  heightInInches?: number;
  weightInPounds?: number;
  birthDate?: string;
  birthCity?: LocalizedValue;
  birthCountry?: string;
  featuredStats?: { regularSeason?: { subSeason?: StatTotals } };
  careerTotals?: { regularSeason?: StatTotals };
}

export async function searchPlayers(term: string): Promise<SearchResult[]> {
  const url = `https://search.d3.nhle.com/api/v1/search/player?culture=en-us&limit=20&q=${encodeURIComponent(
    term,
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

export async function getPlayerDetails(playerId: string | number): Promise<NHLApiPlayer> {
  const id = String(playerId).trim();

  if (!/^\d+$/.test(id)) {
    throw new Error("invalid player id");
  }

  const res = await fetch(`/api/nhl/player/${id}`);
  if (!res.ok) throw new Error("details failed");
  return res.json() as Promise<NHLApiPlayer>;
}

const NA = "N/A" as const;

const POSITION_LABELS: Readonly<Record<string, string>> = {
  c: "Center",
  center: "Center",
  l: "Left Wing",
  lw: "Left Wing",
  "left wing": "Left Wing",
  r: "Right Wing",
  rw: "Right Wing",
  "right wing": "Right Wing",
  f: "Forward",
  forward: "Forward",
  d: "Defense",
  defense: "Defense",
  ld: "Left Defense",
  "left defense": "Left Defense",
  rd: "Right Defense",
  "right defense": "Right Defense",
  g: "Goalie",
  goalie: "Goalie",
};

const NATION_LABELS: Readonly<Record<string, string>> = {
  AUT: "Austria",
  BLR: "Belarus",
  CAN: "Canada",
  CHE: "Switzerland",
  CZE: "Czechia",
  DEU: "Germany",
  DNK: "Denmark",
  EST: "Estonia",
  FIN: "Finland",
  FRA: "France",
  GBR: "United Kingdom",
  KAZ: "Kazakhstan",
  LTU: "Lithuania",
  LVA: "Latvia",
  NLD: "Netherlands",
  NOR: "Norway",
  POL: "Poland",
  RUS: "Russia",
  SVK: "Slovakia",
  SVN: "Slovenia",
  SWE: "Sweden",
  UKR: "Ukraine",
  USA: "United States",
};

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
  VGK: {
    conference: "West",
    division: "Pacific",
    names: ["Vegas Golden Knights", "Golden Knights"],
  },
  WPG: { conference: "West", division: "Central", names: ["Winnipeg Jets", "Jets"] },
  WSH: { conference: "East", division: "Metro", names: ["Washington Capitals", "Capitals"] },
};

function pick<T>(v: T | undefined | null, fallback: typeof NA = NA): T | typeof NA {
  return v === undefined || v === null || v === "" ? fallback : v;
}

function normalizePosition(value?: string): string {
  const normalized = value?.trim().toLowerCase();
  return normalized ? (POSITION_LABELS[normalized] ?? NA) : NA;
}

function normalizeNation(value?: string): string {
  const normalized = value?.trim();
  if (!normalized) return NA;
  return NATION_LABELS[normalized.toUpperCase()] ?? (normalized.length > 3 ? normalized : NA);
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

function getTeamName(value: TeamSeasonTotal): string {
  return (
    value?.teamName?.default ??
    value?.teamCommonName?.default ??
    value?.teamPlaceName?.default ??
    getTeamAbbrev(value) ??
    ""
  );
}

function getTeamAbbrev(value: TeamSeasonTotal): string {
  if (typeof value.teamAbbrev === "string") return value.teamAbbrev;
  return value.teamAbbrev?.default ?? "";
}

function getLeague(value: TeamSeasonTotal): string {
  if (typeof value.league === "string")
    return value.leagueAbbrev ?? value.leagueName?.default ?? value.league;
  return value.leagueAbbrev ?? value.leagueName?.default ?? value.league?.default ?? "";
}

function getCommonNhlTeamName(team: string, abbrev?: string): string | undefined {
  if (abbrev && TEAM_META[abbrev]) return TEAM_META[abbrev].names[1];
  const meta = Object.values(TEAM_META).find((m) => m.names.includes(team));
  return meta?.names[1];
}

function normalizeLeagueLabel(league: string): string {
  const normalized = league.trim();
  const upper = normalized.toUpperCase();

  const tournamentLabels: Record<string, string> = {
    WJC: "World Juniors",
    WJHC: "World Juniors",
    OLY: "Olympics",
    OLYMPICS: "Olympics",
    WCUP: "World Cup of Hockey",
    "WORLD CUP": "World Cup of Hockey",
    "WORLD CUP OF HOCKEY": "World Cup of Hockey",
    WC: "World Championship",
    WHC: "World Championship",
  };

  if (/^WJC(?:-|$)/.test(upper)) return "World Juniors";
  return tournamentLabels[upper] ?? normalized;
}

function isUsefulTeamLeague(label: string): boolean {
  return [
    "AHL",
    "ECHL",
    "OHL",
    "WHL",
    "QMJHL",
    "NCAA",
    "USHL",
    "USNTDP",
    "KHL",
    "SHL",
    "Liiga",
    "DEL",
    "NL",
  ].includes(label);
}

function isTournamentLeague(label: string): boolean {
  return ["World Juniors", "Olympics", "World Cup of Hockey", "World Championship"].includes(label);
}

function isNationalTeam(team: string, abbrev?: string): boolean {
  const value = team.toLowerCase();
  const code = abbrev?.toUpperCase();
  return (
    ["CAN", "USA", "EUR", "NA"].includes(code ?? "") ||
    /^team\s+/.test(value) ||
    ["canada", "united states", "usa", "north america", "europe"].includes(value)
  );
}

function formatNationalTeamName(team: string, abbrev?: string): string {
  const value = team.toLowerCase();
  const code = abbrev?.toUpperCase();
  if (code === "CAN" || value === "canada") return "Team Canada";
  if (code === "USA" || value === "usa" || value === "united states") return "Team USA";
  if (code === "NA" || value === "north america") return "Team North America";
  if (code === "EUR" || value === "europe") return "Team Europe";
  return team;
}

function normalizeSeason(value: TeamSeasonTotal["season"]): string {
  const season = String(value ?? "").trim();
  if (!season) return NA;
  if (/^\d{8}$/.test(season)) return `${season.slice(0, 4)}-${season.slice(-2)}`;
  return season;
}

function getSeasonSortValue(value: TeamSeasonTotal["season"]): number {
  const season = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(season) ? season : Number.MAX_SAFE_INTEGER;
}

function normalizePreviousTeam(
  value: TeamSeasonTotal,
  currentNames: Set<string>,
): PreviousTeamEntry | null {
  const team = getTeamName(value).trim();
  const abbrev = getTeamAbbrev(value).trim();
  const leagueLabel = normalizeLeagueLabel(getLeague(value));
  const nhlCommonName = getCommonNhlTeamName(team, abbrev);

  if (!team && !abbrev) return null;
  if (team.toUpperCase() === "PEAC" && !leagueLabel) return null;

  if (nhlCommonName) {
    if ([team, abbrev, nhlCommonName].some((name) => currentNames.has(name.toLowerCase()))) {
      return null;
    }
    return {
      year: normalizeSeason(value.season),
      team: nhlCommonName,
      league: leagueLabel || NA,
    };
  }

  if (isNationalTeam(team, abbrev)) {
    if (!isTournamentLeague(leagueLabel)) return null;
    return {
      year: normalizeSeason(value.season),
      team: formatNationalTeamName(team, abbrev),
      league: leagueLabel,
    };
  }

  if (!isUsefulTeamLeague(leagueLabel)) return null;

  return {
    year: normalizeSeason(value.season),
    team,
    league: leagueLabel,
  };
}

function getPreviousTeams(
  raw: NHLApiPlayer,
  currentTeam: string,
  currentTeamAbbrev?: string,
): PreviousTeamEntry[] {
  if (!Array.isArray(raw?.seasonTotals)) return [];

  const currentMeta = getTeamMeta(currentTeam, currentTeamAbbrev);
  const currentNames = new Set(
    [
      currentTeam,
      currentTeamAbbrev,
      ...(currentMeta ? currentMeta.names : []),
      ...(currentTeamAbbrev && TEAM_META[currentTeamAbbrev]
        ? TEAM_META[currentTeamAbbrev].names
        : []),
    ]
      .filter((name): name is string => Boolean(name))
      .map((name) => name.toLowerCase()),
  );

  const previousTeams = raw.seasonTotals
    .map((total, index) => ({
      entry: normalizePreviousTeam(total, currentNames),
      index,
      season: getSeasonSortValue(total.season),
      sequence: total.sequence ?? Number.MAX_SAFE_INTEGER,
    }))
    .filter(
      (
        candidate,
      ): candidate is {
        entry: PreviousTeamEntry;
        index: number;
        season: number;
        sequence: number;
      } => Boolean(candidate.entry),
    )
    .sort((a, b) => a.season - b.season || a.sequence - b.sequence || a.index - b.index);

  const seen = new Set<string>();
  return previousTeams.flatMap(({ entry }) => {
    const key = `${entry.year}\u0000${entry.team}\u0000${entry.league}`.toLowerCase();
    if (seen.has(key)) return [];
    seen.add(key);
    return [entry];
  });
}

export function normalizePlayerData(raw: NHLApiPlayer): NHLPlayer {
  const fullName =
    [raw?.firstName?.default, raw?.lastName?.default].filter(Boolean).join(" ") || NA;
  const teamAbbrev = raw?.teamAbbrev;
  const team = [raw?.fullTeamName?.default, teamAbbrev].find((v) => v) || NA;
  const teamMeta = typeof team === "string" ? getTeamMeta(team, teamAbbrev) : undefined;
  const position = normalizePosition(raw?.position);
  const sub = raw?.featuredStats?.regularSeason?.subSeason ?? {};
  const career = raw?.careerTotals?.regularSeason ?? {};
  const stats = { ...career, ...sub };

  const isGoalie = position === "Goalie";

  const player: NHLPlayer = {
    id: raw?.playerId ?? 0,
    fullName,
    team: typeof team === "string" ? team : NA,
    conference: pick(
      raw?.conference?.name ?? raw?.conferenceAbbrev ?? teamMeta?.conference,
    ) as string,
    division: pick(raw?.division?.name ?? raw?.divisionAbbrev ?? teamMeta?.division) as string,
    position,
    jerseyNumber: pick(raw?.sweaterNumber),
    shootsCatches: pick(raw?.shootsCatches),
    previousTeams: getPreviousTeams(raw, typeof team === "string" ? team : NA, teamAbbrev),
    height: fmtHeight(raw?.heightInInches),
    weight: raw?.weightInPounds ? `${raw.weightInPounds} lbs` : NA,
    age: calcAge(raw?.birthDate),
    birthDate: pick(raw?.birthDate) as string,
    birthCity: pick(raw?.birthCity?.default) as string,
    birthCountry: normalizeNation(raw?.birthCountry),
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
