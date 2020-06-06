import Game from "./components/game";

window.onload = function() {
  const game = Game("canvas");

  game.preLoad();
  game.start();
};
