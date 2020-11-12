const Bullet = require('../bullet')

class Archer {
    constructor(x, y, click, direction, speed, damage, atkSpeed) {
        this.x = x
        this.y = y
        this.click = click
        this.direction = direction
        this.speed = speed
        this.fireCooldown = 0
        this.damage = damage
        this.attackSpeed = atkSpeed
    }
    update(dt) {
        if(this.click) {
            this.fireCooldown -= dt
            if (this.fireCooldown <= 0) {
                this.fireCooldown += this.attackSpeed
                // Двинуть передсобой, чтобы вылетали из дула
                let sendX = this.x + dt * this.speed * Math.sin(this.direction) * 13
                let sendY = this.y - dt * this.speed * Math.cos(this.direction) * 13
                return new Bullet(this.id, sendX, sendY, this.direction, this.damage)
            }
        }

        return null
    }

    spellOne(dt) {
        this.move = {}
        this.direction = this.lastDir
        this.click = false
        this.x -= 500 * Math.sin(this.direction) * dt
        this.y += 500 * Math.cos(this.direction) * dt
    }

    setInfo(x, y, click, direction, atkSpeed, damage, speed) {
        this.x = x
        this.y = y
        this.click = click
        this.direction = direction
        this.attackSpeed = atkSpeed
        this.damage = damage
        this.speed = speed
    }

    setAttributes(item) {
        let newChar = {
            atk: 0,
            def: 0,
            reg: 0,
            hp: 0,
            speed: 0,
            atkSpeed: 0,
            str: 0,
            agl: 0,
            int: 0,
        }
        switch (item) {
            case "strength":
                newChar.hp = 1
                newChar.reg = 0.3
                newChar.str = 1
                break
            case "agility":
                newChar.atk = 1
                newChar.def = 1
                newChar.atkSpeed = 0.01
                newChar.speed = 5
                newChar.agl = 1
                break
            case "intelligence":
                newChar.int = 1
                break
        }
        return newChar
    }

    serializeForUpdate() {
        return {
            hitAnimation: 0,
            weaponX: 0,
            weaponY: 0,
            weaponX2: 0,
            weaponY2: 0,
            damage: this.damage,
            atkSpeed: this.attackSpeed
        }
    }
}

module.exports = Archer
