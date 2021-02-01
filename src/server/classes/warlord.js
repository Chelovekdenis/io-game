const Warrior = require('./warrior')
const Constants = require('../../shared/constants')

class Warlord extends Warrior {
    constructor(id, x, y, click, direction, speed, damage, atkSpeed) {
        super(id, x, y, click, direction, speed, damage, atkSpeed)
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

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate())
        }
    }
}

module.exports = Warlord
