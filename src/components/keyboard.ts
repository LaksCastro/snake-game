type Listener = (direction: DIRECTION) => any;

export type DIRECTION = "up" | "down" | "left" | "right";

export type Keyboard = {
  once: (listener: Listener) => void;
  onUp: (listener: Listener) => void;
  onDown: (listener: Listener) => void;
  onLeft: (listener: Listener) => void;
  onRight: (listener: Listener) => void;
  listen: () => void;
};

export default function Keyboard(): Keyboard {
  const events = {};

  const codes = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  };

  function codeToEnum(code) {
    return codes[code];
  }

  function once(listener: Listener) {
    window.addEventListener("keydown", function onlyOnceTime(e) {
      if (events[e.code] === undefined) return;

      listener(codeToEnum(e.code));

      window.removeEventListener("keydown", onlyOnceTime);
    });
  }

  function onDown(listener: Listener): void {
    events["ArrowDown"] = () => listener("down");
  }

  function onUp(listener: Listener): void {
    events["ArrowUp"] = () => listener("up");
  }

  function onLeft(listener: Listener): void {
    events["ArrowLeft"] = () => listener("left");
  }

  function onRight(listener: Listener): void {
    events["ArrowRight"] = () => listener("right");
  }

  function listen() {
    window.addEventListener("keydown", (e) => events[e.code]?.call());
  }

  const self: Keyboard = {
    onDown,
    onUp,
    onLeft,
    onRight,
    listen,
    once,
  };

  return Object.freeze(self);
}
