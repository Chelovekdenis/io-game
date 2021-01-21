const Enemy = require('./enemy')

class EnemyWarrior extends Enemy {
    constructor(id, x, y, speed, lvl) {
        super(id, x, y, speed)
        this.maxHp = 70 + 30 * lvl
        this.hp = this.maxHp
        this.level = lvl

        // this.damage = 0.6 + 0.2 * lvl
        this.damage = 0.1

        this.weaponX = 0
        this.weaponY = 0
    }

    update(dt, x, y) {
        super.update(dt, x, y)

        // Уменьшение показателя агресивности со временем
        this.lastHit.forEach(item => {
            item.count -= item.count >= 0? dt * 0.1 : 0
        })

        let a = dt * this.speed * Math.sin(this.direction + Math.PI/3 + this.hitAnimation)
        let b = dt * this.speed * Math.cos(this.direction + Math.PI/3 + this.hitAnimation)
        this.weaponX = this.x + a * 30
        this.weaponY = this.y - b * 30
    }

    hitKick(dir) {

    }

    weaponsHit(object) {
        const dx = (this.weaponX - object.x)/10
        const dy = (this.weaponY - object.y)/10
        return Math.sqrt(dx * dx + dy * dy)
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            weaponX: this.weaponX,
            weaponY: this.weaponY,
        }
    }
}

module.exports = EnemyWarrior
