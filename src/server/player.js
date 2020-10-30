const ObjectClass = require('./object')
const Bullet = require('./bullet')
const Constants = require('../shared/constants')

// TODO
// Сделать чтобы с апом уровня статы еще немного увеличивались
// Сделать показ что повысился уровень
// Изменить инвентарь и код чтобы было только одно оружие
// Добавить одного Босса
// Изменить покрытие карты
// Добавить класс Воин и Лучник
// Добавить показатель скорость атаки и бега


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
    this.weaponX2 = 0
    this.weaponY2 = 0
    this.giveDamage = false
    this.meleeAttackCD = 0

    this.damage = 1
    this.hp = Constants.PLAYER_MAX_HP
    this.defense = 1
    this.maxHp = this.hp

    this.skills = {
      attack: 0,
      defense: 0,
      regeneration: 0,
      maxHp: 0
    }

    this.lastHit = ''
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    this.score += dt * Constants.SCORE_PER_SECOND

    if(this.maxHp > this.hp) {
      this.hp += dt * this.skills.regeneration
      if(this.maxHp < this.hp) {
        this.hp = this.maxHp
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
        return new Bullet(this.id, sendX, sendY, this.direction, this.damage)
      }
    }
    // Анимация удара
    let animationTime = 60
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
      let a = dt * this.speed * Math.sin(this.direction + Math.PI/4 + this.hitAnimation)
      let b = dt * this.speed * Math.cos(this.direction + Math.PI/4 + this.hitAnimation)
      this.weaponX = this.x + a * 15
      this.weaponY = this.y - b * 15
      this.weaponX2 = this.x + a * 7
      this.weaponY2 = this.y - b * 7
    }

    // console.log(this.username, this.weaponX, this.weaponY)
    return null
  }

  weaponsHit(object) {
    const dx = this.weaponX - object.x
    const dy = this.weaponY - object.y
    const dx2 = this.weaponX2 - object.x
    const dy2 = this.weaponY2 - object.y
    return Math.min(Math.sqrt(dx * dx + dy * dy), Math.sqrt(dx2 * dx2 + dy2 * dy2))
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

  setDamage() {
    this.damage = 1 + 0.3 * this.skills.attack
  }

  setDefense() {
    this.defense = 1 - ((0.06 * this.skills.defense)/(1 + 0.06 * Math.abs(this.skills.defense)))
  }

  setHp() {
    let hpProportion = this.hp / this.maxHp
    this.maxHp = Constants.PLAYER_MAX_HP * (1.1 ** this.skills.maxHp)
    this.hp = this.maxHp * hpProportion
  }

  takeDamage(damage, id) {
    this.hp -= damage * this.defense
    this.lastHit = id
  }

  onDealtDamage() {
    this.score += this.damage
  }

  onKill(level) {
    this.score += Constants.EXP_FOR_LEVEL_UP[level]/2
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
      maxHp: this.maxHp,
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
