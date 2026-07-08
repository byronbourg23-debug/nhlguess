
# Add retry to error states

Everything else you listed is already implemented. Only gap: the two error messages currently show as plain text with no way to retry without changing input.

## Changes

### `src/components/PlayerSearchInput.tsx`
- Extract the search effect body into a callable `runSearch()` (keyed off current `term`).
- When `error` is set, render a **Retry** button next to "Could not search players. Try again." that calls `runSearch()` for the current term.

### `src/components/PlayerLookup.tsx`
- Track `lastSelectedId` alongside `player`/`error`.
- When details fetch fails, render a **Retry** button next to "Could not load player details. Try again." that re-invokes `handleSelect(lastSelectedId)`.

No other files change. No new deps. Keeps existing debounce, sequence guard, and localStorage behavior intact.

## Verification

Preview → Player Lookup → temporarily go offline or search a nonsense term that 500s → confirm the error message plus Retry button appears, and Retry re-runs the request.
