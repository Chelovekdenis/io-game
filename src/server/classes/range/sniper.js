const Archer = require('./archer')

class Sniper extends Archer {
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
        // Икс два урон, модификатор класса
        this.damage = this.damage*2
        return super.update(dt)
    }

    spellTwo(dt, sec) {
        this.attackSpeed = this.defaultAttackSpeed / 2
        this.speed = this.pureSpeed * 0.7
        this.effects.storm.yes = true
        this.effects.storm.time = sec
    }

    afterSpellTwo(data) {
        this.attackSpeed = data.atkSpeed
        this.speed = data.speed
        this.effects.storm.yes = false
        this.effects.storm.time = 0
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            abilityName2: "Storm"
        }
    }
}

module.exports = Sniper
