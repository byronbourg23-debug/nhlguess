# Manual Test Checklist

## Player Lookup

- Search for `Connor McDavid` and select him.
- Confirm the player name is the card heading.
- Confirm there is no duplicate `Full Name` row.
- Confirm Basic Info starts with `Current Team`.
- Confirm Previous Teams is clean/useful or shows `N/A`.
- Switch tabs and confirm the selected player remains.

## Deduction Tracker

- Add opponent `John` and confirm one empty row appears.
- Add rows for Position, Team, Conference, Division, Hand, Top 6, Top 4, Country/Nationality, Age, Jersey Number, and Other.
- Fill the rows with typical answers and refresh the page.
- Confirm rows persist after refresh.
- Confirm there is no horizontal scrollbar around 390px wide.
- Confirm row delete buttons are fully visible and tappable.
- Click `Clear ALL` and confirm a popup appears before clearing.

## Saved Game Sessions

- Add opponent `John` with several filled rows.
- Save the tracker as `Test Game`.
- Click `Clear ALL` and confirm only the active tracker clears.
- Load `Test Game` and confirm John and the rows return.
- Refresh and confirm the saved session still exists.
- Delete `Test Game` and confirm a popup appears before deletion.
- Confirm the deleted session is removed from the dropdown.

## Mobile Layout

- Check around 390px width.
- Confirm inputs, selects, ADD, Remove, delete row, Save Session, and Delete Saved Session controls are not cut off.
- Confirm text wraps cleanly without blocking controls.

## localStorage Persistence

- Refresh after editing tracker rows and confirm active tracker data remains.
- Refresh after saving a session and confirm saved sessions remain.
- Confirm `Clear ALL` does not delete saved sessions.
