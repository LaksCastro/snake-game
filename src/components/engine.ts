import Keyboard, { DIRECTION } from "./keyboard";
import State, { GlobalState, ViewState, GameState } from "./state";
import Frames from "./frames";
import Alignment from "./alignment";
import Dimensions from "./dimensions";

export type Engine = {
  configure: () => void;
  start: () => void;
  reset: () => void;
};

export default function Engine(): Engine {
  const keyboard = Keyboard();
  const state = State();
  let frames = Frames(renderFrame);
  const alignment = Alignment();
  const dimensions = Dimensions();

  let loopId = null;
  let allowPress = true;

  function gameOver(): void {
    alert("Game Over!!! >:D\nTotal Score: " + getScore());

    reset();
  }

  function reset(): void {
    window.clearTimeout(loopId);
    frames.reset();
    state.reset();
    keyboard.reset();

    loopId = null;

    reinit();
  }

  function reinit(): void {
    const { context } = state.get<GlobalState>("global");

    context.configure("newTry");

    frames = Frames(renderFrame);

    configure();
    start();
  }

  function getGameState(): GameState {
    return state.get<GameState>("game");
  }

  function getScore(): number {
    return getGameState().score;
  }

  function addScore(score: number): void {
    const currentState = getGameState();

    state.set<GameState>("game", {
      ...currentState,
      score: currentState.score + score,
    });
  }

  function directionToGridFunc(direction: DIRECTION): string {
    const dir = {
      up: "getAbove",
      down: "getBelow",
      left: "getPrev",
      right: "getNext",
    };

    return dir[direction];
  }

  function isValidDirection(
    currentDirection: DIRECTION,
    newDirection: DIRECTION
  ): boolean {
    let valid = false;

    const directionsEnum = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };

    valid = directionsEnum[currentDirection] !== newDirection;

    return valid;
  }

  function onUp(): void {
    if (!isValidDirection(getGameState().direction, "up") || !allowPress)
      return;

    allowPress = false;

    state.set<GameState>("game", { ...getGameState(), direction: "up" });
  }

  function onDown(): void {
    if (!isValidDirection(getGameState().direction, "down") || !allowPress)
      return;

    allowPress = false;

    state.set<GameState>("game", { ...getGameState(), direction: "down" });
  }

  function onLeft(): void {
    if (!isValidDirection(getGameState().direction, "left") || !allowPress)
      return;

    allowPress = false;

    state.set<GameState>("game", { ...getGameState(), direction: "left" });
  }

  function onRight(): void {
    if (!isValidDirection(getGameState().direction, "right") || !allowPress)
      return;

    allowPress = false;

    state.set<GameState>("game", { ...getGameState(), direction: "right" });
  }

  function onPlayerInit(direction: DIRECTION): void {
    const currentState = state.get<GameState>("game");
    state.set<GameState>("game", { ...currentState, direction });

    keyboard.listen();

    frames.initialize();

    enableAutoMove();
  }

  function renderFrame(): void {
    clearCanvas();
    drawLayout();
    drawSnake();
    drawFood();
  }

  function enableAutoMove(): void {
    const { SNAKE_VELOCITY: velocity } = state.get<GameState>("game").constants;

    const { grid } = state.get<ViewState>("view");

    function moveLoop() {
      const { direction, snake, food } = state.get<GameState>("game");

      const funcName = directionToGridFunc(direction);

      const nextIndex = grid[funcName](snake.parts[0]);

      if (snake.parts.indexOf(nextIndex) !== -1) {
        return gameOver();
      } else if (nextIndex === food.currentIndex) {
        snake.eat(food.currentIndex);
        food.changeIndex();
        addScore(50);
      }

      snake.move(nextIndex);
      allowPress = true;

      loopId = window.setTimeout(moveLoop, velocity / 7);
    }

    moveLoop();
  }

  function drawLayout(): void {
    const { canvas } = state.get<GlobalState>("global");
    const { grid } = state.get<ViewState>("view");
    const { pixelSize } = grid;

    const ctx = canvas.getContext();

    ctx.beginPath();

    ctx.lineWidth = 3;

    for (let i = 0; i < grid.getLastIndex(); i++) {
      const { x, y } = grid.getPointByIndex(i);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.0125)";

      ctx.rect(x, y, pixelSize, pixelSize);
    }

    ctx.stroke();
  }

  function drawSnake(): void {
    const { canvas } = state.get<GlobalState>("global");
    const { grid } = state.get<ViewState>("view");

    const {
      constants: { SNAKE_SIZE: snakeSize },
      snake: { parts },
    } = state.get<GameState>("game");

    const { pixelSize } = grid;
    const ctx = canvas.getContext();

    const containerDimensions = dimensions.create(pixelSize, pixelSize);
    const snakePartDimensions = dimensions.create(snakeSize, snakeSize);

    const { x: alignedX, y: alignedY } = alignment.align(
      containerDimensions,
      snakePartDimensions
    );

    ctx.beginPath();

    for (const part of parts) {
      const { x: containerX, y: containerY } = grid.getPointByIndex(part);

      ctx.fillStyle = "#2F352E";

      const x = containerX + alignedX;
      const y = containerY + alignedY;

      ctx.rect(x, y, snakeSize, snakeSize);
    }

    ctx.fill();
  }

  function drawFood(): void {
    const { canvas } = state.get<GlobalState>("global");
    const { grid } = state.get<ViewState>("view");

    const {
      constants: { FOOD_SIZE: foodSize },
      food: { currentIndex },
    } = state.get<GameState>("game");

    const { pixelSize } = grid;
    const ctx = canvas.getContext();

    const containerDimensions = dimensions.create(pixelSize, pixelSize);
    const foodPartDimensions = dimensions.create(foodSize, foodSize);

    const { x: alignedX, y: alignedY } = alignment.align(
      containerDimensions,
      foodPartDimensions
    );

    ctx.beginPath();

    const { x: containerX, y: containerY } = grid.getPointByIndex(currentIndex);

    ctx.strokeStyle = "#2F352E";
    ctx.lineWidth = 3;

    const x = containerX + alignedX;
    const y = containerY + alignedY;

    ctx.rect(x, y, foodSize, foodSize);

    ctx.stroke();
  }

  function clearCanvas(): void {
    const { canvas } = state.get<GlobalState>("global");

    const ctx = canvas.getContext();

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  function configure() {
    keyboard.onUp(onUp);
    keyboard.onDown(onDown);
    keyboard.onLeft(onLeft);
    keyboard.onRight(onRight);
  }

  function start() {
    renderFrame();
    keyboard.once(onPlayerInit);
  }

  const self: Engine = {
    configure,
    start,
    reset,
  };

  return Object.freeze(self);
}
