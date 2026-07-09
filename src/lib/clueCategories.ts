import type { ClueCategory } from "./types";

export const CLUE_CATEGORY_OPTIONS: { label: string; value: ClueCategory }[] = [
  { label: "Position", value: "position" },
  { label: "Team", value: "team" },
  { label: "Conference", value: "conference" },
  { label: "Country/Nationality", value: "country_nationality" },
  { label: "Age", value: "age" },
  { label: "Shoots/Catches", value: "shoots_catches" },
  { label: "Stats/Awards", value: "stats_awards" },
  { label: "Other", value: "other" },
];

export const NO_CLUE_CATEGORY_LABEL = "No category";

export function getClueCategoryLabel(category: ClueCategory): string {
  return CLUE_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;
}
