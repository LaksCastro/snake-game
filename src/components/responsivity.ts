import Grid from "./grid";
import Alignment from "./alignment";
import Dimensions from "./dimensions";
import State, { ViewState } from "./state";
import { DimensionSize } from "./dimensions";

const BREAKPOINTS = {
  "2158": 40,
  "1984": 35,
  "1642": 30,
  "1200": 25,
  "861": 20,
  "551": 15,
  "320": 10,
  "0": 8,
};

export type Responsivity = {
  configure: () => void;
};

export default function Responsivity(): Responsivity {
  const alignment = Alignment();
  const dimensions = Dimensions();
  const state = State();

  function getWindowDimensions(): DimensionSize {
    const { innerWidth: width, innerHeight: height } = window;

    return {
      width,
      height,
    };
  }

  function getBreakpointsArray(): number[] {
    return Object.keys(BREAKPOINTS)
      .map((breakpoint) => Number(breakpoint))
      .reverse();
  }

  function getColumnsLength(width: number): number {
    let columnsLength = null;

    const breakpoints = getBreakpointsArray();

    for (const breakpoint of breakpoints) {
      if (width < breakpoint) continue;

      columnsLength = BREAKPOINTS[breakpoint];
      break;
    }

    return columnsLength;
  }

  function getPixelSize(width: number, columnsLength: number): number {
    return width / columnsLength;
  }

  function configure(): void {
    const { width, height } = getWindowDimensions();

    const columnsLength = getColumnsLength(width);

    const pixelSize = getPixelSize(width, columnsLength);

    const rowsLength = Math.floor(height / pixelSize);

    const gridWidth = window.innerWidth;
    const gridHeight = pixelSize * rowsLength;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const gridDimensions = dimensions.create(gridWidth, gridHeight);
    const viewportDimensions = dimensions.create(viewportWidth, viewportHeight);

    const gridStartPoint = alignment.align(viewportDimensions, gridDimensions);

    const grid = Grid({
      columns: columnsLength,
      rows: rowsLength,
      pixelSize,
      startPoint: gridStartPoint,
    });

    const currentState = state.get<ViewState>("view");
    state.set<ViewState>("view", { ...currentState, grid });
  }

  const self: Responsivity = {
    configure,
  };

  return Object.freeze(self);
}
