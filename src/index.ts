import Game from "./components/game";

window.onload = function () {
  try {
    // ====================================================================
    // Create a new game using using a canvas ID as a base
    // ====================================================================
    const game = Game("canvas");

    // ====================================================================
    // Will define all game constants according to the viewport size
    // ====================================================================
    game.preLoad();

    // ====================================================================
    // Will start the game (wow, don't tell me)
    // ====================================================================
    game.start();
  } catch (error) {
    console.log(error);
  }
};
