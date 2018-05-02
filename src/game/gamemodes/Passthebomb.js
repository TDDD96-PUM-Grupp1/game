import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';
import BasicRectangle from '../entities/BasicRectangle';
import CollisionCircle from '../entities/collision/CollisionCircle';
/*
  Knock off gamemode, get score by knocking other players off the arena.
*/

// How many walls the arena should have.
const WALLS = 4;
let BOMB;
let Bombset = false;
let number = 5;

class Passthebomb extends Gamemode {
  constructor(game, resources) {
    super(game, resources);

    this.bombtext = new PIXI.Text(number,{fontFamily : 'Arial', fontSize: 30, fill : 0xffffff, align : 'center', strokeThickness: 5});
    this.bombtext.scale.set(10,10);

    this.arenaRadius = 490;
    this.respawnArea = 100;
    this.time = 0;
    this.resttime = 0;

    // Center arena
    this.arenaCenterx = Math.round(window.innerWidth / 2);
    this.arenaCentery = Math.round(window.innerHeight / 2);

    this.arenaSize = 700;
    this.wallWidth = 30;
    this.wallLength = 600;
    this.centerx = 500;
    this.centery = 500;
    //Create arena
    this.createborder(window.innerWidth,0,0,window.innerHeight*2);
    this.createborder(0,0,0,window.innerHeight*2);
    this.createborder(0,0,window.innerWidth*2,0);
    this.createborder(0,window.innerHeight,window.innerWidth*2,0);


  }

  createborder(x,y,width,height)
  {
    const wall = new BasicRectangle(this.game, width, height, Infinity, 0x44ff66);
    wall.x = x;
    wall.y = y;
    this.game.register(wall);
  }

  /* eslint-disable no-unused-vars, class-methods-use-this */

  // Called before the game objects are updated.
  preUpdate(dt) {
    this.time += dt;
  //  this.resttime +=dt;
    let player;

    const players = this.game.entityHandler.getPlayers();
    const eligible = [];
    players.forEach(player => {
      if (!player.phasing && !player.dead)
      {
        eligible.push(player);
      }
    });
    if (eligible.length > 1 && this.time > 5)
    {
      player = eligible[Math.floor(Math.random() * eligible.length)];
      BOMB = player;
      this.time = 0;


    }
    if(BOMB != null && !Bombset)
    {
      BOMB.graphic.addChild(this.bombtext);
      this.bombtext.x = -100;
      this.bombtext.y = -100;
      Bombset = true;

      BOMB.collision.addListener((BOMB, victim) => {
        if (victim.isPlayer()) {
          BOMB.graphic.removeChild(this.bombtext);
          BOMB = victim;
          BOMB.graphic.addChild(this.bombtext);
        }
      });
    }
    if(Bombset)
    {
      number -= dt;
      this.bombtext.setText(Math.ceil(number));
      if(number <0)
      {
        BOMB.graphic.removeChild(this.bombtext);
        BOMB.die();
        Bombset = false;
        BOMB = null;
        this.time = 0;
        number = 5;

      }
    }


  }


  // Called after the game objects are updated.
  postUpdate(dt) {
    if(Bombset)
    {
      //let collisioncirc = new CollisionCircle(33);
      //collisioncirc.setEntity(BOMB);


    }

    }
    //this.collision.setEntity(this);
    //

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    const { iconID } = playerObject;
    const idTag = playerObject.id;

    // Place them in the middle of the arena for now
    circle.x = this.arenaCenterx;
    circle.y = this.arenaCentery;

  }

  // Called when a player disconnects
  onPlayerLeave(idTag) {}

  onButtonPressed(id, button) {}

  /* eslint-enable class-methods-use-this, no-unused-vars */

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.arenaGraphic.destroy();
  }

  // Called when an entity is respawned.
  onRespawn(entity) {
    // Move the entity close to the center
    entity.x = this.arenaCenterx + Math.cos(Math.random() * Math.PI * 2) * this.respawnArea;
    entity.y = this.arenaCentery + Math.sin(Math.random() * Math.PI * 2) * this.respawnArea;
  }

  // Called when an entity dies.
  // eslint-disable-next-line
  onDeath(entity) {}

  onWindowResize() {}
}

export default Passthebomb;
