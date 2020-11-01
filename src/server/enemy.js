const ObjectClass = require('./object')
const Constants = require('../shared/constants')

class Enemy extends ObjectClass {
    constructor(id, x, y, speed) {
        super(id, x, y, speed)
        this.direction = 0
        this.hp = 50
        this.maxHp = 50
        this.level = 1

        this.toAttack = false
        this.count = 0
        this.hitAnimation = 0
        this.giveDamage = false

        this.weaponX = 0
        this.weaponY = 0

        this.damage = 0.5

        this.lastHit = ''
    }

    update(dt, x, y) {
        this.direction = Math.atan2(x - this.x, this.y - y)
        this.x = this.x + dt * this.speed * Math.sin(this.direction)
        this.y = this.y - dt * this.speed * Math.cos(this.direction)

        let animationTime = 60
        if (this.toAttack && this.count === 0) {
            this.count = 1
        }
        if (this.count >= animationTime / 2 ) {
            this.hitAnimation += Math.PI * 1.5 / animationTime
            this.giveDamage = false
        }
        else if (this.count >= 1) {
            this.hitAnimation -= Math.PI * 1.5 / animationTime
            this.giveDamage = true
            let a = dt * this.speed * Math.sin(this.direction + Math.PI/4 + this.hitAnimation)
            let b = dt * this.speed * Math.cos(this.direction + Math.PI/4 + this.hitAnimation)
            this.weaponX = this.x + a * 12
            this.weaponY = this.y - b * 12
        }
        if (this.count !== 0) {
            this.count++
        }
        // console.log(this.direction)
        if (this.count === animationTime) {
            this.count = 0
            this.hitAnimation = 0
        }

    }

    weaponsHit(object) {
        const dx = this.weaponX - object.x
        const dy = this.weaponY - object.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    takeDamage(damage, id) {
        this.hp -= damage
        this.lastHit = id
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            direction: this.direction,
            hp: this.hp,
            maxHp: this.maxHp,
            hitAnimation: this.hitAnimation
        }
    }
}

module.exports = Enemy
