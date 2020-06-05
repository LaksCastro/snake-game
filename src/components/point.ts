export type PointObject = {
  x: number;
  y: number;
};

export type Point = {
  create: (x: number, y: number) => PointObject;
};

export default function Point(): Point {
  function create(x: number, y: number): PointObject {
    return {
      x,
      y,
    };
  }

  const self: Point = {
    create,
  };

  return Object.freeze(self);
}
