const ObjectClass = require('./object')
const Fighter = require('./classes/melee/fighter')
const Warrior = require('./classes/melee/warrior')
const Warlord = require('./classes/melee/warlord')
const Duelist = require('./classes/melee/duelist')
const Knight = require('./classes/melee/knight')
const Paladin = require('./classes/melee/paladin')
const Archer = require('./classes/range/archer')
const Sniper = require('./classes/range/sniper')
const Crossbowman = require('./classes/range/crossbowman')
const Ranger = require('./classes/range/ranger')
const Shooter = require('./classes/range/shooter')
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
    this.score = Constants.EXP_FOR_LEVEL_UP[40]
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
      maxHp: 0,
      regeneration: 0,
      speed: 0,
      atkSpeed: 0,
      bltSpeed: 0,
    }

    this.skills2 = {
      attack: 0,
      defense: 0,
      maxHp: 0,
      regeneration: 0,
      speed: 0,
      atkSpeed: 0,
      bltSpeed: 0,
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

    this.className = Constants.CLASSES.MELEE.FIGHTER
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
      this.hp += dt * this.skills.regeneration * Constants.PLAYER_REGENERATION
      if(this.maxHp < this.hp) {
        this.hp = this.maxHp
      }
    }

    // Lvl up
    if(this.score >= Constants.EXP_FOR_LEVEL_UP[this.level+1]) {
     this.levelUp()
    }

    let upDown = this.move.left || this.move.right ? dt * this.speed * 0.75 : dt * this.speed

    if (this.move.up)
      this.y -= upDown

    if (this.move.down)
      this.y += upDown

    let leftRight = this.move.up || this.move.down ? dt * this.speed * 0.75 : dt * this.speed

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

  levelUp() {
    this.level++
    this.skillPoints++
    this.sendMsgSP = true

    this.skills2.attack += Constants.PLAYER_LEVEL_SKILL_RICE
    this.skills2.defense += Constants.PLAYER_LEVEL_SKILL_RICE
    this.skills2.maxHp += Constants.PLAYER_LEVEL_SKILL_RICE
    this.skills2.regeneration += Constants.PLAYER_LEVEL_SKILL_RICE
    this.skills2.speed += Constants.PLAYER_LEVEL_SKILL_RICE
    this.skills2.atkSpeed += Constants.PLAYER_LEVEL_SKILL_RICE
    this.skills2.bltSpeed += Constants.PLAYER_LEVEL_SKILL_RICE

    this.setDamage()
    this.setDefense()
    this.setHp()
    this.setSpeed()
    this.setAtkSpeed()
    this.setBltSpeed()

    if(this.level === 3) {
      this.classPoint++
      this.sendMsgCP = true
    }
    if(this.level === 11) {
      this.classPoint++
      this.sendMsgCP = true
    }
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
    this.damage = 10 + 6 * (this.skills.attack + this.skills2.attack)
  }

  setDefense() {
    this.defense = 1 - ((0.06 * (this.skills.defense + this.skills2.defense))/
        (1 + 0.06 * Math.abs(this.skills.defense+ this.skills2.defense)))
  }

  setHp() {
    let hpProportion = this.hp / this.maxHp
    this.maxHp = Constants.PLAYER_MAX_HP + Constants.PLAYER_MAX_HP * (this.skills.maxHp + this.skills2.maxHp)
    this.hp = this.maxHp * hpProportion
  }

  setSpeed() {
    this.speed += Constants.PLAYER_RAISE_SPEED
    this.pureSpeed += Constants.PLAYER_RAISE_SPEED
  }

  setAtkSpeed() {
    this.attackSpeed -= Constants.PLAYER_RAISE_ATK_SPEED
    this.defaultAttackSpeed -= Constants.PLAYER_RAISE_ATK_SPEED
  }

  setBltSpeed() {
    this.bulletSpeed = 1 + Constants.PLAYER_RAISE_BLT_SPEED * (this.skills.bltSpeed + this.skills2.bltSpeed)
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
        if (this.skills.attack < 8) {
          this.skills.attack++
          this.setDamage()
          this.skillPoints--
        }
        break
      case 1:
        if (this.skills.defense < 8) {
          this.skills.defense++
          this.setDefense()
          this.skillPoints--
        }
        break
      case 2:
        if (this.skills.maxHp < 8) {
          this.skills.maxHp++
          this.setHp()
          this.skillPoints--
        }
        break
      case 3:
        if (this.skills.regeneration < 8) {
          this.skills.regeneration++
          this.skillPoints--
        }
        break
      case 4:
        if (this.skills.speed < 8) {
          this.skills.speed++
          this.setSpeed()
          this.skillPoints--
        }
        break
      case 5:
        if (this.skills.atkSpeed < 8) {
          this.skills.atkSpeed++
          this.setAtkSpeed()
          this.skillPoints--
        }
        break
      case 6:
        if (this.skills.bltSpeed < 8) {
          this.skills.bltSpeed++
          this.setBltSpeed()
          this.skillPoints--
        }
        break
    }
  }

  ifClassWarrior() {
    this.className = Constants.CLASSES.MELEE.WARRIOR
    this.class = new Warrior(this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)

    this.skills2.attack += 5
    this.skills2.defense += 3
    this.skills2.regeneration += 3
    this.skills2.maxHp += 5
    this.setDamage()
    this.setDefense()
    this.setHp()

    this.updateClass = (dt) => {
      this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage, this.lastMove, this.lastClick)
      this.class.update(dt)
      this.giveDamage = this.class.getInfo()
    }
  }

  ifClassWarlord() {
    this.className = Constants.CLASSES.MELEE.WARLORD
    this.class = new Warlord(this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)

    this.skills2.attack += 5
    this.skills2.defense += 3
    this.skills2.regeneration += 3
    this.skills2.maxHp += 5
    this.setDamage()
    this.setDefense()
    this.setHp()

    this.updateClass = (dt) => {
      this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage)
      this.class.update(dt)
      this.giveDamage = this.class.getInfo()
    }
  }

  ifClassDuelist() {
    this.className = Constants.CLASSES.MELEE.DUELIST
    this.class = new Duelist(this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)

    this.skills2.attack += 5
    this.skills2.defense += 3
    this.skills2.regeneration += 3
    this.skills2.maxHp += 5
    this.setDamage()
    this.setDefense()
    this.setHp()

    this.updateClass = (dt) => {
      this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage)
      this.class.update(dt)
      this.giveDamage = this.class.getInfo()
    }
  }

  ifClassKnight() {
    this.className = Constants.CLASSES.MELEE.KNIGHT
    this.class = new Knight(this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)

    this.skills2.attack += 5
    this.skills2.defense += 3
    this.skills2.regeneration += 3
    this.skills2.maxHp += 5
    this.setDamage()
    this.setDefense()
    this.setHp()

    this.updateClass = (dt) => {
      this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage)
      this.class.update(dt)
      this.giveDamage = this.class.getInfo()
    }
  }

  ifClassPaladin() {
    this.className = Constants.CLASSES.MELEE.PALADIN
    this.class = new Paladin(this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)

    this.skills2.attack += 5
    this.skills2.defense += 3
    this.skills2.regeneration += 3
    this.skills2.maxHp += 5
    this.setDamage()
    this.setDefense()
    this.setHp()

    this.updateClass = (dt) => {
      this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage)
      this.class.update(dt)
      this.giveDamage = this.class.getInfo()
    }
  }

  ifClassArcher() {
    this.className = Constants.CLASSES.RANGE.ARCHER
    this.class = new Archer(this.id, this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)
    this.updateClass = (dt) => {
      this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage, this.speed, this.ifSlowBullet, this.lastMove, this.lastClick, this.bulletSpeed)
      return this.class.update(dt)
    }
  }

  ifClassSniper() {
    this.className = Constants.CLASSES.RANGE.SNIPER
    this.class = new Sniper(this.id, this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)
    this.updateClass = (dt) => {
      this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage, this.speed, this.ifSlowBullet, this.lastMove, this.lastClick, this.bulletSpeed)
      return this.class.update(dt)
    }
  }

  ifClassCrossbowman() {
    this.className = Constants.CLASSES.RANGE.CROSSBOWMAN
    this.class = new Crossbowman(this.id, this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)
    this.updateClass = (dt) => {
      this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage, this.speed, this.ifSlowBullet, this.lastMove, this.lastClick, this.bulletSpeed)
      return this.class.update(dt)
    }
  }

  ifClassRanger() {
    this.className = Constants.CLASSES.RANGE.RANGER
    this.class = new Ranger(this.id, this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)
    this.updateClass = (dt) => {
      this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage, this.speed, this.ifSlowBullet, this.lastMove, this.lastClick, this.bulletSpeed)
      return this.class.update(dt)
    }
  }

  ifClassShooter() {
    this.className = Constants.CLASSES.RANGE.SHOOTER
    this.class = new Shooter(this.id, this.x, this.y, this.click, this.direction, this.speed, this.damage, this.attackSpeed)
    this.updateClass = (dt) => {
      this.class.setInfo(this.x, this.y, this.click, this.direction, this.attackSpeed, this.damage, this.speed, this.ifSlowBullet, this.lastMove, this.lastClick, this.bulletSpeed)
      return this.class.update(dt)
    }
  }

  chosenClass(c) {
    if(this.classStage === 0)
    switch (c) {
      case Constants.CLASSES.MELEE.WARRIOR:
        this.ifClassWarrior()
        break
      case Constants.CLASSES.RANGE.ARCHER:
        this.ifClassArcher()
        break
    }
    else
      switch (c) {
        case Constants.CLASSES.MELEE.WARLORD:
          this.ifClassWarlord()
          break
        case Constants.CLASSES.MELEE.DUELIST:
          this.ifClassDuelist()
          break
        case Constants.CLASSES.MELEE.KNIGHT:
          this.ifClassKnight()
          break
        case Constants.CLASSES.MELEE.PALADIN:
          this.ifClassPaladin()
          break
        case Constants.CLASSES.RANGE.SNIPER:
          this.ifClassSniper()
          break
        case Constants.CLASSES.RANGE.CROSSBOWMAN:
          this.ifClassCrossbowman()
          break
        case Constants.CLASSES.RANGE.RANGER:
          this.ifClassRanger()
          break
        case Constants.CLASSES.RANGE.SHOOTER:
          this.ifClassShooter()
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
      abilityCd: this.abilityCd,
      effects: this.effects,
      skillPoints: this.skillPoints
    }
  }
}

module.exports = Player
