const ObjectClass = require('./object')
const Bullet = require('./bullet')
const Constants = require('../shared/constants')

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED)
    this.username = username
    console.log(username)
    this.hp = Constants.PLAYER_MAX_HP
    this.fireCooldown = 0
    this.score = 0
    this.move = {}
    this.click = false
    this.item = 1
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    this.score += dt * Constants.SCORE_PER_SECOND

    let upDown = this.move.left || this.move.right ? dt * this.speed * 0.8 : dt * this.speed

    if (this.move.up) {
      this.y -= upDown
    }

    if (this.move.down) {
      this.y += upDown
    }

    let leftRight = this.move.up || this.move.down ? dt * this.speed * 0.8 : dt * this.speed

    if (this.move.left) {
      this.x -= leftRight
    }

    if (this.move.right) {
      this.x += leftRight
    }

    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x))
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y))

    if(this.click && this.item === 3) {
      this.fireCooldown -= dt
      if (this.fireCooldown <= 0) {
        this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN
        let sendX = this.x + dt * this.speed * Math.sin(this.direction) * 15
        let sendY = this.y - dt * this.speed * Math.cos(this.direction) * 15
        return new Bullet(this.id, sendX, sendY, this.direction)
      }
    }
    return null
  }

  setMovement(move) {
    this.move = move
  }

  setMouseClick(click) {
    this.click = click
  }

  setItem(item) {
    this.item = item
  }


  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
      username: this.username,
      item: this.item
    }
  }
}

module.exports = Player
