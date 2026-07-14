import type { ChecklistMark, ExplicitChecklistState } from "./types";

export type ChecklistOption = {
  value: string;
  label: string;
};

export type TeamGroup = {
  label: DivisionValue;
  conference: ConferenceValue;
  teams: readonly ChecklistOption[];
};

export type ConferenceValue = "East" | "West";
export type DivisionValue = "Atlantic" | "Metropolitan" | "Central" | "Pacific";

export const POSITION_OPTIONS = [
  { value: "LW", label: "LW" },
  { value: "C", label: "C" },
  { value: "RW", label: "RW" },
  { value: "LD", label: "LD" },
  { value: "RD", label: "RD" },
  { value: "F", label: "F" },
  { value: "D", label: "D" },
  { value: "G", label: "G" },
] as const;

export const TEAM_GROUPS: readonly TeamGroup[] = [
  {
    label: "Atlantic",
    conference: "East",
    teams: [
      { value: "Bruins", label: "Bruins" },
      { value: "Sabres", label: "Sabres" },
      { value: "Red Wings", label: "Red Wings" },
      { value: "Panthers", label: "Panthers" },
      { value: "Canadiens", label: "Canadiens" },
      { value: "Senators", label: "Senators" },
      { value: "Lightning", label: "Lightning" },
      { value: "Maple Leafs", label: "Maple Leafs" },
    ],
  },
  {
    label: "Metropolitan",
    conference: "East",
    teams: [
      { value: "Hurricanes", label: "Hurricanes" },
      { value: "Blue Jackets", label: "Blue Jackets" },
      { value: "Devils", label: "Devils" },
      { value: "Islanders", label: "Islanders" },
      { value: "Rangers", label: "Rangers" },
      { value: "Flyers", label: "Flyers" },
      { value: "Penguins", label: "Penguins" },
      { value: "Capitals", label: "Capitals" },
    ],
  },
  {
    label: "Central",
    conference: "West",
    teams: [
      { value: "Blackhawks", label: "Blackhawks" },
      { value: "Avalanche", label: "Avalanche" },
      { value: "Stars", label: "Stars" },
      { value: "Wild", label: "Wild" },
      { value: "Predators", label: "Predators" },
      { value: "Blues", label: "Blues" },
      { value: "Utah Mammoth", label: "Utah Mammoth" },
      { value: "Jets", label: "Jets" },
    ],
  },
  {
    label: "Pacific",
    conference: "West",
    teams: [
      { value: "Ducks", label: "Ducks" },
      { value: "Flames", label: "Flames" },
      { value: "Oilers", label: "Oilers" },
      { value: "Kings", label: "Kings" },
      { value: "Sharks", label: "Sharks" },
      { value: "Kraken", label: "Kraken" },
      { value: "Canucks", label: "Canucks" },
      { value: "Golden Knights", label: "Golden Knights" },
    ],
  },
] as const;

export const TEAM_OPTIONS = TEAM_GROUPS.flatMap((group) => group.teams);

export const DIVISION_TO_CONFERENCE: Readonly<Record<DivisionValue, ConferenceValue>> =
  Object.fromEntries(TEAM_GROUPS.map((group) => [group.label, group.conference])) as Record<
    DivisionValue,
    ConferenceValue
  >;

export const TEAM_TO_DIVISION: Readonly<Record<string, DivisionValue>> = Object.fromEntries(
  TEAM_GROUPS.flatMap((group) => group.teams.map((team) => [team.value, group.label])),
) as Record<string, DivisionValue>;

export const CONFERENCE_OPTIONS = [
  { value: "East", label: "East" },
  { value: "West", label: "West" },
] as const;

export const DIVISION_OPTIONS = [
  { value: "Atlantic", label: "Atlantic" },
  { value: "Metropolitan", label: "Metropolitan" },
  { value: "Central", label: "Central" },
  { value: "Pacific", label: "Pacific" },
] as const;

export const HAND_OPTIONS = [
  { value: "L", label: "Left" },
  { value: "R", label: "Right" },
] as const;

export const ROLE_OPTIONS = [
  { value: "top6", label: "Top 6" },
  { value: "top4", label: "Top 4" },
] as const;

export const NATIONALITY_OPTIONS = [
  { value: "Canadian", label: "Canadian" },
  { value: "American", label: "American" },
  { value: "Swedish", label: "Swedish" },
  { value: "Finnish", label: "Finnish" },
  { value: "Russian", label: "Russian" },
  { value: "Czech", label: "Czech" },
  { value: "Slovak", label: "Slovak" },
  { value: "German", label: "German" },
  { value: "Swiss", label: "Swiss" },
  { value: "Other", label: "Other" },
] as const;

export const AGE_OPTIONS = [
  { value: "under-20", label: "Under 20" },
  { value: "20-24", label: "20-24" },
  { value: "25-29", label: "25-29" },
  { value: "30-34", label: "30-34" },
  { value: "35-plus", label: "35 and older" },
] as const;

export const JERSEY_NUMBER_OPTIONS = [
  { value: "0-9", label: "0-9" },
  { value: "10-19", label: "10-19" },
  { value: "20-29", label: "20-29" },
  { value: "30-39", label: "30-39" },
  { value: "40-49", label: "40-49" },
  { value: "50-59", label: "50-59" },
  { value: "60-69", label: "60-69" },
  { value: "70-79", label: "70-79" },
  { value: "80-89", label: "80-89" },
  { value: "90-99", label: "90-99" },
] as const;

export function createEmptyChecklist(): ExplicitChecklistState {
  return {
    position: createNeutralRecord(POSITION_OPTIONS),
    team: createNeutralRecord(TEAM_OPTIONS),
    conference: createNeutralRecord(CONFERENCE_OPTIONS),
    division: createNeutralRecord(DIVISION_OPTIONS),
    hand: createNeutralRecord(HAND_OPTIONS),
    role: createNeutralRecord(ROLE_OPTIONS),
    nationality: createNeutralRecord(NATIONALITY_OPTIONS),
    age: createNeutralRecord(AGE_OPTIONS),
    jerseyNumber: createNeutralRecord(JERSEY_NUMBER_OPTIONS),
    other: [],
  };
}

export function isChecklistMark(value: unknown): value is ChecklistMark {
  return value === "neutral" || value === "yes" || value === "no";
}

function createNeutralRecord(options: readonly ChecklistOption[]): Record<string, ChecklistMark> {
  return Object.fromEntries(options.map((option) => [option.value, "neutral"])) as Record<
    string,
    ChecklistMark
  >;
}
