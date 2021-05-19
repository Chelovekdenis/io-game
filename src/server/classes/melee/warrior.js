const Fighter = require('./fighter')
const Constants = require('../../../shared/constants')

class Warrior extends Fighter {
    constructor(x, y, click, direction, speed, damage, atkSpeed) {
        super(x, y, click, direction, speed, damage, atkSpeed)
        this.availableAbilities = {
            first: true,
            second: false,
            third: false,
            fourth: false,
        }
    }
    update(dt) {
        return super.update(dt)
    }

    spellOne(dt) {
        this.ifStun = true
        this.move = {}
        this.direction = this.lastDir
        this.click = false
        this.x += 1000 * Math.sin(this.direction) * dt
        this.y -= 1000 * Math.cos(this.direction) * dt
    }

    afterSpellOne(data) {
        this.ifStun = data
        this.move = this.lastMove
        this.click = this.lastClick
    }

    setInfo(x, y, click, direction, atkSpeed, damage, lastMove, lastClick) {
        this.x = x
        this.y = y
        this.click = click
        this.direction = direction
        this.attackSpeed = atkSpeed
        this.damage = damage
        this.lastMove = lastMove
        this.lastClick = lastClick
    }

    getInfo() {
        return this.giveDamage
    }

    weaponsTargets(dt) {
        let a = dt * 400 * Math.sin(this.direction + Constants.PI_25 + this.hitAnimation)
        let b = dt * 400 * Math.cos(this.direction + Constants.PI_25 + this.hitAnimation)
        this.weaponX = this.x + a * 12
        this.weaponY = this.y - b * 12
        a = dt * 400 * Math.sin(this.direction + Constants.PI_40 + this.hitAnimation)
        b = dt * 400 * Math.cos(this.direction + Constants.PI_40 + this.hitAnimation)
        this.weaponX2 = this.x + a * 7
        this.weaponY2 = this.y - b * 7
    }


    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            abilityName1: "Rush"
        }
    }
}

module.exports = Warrior
