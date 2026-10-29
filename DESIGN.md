# DESIGN — Foundry Printer Status

## Direction

**Dark terminal shelf.** The page mimics the real printer shelf in the
Foundry — dark cabinet, printers arranged in rows — so a student recognizes
"Printer #4 on screen" as the same physical printer they'd see walking in.

## Tokens

```css
:root {
  --bg: #0a0b0a; /* page background */
  --text: #e8ebe9; /* primary text */
  --printing: #57e389; /* accent: printing state */
  font-family: "SFMono-Regular", "Menlo", "Consolas", "Courier New", monospace;
  --spacing: 10px; /* gap between shelf cards */
  --radius: 4px; /* card corner radius */
}
```

Other status colors used on cards: **done** `#e0a93a` (amber), **available**
`#ffffff` (white).

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
