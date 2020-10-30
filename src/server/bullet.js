const shortid = require('shortid')
const ObjectClass = require('./object')
const Constants = require('../shared/constants')

class Bullet extends ObjectClass {
  constructor(parentID, x, y, dir, attack) {
    super(shortid(), x, y, Constants.BULLET_SPEED)
    this.direction = dir
    this.parentID = parentID
    this.attack = attack * Constants.BULLET_DAMAGE
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    this.x += dt * this.speed * Math.sin(this.direction)
    this.y -= dt * this.speed * Math.cos(this.direction)
    return this.x < 0 || this.x > Constants.MAP_SIZE || this.y < 0 || this.y > Constants.MAP_SIZE
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction
    }
  }
}

module.exports = Bullet
