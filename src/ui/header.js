function formatCounter(value) {
  const clamped = Math.min(Math.abs(value), 999);
  const digits = String(clamped).padStart(3, "0");

  return value < 0 ? `-${digits}` : digits;
}

function faceForStatus(status) {
  if (status === "won") {
    return "B)";
  }

  if (status === "lost") {
    return ":(";
  }

  return ":)";
}

export function createHeader(root, actions) {
  root.innerHTML = `
    <div class="counter" data-mine-counter>000</div>
    <button type="button" class="reset-button" data-reset-button aria-label="Reset game">:)</button>
    <div class="counter" data-timer>000</div>
  `;

  const elements = {
    mineCounter: root.querySelector("[data-mine-counter]"),
    timer: root.querySelector("[data-timer]"),
    resetButton: root.querySelector("[data-reset-button]"),
  };

  elements.resetButton.addEventListener("click", actions.onReset);

  return elements;
}

export function renderHeader(elements, state) {
  elements.mineCounter.textContent = formatCounter(state.mineCounter);
  elements.timer.textContent = formatCounter(state.timer);
  elements.resetButton.textContent = faceForStatus(state.status);
}
