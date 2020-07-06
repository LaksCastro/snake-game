export type DimensionSize = {
  width: number;
  height: number;
};

export type Dimensions = {
  create: (width: number, height: number) => DimensionSize;
};

export default function Dimensions(): Dimensions {
  function create(width, height): DimensionSize {
    return {
      width,
      height,
    };
  }

  const self: Dimensions = {
    create,
  };

  return Object.freeze(self);
}
