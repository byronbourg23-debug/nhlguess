# Manual Test Checklist

## Navigation

- Confirm the top tabs are exactly `My Player`, `Opponent(s)`, and `Save`.
- Confirm each tab fits and remains tappable around 390px wide.
- Switch between all three tabs and confirm no page reload occurs.

## My Player

- Search for `Connor McDavid` and select him.
- Confirm the player name is the card heading.
- Confirm there is no duplicate `Full Name` row.
- Confirm Basic Info starts with `Current Team`.
- Confirm Previous Teams is clean/useful or shows `N/A`.
- Switch through Opponent(s) and Save, then confirm the selected player remains.
- Confirm height, weight, birth date, birth city, and season statistics are still absent.

## Opponent(s)

- Add opponents `John` and `Sam`; confirm each receives the full collapsed checklist.
- Confirm categories appear in this order: Position, Team, Conference, Division, Hand, Line / Role, Country / Nationality, Age, Jersey Number, Other.
- Expand Team and confirm all 32 teams are grouped under Atlantic, Metropolitan, Central, and Pacific.
- Confirm there is no old per-opponent row ADD button.
- Mark John's `C` as Yes and Sam's `C` as No; confirm each card keeps its own state.
- Click John's selected Yes control again and confirm it returns to neutral.
- Confirm Yes and No cannot be selected together for one option.
- Confirm Top 6 and Top 4 are separate items in Line / Role.
- Add a custom nationality and confirm it supports neutral, Yes, and No and can be deleted.
- Add an Other item, mark it, and confirm it can be deleted.
- Refresh and confirm opponent names, checklist marks, and custom items persist.
- Confirm `Remove` requires confirmation and only removes that opponent.
- Click `Clear ALL`, cancel the confirmation, and confirm active data remains.
- Click `Clear ALL` again and confirm; verify active opponents are cleared.

## Saved Game Sessions

- Add opponent `John` with several checklist marks and a custom Other item.
- Open `Save` and confirm all session controls are absent from `Opponent(s)`.
- Save the tracker as `Test Game`.
- Click `Clear ALL` and confirm only the active tracker clears.
- Return to Save, select `Test Game`, and click `Load Session`.
- Confirm John, all checklist marks, and the custom item return.
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
- Refresh after saving a session and confirm saved sessions remain.
- Confirm `Clear ALL` does not delete saved sessions.
