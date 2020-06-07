import { DimensionSize } from "./dimensions";
import State, { GlobalState } from "./state";

export type Canvas = {
  getElement: () => HTMLCanvasElement;
  getContext: () => CanvasRenderingContext2D;
  getDimensions: () => DimensionSize;
  configure: () => void;
  update: () => void;
};

export default function Canvas(): Canvas {
  const state = State();

  const { id } = state.get<GlobalState>("global");

  function getElement(): HTMLCanvasElement {
    const element = document.getElementById(id) as HTMLCanvasElement;

    return element;
  }

  function getContext(): CanvasRenderingContext2D {
    const element = getElement();

    const context = element.getContext("2d");

    return context;
  }

  function getDimensions(): DimensionSize {
    const { width, height } = getElement().getBoundingClientRect();

    const data: DimensionSize = {
      width,
      height,
    };

    return data;
  }

  function setCanvasDimensions(): void {
    const canvas = getElement();

    const { width, height } = getDimensions();

    canvas.width = width;
    canvas.height = height;
  }

  function configure(): void {
    const currentState = state.get<GlobalState>("global");

    setCanvasDimensions();

    state.set("global", {
      ...currentState,
      canvas: this,
    });
  }

  function update(): void {
    setCanvasDimensions();
  }

  const self: Canvas = {
    getElement,
    getContext,
    getDimensions,
    configure,
    update,
  };

  return Object.freeze(self);
}
