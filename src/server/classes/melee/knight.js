const Warrior = require('./warrior')
const Constants = require('../../../shared/constants')

class Knight extends Warrior {
    constructor(id, x, y, click, direction, speed, damage, atkSpeed) {
        super(id, x, y, click, direction, speed, damage, atkSpeed)
        this.availableAbilities = {
            first: true,
            second: true,
            third: false,
            fourth: false,
        }
        this.abilitiesPassivActive = {
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
        // Сделать 10000 брони или больше
        this.defense = 0
        this.effects.immortal.yes = true
        this.effects.immortal.time = sec
    }

    afterSpellTwo(data) {
        this.defense = data.defense
        this.effects.immortal.yes = false
        this.effects.immortal.time = 0
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            abilityName2: "Immortal"
        }
    }
}

module.exports = Knight
