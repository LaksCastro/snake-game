import Game from "./components/game";
import debounce from "lodash.debounce";

window.addEventListener("DOMContentLoaded", function () {
  const game = Game("canvas");

  game.preLoad();
  game.start();

  window.onresize = debounce(game.restart, 200) as () => void;
});
