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
Two tabs:
1. Player Lookup
2. Deduction Tracker

## Player Lookup
Purpose:
- Search/select active NHL player
- Show simplified Basic Info only

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

## Deduction Tracker
Purpose:
Track info uncovered from questions asked during the game.

Current target UI:
- Add opponents
- Each opponent gets its own Question / Answer table
- One empty row auto-populates when opponent is added
- More rows only added by that opponent's ADD button
- No horizontal scrollbar
- Delete x fully visible

Question types:
- Position
- Team
- Conference
- Division
- Hand
- Top 6
- Top 4
- Country/Nationality
- Age
- Jersey Number
- Other

Other is the only type that should show a custom text box.

## Current Known UI Fixes Needed
1. Previous Teams should include league/tournament context when useful.
2. Show Team Canada / Team North America if tournament/context is useful.
3. Do not show noisy entries like PEAC unless useful context exists.
4. Player name should be the player card heading, not duplicated in Basic Info.
5. Fix Deduction Tracker horizontal overflow and clipped delete x.
6. Rename Add Opponent to ADD and make all ADD buttons green.
7. Rename Reset Tracker to Clear ALL and make cautionary.
8. All remove/delete buttons should be consistent danger styling.
