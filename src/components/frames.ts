export default function Frames(render: () => any) {
  function initialize() {
    function renderFrame() {
      render();
      initialize();
    }

    window.requestAnimationFrame(renderFrame);
  }

  const self = {
    initialize,
  };

  return Object.freeze(self);
}
