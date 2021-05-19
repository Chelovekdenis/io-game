const Warrior = require('./warrior')
const Constants = require('../../../shared/constants')

class Duelist extends Warrior {
    constructor(x, y, click, direction, speed, damage, atkSpeed) {
        super(x, y, click, direction, speed, damage, atkSpeed)
        this.availableAbilities = {
            first: true,
            second: true,
            third: false,
            fourth: false,
        }
    }

    update(dt) {
        return super.update(dt)
    }

    weaponsTargets(dt) {
        let a = dt * 400 * Math.sin(this.direction + Constants.PI_25 + this.hitAnimation)
        let b = dt * 400 * Math.cos(this.direction + Constants.PI_25 + this.hitAnimation)
        this.weaponX = this.x + a * 14
        this.weaponY = this.y - b * 14
        a = dt * 400 * Math.sin(this.direction + Constants.PI_30 + this.hitAnimation)
        b = dt * 400 * Math.cos(this.direction + Constants.PI_30 + this.hitAnimation)
        this.weaponX2 = this.x + a * 8
        this.weaponY2 = this.y - b * 8
    }

    spellTwo(dt, sec) {
        this.attackSpeed = this.defaultAttackSpeed / 2
        this.speed = this.pureSpeed * 1.3
        this.effects.rage.yes = true
        this.effects.rage.time = sec
    }

    afterSpellTwo(data) {
        this.attackSpeed = data.atkSpeed
        this.speed = data.speed
        this.effects.rage.yes = false
        this.effects.rage.time = 0
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            abilityName2: "Rage"
        }
    }
}

module.exports = Duelist
