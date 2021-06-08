const Archer = require('./archer')
const Bullet = require('../../bullet')
const Constants = require('../../../shared/constants')

class Shooter extends Archer {
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
            second: false,
            third: false,
            fourth: false,
        }
    }

    update(dt) {
        if (this.fireCooldown > 0)
            this.fireCooldown -= dt
        if(this.click) {
            if (this.fireCooldown <= 0) {
                this.fireCooldown += this.attackSpeed
                // Двинуть передсобой, чтобы вылетали из дула
                let bullets = []
                for (let i = 0; i < 3; i++) {
                    let sendX = this.x + dt * 400 * Math.sin(this.direction + Constants.PI_40 * (i-1)) * 6
                    let sendY = this.y - dt * 400 * Math.cos(this.direction + Constants.PI_40 * (i-1)) * 6
                    bullets.push(new Bullet(this.id, sendX, sendY, this.direction, this.damage * 0.6, Constants.BULLET_MODIFICATOR.PURE, this.bulletSpeed, false))
                }
                return bullets
            }
        }
        if(this.ifSlowBullet) {
            let bullets = []
            for (let i = 0; i < 3; i++) {
                let sendX = this.x + dt * 400 * Math.sin(this.direction + Constants.PI_40 * (i-1)) * 6
                let sendY = this.y - dt * 400 * Math.cos(this.direction + Constants.PI_40 * (i-1)) * 6
                bullets.push(new Bullet(this.id, sendX, sendY, this.direction, this.damage, Constants.BULLET_MODIFICATOR.SLOW, this.bulletSpeed, false))
            }
            return bullets
        }

        return null
    }

    spellTwo(dt, sec) {

    }

    afterSpellTwo(data) {
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            abilityName2: "Triple"
        }
    }
}

module.exports = Shooter
