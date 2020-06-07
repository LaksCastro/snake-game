import Touch from "hammerjs";

type Listener = (direction: DIRECTION) => any;

export type DIRECTION = "up" | "down" | "left" | "right";

export type Keyboard = {
  once: (listener: Listener) => void;
  onUp: (listener: Listener) => void;
  onDown: (listener: Listener) => void;
  onLeft: (listener: Listener) => void;
  onRight: (listener: Listener) => void;
  listen: () => void;
  reset: () => void;
};

export default function Keyboard(): Keyboard {
  const events = {};

  const windowTouch = new Touch(window);

  windowTouch.get("swipe").set({ direction: Touch.DIRECTION_ALL });

  let alreadyStarted = false;

  let listeners = {};

  let onceListener: Listener;

  const codes = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    KeyW: "up",
    KeyS: "down",
    KeyA: "left",
    KeyD: "right",
  };

  function codeToEnum(code: string): DIRECTION {
    return codes[code];
  }

  function touchEventToCode(touch: string): string {
    const touchs = {
      swipeleft: "ArrowLeft",
      swiperight: "ArrowRight",
      swipeup: "ArrowUp",
      swipedown: "ArrowDown",
    };

    return touchs[touch];
  }

  function onlyOnceTimeWithKeys(e: KeyboardEvent): void {
    if (alreadyStarted)
      return window.removeEventListener("keydown", onlyOnceTimeWithKeys);

    if (events[e.code] === undefined) return;

    alreadyStarted = true;

    onceListener(codeToEnum(e.code));

    window.removeEventListener("keydown", onlyOnceTimeWithKeys);
    windowTouch.off(
      "swipeleft swipeup swipedown swiperight",
      onlyOnceTimeWithSwipe
    );
  }

  function onlyOnceTimeWithSwipe(e: KeyboardEvent): void {
    if (alreadyStarted) return windowTouch.off("swipe", onlyOnceTimeWithSwipe);

    const code = touchEventToCode(e.type);

    if (events[code] === undefined) return;

    alreadyStarted = true;

    onceListener(codeToEnum(code));

    window.removeEventListener("keydown", onlyOnceTimeWithKeys);
    windowTouch.off(
      "swipeleft swipeup swipedown swiperight",
      onlyOnceTimeWithSwipe
    );
  }

  function once(listener: Listener): void {
    onceListener = listener;

    window.addEventListener("keydown", onlyOnceTimeWithKeys);

    windowTouch.on(
      "swipeleft swipeup swipedown swiperight",
      onlyOnceTimeWithSwipe
    );
  }

  function onKeyDown(): void {
    listeners["onKeyDown"]("down");
  }

  function onKeyUp(): void {
    listeners["onKeyUp"]("up");
  }

  function onKeyLeft(): void {
    listeners["onKeyLeft"]("left");
  }

  function onKeyRight(): void {
    listeners["onKeyRight"]("right");
  }

  function onDown(listener: Listener): void {
    listeners["onKeyDown"] = listener;

    events["ArrowDown"] = onKeyDown;
    events["KeyS"] = onKeyDown;
  }

  function onUp(listener: Listener): void {
    listeners["onKeyUp"] = listener;

    events["ArrowUp"] = onKeyUp;
    events["KeyW"] = onKeyUp;
  }

  function onLeft(listener: Listener): void {
    listeners["onKeyLeft"] = listener;

    events["ArrowLeft"] = onKeyLeft;
    events["KeyA"] = onKeyLeft;
  }

  function onRight(listener: Listener): void {
    listeners["onKeyRight"] = listener;

    events["ArrowRight"] = onKeyRight;
    events["KeyD"] = onKeyRight;
  }

  function onKeyEvent(e: KeyboardEvent) {
    events[e.code]?.call();
  }

  function listen() {
    window.addEventListener("keydown", onKeyEvent);

    windowTouch.on("swipedown", onKeyDown);
    windowTouch.on("swipeup", onKeyUp);
    windowTouch.on("swipeleft", onKeyLeft);
    windowTouch.on("swiperight", onKeyRight);
  }

  function reset(): void {
    window.removeEventListener("keydown", onKeyEvent);

    windowTouch.off("swipedown", onKeyDown);
    windowTouch.off("swipeup", onKeyUp);
    windowTouch.off("swipeleft", onKeyLeft);
    windowTouch.off("swiperight", onKeyRight);

    onceListener = undefined;

    window.removeEventListener("keydown", onlyOnceTimeWithKeys);
    windowTouch.off(
      "swipeleft swipeup swipedown swiperight",
      onlyOnceTimeWithSwipe
    );

    alreadyStarted = false;
  }

  const self: Keyboard = {
    onDown,
    onUp,
    onLeft,
    onRight,
    listen,
    once,
    reset,
  };

  return Object.freeze(self);
}
