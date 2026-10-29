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

// Turns a minute count into "H:MM" or "M:SS"-style text like the design (e.g. 42 -> "0:42").
function formatTimeLeft(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}:${String(minutes).padStart(2, "0")}`;
}

// Fills the printer "door" element with content based on the printer's state.
function fillDoorContent(door, printer) {
  if (printer.state === "printing") {
    const ring = document.createElement("div");
    ring.className = "ring";
    ring.style.setProperty("--pct", printer.progress);
    ring.style.setProperty("--ring-color", "var(--printing)");

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

  if (printer.state === "done") {
    const doneText = document.createElement("div");
    doneText.className = "done-text";

    const big = document.createElement("span");
    big.className = "big";
    big.textContent = "DONE";

    const small = document.createElement("span");
    small.className = "small";
    small.textContent = "waiting for pickup";

    doneText.append(big, small);
    door.append(doneText);
    return;
  }

  if (printer.state === "paused") {
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

// Builds one printer card element from a single printer's data.
function buildPrinterCard(printer) {
  const card = document.createElement("div");
  card.className = "printer";

  const lid = document.createElement("div");
  lid.className = "printer-lid";

  const statusTag = document.createElement("span");
  statusTag.className = `status-tag ${printer.state}`;
  statusTag.textContent = STATUS_LABELS[printer.state] ?? printer.state;

  const numberTag = document.createElement("span");
  numberTag.className = "number-tag";
  numberTag.textContent = `#${printer.number}`;

  lid.append(statusTag, numberTag);

  const doorWrap = document.createElement("div");
  doorWrap.className = "printer-door";
  fillDoorContent(doorWrap, printer);

  const screen = document.createElement("div");
  screen.className = "printer-screen";

  const model = document.createElement("span");
  model.textContent = printer.model;
  screen.append(model);

  card.append(lid, doorWrap, screen);
  return card;
}

// Fills the three shelf rows with 3 printer cards each, in order.
function renderShelf(printers) {
  const rows = [
    document.getElementById("shelf-row-1"),
    document.getElementById("shelf-row-2"),
    document.getElementById("shelf-row-3"),
  ];

  printers.forEach((printer, index) => {
    const rowIndex = Math.floor(index / 3);
    rows[rowIndex].append(buildPrinterCard(printer));
  });
}

// Updates the header's "AVAILABLE NOW" count and "LAST SYNC" time.
function renderHeader(state) {
  const availableCount = state.printers.filter((p) => p.state === "available").length;
  document.getElementById("available-count").textContent = `${availableCount} / ${state.printers.length}`;

  const syncTime = new Date(state.lastUpdated);
  document.getElementById("last-sync").textContent = syncTime.toLocaleTimeString();
}

// Loads data/status.json once and keeps it in this single state variable.
let appState = null;

async function loadStatus() {
  const response = await fetch("data/status.json");
  const data = await response.json();
  appState = data;

  renderHeader(appState);
  renderShelf(appState.printers);
}

loadStatus();
