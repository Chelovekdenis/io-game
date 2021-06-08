const Enemy = require('./enemy')
const Constants = require('../../shared/constants')

class EnemyWarrior extends Enemy {
    constructor(id, x, y, speed, lvl, topPlayer) {
        super(id, x, y, speed)
        this.maxHp = 70 + 30 * lvl
        this.hp = this.maxHp
        this.level = lvl
        this.radius = Constants.PLAYER_RADIUS
        this.damage = 0.6 + 0.3 * lvl
        // this.damage = 0.2
        this.className = "ew"

        this.defense = 0.80

        this.weaponX = 0
        this.weaponY = 0
        this.weaponX2 = 0
        this.weaponY2 = 0

        this.ifObsidian = topPlayer.ifObsidian
        if(this.ifObsidian) {
            this.maxHp += 1500
            this.hp = this.maxHp
            this.damage *= 3
        }
    }

    update(dt, x, y) {
        super.update(dt, x, y)

        let a = dt * 400 * Math.sin(this.direction + Constants.PI_25 + this.hitAnimation)
        let b = dt * 400 * Math.cos(this.direction + Constants.PI_25 + this.hitAnimation)
        this.weaponX = this.x + a * 12
        this.weaponY = this.y - b * 12
        a = dt * 400 * Math.sin(this.direction + Constants.PI_40 + this.hitAnimation)
        b = dt * 400 * Math.cos(this.direction + Constants.PI_40 + this.hitAnimation)
        this.weaponX2 = this.x + a * 7
        this.weaponY2 = this.y - b * 7
    }

    weaponsHit(object) {
        // const dx = (this.weaponX - object.x)/10
        // const dy = (this.weaponY - object.y)/10
        // return Math.sqrt(dx * dx + dy * dy)
        const dx = this.weaponX - object.x
        const dy = this.weaponY - object.y
        const dx2 = this.weaponX2 - object.x
        const dy2 = this.weaponY2 - object.y
        return Math.min(Math.sqrt(dx * dx + dy * dy), Math.sqrt(dx2 * dx2 + dy2 * dy2))
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            weaponX: this.weaponX,
            weaponY: this.weaponY,
            weaponX2: this.weaponX2,
            weaponY2: this.weaponY2,
            ifObsidian: this.ifObsidian,
        }
    }
}

module.exports = EnemyWarrior
