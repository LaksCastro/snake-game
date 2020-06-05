import Point, { PointObject } from "./point";

export type Grid = {
  getLastIndex: () => number;
  getPointByIndex: (index: number) => PointObject;
  getCenterIndex: () => number;
  pixelSize: number;
};

export default function Grid(gridParams: {
  columns: number;
  rows: number;
  pixelSize: number;
  startPoint: PointObject;
}) {
  const point = Point();

  const {
    columns,
    rows,
    startPoint: { x: initialX, y: initialY },
    pixelSize,
  } = gridParams;

  function validateIndex(index) {
    if (index < 0) {
      throw new Error(
        "The Grid Index must be a value between 0 and " + getLastIndex()
      );
    }

    if (index > getLastIndex()) {
      throw new Error(
        "The Grid Index must be a value between 0 and " + getLastIndex()
      );
    }
  }

  function getCenterIndex() {
    return columns * Math.floor(rows / 2) + Math.floor(columns / 2);
  }

  function getLastIndex() {
    return columns * rows;
  }

  function getPointByIndex(index: number) {
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
  };

  return Object.freeze(self);
}
