import { Grid } from "./grid";
import { Canvas } from "./canvas";
import { Snake } from "./snake";
import { Food } from "./food";
import { Engine } from "./engine";
import { DIRECTION } from "./keyboard";
import { Context } from "./context";

type StateEnum = "game" | "view" | "global";

export type GameState = {
  constants: {
    SNAKE_SIZE: number;
    FOOD_SIZE: number;
    SNAKE_VELOCITY: number;
  };
  direction: DIRECTION;
  score: number;
  snake: Snake;
  food: Food;
};

export type ViewState = {
  grid: Grid;
};

export type GlobalState = {
  id: string;
  canvas: Canvas;
  engine: Engine;
  context: Context;
};

type StateObject = {
  game: GameState;
  view: ViewState;
  global: GlobalState;
};

let state: StateObject = {
  game: {
    constants: {
      SNAKE_SIZE: null,
      FOOD_SIZE: null,
      SNAKE_VELOCITY: null,
    },
    direction: null,
    score: 0,
    snake: null,
    food: null,
  },
  view: {
    grid: null,
  },
  global: {
    id: null,
    canvas: null,
    engine: null,
    context: null,
  },
};

export type State = {
  get: <T>(type: StateEnum) => T;
  set: <T>(type: StateEnum, newState: T) => void;
  reset: () => void;
};

export default function State(): State {
  function getTargetState<T>(type: StateEnum): T {
    return (state[type] as unknown) as T;
  }

  function get<T>(type: StateEnum): T {
    const targetState = (getTargetState(type) as unknown) as T;

    return targetState;
  }

  function set<T>(type: StateEnum, newState: T): void {
    ((state[type] as unknown) as T) = newState;
  }

  function reset(): void {
    state = {
      game: {
        constants: {
          SNAKE_SIZE: null,
          FOOD_SIZE: null,
          SNAKE_VELOCITY: null,
        },
        direction: null,
        score: 0,
        snake: null,
        food: null,
      },
      view: {
        grid: null,
      },
      global: {
        ...state.global,
      },
    };
  }

  const self: State = {
    get,
    set,
    reset,
  };

  return Object.freeze(self);
}
