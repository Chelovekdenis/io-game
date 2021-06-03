const Warrior = require('./warrior')
const Bullet = require('../../bullet')
const Constants = require('../../../shared/constants')

class Paladin extends Warrior {
    constructor(id, x, y, click, direction, speed, damage, atkSpeed) {
        super(id, x, y, click, direction, speed, damage, atkSpeed)
        this.ifToss = false
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
        super.update(dt)
        if(this.ifToss) {
            let sendX = this.x + dt * 400 * Math.sin(this.direction) * 10
            let sendY = this.y - dt * 400 * Math.cos(this.direction) * 10
            return new Bullet(this.id, sendX, sendY, this.direction, this.damage * 3, Constants.BULLET_MODIFICATOR.STUN, 0.2, true)
        }
    }

    weaponsTargets(dt) {
        let a = dt * 400 * Math.sin(this.direction + Constants.PI_25 + this.hitAnimation)
        let b = dt * 400 * Math.cos(this.direction + Constants.PI_25 + this.hitAnimation)
        this.weaponX = this.x + a * 14
        this.weaponY = this.y - b * 14
        a = dt * 400 * Math.sin(this.direction + Constants.PI_30 + this.hitAnimation)
        b = dt * 400 * Math.cos(this.direction + Constants.PI_30 + this.hitAnimation)
        this.weaponX2 = this.x + a * 8
        this.weaponY2 = this.y - b * 8
    }

    spellTwo(dt, sec) {
        this.ifToss = false
        if(this.ifTossCount) {
            this.ifToss = true
            this.ifTossCount = false
        }
    }

    afterSpellTwo(data) {
        this.ifTossCount = true
    }

    setInfo(x, y, click, direction, atkSpeed, damage, ifToss) {
        this.x = x
        this.y = y
        this.click = click
        this.direction = direction
        this.attackSpeed = atkSpeed
        this.damage = damage
        this.ifToss = ifToss
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            abilityName2: "Toss"
        }
    }
}

module.exports = Paladin
