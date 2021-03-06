import * as PIXI from 'pixi.js';
import BasicCircle from './BasicCircle';

const MASS = 1;
const SQUAREROOTOF2 = 1.4142135623730951;
const ICONSIZE = Math.floor(256 * SQUAREROOTOF2);

/*
Game object representing a player
*/
class PlayerCircle extends BasicCircle {
  constructor(game, resource, radius = 32) {
    super(game, radius, MASS, 0xffffff, true);

    this.sprite = new PIXI.Sprite(resource);
    this.sprite.width = ICONSIZE;
    this.sprite.height = ICONSIZE;
    // Center x,y
    this.sprite.anchor.set(0.5, 0.5);

    this.graphic.addChild(this.sprite);

    this.restitution = 1;

    // Flag for if the player has left the game.
    this.playerLeft = false;

    // Flag that entity can respawn.
    this.respawnable = true;

    // default player collision group is random so they will be able to collide
    this.collisionGroup = Math.random();
  }

  setColor(backgroundColor, iconColor) {
    this.graphic.tint = backgroundColor;
    if (iconColor !== undefined) {
      this.sprite.tint = iconColor;
    }
  }

  // Update this object
  update(dt) {
    super.update(dt);
  }

  // Destroy sprite when removed
  destroy() {
    super.destroy();
    this.sprite.destroy();
  }

  // eslint-disable-next-line
  isPlayer() {
    return true;
  }
}

export default PlayerCircle;
