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

  const codes = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  };

  function codeToEnum(code: string): DIRECTION {
    return codes[code];
  }

  function touchEventToCode(touch: string) {
    const touchs = {
      swipeleft: "ArrowLeft",
      swiperight: "ArrowRight",
      swipeup: "ArrowUp",
      swipedown: "ArrowDown",
    };

    return touchs[touch];
  }

  function once(listener: Listener): void {
    function onlyOnceTimeWithKeys(e: KeyboardEvent) {
      if (alreadyStarted)
        return window.removeEventListener("keydown", onlyOnceTimeWithKeys);

      if (events[e.code] === undefined) return;

      alreadyStarted = true;

      listener(codeToEnum(e.code));

      window.removeEventListener("keydown", onlyOnceTimeWithKeys);
      windowTouch.off(
        "swipeleft swipeup swipedown swiperight",
        onlyOnceTimeWithSwipe
      );
    }

    window.addEventListener("keydown", onlyOnceTimeWithKeys);

    function onlyOnceTimeWithSwipe(e: KeyboardEvent) {
      if (alreadyStarted)
        return windowTouch.off("swipe", onlyOnceTimeWithSwipe);

      const code = touchEventToCode(e.type);

      if (events[code] === undefined) return;

      alreadyStarted = true;

      listener(codeToEnum(code));

      window.removeEventListener("keydown", onlyOnceTimeWithKeys);
      windowTouch.off(
        "swipeleft swipeup swipedown swiperight",
        onlyOnceTimeWithSwipe
      );
    }

    windowTouch.on(
      "swipeleft swipeup swipedown swiperight",
      onlyOnceTimeWithSwipe
    );
  }

  function onKeyDown() {
    listeners["onKeyDown"]("down");
  }

  function onKeyUp() {
    listeners["onKeyUp"]("up");
  }

  function onKeyLeft() {
    listeners["onKeyLeft"]("left");
  }

  function onKeyRight() {
    listeners["onKeyRight"]("right");
  }

  function onDown(listener: Listener): void {
    listeners["onKeyDown"] = listener;

    events["ArrowDown"] = onKeyDown;
    windowTouch.on("swipedown", onKeyDown);
  }

  function onUp(listener: Listener): void {
    listeners["onKeyUp"] = listener;

    events["ArrowUp"] = onKeyUp;
    windowTouch.on("swipeup", onKeyUp);
  }

  function onLeft(listener: Listener): void {
    listeners["onKeyLeft"] = listener;

    events["ArrowLeft"] = onKeyLeft;
    windowTouch.on("swipeleft", onKeyLeft);
  }

  function onRight(listener: Listener): void {
    listeners["onKeyRight"] = listener;

    events["ArrowRight"] = onKeyRight;
    windowTouch.on("swiperight", onKeyRight);
  }

  function onKeyEvent(e: KeyboardEvent) {
    events[e.code]?.call();
  }

  function listen() {
    window.addEventListener("keydown", onKeyEvent);
  }

  function reset(): void {
    window.removeEventListener("keydown", onKeyEvent);

    windowTouch.off("swipedown", onKeyDown);
    windowTouch.off("swipeup", onKeyUp);
    windowTouch.off("swipeleft", onKeyLeft);
    windowTouch.off("swiperight", onKeyRight);
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
