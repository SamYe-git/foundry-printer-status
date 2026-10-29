# AGENTS.md

Rules for any agent working in this repo:

1. Start every response to the user by calling them Sam.
2. Plain HTML, CSS, and JavaScript only. No frameworks, libraries, CDNs, npm, or build step.
3. Printer data comes only from `data/status.json`, loaded with `fetch()`. Never hard-code printer data in HTML or JS.
4. Styles live in `css/styles.css` and use only the custom properties defined in `:root`, following [DESIGN.md](DESIGN.md). If a needed value is missing, stop and ask.
5. Build only what [PRD.md](PRD.md) lists. Every state must be shown on the page itself, never with `alert()`.
6. Never show file names, who started a print, or camera images.
