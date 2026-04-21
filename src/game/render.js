import { cellKey } from "./board.js";

function getCellPresentation(state, tile) {
  const key = cellKey(tile.x, tile.y);
  const isRevealed = state.revealed.has(key);
  const isFlagged = state.flagged.has(key);

  if (state.status === "lost" && state.explodedKey === key) {
    return { classes: ["revealed", "mine", "exploded"], label: "*" };
  }

  if (state.status === "lost" && isFlagged && !tile.mine) {
    return { classes: ["hidden", "incorrect-flag"], label: "X" };
  }

  if (isRevealed) {
    if (tile.mine) {
      return { classes: ["revealed", "mine"], label: "*" };
    }

    if (tile.adjacent > 0) {
      return { classes: ["revealed", `n${tile.adjacent}`], label: String(tile.adjacent) };
    }

    return { classes: ["revealed", "empty"], label: "" };
  }

  if (state.status === "lost" && tile.mine) {
    return { classes: ["revealed", "mine"], label: "*" };
  }

  if (isFlagged) {
    return { classes: ["hidden", "flagged"], label: "F" };
  }

  return { classes: ["hidden"], label: "" };
}

export function renderBoard(boardElement, state) {
  boardElement.style.setProperty("--columns", String(state.config.width));
  boardElement.innerHTML = "";

  const fragment = document.createDocumentFragment();

  for (let y = 0; y < state.config.height; y += 1) {
    for (let x = 0; x < state.config.width; x += 1) {
      const tile = state.board[y][x];
      const presentation = getCellPresentation(state, tile);
      const button = document.createElement("button");

      button.type = "button";
      button.className = `tile ${presentation.classes.join(" ")}`;
      button.dataset.tile = "true";
      button.dataset.key = cellKey(x, y);
      button.dataset.x = String(x);
      button.dataset.y = String(y);
      button.textContent = presentation.label;
      button.setAttribute("aria-label", `Tile ${x + 1}, ${y + 1}`);

      fragment.appendChild(button);
    }
  }

  boardElement.appendChild(fragment);
}
