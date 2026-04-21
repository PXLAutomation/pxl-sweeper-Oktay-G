export function cellKey(x, y) {
  return `${x},${y}`;
}

export function createEmptyBoard(config) {
  return Array.from({ length: config.height }, (_, y) =>
    Array.from({ length: config.width }, (_, x) => ({
      x,
      y,
      mine: false,
      adjacent: 0,
    })),
  );
}

export function getTile(board, x, y) {
  return board[y]?.[x] ?? null;
}

export function forEachNeighbor(board, x, y, callback) {
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) {
        continue;
      }

      const tile = getTile(board, x + dx, y + dy);

      if (tile) {
        callback(tile);
      }
    }
  }
}

export function generateBoard(config, safeX, safeY) {
  const board = createEmptyBoard(config);
  const blocked = new Set();
  const candidates = [];

  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      const x = safeX + dx;
      const y = safeY + dy;

      if (x >= 0 && x < config.width && y >= 0 && y < config.height) {
        blocked.add(cellKey(x, y));
      }
    }
  }

  for (let y = 0; y < config.height; y += 1) {
    for (let x = 0; x < config.width; x += 1) {
      if (!blocked.has(cellKey(x, y))) {
        candidates.push(board[y][x]);
      }
    }
  }

  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [candidates[index], candidates[swapIndex]] = [candidates[swapIndex], candidates[index]];
  }

  for (let index = 0; index < config.mines; index += 1) {
    candidates[index].mine = true;
  }

  for (let y = 0; y < config.height; y += 1) {
    for (let x = 0; x < config.width; x += 1) {
      const tile = board[y][x];

      if (tile.mine) {
        continue;
      }

      let adjacent = 0;

      forEachNeighbor(board, x, y, (neighbor) => {
        if (neighbor.mine) {
          adjacent += 1;
        }
      });

      tile.adjacent = adjacent;
    }
  }

  return board;
}
