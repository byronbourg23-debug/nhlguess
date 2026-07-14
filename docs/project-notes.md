# NHL Guessing Helper - Project Notes

## Core Rule

This app is a deduction notebook only.

Do NOT add:

- Possible player filters
- Player guessing suggestions
- AI parsing
- Outside NHL data to infer mystery players
- Accounts
- Multiplayer
- Database
- Charts
- Major redesign

## Current App Structure

Three tabs:

1. My Player
2. Opponent(s)
3. Save

## Beta Onboarding

- The app title includes a small `Beta` label.
- First use shows a non-blocking quick-start panel and one-line hint for the active tab.
- Dismissing onboarding stores `nhl-guess-helper:onboarding-dismissed:v1` in localStorage.
- `How to Play` remains available after dismissal and explains the three tabs and checklist states.
- Green means confirmed, red X means ruled out, and `Auto` means calculated from another confirmed answer.
- The footer links to Privacy and the GitHub feedback form.
- Privacy explains that opponent data and saved sessions stay in browser localStorage, require no
  account, and are not intentionally uploaded to an application database.
- Clearing browser data removes locally saved games.

## My Player

Purpose:

- Search/select active NHL player
- Show simplified Basic Info only
- Keep the selected player available while switching tabs

Should show:

- Player name as card heading
- Current Team
- Conference
- Division
- Position as a full readable name
- Nation
- Number
- Hand
- Previous Teams as a collapsed, oldest-first Year / Team / League history

Should NOT show:

- Height
- Weight
- Birth date
- Birth city
- Season stats
- Goalie stats

## Opponent(s)

Purpose:
Track info uncovered from questions asked during the game.

Current UI:

- Add opponents
- Each opponent gets a complete deduction checklist automatically
- Categories start collapsed so the page stays manageable
- Every option has neutral, Yes, and No states
- Selecting the active Yes or No state again returns it to neutral
- Manual marks are stored separately from automatic marks
- Automatic marks are recalculated from manual marks and are labeled `Auto`
- State is independent per opponent and persists locally
- Each opponent has compact Expand All and Collapse All controls
- Custom rows are limited to the Other category
- Custom nationality entries are supported for uncommon nationalities

Checklist categories:

- Position
- Conference
- Division
- Team
- Hand
- Country / Nationality
- Age
- Jersey Number
- Other

Position starts with Forward, D, and Goalie. Forward reveals LW, C, and RW when selected; D
reveals LD and RD. Team options are grouped into independently collapsible Atlantic,
Metropolitan, Central, and Pacific sections. Automatically ruled-out teams are hidden unless
`Show ruled-out teams` is enabled. Age and jersey number are free-text clue fields and do not
propagate.

Deterministic checklist relationships:

- A specific forward or defense position marks its parent position and rules out incompatible positions.
- Yes marks in exclusive categories rule out the other options.
- Conference marks constrain divisions and teams.
- Division marks constrain conferences and teams.
- A Team Yes mark sets its division and conference and rules out every other team.
- Excluding every option but one in an exclusive category marks the remaining option Yes.

Nationality and Other entries do not propagate because their relationships are not strictly
deterministic. Only explicit marks are persisted. Derived marks are recomputed after load or
refresh so changing a source cannot leave stale automatic marks. Older Top 6 and Top 4 marks are
migrated into Other; older age and jersey range marks are migrated into readable clue text.

## Save

Purpose:

- Save the full active opponent checklist under a session name
- Load a saved session back into the active tracker
- Delete a saved session with confirmation

Storage remains local-only. Active opponents use `nhl-guess-helper:v1`; saved sessions use
`nhl-guessing-helper-sessions`. Loading normalizes both older row-based data and the first checklist
model into the explicit checklist model. Clear ALL only clears the active tracker and does not
remove saved sessions.
