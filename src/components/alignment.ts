import { Point } from "./point";

import { DimensionSize } from "./dimensions";

export type Alignment = {
  align: (container: DimensionSize, content: DimensionSize) => Point;
};

export default function Alignment(): Alignment {
  function align(container: DimensionSize, content: DimensionSize): Point {
    const { width: containerW, height: containerH } = container;
    const { width: contentW, height: contentH } = content;

    const centerX = (containerW - contentW) / 2;
    const centerY = (containerH - contentH) / 2;

    return {
      x: centerX,
      y: centerY,
    };
  }

  const self: Alignment = {
    align,
  };

  return Object.freeze(self);
}
