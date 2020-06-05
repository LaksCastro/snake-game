import State, { ViewState, GameState } from "./state";

export type Snake = {
  eat: (index: number) => void;
  move: (newIndex: number) => void;
  configure: () => void;
  parts: number[];
};

export default function Snake(): Snake {
  const state = State();

  let parts: number[] = [];

  function eat(index: number): void {
    parts.push(index);
  }

  function move(newIndex): void {
    for (let i = parts.length - 1; i >= 0; i--) {
      parts[i] = parts[i - 1] || newIndex;
    }
  }

  function configure(): void {
    const { grid } = state.get<ViewState>("view");

    parts.push(grid.getCenterIndex());

    const currentState = state.get<GameState>("game");

    state.set<GameState>("game", { ...currentState, snake: this });
  }

  const self: Snake = {
    eat,
    move,
    configure,
    parts,
  };

  return Object.freeze(self);
}
