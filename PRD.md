# PRD — Foundry Printer Status

## Goal

Let a Babson student check, from their own device, whether a Foundry 3D
printer is free before walking over — so they don't waste a trip.

## Audience and key action

**Audience:** Babson students deciding whether to go to the Foundry right now.

**Key action:** See, at a glance, how many printers are free and what each
printer is doing (state, progress, time left) — and trust that the data is
current.

## Features (what V1 does)

**1. Main Shelf page** (`index.html`)

- Header: site title, count of free printers (out of the 9 shown here), and
  the last time the data was synced.
- A 3×3 grid of cards for Printers #1–9 (PLA). Each card shows: printer
  number, model, current state (free / printing / done-waiting-for-pickup /
  paused / failed / offline), and — when printing or done — progress % and
  estimated time left.
- A link to the BYOF Shelf page.
- Cards are view-only (not clickable) in V1.
- Page auto-refreshes from a data file every 30 seconds, no reload needed.

**2. BYOF Shelf page** (`byof.html`)

- Same header pattern, with its own free-of-3 count and last-sync time.
- A row of 3 cards for Printers #10–12, same fields as above, plus a
  permanent "Bring Your Own Filament" tag on each card.
- A link back to the Main Shelf page.
- Same 30-second auto-refresh behavior.

Both pages read from one shared data file. For now that file is edited by
hand; later it will be written automatically by a program on a Foundry
computer (see Later).

## Content and data

**Have:**

- 12 printers total: #1–9 (PLA) on the Main Shelf, #10–12 (BYOF) on their own
  page.
- Model: Bambu Lab X1 Carbon, for all 12 (per club organizer, subject to
  reconfirmation).
- Possible states: free, printing, done (waiting for pickup), paused, failed,
  offline.
- Per-printer fields: state, progress %, estimated time left.
- Page-level fields: last-updated timestamp, free-printer count.
- Privacy rule: no file names, no record of who started a print, no camera
  images.
- Refresh interval: 30 seconds.
- Design references: [Sketch.pdf](Sketch.pdf), [Printer shelf, dark terminal.pdf](Printer%20shelf%2C%20dark%20terminal.pdf).

**Missing:**

- Real live data feed / connection method for the 12 printers — from: Foundry
  administrator and professor (in progress).
- Confirmation that Printers #10–12 are X1 Carbon — from: club
  organizer/you.
- Starting sample data for the hand-edited data file, so V1 can be built and
  tested before the real feed exists — from: you.

## Look

See `DESIGN.md` (to be written from Sketch.pdf and Printer shelf, dark
terminal.pdf).

## States

- **Ideal:** All cards show live state, progress, and time left; header shows
  an accurate free count and a recent last-sync time.
- **Loading:** First load, before the data file finishes fetching — cards
  show as blue placeholder shapes.
- **Error:** The data file fails to load entirely — the shelf is replaced by
  a red "Status unavailable" message.
- **Partial:** The data file loads but is missing or has malformed entries
  for some printers — known printers render normally; the rest show a "No
  data" placeholder card instead of breaking the page.
- **Empty:** The data file loads but lists no printer entries at all (e.g.
  misconfigured) — the shelf shows a "No printer data configured" message.

## Checks

1. On the Main Shelf, see at a glance how many of the 9 PLA printers are free
   right now.
2. Read any single printer's state, progress %, and time left from its card.
3. Tell whether the shown data is fresh (recent last-sync time) or
   stale/unavailable (banner or red state).
4. Get from the Main Shelf to the BYOF Shelf page and back.
5. Watch the page update on its own within ~30–60 seconds, without manually
   reloading.

## Out of scope

- Logins, accounts, or a members area.
- Attendance tracking or history.
- Real-time connection to actual printer hardware/APIs (a hand-edited data
  file stands in for V1).
- Clicking a printer card for extra detail.
- File names, who started a print, camera images.
- Colors, fonts, and other visual styling decisions (deferred to
  `DESIGN.md`).

## Later

- Real printer-hardware integration, once the Foundry administrator and
  professor confirm a connection method.
- Per-printer last-updated timestamps, to catch a single printer going
  silent.
- Clickable printer cards showing full description (e.g. filament color).
