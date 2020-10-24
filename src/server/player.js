const ObjectClass = require('./object')
const Bullet = require('./bullet')
const Constants = require('../shared/constants')


class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Constants.PLAYER_SPEED)
    this.username = username
    this.direction = 0
    this.fireCooldown = 0
    this.move = {}
    this.click = false
    this.item = 1
    this.hitAnimation = 0
    this.count = 0

    this.level = 0
    this.score = 0
    this.skillPoints = 0
    this.sendMsgSP = false

    this.weaponX = 0
    this.weaponY = 0
    this.giveDamage = false
    this.meleeAttackCD = 0

    this.skills = {
      attack: 1,
      defense: 1,
      regeneration: 0,
      hp: Constants.PLAYER_MAX_HP,
      maxHp: Constants.PLAYER_MAX_HP
    }
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    this.score += dt * Constants.SCORE_PER_SECOND

    if(this.skills.maxHp > this.skills.hp) {
      this.skills.hp += dt * this.skills.regeneration
      if(this.skills.maxHp < this.skills.hp) {
        this.skills.hp = this.skills.maxHp
      }
    }

    if(this.score >= Constants.EXP_FOR_LEVEL_UP[this.level+1]) {
      this.level++
      this.skillPoints++
      this.sendMsgSP = true
    }

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
    // Не дает зайти за барьер
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x))
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y))
    // Стрельба если выбран пистолет на третьем слоте
    if(this.click && this.item === 3) {
      this.fireCooldown -= dt
      if (this.fireCooldown <= 0) {
        this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN
        // Двинуть передсобой, чтобы вылетали из дула
        let sendX = this.x + dt * this.speed * Math.sin(this.direction) * 15
        let sendY = this.y - dt * this.speed * Math.cos(this.direction) * 15
        return new Bullet(this.id, sendX, sendY, this.direction, this.skills.attack)
      }
    }
    // Анимация удара
    let animationTime = 50
    if (this.item !== 2 ) {
      this.count = 0
      this.hitAnimation = 0
    }
    if (this.item === 2 && this.click && this.count === 0) {
      this.count = 1
    }
    if (this.count >= animationTime / 2 ) {
      this.hitAnimation += Math.PI * 1.5 / animationTime
      this.giveDamage = false
    }
    else if (this.count >= 1) {
      this.hitAnimation -= Math.PI * 1.5 / animationTime
      this.giveDamage = true
    }
    if (this.count !== 0) {
      this.count++
    }
    // console.log(this.direction)
    if (this.count === animationTime) {
      this.count = 0
      this.hitAnimation = 0
    }
    // Ставит точку где оружие, которая наносит урон при попадании
    if (this.item === 2) {
      this.weaponX = this.x + dt * this.speed * Math.sin(this.direction + Math.PI/4 + this.hitAnimation) * 15
      this.weaponY = this.y - dt * this.speed * Math.cos(this.direction + Math.PI/4 + this.hitAnimation) * 15
    }

    // console.log(this.username, this.weaponX, this.weaponY)
    return null
  }

  weaponsHit(object) {
    const dx = this.weaponX - object.x
    const dy = this.weaponY - object.y
    return Math.sqrt(dx * dx + dy * dy)
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


  takeBulletDamage(damage) {
    this.skills.hp -= damage / this.skills.defense
  }

  onDealtDamage(score) {
    this.score += score
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      skills: this.skills,
      username: this.username,
      score: this.score,
      level: this.level,
      item: this.item,
      click: this.click,
      hitAnimation: this.hitAnimation,
      weaponX: this.weaponX,
      weaponY: this.weaponY
    }
  }
}

module.exports = Player
