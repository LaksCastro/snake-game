import State, { ViewState, GameState } from "./state";
import Utils from "./utils";

export type Food = {
  changeIndex: () => void;
  configure: () => void;
  currentIndex: number;
};

export default function Food(): Food {
  const state = State();
  const utils = Utils();

  let currentIndex = null;

  let lastIndex: number;

  function configure(): void {
    const { grid } = state.get<ViewState>("view");

    lastIndex = grid.getLastIndex();

    const {
      snake: { parts: snakeParts },
    } = state.get<GameState>("game");

    currentIndex = utils.randomInt({
      min: 0,
      max: lastIndex,
      exclude: snakeParts,
    });

    const currentState = state.get<GameState>("game");

    state.set<GameState>("game", {
      ...currentState,
      food: { ...this, currentIndex },
    });
  }

  function changeIndex(): void {
    const currentState = state.get<GameState>("game");

    currentIndex = utils.randomInt({
      min: 0,
      max: lastIndex,
      exclude: currentState.snake.parts,
    });

    state.set<GameState>("game", {
      ...currentState,
      food: { ...this, currentIndex },
    });
  }

  const self: Food = {
    configure,
    changeIndex,
    currentIndex,
  };

  return Object.freeze(self);
}
