import { DimensionSize } from "./dimensions";
import State, { GlobalState } from "./state";

export type Canvas = {
  getElement: () => HTMLCanvasElement;
  getContext: () => CanvasRenderingContext2D;
  getDimensions: () => DimensionSize;
  configure: () => void;
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

  function configure() {
    const currentState = state.get<GlobalState>("global");

    const canvas = getElement();

    const { clientWidth: width, clientHeight: height } = canvas;

    canvas.width = width;
    canvas.height = height;

    state.set("global", {
      ...currentState,
      canvas: this,
    });
  }

  const self: Canvas = {
    getElement,
    getContext,
    getDimensions,
    configure,
  };

  return Object.freeze(self);
}
