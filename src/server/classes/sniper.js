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
    }

    update(dt) {
        // Икс два урон, модификатор класса
        this.damage = this.damage*2
        return super.update(dt)
    }

    spellTwo(dt) {
        this.attackSpeed = this.defaultAttackSpeed / 2
        this.speed = this.pureSpeed * 0.7
    }

    afterSpellTwo(data) {
        this.attackSpeed = data.atkSpeed
        this.speed = data.speed
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            abilityName2: "Storm of arrows"
        }
    }
}

module.exports = Sniper
