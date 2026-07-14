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

## My Player

Purpose:

- Search/select active NHL player
- Show simplified Basic Info only
- Keep the selected player available while switching tabs

Should show:

- Player name as card heading
- Current Team
- Number
- Position
- Conference
- Division
- Country/Nationality
- Hand
- Previous Teams / Teams Played For

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
- Custom rows are limited to the Other category
- Custom nationality entries are supported for uncommon nationalities

Checklist categories:

- Position
- Team
- Conference
- Division
- Hand
- Line / Role
- Country / Nationality
- Age
- Jersey Number
- Other

Team options are grouped by Atlantic, Metropolitan, Central, and Pacific.
Age and jersey number use practical ranges rather than individual values.

Deterministic checklist relationships:

- A specific forward or defense position marks its parent position and rules out incompatible positions.
- Yes marks in exclusive categories rule out the other options.
- Conference marks constrain divisions and teams.
- Division marks constrain conferences and teams.
- A Team Yes mark sets its division and conference and rules out every other team.
- Excluding every option but one in an exclusive category marks the remaining option Yes.

Line / Role, nationality, and Other entries do not propagate because their relationships are not
strictly deterministic. Only explicit marks are persisted. Derived marks are recomputed after load
or refresh so changing a source cannot leave stale automatic marks.

## Save

Purpose:

- Save the full active opponent checklist under a session name
- Load a saved session back into the active tracker
- Delete a saved session with confirmation

Storage remains local-only. Active opponents use `nhl-guess-helper:v1`; saved sessions use
`nhl-guessing-helper-sessions`. Loading normalizes both older row-based data and the first checklist
model into the explicit checklist model. Clear ALL only clears the active tracker and does not
remove saved sessions.
