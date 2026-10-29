# DESIGN — Foundry Printer Status

## Direction

**Dark terminal shelf.** The page mimics the real printer shelf in the
Foundry — dark cabinet, printers arranged in rows — so a student recognizes
"Printer #4 on screen" as the same physical printer they'd see walking in.

## Tokens

```css
:root {
  --bg: #0a0b0a; /* page background */
  --cabinet: #121513; /* dark back panel behind the shelf rows */
  --shelf-shade: #6f7573; /* darker bottom edge of shelf boards and side posts (metal shading) */
  --body: #1a1d1b; /* printer body (bottom tone), lighter than --bg so it reads as a box */
  --body-light: #262a27; /* printer body top tone, for top-to-bottom shading */
  --lid: #343830; /* lighter strip on top of the printer body */
  --door: #0c0e0d; /* glass door inside the printer body */
  --reflection: rgba(
    255,
    255,
    255,
    0.06
  ); /* faint diagonal reflection on the glass door */
  --text: #e8ebe9; /* primary text */
  --dim: #7c8482; /* small labels: model name, LAST SYNC, percent under the ring */
  --line: #2a2f2d; /* card edges and the ring's unfilled track */
  --silver: #c4c8c6; /* shelf boards between rows */
  --printing: #57e389; /* accent: printing state */
  --done: #e0a93a;
  --available: #ffffff;
  --paused: #9aa0a6;
  --font: "SFMono-Regular", "Menlo", "Consolas", "Courier New", monospace;
  --spacing: 10px; /* gap between shelf cards */
  --radius: 4px; /* card corner radius */
}
```

## The printer box

Each card is shaped like an X1 Carbon: a thin lid strip on top, a glass
"door" panel in the middle, and a status screen strip at the bottom. The
printer number sits top-right like a vinyl sticker on the door (slightly
rotated); the status word sits top-left, same row. Every printing printer
shows a ring progress in the center of the door — time left in the middle,
percent just below it — no exceptions, so #1–9 all read the same way when
printing. A printer with nothing printing is labeled **"AVAILABLE"** instead
of a ring.

## States

- **Ideal:** Shelf renders normally; header shows an accurate "AVAILABLE
  NOW x / 9" count and a recent "LAST SYNC" time.
- **Loading:** Before the data file resolves, each card renders as a blank
  placeholder shape in the shelf grid (same size/position, no ring or text)
  so the shelf outline appears instantly.
- **Error:** The data file fails to load — the whole shelf grid is replaced
  by a single centered message, **"Status unavailable"**, in place of the
  cards.
- **Stale:** Shelf renders normally, but a banner above the shelf (below the
  header) reads **"Data may be out of date"** when last-sync is over an hour
  old.
- **Partial:** Known printers render normally; any printer missing/malformed
  in the data file shows its card with **"No data"** in place of the ring or
  status text, instead of breaking the page.
- **Empty:** The data file loads with no printer entries — the shelf grid is
  replaced by **"No printer data configured"**.

## Phone rules (390px)

The 3×3 grid keeps its 3-column layout at 390px (cards simply shrink); it
does not stack to 1 column. Only type sizes adjust: the printer number tag
and the ring's time text step down slightly so they stay inside the smaller
card without wrapping or overflowing.
