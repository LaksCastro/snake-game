import Keyboard from "./keyboard";
import State, { GlobalState, ViewState } from "./state";
import Frames from "./frames";

export type Engine = {
  configure: () => void;
  start: () => void;
};

export default function Engine(): Engine {
  const keyboard = Keyboard();
  const state = State();
  const frames = Frames(renderFrame);

  function onUp(): void {}
  function onDown(): void {}
  function onLeft(): void {}
  function onRight(): void {}

  function onPlayerInit(): void {
    alert("a");
    enableAutoMove();
  }

  function renderFrame(): void {}

  function enableAutoMove() {}

  function drawLayout(): void {
    const { canvas } = state.get<GlobalState>("global");
    const { grid } = state.get<ViewState>("view");
    const { pixelSize } = grid;

    const ctx = canvas.getContext();

    ctx.beginPath();

    for (let i = 0; i < grid.getLastIndex(); i++) {
      const { x, y } = grid.getPointByIndex(i);
      console.log({ x, y });
      console.log(pixelSize);
      ctx.strokeStyle = "white";
      ctx.rect(x, y, pixelSize, pixelSize);
    }

    ctx.stroke();
  }

  function configure() {
    keyboard.once(onPlayerInit);
    keyboard.onUp(onUp);
    keyboard.onDown(onDown);
    keyboard.onLeft(onLeft);
    keyboard.onRight(onRight);

    drawLayout();
  }

  function start() {
    keyboard.listen();
    // frames.initialize();
  }

  const self: Engine = {
    configure,
    start,
  };

  return Object.freeze(self);
}
