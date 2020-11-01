const ObjectClass = require('./object')
const Warrior = require('./warrior')
const Archer = require('./archer')
const Constants = require('../shared/constants')

// TODO
// Сделать показ что повысился уровень
// Добавить показатель скорость атаки и бега
// Всплывающее окно перед закрытием
// За просмотр рекламы восрешение с 20% опыт от смерти

// Поправить хитбоксы оружия !!!!!!!!!!!!!!!


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

    this.classStage = 0
    this.classPoint = 0
    this.sendMsgCP = false

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

    this.className = Constants.CLASSES.FIGHTER
    this.class = new Warrior(this.x, this.y, this.click, this.direction, this.speed)
    // this.class2 = new Archer(this.id, this.x, this.y, this.click, this.direction, this.speed, this.damage)

    this.updateClass = (dt) => {
      this.class.setInfo(this.x, this.y, this.click, this.direction)
      this.class.update(dt)
      this.giveDamage = this.class.getInfo()
    }
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    this.score += dt * Constants.SCORE_PER_SECOND * 4000

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

      this.skills.attack += 0.2
      this.skills.defense += 0.2
      this.skills.regeneration += 0.2
      this.skills.maxHp += 0.2

      this.setDamage()
      this.setDefense()
      this.setHp()

      if(this.level === 3) {
        this.classPoint++
        this.sendMsgCP = true
      }
      if(this.level === 21) {
        this.classPoint++
        this.sendMsgCP = true
      }
    }
    let upDown = this.move.left || this.move.right ? dt * this.speed * 0.6 : dt * this.speed

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



    // this.class2.setInfo(this.x, this.y, this.click, this.direction, this.damage)
    // return this.class2.update(dt)

    return this.updateClass(dt)

  }

  weaponsHit(object) {
    return this.class.weaponsHit(object)
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

  onDealtDamage(dopScore) {
    this.score += this.damage + dopScore
  }

  onKill(level) {
    this.score += Constants.EXP_FOR_LEVEL_UP[level]/2
  }

  chosenClass(c) {
    if(this.classStage === 0)
    switch (c) {
      case Constants.CLASSES.WARRIOR:
        this.className = Constants.CLASSES.WARRIOR
        this.class = new Warrior(this.x, this.y, this.click, this.direction, this.speed)

        this.skills.attack += 5
        this.skills.defense += 3
        this.skills.regeneration += 3
        this.skills.maxHp += 5
        this.setDamage()
        this.setDefense()
        this.setHp()

        this.updateClass = (dt) => {
          this.class.setInfo(this.x, this.y, this.click, this.direction)
          this.class.update(dt)
          this.giveDamage = this.class.getInfo()
        }
        break
      case Constants.CLASSES.ARCHER:
        this.className = Constants.CLASSES.ARCHER
        this.class = new Archer(this.id, this.x, this.y, this.click, this.direction, this.speed, this.damage)
        this.updateClass = (dt) => {
          this.class.setInfo(this.x, this.y, this.click, this.direction, this.damage)
          return this.class.update(dt)
        }
        break
    }
    else
      switch (c) {
        case "warlord":
          this.className = "warlord"
          this.class = new Warrior(this.x, this.y, this.click, this.direction, this.speed)

          this.skills.attack += 5
          this.skills.defense += 3
          this.skills.regeneration += 3
          this.skills.maxHp += 5
          this.setDamage()
          this.setDefense()
          this.setHp()

          this.updateClass = (dt) => {
            this.class.setInfo(this.x, this.y, this.click, this.direction)
            this.class.update(dt)
            this.giveDamage = this.class.getInfo()
          }
          break
        case "sniper":
          this.className = "sniper"
          this.class = new Archer(this.id, this.x, this.y, this.click, this.direction, this.speed, this.damage)
          this.updateClass = (dt) => {
            this.class.setInfo(this.x, this.y, this.click, this.direction, this.damage)
            return this.class.update(dt)
          }
          break
      }
    this.classStage++
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      ...(this.class.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
      maxHp: this.maxHp,
      username: this.username,
      score: this.score,
      level: this.level,
      item: this.item,
      click: this.click,
      className: this.className,
      classStage: this.classStage,
      skills: this.skills
    }
  }
}

module.exports = Player
