export type Frames = {
  initialize: () => void;
  reset: () => void;
};

export default function Frames(render: () => any): Frames {
  let gameOver = false;

  function initialize() {
    function renderFrame() {
      if (gameOver) return;

      render();
      initialize();
    }

    window.requestAnimationFrame(renderFrame);
  }

  function reset() {
    gameOver = true;
  }

  const self: Frames = {
    initialize,
    reset,
  };

  return Object.freeze(self);
}
