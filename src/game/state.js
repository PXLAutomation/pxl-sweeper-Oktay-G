import { createEmptyBoard } from "./board.js";

export const DIFFICULTIES = {
  beginner: {
    key: "beginner",
    label: "Beginner",
    width: 9,
    height: 9,
    mines: 10,
  },
  intermediate: {
    key: "intermediate",
    label: "Intermediate",
    width: 16,
    height: 16,
    mines: 40,
  },
  expert: {
    key: "expert",
    label: "Expert",
    width: 30,
    height: 16,
    mines: 99,
  },
};

export function createGameState(difficultyKey = "beginner") {
  const config = DIFFICULTIES[difficultyKey];

  return {
    difficultyKey,
    config,
    board: createEmptyBoard(config),
    boardGenerated: false,
    revealed: new Set(),
    flagged: new Set(),
    status: "idle",
    timer: 0,
    mineCounter: config.mines,
    explodedKey: null,
  };
}

export function resetGame(state, difficultyKey = state.difficultyKey) {
  const config = DIFFICULTIES[difficultyKey];

  state.difficultyKey = difficultyKey;
  state.config = config;
  state.board = createEmptyBoard(config);
  state.boardGenerated = false;
  state.revealed = new Set();
  state.flagged = new Set();
  state.status = "idle";
  state.timer = 0;
  state.mineCounter = config.mines;
  state.explodedKey = null;
}

export function tickTimer(state) {
  if (state.status !== "playing") {
    return;
  }

  state.timer = Math.min(state.timer + 1, 999);
}
