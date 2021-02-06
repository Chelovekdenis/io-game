const Warrior = require('./warrior')
const Constants = require('../../shared/constants')

class Warlord extends Warrior {
    constructor(id, x, y, click, direction, speed, damage, atkSpeed) {
        super(id, x, y, click, direction, speed, damage, atkSpeed)
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
        this.weaponX = this.x + a * 20
        this.weaponY = this.y - b * 20
        a = dt * 400 * Math.sin(this.direction + Constants.PI_30 + this.hitAnimation)
        b = dt * 400 * Math.cos(this.direction + Constants.PI_30 + this.hitAnimation)
        this.weaponX2 = this.x + a * 10
        this.weaponY2 = this.y - b * 10
    }

    spellTwo(dt) {
        this.attackSpeed = this.defaultAttackSpeed / 2
        this.speed = this.pureSpeed * 1.3
    }

    afterSpellTwo(data) {
        this.attackSpeed = data.atkSpeed
        this.speed = data.speed
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            abilityName2: "Rage"
        }
    }
}

module.exports = Warlord
