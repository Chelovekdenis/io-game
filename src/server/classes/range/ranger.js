const Archer = require('./archer')

class Ranger extends Archer {
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
        this.speed = this.pureSpeed * 1.1
        this.effects.invis.yes = true
        this.effects.invis.time = sec
    }

    afterSpellTwo(data) {
        this.speed = data.speed
        this.effects.invis.yes = false
        this.effects.invis.time = 0
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            abilityName2: "Invisible"
        }
    }
}

module.exports = Ranger
