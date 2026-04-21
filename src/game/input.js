function getTileElement(target) {
  return target.closest("[data-tile='true']");
}

function getCoordinates(element) {
  return {
    x: Number(element.dataset.x),
    y: Number(element.dataset.y),
    key: element.dataset.key,
  };
}

function buttonMask(button) {
  if (button === 0) {
    return 1;
  }

  if (button === 2) {
    return 2;
  }

  return 0;
}

export function bindBoardInput(boardElement, callbacks) {
  let pressedMask = 0;
  let activeKey = null;
  let chordFired = false;

  function resetPointerState() {
    pressedMask = 0;
    activeKey = null;
    chordFired = false;
  }

  boardElement.addEventListener("contextmenu", (event) => {
    if (getTileElement(event.target)) {
      event.preventDefault();
    }
  });

  boardElement.addEventListener("mousedown", (event) => {
    const tileElement = getTileElement(event.target);

    if (!tileElement) {
      return;
    }

    event.preventDefault();

    const { x, y, key } = getCoordinates(tileElement);
    pressedMask |= buttonMask(event.button);

    if (activeKey && activeKey !== key) {
      activeKey = key;
      chordFired = false;
    } else if (!activeKey) {
      activeKey = key;
    }

    if (pressedMask === 3 && !chordFired) {
      chordFired = true;
      callbacks.onChord(x, y);
    }
  });

  boardElement.addEventListener("mouseup", (event) => {
    const tileElement = getTileElement(event.target);
    const mask = buttonMask(event.button);

    if (!tileElement) {
      pressedMask &= ~mask;
      if (pressedMask === 0) {
        resetPointerState();
      }
      return;
    }

    event.preventDefault();

    const { x, y, key } = getCoordinates(tileElement);
    const shouldFire = !chordFired && activeKey === key;

    if (shouldFire) {
      if (event.button === 0) {
        callbacks.onReveal(x, y);
      } else if (event.button === 2) {
        callbacks.onFlag(x, y);
      }
    }

    pressedMask &= ~mask;

    if (pressedMask === 0) {
      resetPointerState();
    }
  });

  boardElement.addEventListener("dblclick", (event) => {
    const tileElement = getTileElement(event.target);

    if (!tileElement) {
      return;
    }

    event.preventDefault();

    const { x, y } = getCoordinates(tileElement);
    callbacks.onChord(x, y);
  });

  window.addEventListener("mouseup", () => {
    if (pressedMask === 0) {
      resetPointerState();
    }
  });
}
