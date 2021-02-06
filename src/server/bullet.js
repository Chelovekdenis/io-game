const shortid = require('shortid')
const ObjectClass = require('./object')
const Constants = require('../shared/constants')

class Bullet extends ObjectClass {
  constructor(parentID, x, y, dir, attack, isSlow) {
    super(shortid(), x, y, Constants.BULLET_SPEED, Constants.BULLET_RADIUS)
    this.direction = dir
    this.parentID = parentID
    this.attack = attack
    this.livetime = 1
    this.isSlow = isSlow
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    this.livetime -= dt
    this.x += dt * this.speed * Math.sin(this.direction)
    this.y -= dt * this.speed * Math.cos(this.direction)
    return this.x < 0 || this.x > Constants.MAP_SIZE || this.y < 0 || this.y > Constants.MAP_SIZE || this.livetime < 0
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      isSlow: this.isSlow
    }
  }
}

module.exports = Bullet
