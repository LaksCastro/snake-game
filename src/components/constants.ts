import Utils from "./utils";
import State, { ViewState, GameState } from "./state";

export type Constants = {
  configure: () => void;
};

export default function Constants(): Constants {
  const state = State();
  const utils = Utils();

  let gameConstants = {
    SNAKE_SIZE: null,
    FOOD_SIZE: null,
    SNAKE_VELOCITY: null,
  };

  function configure(): void {
    const { pixelSize } = state.get<ViewState>("view").grid;

    const percentToPixels = utils.interpolate([0, 100], [0, pixelSize]);

    gameConstants["SNAKE_SIZE"] = percentToPixels(100);

    gameConstants["FOOD_SIZE"] = percentToPixels(50);

    gameConstants["SNAKE_VELOCITY"] = 500;

    const currentState = state.get<GameState>("game");
    state.set<GameState>("game", { ...currentState, constants: gameConstants });
  }

  const self: Constants = {
    configure,
  };

  return Object.freeze(self);
}
