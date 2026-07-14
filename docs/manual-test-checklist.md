# Manual Test Checklist

## Navigation

- Confirm the top tabs are exactly `My Player`, `Opponent(s)`, and `Save`.
- Confirm each tab fits and remains tappable around 390px wide.
- Switch between all three tabs and confirm no page reload occurs.

## My Player

- Search for `Connor McDavid` and select him.
- Confirm the player name is the card heading.
- Confirm there is no duplicate `Full Name` row.
- Confirm fields appear in this order: Current Team, Conference, Division, Position, Nation, Number, Hand, Previous Teams.
- Confirm Position displays `Center`, not `C`, and wing positions display `Left Wing` or `Right Wing` rather than only `Left` or `Right`.
- Confirm Nation displays a readable country name such as `Canada`, not a country code.
- Confirm Previous Teams starts collapsed and shows an entry count.
- Expand Previous Teams and confirm the only columns are Year, Team, and League.
- Confirm previous-team entries are oldest first and identical regular-season/playoff rows are not duplicated.
- Switch through Opponent(s) and Save, then confirm the selected player remains.
- Confirm height, weight, birth date, birth city, and season statistics are still absent.

## Opponent(s)

- Add opponents `John` and `Sam`; confirm each receives the full collapsed checklist.
- Confirm categories appear in this order: Position, Conference, Division, Team, Hand, Country / Nationality, Age, Jersey Number, Other.
- Confirm Expand All opens all nine top-level categories for only that opponent.
- Confirm Collapse All closes all top-level categories and open Team division groups for only that opponent.
- Expand Position and confirm only Forward, D, and Goalie appear initially.
- Confirm there is no old per-opponent row ADD button.
- Mark John's `Forward` as Yes; confirm D and Goalie become automatic No and the LW/C/RW subsection appears.
- Mark John's `C` as Yes and confirm LW and RW become automatic No while Forward stays Yes.
- Clear John's `C`; confirm all three forward subtypes become neutral while Forward stays Yes.
- Mark John's `D` as Yes; confirm the forward subtype state clears and the LD/RD subsection appears.
- Mark Sam's `Goalie` as Yes; confirm each card keeps its own position and expansion state.
- Confirm Yes and No cannot be selected together for one option.
- Mark `West` as Yes and confirm East, Atlantic, Metropolitan, and all Eastern teams become automatic No marks.
- Return `West` to neutral and confirm all marks derived only from West return to neutral.
- Mark `Pacific` as Yes and confirm West becomes automatic Yes, other divisions become automatic No, and non-Pacific teams become automatic No.
- Mark `Oilers` as Yes and confirm Pacific and West become automatic Yes and every other team becomes automatic No.
- Expand Team and confirm the selected team's division opens automatically.
- Confirm automatically ruled-out teams are hidden by default and all four division groups start collapsed when no team is selected.
- Enable `Show ruled-out teams` and confirm ruled-out teams appear inside their correct division groups.
- Mark `Kings` as Yes and confirm the explicit Oilers Yes is replaced, Kings is Yes, and Oilers becomes automatic No.
- Return Kings to neutral and confirm the team, division, and conference automatic marks clear.
- Confirm automatic marks use lighter styling and show an `Auto` label while manual marks remain solid.
- Enter `Over 30` in Age and `Under 50` in Jersey Number; confirm both are plain text fields with no Yes/No controls.
- Collapse Age and Jersey Number and confirm their entered text appears in the summaries.
- Add a custom nationality and confirm it supports neutral, Yes, and No and can be deleted.
- Add an Other item, mark it, and confirm it can be deleted.
- Refresh and confirm opponent names, checklist marks, text clues, and custom items persist.
- Confirm automatic marks are restored by recalculation after refresh.
- Confirm `Remove` requires confirmation and only removes that opponent.
- Click `Clear ALL`, cancel the confirmation, and confirm active data remains.
- Click `Clear ALL` again and confirm; verify active opponents are cleared.

## Saved Game Sessions

- Add opponent `John` with several checklist marks and a custom Other item.
- Add age and jersey-number clue text.
- Open `Save` and confirm all session controls are absent from `Opponent(s)`.
- Save the tracker as `Test Game`.
- Click `Clear ALL` and confirm only the active tracker clears.
- Return to Save, select `Test Game`, and click `Load Session`.
- Confirm John, all checklist marks, both clue fields, and the custom item return.
- Confirm manual marks load from the session and their automatic marks are recalculated.
- Refresh and confirm the saved session still exists.
- Delete `Test Game` and confirm a popup appears before deletion.
- Confirm the deleted session is removed from the dropdown.
- With no saved sessions, confirm the empty state is clear.

## Mobile Layout

- Check around 390px width.
- Expand several categories and confirm the option label plus Yes and No controls remain visible.
- Confirm inputs, ADD, Remove, Clear ALL, Save Session, Load Session, and delete controls are not cut off.
- Confirm text wraps cleanly without blocking controls.
- Confirm the document has no horizontal scrolling.

## localStorage Persistence

- Refresh after editing checklist marks and confirm active tracker data remains.
- Change or clear a source mark after refresh and confirm old automatic exclusions disappear.
- Refresh after saving a session and confirm saved sessions remain.
- Confirm `Clear ALL` does not delete saved sessions.
