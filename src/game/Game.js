// import * as PIXI from 'pixi.js';
import EntityHandler from './EntityHandler';
import CollisionHandler from './CollisionHandler';
import ResourceServer from './ResourceServer';
import GamemodeHandler from './GamemodeHandler';
import RespawnHandler from './RespawnHandler';

/*
Game.
*/
class Game {
  constructor(app, communication) {
    this.app = app;
    this.communication = communication;
    this.communication.setGameListener(this);

    // Create all handlers
    this.entityHandler = new EntityHandler();
    this.collisionHandler = new CollisionHandler(this.entityHandler);
    this.respawnHandler = new RespawnHandler(this.entityHandler);
    this.resourceServer = new ResourceServer();

    // Create gamemode
    const gamemodeHandler = GamemodeHandler.getInstance();
    const SelectedMode = gamemodeHandler.getSelected();
    this.currentGamemode = new SelectedMode(this);
  }

  // Main game loop
  loop(delta) {
    // Convert frame delta to time delta [second] (assuming 60fps)
    const dt = delta / 60;

    // Update handlers and gamemodes
    this.currentGamemode.preUpdate(dt);
    this.entityHandler.update(dt);
    this.collisionHandler.handleCollisions(dt);
    this.currentGamemode.postUpdate(dt);
    this.respawnHandler.checkRespawns();
    this.entityHandler.updateGraphics(dt);
    this.communication.update(dt);
  }

  // Called when a new player joins.
  onPlayerJoin(idTag) {
    this.currentGamemode.onPlayerJoin(idTag);
  }

  // Called when a player leaves the game.
  onPlayerLeave(idTag) {
    this.currentGamemode.onPlayerLeave(idTag);
  }
}

export default Game;
