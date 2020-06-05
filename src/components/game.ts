import State, { GlobalState, ViewState, GameState } from "./state";
import Responsivity from "./responsivity";
import Canvas from "./canvas";
import Constants from "./constants";
import Snake from "./snake";
import Food from "./food";
import Engine from "./engine";

export type Game = {
  preLoad: () => void;
  start: () => void;
};

export default function Game(id: string): Game {
  const state = State();
  const currentState = state.get<GlobalState>("global");
  state.set<GlobalState>("global", { ...currentState, id });

  const responsivity = Responsivity();
  const canvas = Canvas();
  const constants = Constants();
  const snake = Snake();
  const food = Food();
  const engine = Engine();

  function preLoad(): void {
    responsivity.configure();
    canvas.configure();
    constants.configure();
    snake.configure();
    food.configure();
    engine.configure();
  }

  function start(): void {
    engine.start();
  }

  const self: Game = {
    start,
    preLoad,
  };

  return Object.freeze(self);
}
