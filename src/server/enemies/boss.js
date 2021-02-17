const Enemy = require('./enemy')
const Constants = require('../../shared/constants')


class Boss extends Enemy {
    constructor(id, x, y, speed) {
        super(id, x, y, speed)
        this.hp = 2000
        this.maxHp = 2000
        this.level = 20
        this.radius = Constants.BOSS_RADIUS

        this.damage = 1

        this.weaponX2 = 0
        this.weaponY2 = 0
        this.weaponX3 = 0
        this.weaponY3 = 0
    }

    update(dt, x, y) {
        super.update(dt, x, y)

        let a = dt * 400 * Math.sin(this.direction + Constants.PI_40 + this.hitAnimation)
        let b = dt * 400 * Math.cos(this.direction + Constants.PI_40 + this.hitAnimation)
        this.weaponX = this.x + a * 24
        this.weaponY = this.y - b * 24
        a = dt * 400 * Math.sin(this.direction + Constants.PI_30 + this.hitAnimation)
        b = dt * 400 * Math.cos(this.direction + Constants.PI_30 + this.hitAnimation)
        this.weaponX2 = this.x + a * 48
        this.weaponY2 = this.y - b * 48
        a = dt * 400 * Math.sin(this.direction + Constants.PI_25 + this.hitAnimation)
        b = dt * 400 * Math.cos(this.direction + Constants.PI_25 + this.hitAnimation)
        this.weaponX3 = this.x + a * 32
        this.weaponY3 = this.y - b * 32
    }

    hitKick(dir) {

    }


    weaponsHit(object) {
        const dx = this.weaponX - object.x
        const dy = this.weaponY - object.y
        const dx2 = this.weaponX2 - object.x
        const dy2 = this.weaponY2 - object.y
        const dx3 = this.weaponX3 - object.x
        const dy3 = this.weaponY3 - object.y
        return Math.min(Math.sqrt(dx * dx + dy * dy),
            Math.sqrt(dx2 * dx2 + dy2 * dy2),
            Math.sqrt(dx3 * dx3 + dy3 * dy3))

    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            weaponX2: this.weaponX2,
            weaponY2: this.weaponY2,
        }
    }
}

module.exports = Boss
