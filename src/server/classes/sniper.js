const Archer = require('./archer')

class Sniper extends Archer {
    constructor(id, x, y, click, direction, speed, damage, atkSpeed) {
        super(id, x, y, click, direction, speed, damage, atkSpeed)
    }

    update(dt) {
        // Икс два урон, модификатор класса
        this.damage = this.damage*2
        return super.update(dt)
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate())
        }
    }
}

module.exports = Sniper
