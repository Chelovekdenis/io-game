const Warrior = require('./warrior')
const Constants = require('../../../shared/constants')

class Duelist extends Warrior {
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
        a = dt * 400 * Math.sin(this.direction - Constants.PI_25 + this.hitAnimation)
        b = dt * 400 * Math.cos(this.direction - Constants.PI_25 + this.hitAnimation)
        this.weaponX3 = this.x + a * 14
        this.weaponY3 = this.y - b * 14
        a = dt * 400 * Math.sin(this.direction - Constants.PI_30 + this.hitAnimation)
        b = dt * 400 * Math.cos(this.direction - Constants.PI_30 + this.hitAnimation)
        this.weaponX4 = this.x + a * 8
        this.weaponY4 = this.y - b * 8
    }

    spellTwo(dt, sec) {
        this.damage = this.pureDamage * 2
        this.effects.double.yes = true
        this.effects.double.time = sec
    }

    afterSpellTwo(data) {
        // Так как урон к которому вернется записывается в начале
        // использования скилла, то прокаченный урон не добавится пока
        // не прокачать повторно (можно запретить прокачку под действием скилов)
        this.damage = data.damage
        this.effects.double.yes = false
        this.effects.double.time = 0
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            abilityName2: "Double"
        }
    }
}

module.exports = Duelist
