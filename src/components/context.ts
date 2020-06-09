import State, { GlobalState } from "./state";
import Responsivity from "./responsivity";
import Canvas from "./canvas";
import Constants from "./constants";
import Snake from "./snake";
import Food from "./food";
import Engine from "./engine";

type WhichContext = "initGame" | "newTry";

export type Context = {
  configure: (context: WhichContext) => void;
};

export default function Context(): Context {
  const state = State();
  const responsivity = Responsivity();
  const canvas = Canvas();
  const constants = Constants();
  const snake = Snake();
  const food = Food();
  const engine = Engine();

  state.set<GlobalState>("global", { ...getGlobalState(), engine });

  const contexts = {
    initGame: function () {
      responsivity.configure();
      canvas.configure();
      constants.configure();
      snake.configure();
      food.configure();
      engine.configure();
    },
    newTry: function () {
      const { canvas } = state.get<GlobalState>("global");

      const responsivity = Responsivity();
      const constants = Constants();
      const snake = Snake();
      const food = Food();

      responsivity.configure();
      canvas.update();
      constants.configure();
      snake.configure();
      food.configure();
    },
  };

  function getGlobalState(): GlobalState {
    return state.get<GlobalState>("global");
  }

  function configure(context: WhichContext): void {
    contexts[context]();
  }

  const self = {
    configure,
  };

  return Object.freeze(self);
}
