// Foundry Printer Status — Main Shelf (Ideal state only, for now)

// Human-readable word shown on each card for each possible state.
const STATUS_LABELS = {
  available: "AVAILABLE",
  printing: "PRINTING",
  done: "DONE",
  paused: "PAUSED",
  failed: "FAILED",
  offline: "OFFLINE",
};

// A finished print only shows as DONE for this long before it reverts to AVAILABLE.
const DONE_DISPLAY_CAP_MIN = 15;

// Re-renders on this interval so a DONE card can flip to AVAILABLE without a page reload.
const RENDER_REFRESH_MS = 30000;

// Turns a minute count into "H:MM" or "M:SS"-style text like the design (e.g. 42 -> "0:42").
function formatTimeLeft(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}:${String(minutes).padStart(2, "0")}`;
}

// Returns the state a printer should display right now: a DONE printer past its 15-minute
// cap reads as AVAILABLE, even though the data file still says "done".
function getDisplayState(printer, now) {
  if (printer.state === "done" && printer.doneAt) {
    const elapsedMin = (now - new Date(printer.doneAt).getTime()) / 60000;
    if (elapsedMin >= DONE_DISPLAY_CAP_MIN) {
      return "available";
    }
  }
  return printer.state;
}

// Fills the printer "door" element with content based on the printer's display state.
function fillDoorContent(door, printer, displayState) {
  if (displayState === "printing") {
    const ring = document.createElement("div");
    ring.className = "ring";
    ring.style.setProperty("--pct", printer.progress);
    ring.style.setProperty("--ring-color", "var(--ring-printing)");

    const ringText = document.createElement("div");
    ringText.className = "ring-text";

    const time = document.createElement("span");
    time.className = "time";
    time.textContent = formatTimeLeft(printer.timeLeftMin);

    const pct = document.createElement("span");
    pct.className = "pct";
    pct.textContent = `${printer.progress}%`;

    ringText.append(time, pct);
    ring.append(ringText);
    door.append(ring);
    return;
  }

  if (displayState === "done") {
    const doneText = document.createElement("div");
    doneText.className = "done-text";

    const big = document.createElement("span");
    big.className = "big";
    big.textContent = "DONE";

    const small = document.createElement("span");
    small.className = "small";

    doneText.append(big, small);
    door.append(doneText);
    return;
  }

  if (displayState === "paused") {
    const pausedText = document.createElement("div");
    pausedText.className = "paused-text";

    const big = document.createElement("span");
    big.className = "big";
    big.textContent = `PAUSED ${printer.progress}%`;

    const small = document.createElement("span");
    small.className = "small";
    small.textContent = "paused by user";

    pausedText.append(big, small);
    door.append(pausedText);
    return;
  }

  // Default: available (free) printer.
  const availableText = document.createElement("span");
  availableText.className = "available-text";
  availableText.textContent = "AVAILABLE";
  door.append(availableText);
}

// Builds the side-view filament spool icon that stands next to a printer on the shelf.
function buildFilamentSpool(printer) {
  const spool = document.createElement("div");
  spool.className = `spool spool--${printer.filament}`;

  const leftFlange = document.createElement("div");
  leftFlange.className = "spool-flange";

  const core = document.createElement("div");
  core.className = "spool-core";

  const rightFlange = document.createElement("div");
  rightFlange.className = "spool-flange";

  const label = document.createElement("span");
  label.className = "visually-hidden";
  label.textContent = `Filament: ${printer.filament} PLA`;

  spool.append(leftFlange, core, rightFlange, label);
  return spool;
}

// Builds one printer card element from a single printer's data.
function buildPrinterCard(printer, now) {
  const displayState = getDisplayState(printer, now);

  const card = document.createElement("div");
  card.className = "printer";

  const lid = document.createElement("div");
  lid.className = "printer-lid";

  const statusTag = document.createElement("span");
  statusTag.className = `status-tag ${displayState}`;
  statusTag.textContent = STATUS_LABELS[displayState] ?? displayState;

  const numberTag = document.createElement("span");
  numberTag.className = "number-tag";
  numberTag.textContent = `#${printer.number}`;

  lid.append(statusTag, numberTag);

  const doorWrap = document.createElement("div");
  doorWrap.className = "printer-door";
  fillDoorContent(doorWrap, printer, displayState);

  const screen = document.createElement("div");
  screen.className = "printer-screen";

  const model = document.createElement("span");
  model.textContent = printer.model;
  screen.append(model);

  card.append(lid, doorWrap, screen);
  return card;
}

// Fills the three shelf rows with 3 printer cards each, in order.
function renderShelf(printers, now) {
  const rows = [
    document.getElementById("shelf-row-1"),
    document.getElementById("shelf-row-2"),
    document.getElementById("shelf-row-3"),
  ];

  rows.forEach((row) => {
    row.replaceChildren();
  });

  printers.forEach((printer, index) => {
    const rowIndex = Math.floor(index / 3);

    const slot = document.createElement("div");
    slot.className = "printer-slot";
    slot.append(buildFilamentSpool(printer), buildPrinterCard(printer, now));

    rows[rowIndex].append(slot);
  });
}

// Updates the header's "AVAILABLE NOW" count and "LAST SYNC" time.
function renderHeader(state, now) {
  const availableCount = state.printers.filter((p) => getDisplayState(p, now) === "available").length;
  document.getElementById("available-count").textContent = `${availableCount} / ${state.printers.length}`;

  const syncTime = new Date(state.lastUpdated);
  document.getElementById("last-sync").textContent = syncTime.toLocaleTimeString();
}

// Loads data/status.json once and keeps it in this single state variable.
let appState = null;

// Re-renders the already-loaded data against the current time, so the 15-minute DONE cap applies
// without needing a fresh fetch.
function renderNow() {
  if (!appState) {
    return;
  }
  const now = Date.now();
  renderHeader(appState, now);
  renderShelf(appState.printers, now);
}

async function loadStatus() {
  const response = await fetch("data/status.json");
  const data = await response.json();
  appState = data;

  renderNow();
}

loadStatus();
setInterval(renderNow, RENDER_REFRESH_MS);
