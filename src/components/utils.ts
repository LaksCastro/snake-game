type Range = [number, number];

export type Utils = {
  interpolate: (xInterval: Range, yInterval: Range) => (xA: number) => number;
  randomInt: (params: {
    min: number;
    max: number;
    exclude: number[];
  }) => number;
};

export default function Utils(): Utils {
  function interpolate(
    xInterval: Range,
    yInterval: Range
  ): (xA: number) => number {
    const [x0, x1] = xInterval;
    const [y0, y1] = yInterval;

    return (xA: number): number => {
      if (xA > x1) xA = x1;
      else if (xA < x0) xA = x0;

      const yA = y0 + (y1 - y0) * ((xA - x0) / (x1 - x0));

      return yA;
    };
  }

  function randomInt(params: {
    min: number;
    max: number;
    exclude: number[];
  }): number {
    const { min, max, exclude } = params;

    const random = Math.floor(Math.random() * (max - min + 1) + min);

    if (exclude.includes(random)) return randomInt(params);

    return random;
  }

  const self: Utils = {
    interpolate,
    randomInt,
  };

  return Object.freeze(self);
}
