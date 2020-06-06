import State, { GlobalState } from "./state";
import Context from "./context";

export type Game = {
  preLoad: () => void;
  start: () => void;
  restart: () => void;
};

export default function Game(id: string): Game {
  const state = State();

  state.set<GlobalState>("global", { ...getGlobalState(), id });

  const context = Context();
  state.set<GlobalState>("global", { ...getGlobalState(), context });

  function preLoad(): void {
    context.configure("initGame");
  }

  function getGlobalState() {
    return state.get<GlobalState>("global");
  }

  function start(): void {
    const { engine } = state.get<GlobalState>("global");
    engine.start();
  }

  function restart(): void {
    const { engine } = state.get<GlobalState>("global");
    engine.reset();
  }

  const self: Game = {
    start,
    preLoad,
    restart,
  };

  return Object.freeze(self);
}
