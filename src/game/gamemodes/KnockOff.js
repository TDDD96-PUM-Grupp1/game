import * as PIXI from 'pixi.js';
import PlayerCircle from '../entities/PlayerCircle';
import Gamemode from './Gamemode';
// import TestController from '../entities/controllers/TestController';
import PlayerController from '../entities/controllers/PlayerController';
import LocalPlayerController from '../entities/controllers/LocalPlayerController';

// Respawn time in seconds
const RESPAWN_TIME = 3;

// The max time between a collision and a player dying in order to count as a kill.
const TAG_TIME = 4;

/*
  Knock off gamemode, get score by knocking other players off the arena.
*/
class KnockOff extends Gamemode {
  constructor(game) {
    super(game);

    this.players = {};
    this.respawn = {};
    this.score = {};
    this.tags = {};

    this.arenaRadius = 350;
    this.arenaCenterx = 500;
    this.arenaCentery = 500;

    // Set up arena graphic
    const graphic = new PIXI.Graphics();
    graphic.beginFill(0xfffffff);
    graphic.drawCircle(0, 0, this.arenaRadius);
    graphic.endFill();
    game.app.stage.addChildAt(graphic, 0); // Set arena to be first thing to render
    graphic.tint = 0x555555;
    graphic.x = this.arenaCenterx;
    graphic.y = this.arenaCentery;
    this.arenaGraphic = graphic;

    // TODO remove
    this.onPlayerJoin(1);
    let fakePlayer = this.players[1];
    fakePlayer.setController(new LocalPlayerController(1));
    fakePlayer.setColor(0xee6666);
    fakePlayer.y = 300;

    this.onPlayerJoin(2);
    fakePlayer = this.players[2];
    fakePlayer.setColor(0xeeff66);
    fakePlayer.x = 600;
    fakePlayer.y = 300;

    this.game.respawnHandler.registerRespawnListener(this);
  }

  /* eslint-disable no-unused-vars, class-methods-use-this */
  // Called before the game objects are updated.
  preUpdate(dt) {
    // Update tags
    Object.keys(this.tags).forEach(id => {
      const list = this.tags[id];
      while (list.length > 0) {
        list[0].timer -= dt;
        if (list[0].timer <= 0) {
          // Remove expired tag
          list.shift();
        }
      }
      list.forEach(item => {
        item.timer -= dt;
      });
    });
  }
  /* eslint-enable no-unused-vars, class-methods-use-this */

  /* eslint-disable class-methods-use-this, no-unused-vars */

  // Called after the game objects are updated.
  postUpdate(dt) {
    this.game.entityHandler.getEntities().forEach(entity => {
      const dx = this.arenaCenterx - entity.x;
      const dy = this.arenaCentery - entity.y;
      const centerDist = Math.sqrt(dx * dx + dy * dy);

      if (centerDist > this.arenaRadius) {
        entity.die();
      }
    });
  }

  // Called when a new player connects
  onPlayerJoin(idTag) {
    console.log('Player join');
    const circle = new PlayerCircle(this.game.app);
    const controller = new PlayerController(this.game, idTag);
    circle.setController(controller);
    // Place them in the middle of the arena for now
    circle.x = 500;
    circle.y = 500;
    circle.setColor(0xff3333);
    this.game.entityHandler.register(circle);

    this.players[idTag] = circle;
    this.score[idTag] = 0;
    this.tags[idTag] = [];
    this.respawn[idTag] = true;

    circle.addEntityListener(this);

    circle.collision.addListener((player, victim) => {
      // Check if victim is a player
      if (victim.controller.id !== undefined) {
        this.tags[victim.controller.id].push({ id: player.id, timer: TAG_TIME });
        this.tags[player.controller.id].push({ id: victim.id, timer: TAG_TIME });
      }
    });
  }

  // Called when a player disconnects
  onPlayerLeave(idTag) {
    // When a player leaves, just leave their entity on the map.
    // But stop them from respawning.
    this.respawn[idTag] = false;
  }

  /* eslint-enable class-methods-use-this, no-unused-vars */

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.game.entityHandler.clear();
    // TODO: Clear respawns
    // this.game.respawnHandler.clear();
  }

  // Called when an entity is respawned.
  onRespawn(entity) {
    console.log('Player respawn');
    // Move the entity to the center
    entity.x = 400;
    entity.y = 400;
    // TODO: randomize a bit
  }

  // Called when an entity dies.
  onDeath(entity) {
    const { id } = entity.controller;
    this.tags[id].forEach(item => {
      console.log("{} killed {}".format(id, item.id))
      this.score[item.id] += 1;
    });

    console.log('Player died');

    if (this.respawn[id]) {
      this.game.respawnHandler.addRespawn(entity, RESPAWN_TIME);
    }
  }

  /* eslint-disable class-methods-use-this */
}

export default KnockOff;
