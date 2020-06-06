export type Frames = {
  initialize: () => void;
  reset: () => void;
};

export default function Frames(render: () => any): Frames {
  let gameOver = false;

  function initialize(): void {
    if (gameOver) return;

    function renderFrame() {
      render();
      initialize();
    }

    window.requestAnimationFrame(() => renderFrame());
  }

  function reset(): void {
    gameOver = true;
  }

  const self: Frames = {
    initialize,
    reset,
  };

  return Object.freeze(self);
}
