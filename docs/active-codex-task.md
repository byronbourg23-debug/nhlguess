# Active Codex Task — NHL Guessing Helper UI Fix + Light Polish

## Repo
Work only in this repo:

~/Documents/nhlguess

Confirm before editing:
1. Current working directory.
2. git status works.
3. You are in the nhlguess repo.
4. Files you expect to touch.

## Important Context

This app is a simple NHL guessing-game helper.

It has two main tabs:
1. Player Lookup
2. Deduction Tracker

Core rule:
This app is a deduction notebook. Do NOT add guessing, filtering, AI parsing, recommendations, accounts, multiplayer, database, charts, or major redesigns.

Use npm only. Do not use pnpm, bun, or yarn.

## Efficiency Rules

I may be away from the computer.

Do not waste usage:
- Do not get stuck in retry loops.
- If the same command fails twice, stop and report the blocker.
- Do not reinstall dependencies unless clearly necessary.
- Do not make unrelated changes.
- If browser/manual testing is blocked, run build and summarize what still needs checking.
- Prioritize useful scoped fixes over perfect automation.

## Scope

This task has two parts:

1. Fix specific UI bugs.
2. Do a light visual polish pass so the app feels more current/modern, but still simple.

Do NOT change:
- Deduction Tracker data behavior
- Player Lookup search behavior
- package manager
- routing unless necessary

---

# PART 1 — Specific Fixes

## 1. Deduction Tracker horizontal overflow

The Question / Answer table is too wide and creates a horizontal scrollbar.
The red x delete button is cut off on the right side.

Fix the layout so:
- No horizontal scrollbar appears on normal desktop or mobile width.
- The delete x is fully visible.
- The Question and Answer controls fit inside the card.
- Rows can wrap or stack on smaller widths if needed.
- The delete button stays visible and tappable.
- The table/grid remains simple and readable.

Preferred approach:
- Use a responsive grid instead of a fixed-width table if needed.
- On wider screens, show Question / Answer / Delete in one row.
- On narrow screens, allow controls to stack cleanly.
- Do not use fixed widths that force overflow.

## 2. Add buttons

Rename Add Opponent to:

ADD

Make it green.

Every Add button in the Deduction Tracker should be green and consistent:
- opponent setup ADD button
- per-opponent row ADD buttons

Use consistent padding, font weight, border radius, and capitalization.

## 3. Reset Tracker button

Rename Reset Tracker to:

Clear ALL

Make it clearly cautionary/danger styled:
- red/danger color
- thicker/bolder text
- warning-like styling
- still simple and clean

When clicked, it must still show a confirmation popup before clearing tracker data.

## 4. Remove/delete buttons

All remove/delete buttons should use consistent danger styling.

This includes:
- opponent Remove buttons
- row/question-answer x delete buttons

The row x delete button should:
- be fully visible
- be centered
- look cautionary
- not cause horizontal overflow

Remove buttons do not need new popup behavior unless they already had it.

## 5. Player Lookup name placement

The selected player’s name should be the main heading/title of the player info card.

Current problem:
The player name is shown in a separate box above the Basic Info card and also appears as a Full Name row inside the Basic Info table.

Fix:
- Show the selected player name as the heading/title at the top of the player info card.
- Remove the Full Name row from the Basic Info table.
- Do not show a separate selected-player box above the card unless necessary.
- The Basic Info table should start with:
  - Current Team
  - Number
  - Position
  - Conference
  - Division
  - Country/Nationality
  - Hand
  - Previous Teams

## 6. Previous Teams / Teams Played For cleanup

The Previous Teams row should be useful for the guessing game.

Include:
- NHL teams
- Major junior / college / minor pro teams if league is available
- National teams if tournament/context is available

Show league/tournament in parentheses only when useful.

Examples:
- Blackhawks
- Erie Otters (OHL)
- Boston University (NCAA)
- Rockford IceHogs (AHL)
- Team Canada (World Juniors)
- Team Canada (Olympics)
- Team North America (World Cup of Hockey)
- USA NTDP (USNTDP)

Do not show PEAC unless there is a clear useful league/tournament context.

If the current NHL response is too messy or unreliable, filter it conservatively.
If nothing reliable/useful remains, show N/A.

Do not fetch extra APIs just for this.
Do not scrape.
Do not build a complex history system.

## 7. Player Lookup text color

Keep Player Lookup text black by default.
The search input placeholder can stay grey.

---

# PART 2 — Light 2026-style UI polish

After the specific fixes above, do a light styling pass.

Goal:
Make the UI feel more like a clean 2026 web app and less like a 2017 starter app, while keeping it simple and functional.

Style direction:
- Clean
- Modern
- Lightweight
- Mobile-friendly
- Calm
- Not flashy
- Not overdesigned
- Not bland

Allowed visual improvements:
- Better spacing rhythm
- Better card padding
- Better border radius
- Subtle borders
- Subtle shadows only if tasteful
- Cleaner button styles
- More consistent font sizes
- More consistent font weights
- Better table/grid alignment
- Better input/select styling
- Better section headers
- Cleaner empty states
- Slightly improved visual hierarchy

Avoid:
- Big gradients
- Animations
- Glassmorphism
- Neon colors
- Sports-card graphics
- Large decorative images
- Complex theme system
- Major layout rebuild
- Anything that makes the app harder to use in the car

Keep the app simple:
- Player Lookup should still be quick.
- Deduction Tracker should still be easy to use on a phone.
- Buttons should be obvious.
- Inputs should be easy to tap.
- No feature should require more clicks than before.

## Likely Files

Inspect only what is needed.

Likely files:
- src/components/PlayerInfoCard.tsx
- src/components/PlayerLookup.tsx
- src/components/PlayerSearchInput.tsx
- src/components/DeductionTracker.tsx
- src/components/OpponentSetup.tsx
- src/components/OpponentDeductionCard.tsx
- src/lib/nhlApi.ts
- src/lib/types.ts
- shared CSS file if styling is centralized

## Verification

1. Run npm run build.

2. Open app locally if possible.

3. Player Lookup:
   - Search/select Connor McDavid.
   - Confirm Connor McDavid is the card heading/title.
   - Confirm there is no duplicate Full Name row.
   - Confirm Basic Info starts with Current Team.
   - Confirm Previous Teams is clean/useful or N/A.
   - Confirm removed fields are still gone:
     - height
     - weight
     - birth date
     - birth city
     - season stats
   - Confirm text is black except search placeholder.

4. Deduction Tracker:
   - Add opponent John.
   - Confirm setup button says ADD and is green.
   - Confirm John’s row ADD button is green.
   - Add multiple rows.
   - Confirm no horizontal scrollbar.
   - Confirm red x delete button is fully visible.
   - Confirm Remove buttons look cautionary.
   - Confirm Clear ALL is cautionary and shows confirmation before clearing.
   - Refresh and confirm tracker rows persist.

5. General UI:
   - Confirm the app looks cleaner and more modern.
   - Confirm it is still simple and not overdesigned.
   - Confirm mobile usability is not worse.

## Final Report

Report:
- Confirm repo path.
- Files changed.
- What caused the horizontal overflow.
- What changed about button styling.
- What changed about Player Lookup name placement.
- How Previous Teams / Teams Played For is handled.
- What visual polish was applied.
- Whether npm run build passed.
- Manual verification results.
- Any known issues left.
- Whether safe to commit.
