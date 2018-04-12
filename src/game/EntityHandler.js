/*
Handles game entities.
*/
class EntityHandler {
  constructor() {
    // List of entites handled by this handler.
    this.entities = [];
  }

  // Update all entities.
  update(dt) {
    for (let i = 0; i < this.entities.length; i += 1) {
      this.entities[i].update(dt);
    }
  }

  // Update all the entities graphics.
  updateGraphics(dt) {
    for (let i = 0; i < this.entities.length; i += 1) {
      this.entities[i].graphicUpdate(dt);
    }
  }

  // Add an entity to this entity handler.
  register(obj) {
    this.entities.push(obj);
  }

  // Removes an entity from this entity handler.
  unregister(obj) {
    const index = this.entities.indexOf(obj);
    this.entities.splice(index, 1);
  }

  // Removes an entity from this entity handler.
  // Also destroys its graphics.
  unregisterFully(obj) {
    unregister(obj);
    obj.destroy();
  }

  // Returns an array containing all entities.
  getEntities() {
    const copy = [];
    for (let i = 0; i < this.entities.length; i += 1) {
      copy.push(this.entities[i]);
    }
    return copy;
  }

  // Destroy all entities and clear the entity list.
  clear() {
    for (let i = 0; i < this.entities.length; i += 1) {
      this.entities[i].destroy();
    }
    this.entities = [];
  }
}

export default EntityHandler;
