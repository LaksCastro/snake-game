import Point, { PointObject } from "./point";

import { DimensionSize } from "./dimensions";

export type Alignment = {
  align: (container: DimensionSize, content: DimensionSize) => PointObject;
};

export default function Alignment(): Alignment {
  const point = Point();

  function align(
    container: DimensionSize,
    content: DimensionSize
  ): PointObject {
    const { width: containerW, height: containerH } = container;
    const { width: contentW, height: contentH } = content;

    const centerX = (containerW - contentW) / 2;
    const centerY = (containerH - contentH) / 2;

    return point.create(centerX, centerY);
  }

  const self: Alignment = {
    align,
  };

  return Object.freeze(self);
}
