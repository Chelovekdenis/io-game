const ObjectClass = require('./object')
const Fighter = require('./classes/fighter')
const Warrior = require('./classes/warrior')
const Warlord = require('./classes/warlord')
const Archer = require('./classes/archer')
const Sniper = require('./classes/sniper')
const Constants = require('../shared/constants')

// Networking и assets ссылки на сервер
// player.js уровени игрока меньше


// Недочеты
// ~ Если несолько раз нажать на выбор атрибута
// в следующий раз он выберется автоматически
// ~ Долго работал сервер и почему-то босс оказался
// в левом верхнем углу и был не активен, а обычных
// мобов не было

class Player extends ObjectClass {
  constructor(id, username, x, y, level, ifAI) {
    super(id, x, y, Constants.PLAYER_SPEED, Constants.PLAYER_RADIUS)
    // От этого избавиться, то что снизу
    this.ifNotAI = ifAI
    this.username = username
    this.direction = 0
    this.fireCooldown = 0
    this.move = {}
    this.click = false
    this.item = 1
    this.hitAnimation = 0
    this.count = 0
    this.level = 0
    this.score = Constants.EXP_FOR_LEVEL_UP[level]
    this.leaderBuff = 1
    this.skillPoints = 0
    this.sendMsgSP = false

    this.classStage = 0
    this.classPoint = 0
    this.sendMsgCP = false

    this.pureSpeed = this.speed
    this.ifStun = false
    this.canSpell = true
    this.canAttack = true

    this.ifSlowBullet = false
    this.ifSlowBulletCount = true

    this.needKick = {
      need:false,
      dir: 0,
      power: 0
    }
    this.needStun = false


    this.reductionCd = 1
    this.abilityCd = {
      first: 0,
      second: 0
    }
    this.abilityMaxCd = {
      first: 10,
      second: 15
    }
    this.defualtAbilityMaxCd = {
      first: 10,
      second: 15
    }

    this.listDamaged = []
    this.attackSpeed = 0.6
    this.defaultAttackSpeed = this.attackSpeed
    this.weaponX = 0
    this.weaponY = 0
    this.weaponX2 = 0
    this.weaponY2 = 0
    this.giveDamage = false

    this.damage = 20
    this.hp = Constants.PLAYER_MAX_HP
    this.defense = 1
    this.maxHp = this.hp
    this.bulletSpeed = 1

    this.functionStack = []
    this.lastDir = 0
    this.lastMove = {}
    this.lastClick = false

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

    this.effects = {
      stunned: {
        yes: false,
        time: 0
      },
      slowed: {
        yes: false,
        time: 0
      },
      rage: {
        yes: false,
        time: 0
      },
      storm: {
        yes: false,
        time: 0
      }
    }

    this.lastHit = ''

    this.className = Constants.CLASSES.FIGHTER
    this.class = new Fighter(this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)
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
      item.sec -= dt
      item.func(dt, item.sec)
      if(item.sec <= 0) {
        if(item.rec)
          item.rec(item.recData)
        this.functionStack.splice(i, 1)
      }
    })
    this.score += dt * Constants.SCORE_PER_SECOND * (this.level + 1) * this.leaderBuff

    this.listDamaged.forEach(item => {
      item.count -=  dt
    })
    this.listDamaged = this.listDamaged.filter(item =>
      item.count > 0
    )

    // Regeneration
    if(this.maxHp > this.hp) {
      this.hp += dt * this.skills.regeneration
      if(this.maxHp < this.hp) {
        this.hp = this.maxHp
      }
    }

    // Lvl up
    if(this.score >= Constants.EXP_FOR_LEVEL_UP[this.level+1]) {
      this.level++
      this.skillPoints++
      this.sendMsgSP = true

      this.skills.attack += 0.8
      this.skills.defense += 0.1
      this.skills.regeneration += 0.5
      this.skills.maxHp += 0.8
      this.attackSpeed -= 0.001
      this.defaultAttackSpeed -= 0.001

      this.setDamage()
      this.setDefense()
      this.setHp()

      if(this.level === 3) {
        this.classPoint++
        this.sendMsgCP = true
      }
      if(this.level === 11) {
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

    if(this.canAttack)
      return this.updateClass(dt)
  }

  setKick(sec) {
    this.functionStack.push({
      func: this.hitKick.bind(this),
      sec: sec,
      rec: this.afterKick.bind(this),
      recData: this.pureSpeed
    })
  }

  setStun(sec) {
    this.effects.stunned.time = sec
    this.functionStack.push({
      func: this.stun.bind(this),
      sec: sec,
      rec: this.afterStun.bind(this),
      recData: this.pureSpeed
    })
  }

  setSlow(sec) {
    this.effects.slowed.time = sec
    this.functionStack.push({
      func: this.slow.bind(this),
      sec: sec,
      rec: this.afterSlow.bind(this),
      recData: this.pureSpeed
    })
  }

  setAbility(item, sec) {
    // First
    if (this.abilityCd.first <= 0
        && this.canSpell
        && item === 1
        && this.class.availableAbilities.first) {
      this.item = item
      this.lastDir = this.direction
      this.lastMove = this.move
      this.lastClick = this.click
      this.functionStack.push({
        func: this.class.spellOne.bind(this),
        sec: sec,
        rec: this.class.afterSpellOne.bind(this),
        recData: false,
      })
      this.functionStack.push({
        func: function(dt) {
          if(this.abilityCd.first <= 0)
            this.abilityCd.first = this.abilityMaxCd.first
          this.abilityCd.first -= dt
        }.bind(this),
        sec: this.abilityMaxCd.first
      })
    }

    // Second
    if (this.abilityCd.second <= 0
        && this.canSpell
        && item === 2
        && this.class.availableAbilities.second) {
      this.item = item
      this.lastDir = this.direction
      this.lastMove = this.move
      this.lastClick = this.click
      this.functionStack.push({
        func: this.class.spellTwo.bind(this),
        sec: sec * 10,
        rec: this.class.afterSpellTwo.bind(this),
        recData: {
          atkSpeed: this.defaultAttackSpeed,
          speed: this.pureSpeed
        },
      })
      this.functionStack.push({
        func: function(dt) {
          if(this.abilityCd.second <= 0)
            this.abilityCd.second = this.abilityMaxCd.second
          this.abilityCd.second -= dt
        }.bind(this),
        sec: this.abilityMaxCd.second
      })
    }
  }

  hitKick(dt) {
    this.speed = this.pureSpeed * 0.8
    this.x += this.needKick.power * Math.sin(this.needKick.dir) * dt
    this.y -= this.needKick.power * Math.cos(this.needKick.dir) * dt
    this.needKick.need = false
  }

  afterKick(speed) {
    this.speed = speed
  }

  stun(dt, sec) {
    this.speed = 0
    this.needStun = false
    this.canSpell = false
    this.canAttack = false
    this.effects.stunned.yes = true
    this.effects.stunned.time = sec
  }

  afterStun(speed) {
    this.speed = speed
    this.canSpell = true
    this.canAttack = true
    this.effects.stunned.yes = false
    this.effects.stunned.time = 0
  }

  slow(dt, sec) {
    this.speed = this.pureSpeed * 0.8
    this.effects.slowed.yes = true
    this.effects.slowed.time = sec
  }

  afterSlow(speed) {
    this.speed = speed
    this.effects.slowed.yes = false
    this.effects.slowed.time = 0
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
    this.damage = 10 + 2 * this.skills.attack
  }

  setDefense() {
    this.defense = 1 - ((0.06 * this.skills.defense)/(1 + 0.06 * Math.abs(this.skills.defense)))
  }

  setHp() {
    let hpProportion = this.hp / this.maxHp
    this.maxHp = Constants.PLAYER_MAX_HP + Constants.PLAYER_MAX_HP * this.skills.maxHp
    this.hp = this.maxHp * hpProportion
  }

  setCdReduction() {
      this.reductionCd = this.attributes.intelligence <= 20 ? 1 - this.attributes.intelligence * 0.02 : 0.6
      for (let key in this.abilityMaxCd) {
          this.abilityMaxCd[key] = this.defualtAbilityMaxCd[key] * this.reductionCd
          // console.log(this.abilityMaxCd[key])
      }

  }

  takeDamage(damage, id) {
    this.hp -= damage * this.defense
    this.lastHit = id
  }

  onDealtDamage(dopScore) {
    let temp = 1
    if(this.level < 3)
      temp = 10
    this.score += this.damage / 10 + dopScore / 10  * this.leaderBuff + temp
  }

  onKill(level) {
    this.score += Constants.EXP_FOR_LEVEL_UP[level] / 20  * this.leaderBuff
  }

  setAttributes(item) {
    switch (item) {
      case 0:
        this.skills.attack += 1.5
        this.setDamage()
        break
      case 1:
        this.skills.defense += 1
        this.setDefense()
        break
      case 2:
        this.skills.maxHp += 1
        this.setHp()
        break
      case 3:
        this.skills.regeneration += 2
        break
      case 4:
        this.speed += 3
        this.pureSpeed += 3
        break
      case 5:
        this.attackSpeed -= 0.005
        this.defaultAttackSpeed -= 0.005
        break
      case 6:
        this.bulletSpeed += 0.1
        if(this.bulletSpeed >= 2) this.bulletSpeed = 2
        break
    }
    // let newSkills = this.class.setAttributes(item)
    // this.skills.attack += newSkills.atk
    // this.skills.defense += newSkills.def
    // this.skills.regeneration += newSkills.reg
    // this.skills.maxHp += newSkills.hp
    //
    // this.speed += newSkills.speed
    // this.pureSpeed += newSkills.speed
    // this.attackSpeed -= newSkills.atkSpeed
    // this.defaultAttackSpeed -= newSkills.atkSpeed
    //
    // this.attributes.strength += newSkills.str
    // this.attributes.agility += newSkills.agl
    // this.attributes.intelligence += newSkills.int



    // this.setDamage()
    // this.setDefense()
    // this.setHp()
    // this.setCdReduction()
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
          this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage, this.lastMove, this.lastClick)
          this.class.update(dt)
          this.giveDamage = this.class.getInfo()
        }
        break
      case Constants.CLASSES.ARCHER:
        this.className = Constants.CLASSES.ARCHER
        this.class = new Archer(this.id, this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)
        this.updateClass = (dt) => {
          this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage, this.speed, this.ifSlowBullet, this.lastMove, this.lastClick, this.bulletSpeed)
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
          this.class = new Sniper(this.id, this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)
          this.updateClass = (dt) => {
            this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage, this.speed, this.ifSlowBullet, this.lastMove, this.lastClick, this.bulletSpeed)
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
      abilityCd: this.abilityCd,
      effects: this.effects
    }
  }
}

module.exports = Player
