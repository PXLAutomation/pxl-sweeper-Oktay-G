import { cellKey, forEachNeighbor, generateBoard, getTile } from "./board.js";

function revealRegion(state, x, y) {
  const stack = [[x, y]];
  const visited = new Set();

  while (stack.length > 0) {
    const [currentX, currentY] = stack.pop();
    const key = cellKey(currentX, currentY);

    if (visited.has(key) || state.flagged.has(key) || state.revealed.has(key)) {
      continue;
    }

    visited.add(key);

    const tile = getTile(state.board, currentX, currentY);

    if (!tile || tile.mine) {
      continue;
    }

    state.revealed.add(key);

    if (tile.adjacent !== 0) {
      continue;
    }

    forEachNeighbor(state.board, currentX, currentY, (neighbor) => {
      stack.push([neighbor.x, neighbor.y]);
    });
  }
}

function countAdjacentFlags(state, x, y) {
  let flaggedCount = 0;

  forEachNeighbor(state.board, x, y, (neighbor) => {
    if (state.flagged.has(cellKey(neighbor.x, neighbor.y))) {
      flaggedCount += 1;
    }
  });

  return flaggedCount;
}

function syncMineCounter(state) {
  state.mineCounter = state.config.mines - state.flagged.size;
}

function hasWon(state) {
  return state.revealed.size === state.config.width * state.config.height - state.config.mines;
}

function applyWin(state) {
  state.status = "won";

  for (let y = 0; y < state.config.height; y += 1) {
    for (let x = 0; x < state.config.width; x += 1) {
      if (state.board[y][x].mine) {
        state.flagged.add(cellKey(x, y));
      }
    }
  }

  syncMineCounter(state);
}

function applyLoss(state, explodedKey) {
  state.status = "lost";
  state.explodedKey = explodedKey;
  syncMineCounter(state);
}

function ensureBoard(state, x, y) {
  if (state.boardGenerated) {
    return;
  }

  state.board = generateBoard(state.config, x, y);
  state.boardGenerated = true;
}

export function revealTile(state, x, y) {
  if (state.status === "won" || state.status === "lost") {
    return false;
  }

  const key = cellKey(x, y);

  if (state.flagged.has(key) || state.revealed.has(key)) {
    return false;
  }

  ensureBoard(state, x, y);
  state.status = "playing";

  const tile = getTile(state.board, x, y);

  if (!tile) {
    return false;
  }

  if (tile.mine) {
    applyLoss(state, key);
    return true;
  }

  revealRegion(state, x, y);

  if (hasWon(state)) {
    applyWin(state);
  }

  return true;
}

export function toggleFlag(state, x, y) {
  if (state.status === "won" || state.status === "lost") {
    return false;
  }

  const key = cellKey(x, y);

  if (state.revealed.has(key)) {
    return false;
  }

  if (state.flagged.has(key)) {
    state.flagged.delete(key);
  } else {
    state.flagged.add(key);
  }

  syncMineCounter(state);
  return true;
}

export function chordTile(state, x, y) {
  if (state.status !== "playing") {
    return false;
  }

  const key = cellKey(x, y);
  const tile = getTile(state.board, x, y);

  if (!tile || !state.revealed.has(key) || tile.adjacent === 0) {
    return false;
  }

  if (countAdjacentFlags(state, x, y) !== tile.adjacent) {
    return false;
  }

  const hiddenNeighbors = [];

  forEachNeighbor(state.board, x, y, (neighbor) => {
    const neighborKey = cellKey(neighbor.x, neighbor.y);

    if (!state.revealed.has(neighborKey) && !state.flagged.has(neighborKey)) {
      hiddenNeighbors.push(neighbor);
    }
  });

  if (hiddenNeighbors.length === 0) {
    return false;
  }

  let explodedKey = null;

  for (const neighbor of hiddenNeighbors) {
    if (neighbor.mine) {
      explodedKey = cellKey(neighbor.x, neighbor.y);
      continue;
    }

    revealRegion(state, neighbor.x, neighbor.y);
  }

  if (explodedKey) {
    applyLoss(state, explodedKey);
    return true;
  }

  if (hasWon(state)) {
    applyWin(state);
  }

  return true;
}
