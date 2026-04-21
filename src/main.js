import "./styles/main.css";

import { bindBoardInput } from "./game/input.js";
import { chordTile, revealTile, toggleFlag } from "./game/logic.js";
import { renderBoard } from "./game/render.js";
import { createGameState, DIFFICULTIES, resetGame, tickTimer } from "./game/state.js";
import { createHeader, renderHeader } from "./ui/header.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="app-shell">
    <section class="game-panel">
      <div class="header" data-header></div>
      <div class="difficulty" data-difficulty></div>
      <div class="board" data-board></div>
    </section>
  </main>
`;

const state = createGameState();
const headerElement = app.querySelector("[data-header]");
const difficultyElement = app.querySelector("[data-difficulty]");
const boardElement = app.querySelector("[data-board]");

let timerId = null;

const header = createHeader(headerElement, {
  onReset() {
    resetGame(state);
    syncTimer();
    render();
  },
});

function syncTimer() {
  if (state.status === "playing" && timerId === null) {
    timerId = window.setInterval(() => {
      tickTimer(state);
      renderHeader(header, state);
    }, 1000);
    return;
  }

  if (state.status !== "playing" && timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function renderDifficultyButtons() {
  difficultyElement.innerHTML = "";

  for (const difficulty of Object.values(DIFFICULTIES)) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "difficulty-button";
    button.textContent = difficulty.label;
    button.dataset.difficulty = difficulty.key;

    if (difficulty.key === state.difficultyKey) {
      button.classList.add("active");
    }

    difficultyElement.appendChild(button);
  }
}

function applyInteraction(action) {
  const changed = action();

  if (!changed) {
    return;
  }

  syncTimer();
  render();
}

function render() {
  renderHeader(header, state);
  renderDifficultyButtons();
  renderBoard(boardElement, state);
}

difficultyElement.addEventListener("click", (event) => {
  const button = event.target.closest("[data-difficulty]");

  if (!button) {
    return;
  }

  resetGame(state, button.dataset.difficulty);
  syncTimer();
  render();
});

bindBoardInput(boardElement, {
  onReveal(x, y) {
    applyInteraction(() => revealTile(state, x, y));
  },
  onFlag(x, y) {
    applyInteraction(() => toggleFlag(state, x, y));
  },
  onChord(x, y) {
    applyInteraction(() => chordTile(state, x, y));
  },
});

render();
