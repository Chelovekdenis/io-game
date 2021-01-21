const Bullet = require('../bullet')

class Archer {
    constructor(id, x, y, click, direction, speed, damage, atkSpeed) {
        this.id = id
        this.x = x
        this.y = y
        this.click = click
        this.direction = direction
        this.speed = speed
        this.fireCooldown = 0
        this.damage = damage
        this.attackSpeed = atkSpeed
        this.ifSlowBullet = false
        this.lastMove = {}
        this.lastClick = false
    }
    update(dt) {
        if (this.fireCooldown > 0)
            this.fireCooldown -= dt
        if(this.click) {
            if (this.fireCooldown <= 0) {
                this.fireCooldown += this.attackSpeed
                // Двинуть передсобой, чтобы вылетали из дула
                let sendX = this.x + dt * this.speed * Math.sin(this.direction) * 10
                let sendY = this.y - dt * this.speed * Math.cos(this.direction) * 10
                return new Bullet(this.id, sendX, sendY, this.direction, this.damage)
            }
        }
        if(this.ifSlowBullet) {
            let sendX = this.x + dt * this.speed * Math.sin(this.direction) * 10
            let sendY = this.y - dt * this.speed * Math.cos(this.direction) * 10
            return new Bullet(this.id, sendX, sendY, this.direction, this.damage*100)
        }

        return null
    }

    spellOne(dt) {
        this.ifSlowBullet = false
        if(this.ifSlowBulletCount) {
            this.ifSlowBullet = true
            this.ifSlowBulletCount = false
        }
        this.move = {}
        this.direction = this.lastDir
        this.click = false
        this.x -= 700 * Math.sin(this.direction) * dt
        this.y += 700 * Math.cos(this.direction) * dt
    }

    afterSpellOne(data) {
        this.move = this.lastMove
        this.click = this.lastClick
        this.ifSlowBulletCount = !data
    }

    setInfo(x, y, click, direction, atkSpeed, damage, speed, ifSlowBullet, lastMove, lastClick) {
        this.x = x
        this.y = y
        this.click = click
        this.direction = direction
        this.attackSpeed = atkSpeed
        this.damage = damage
        this.speed = speed
        this.ifSlowBullet = ifSlowBullet
        this.lastMove = lastMove
        this.lastClick = lastClick
    }

    getIfStun() {
        return this.ifStun
    }

    setIfStun(ifStun) {
        this.ifStun = ifStun
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
            atkSpeed: this.attackSpeed,
            abilityName1: "Bounce"
        }
    }
}

module.exports = Archer
