import Point, { PointObject } from "./point";

export type Grid = {
  getLastIndex: () => number;
  getPointByIndex: (index: number) => PointObject;
  getCenterIndex: () => number;
  getAbove: (index: number) => number;
  getBelow: (index: number) => number;
  getNext: (index: number) => number;
  getPrev: (index: number) => number;
  pixelSize: number;
};

export default function Grid(gridParams: {
  columns: number;
  rows: number;
  pixelSize: number;
  startPoint: PointObject;
}): Grid {
  const point = Point();

  const {
    columns,
    rows,
    startPoint: { x: initialX, y: initialY },
    pixelSize,
  } = gridParams;

  function onForMore(index: number): boolean {
    return index > getLastIndex();
  }

  function onForLess(index: number): boolean {
    return index < 0;
  }

  function isValidIndex(index: number): boolean {
    return !onForLess(index) && !onForMore(index);
  }

  function validateIndex(index: number): void {
    if (!isValidIndex(index)) {
      throw new Error(
        "The Grid Index must be a value between 0 and " + getLastIndex()
      );
    }
  }

  function rowOf(index: number): number {
    return Math.floor(index / columns) + 1;
  }

  function getCenterIndex(): number {
    return columns * Math.floor(rows / 2) + Math.floor(columns / 2);
  }

  function getLastIndex(): number {
    return columns * rows;
  }

  function getNext(index: number): number {
    const currentRow = rowOf(index);

    const probableNextIndex = index + 1;

    const newRow = rowOf(probableNextIndex);

    if (currentRow !== newRow) return index - columns + 1;
    else return probableNextIndex;
  }

  function getPrev(index: number): number {
    const currentRow = rowOf(index);

    const probablePrevIndex = index - 1;

    const newRow = rowOf(probablePrevIndex);

    if (currentRow !== newRow) return index + columns - 1;
    else return probablePrevIndex;
  }

  function getAbove(index: number): number {
    const probableAboveIndex = index - columns;

    if (onForLess(probableAboveIndex)) return index + columns * (rows - 1);
    else return probableAboveIndex;
  }

  function getBelow(index: number): number {
    const probableBelowIndex = index + columns;

    if (onForMore(probableBelowIndex)) return index - columns * (rows - 1);
    else return probableBelowIndex;
  }

  function getPointByIndex(index: number): PointObject {
    validateIndex(index);

    const row = Math.floor(index / columns);
    const column = index - row * columns;

    const x = initialX + column * pixelSize;
    const y = initialY + row * pixelSize;

    const targetPoint = point.create(x, y);

    return targetPoint;
  }

  const self: Grid = {
    getLastIndex,
    getPointByIndex,
    pixelSize,
    getCenterIndex,
    getAbove,
    getBelow,
    getNext,
    getPrev,
  };

  return Object.freeze(self);
}
