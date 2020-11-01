const Bullet = require('./bullet')

class Archer {
    constructor(id, x, y, click, direction, speed, damage) {
        this.id = id
        this.x = x
        this.y = y
        this.click = click
        this.direction = direction
        this.speed = speed
        this.fireCooldown = 0
        this.damage = damage
    }
    update(dt) {
        // Стрельба если выбран пистолет на третьем слоте
        if(this.click) {
            this.fireCooldown -= dt
            if (this.fireCooldown <= 0) {
                this.fireCooldown += 1
                // Двинуть передсобой, чтобы вылетали из дула
                let sendX = this.x + dt * this.speed * Math.sin(this.direction) * 13
                let sendY = this.y - dt * this.speed * Math.cos(this.direction) * 13
                return new Bullet(this.id, sendX, sendY, this.direction, this.damage)
            }
        }

        return null
    }

    setInfo(x, y, click, direction, damage) {
        this.x = x
        this.y = y
        this.click = click
        this.direction = direction
        this.damage = damage
    }

    serializeForUpdate() {
        return {
            hitAnimation: 0,
            weaponX: 0,
            weaponY: 0,
            weaponX2: 0,
            weaponY2: 0,
        }
    }
}

module.exports = Archer
