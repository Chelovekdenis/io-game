const ObjectClass = require('./object')
const Warrior = require('./classes/warrior')
const Warlord = require('./classes/warlord')
const Archer = require('./classes/archer')
const Sniper = require('./classes/sniper')
const Constants = require('../shared/constants')

// TODO
// Сделать показ что повысился уровень
// Всплывающее окно перед закрытием
// За просмотр рекламы восрешение с 20% опыт от смерти



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
    this.score = 86270
    this.skillPoints = 0
    this.sendMsgSP = false

    this.classStage = 0
    this.classPoint = 0
    this.sendMsgCP = false

    this.needKick = {
      need:false,
      dir: 0,
      power: 0
    }
    this.needStun = false

    this.abilityCd = {
      first: 0
    }
    this.abilityMaxCd = {
      first: 5
    }

    this.listDamaged = []
    this.attackSpeed = 0.6
    this.weaponX = 0
    this.weaponY = 0
    this.weaponX2 = 0
    this.weaponY2 = 0
    this.giveDamage = false

    this.damage = 10
    this.hp = Constants.PLAYER_MAX_HP
    this.defense = 1
    this.maxHp = this.hp

    this.functionStack = []
    this.lastDir = 0

    this.skills = {
      attack: 0,
      defense: 0,
      regeneration: 0,
      maxHp: 0
    }

    this.attributes = {
      strength: 0,
      agility: 0,
      intelligence: 0
    }

    this.lastHit = ''

    this.className = Constants.CLASSES.FIGHTER
    this.class = new Warrior(this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)
    // this.class2 = new Archer(this.id, this.x, this.y, this.click, this.direction, this.speed, this.damage)

    this.updateClass = (dt) => {
      this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage)
      this.class.update(dt)
      this.giveDamage = this.class.getInfo()
    }
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    this.functionStack.forEach((item, i) => {
      item.func(dt)
      item.sec -= dt
      if(item.sec <= 0) {
        if(item.rec)
          this.speed = item.rec
        this.functionStack.splice(i, 1)
      }
    })

    this.score += dt * Constants.SCORE_PER_SECOND * (this.level + 1)

    this.listDamaged.forEach(item => {
      item.count -=  dt
    })
    this.listDamaged = this.listDamaged.filter(item =>
      item.count > 0
    )

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

    let upDown = this.move.left || this.move.right ? dt * this.speed * 0.7 : dt * this.speed

    if (this.move.up)
      this.y -= upDown

    if (this.move.down)
      this.y += upDown

    let leftRight = this.move.up || this.move.down ? dt * this.speed * 0.7 : dt * this.speed

    if (this.move.left)
      this.x -= leftRight

    if (this.move.right)
      this.x += leftRight

    // this.x += dt * this.speed * Math.sin(moveDir)
    // this.y -= dt * this.speed * Math.cos(moveDir)

    // Не дает зайти за барьер
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x))
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y))

    return this.updateClass(dt)
  }

  setKick(sec) {
    this.functionStack.push({
      func: this.hitKick.bind(this),
      sec: sec
    })
  }

  setStun(sec) {
    this.functionStack.push({
      func: this.stun.bind(this),
      sec: sec,
      rec: this.speed
    })
  }

  setAbility(item, sec) {
    if (this.abilityCd.first <= 0) {
      this.item = item
      this.lastDir = this.direction
      this.functionStack.push({
        func: this.class.spellOne.bind(this),
        sec: sec
      })
      this.functionStack.push({
        func: function(dt) {if(this.abilityCd.first <= 0) {this.abilityCd.first = this.abilityMaxCd.first} this.abilityCd.first -= dt}.bind(this),
        sec: this.abilityMaxCd.first
      })
    }
  }

  hitKick(dt) {
    this.x += this.needKick.power * Math.sin(this.needKick.dir) * dt
    this.y -= this.needKick.power * Math.cos(this.needKick.dir) * dt
    this.needKick.need = false
  }

  stun() {
    this.speed = 0
    this.needStun = false
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

  setDamage() {
    this.damage = 1 + 0.3 * this.skills.attack + 10
  }

  setDefense() {
    this.defense = 1 - ((0.06 * this.skills.defense)/(1 + 0.06 * Math.abs(this.skills.defense)))
  }

  setHp() {
    let hpProportion = this.hp / this.maxHp
    this.maxHp = Constants.PLAYER_MAX_HP + Constants.PLAYER_MAX_HP * 0.1 * this.skills.maxHp
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

  setAttributes(item) {
    let newSkills = this.class.setAttributes(item)
    this.skills.attack += newSkills.atk
    this.skills.defense += newSkills.def
    this.skills.regeneration += newSkills.reg
    this.skills.maxHp += newSkills.hp

    this.speed += newSkills.speed
    this.attackSpeed -= newSkills.atkSpeed

    this.attributes.strength += newSkills.str
    this.attributes.agility += newSkills.agl
    this.attributes.intelligence += newSkills.int

    this.setDamage()
    this.setDefense()
    this.setHp()
  }

  chosenClass(c) {
    if(this.classStage === 0)
    switch (c) {
      case Constants.CLASSES.WARRIOR:
        this.className = Constants.CLASSES.WARRIOR
        this.class = new Warrior(this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)

        this.skills.attack += 5
        this.skills.defense += 3
        this.skills.regeneration += 3
        this.skills.maxHp += 5
        this.setDamage()
        this.setDefense()
        this.setHp()

        this.updateClass = (dt) => {
          this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage)
          this.class.update(dt)
          this.giveDamage = this.class.getInfo()
        }
        break
      case Constants.CLASSES.ARCHER:
        this.className = Constants.CLASSES.ARCHER
        this.class = new Archer(this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)
        this.updateClass = (dt) => {
          this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage, this.speed)
          return this.class.update(dt)
        }
        break
    }
    else
      switch (c) {
        case "warlord":
          this.className = "warlord"
          this.class = new Warlord(this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)

          this.skills.attack += 5
          this.skills.defense += 3
          this.skills.regeneration += 3
          this.skills.maxHp += 5
          this.setDamage()
          this.setDefense()
          this.setHp()

          this.updateClass = (dt) => {
            this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage)
            this.class.update(dt)
            this.giveDamage = this.class.getInfo()
          }
          break
        case "sniper":
          this.className = "sniper"
          this.class = new Sniper(this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)
          this.updateClass = (dt) => {
            this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage, this.speed)
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
      skills: this.skills,
      speed: this.speed,
      defense: this.defense,
      attributes: this.attributes,
      abilityCd: this.abilityCd
    }
  }
}

module.exports = Player
