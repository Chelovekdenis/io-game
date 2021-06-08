const Archer = require('./archer')
const Bullet = require('../../bullet')
const Constants = require('../../../shared/constants')

class Crossbowman extends Archer {
    constructor(id, x, y, click, direction, speed, damage, atkSpeed) {
        super(id, x, y, click, direction, speed, damage, atkSpeed)
        this.ifMegaShot = false
        this.megaShotDamage = this.damage * 5
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
        if (this.fireCooldown > 0)
            this.fireCooldown -= dt
        if(this.click) {
            if (this.fireCooldown <= 0) {
                this.fireCooldown += this.attackSpeed
                // Двинуть передсобой, чтобы вылетали из дула
                let sendX = this.x + dt * 400 * Math.sin(this.direction) * 6
                let sendY = this.y - dt * 400 * Math.cos(this.direction) * 6
                return new Bullet(this.id, sendX, sendY, this.direction, this.damage, Constants.BULLET_MODIFICATOR.PURE, this.bulletSpeed, true)
            }
        }
        if(this.ifSlowBullet) {
            let sendX = this.x + dt * this.speed * Math.sin(this.direction) * 10
            let sendY = this.y - dt * this.speed * Math.cos(this.direction) * 10
            return new Bullet(this.id, sendX, sendY, this.direction, this.damage, Constants.BULLET_MODIFICATOR.SLOW, this.bulletSpeed, true)
        }

        if(this.ifMegaShot) {
            let sendX = this.x + dt * this.speed * Math.sin(this.direction) * 10
            let sendY = this.y - dt * this.speed * Math.cos(this.direction) * 10
            return new Bullet(this.id, sendX, sendY, this.direction, this.megaShotDamage, Constants.BULLET_MODIFICATOR.MEGA, this.bulletSpeed, true)
        }

        return null
    }

    spellTwo(dt, sec) {
        this.ifMegaShot = false
        if(this.ifMegaShotCount) {
            this.ifMegaShot = true
            this.ifMegaShotCount = false
        }
    }

    afterSpellTwo(data) {
        this.ifMegaShotCount = true
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            abilityName2: "Mega"
        }
    }
}

module.exports = Crossbowman
