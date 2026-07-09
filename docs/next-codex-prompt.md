Update the NHL Guessing Helper app.

Real repo:
~/Documents/nhlguess

Work only in this repo.

Scope:
Fix only the Player Lookup card display and Deduction Tracker table/button UI issues.

Do NOT add:
- Player guessing
- Possible player filters
- AI parsing
- Accounts
- Database
- Multiplayer
- Charts
- Major redesign

Do NOT change:
- Deduction Tracker data behavior
- Player Lookup search behavior
- package manager
- routing unless necessary

Use npm only.

Issues to fix:

1. Deduction Tracker horizontal overflow

The Question / Answer table is too wide and creates a horizontal scrollbar.
The red x delete button is cut off on the right side.

Fix the layout so:
- No horizontal scrollbar appears on normal desktop or mobile width.
- The delete x is fully visible.
- The Question and Answer controls fit inside the card.
- Rows can wrap or stack on smaller widths if needed.
- The delete button should stay visible and tappable.
- The table/grid should remain simple and readable.

2. Add buttons

Rename Add Opponent to:

ADD

Make it green.

Every Add button in the Deduction Tracker should be green and consistent.

3. Reset Tracker button

Rename Reset Tracker to:

Clear ALL

Make it clearly cautionary/danger styled.

When clicked, it must still show a confirmation popup before clearing tracker data.

4. Remove/delete buttons

All remove/delete buttons should use consistent danger styling.

This includes:
- opponent Remove buttons
- row/question-answer x delete buttons

5. Player Lookup name placement

The selected player’s name should be the main heading/title of the player info card.

Remove the Full Name row from the Basic Info table.

The Basic Info table should start with:
- Current Team
- Number
- Position
- Conference
- Division
- Country/Nationality
- Hand
- Previous Teams

6. Previous Teams / Teams Played For cleanup

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

If the current response is too messy or unreliable, filter it conservatively.
If nothing reliable/useful remains, show N/A.

Do not fetch extra APIs just for this.
Do not scrape.

7. Player Lookup text color

Keep Player Lookup text black by default.
The search input placeholder can stay grey.

Verify:
1. Run npm run build.
2. Open app locally.
3. Player Lookup:
   - Search/select Connor McDavid.
   - Confirm player name is the card heading.
   - Confirm Full Name row is gone.
   - Confirm Basic Info starts with Current Team.
   - Confirm Previous Teams is clean/useful or N/A.
   - Confirm removed fields are still gone: height, weight, birth date, birth city, season stats.
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

Final report:
- Confirm repo path
- Files changed
- What caused the horizontal overflow
- What changed about button styling
- What changed about Player Lookup name placement
- How Previous Teams / Teams Played For is now handled
- Whether npm run build passed
- Manual verification results
- Whether safe to commit
