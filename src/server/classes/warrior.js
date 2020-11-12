const Constants = require('../../shared/constants')

class Warrior {
    constructor(x, y, click, direction, speed, damage, atkSpeed) {
        this.x = x
        this.y = y
        this.click = click
        this.direction = direction
        this.speed = speed
        this.count = 0
        this.giveDamage = false
        this.damage = damage
        this.attackSpeed = atkSpeed

        this.weaponX = 0
        this.weaponY = 0
        this.weaponX2 = 0
        this.weaponY2 = 0
        this.hitAnimation = 0
    }
    update(dt) {
        // Анимация удара

        let animationTime = 90 * this.attackSpeed
        let rotationVal = Constants.PI_15  / animationTime
        // Обнуление анимации при смени того что в руках
        // if (this.item !== 2 ) {
        //     this.count = 0
        //     this.hitAnimation = 0
        // }
        if (this.click && this.count === 0) {
            this.count = 1
        }
        if (this.count >= animationTime / 2 ) {
            this.hitAnimation += rotationVal
            this.giveDamage = false
        }
        else if (this.count >= 1) {
            this.hitAnimation -= rotationVal
            this.giveDamage = true
        }
        if (this.count !== 0) {
            this.count++
        }
        // console.log(this.direction)
        if (this.count >= animationTime) {
            this.count = 0
            this.hitAnimation = 0
        }
        // Ставит точку где оружие, которая наносит урон при попадании
        this.weaponsTargets(dt)
    }

    spellOne(dt) {
        this.move = {}
        this.direction = this.lastDir
        this.click = false
        this.x += 1000 * Math.sin(this.direction) * dt
        this.y -= 1000 * Math.cos(this.direction) * dt
    }

    setInfo(x, y, click, direction, atkSpeed, damage) {
        this.x = x
        this.y = y
        this.click = click
        this.direction = direction
        this.attackSpeed = atkSpeed
        this.damage = damage
    }

    getInfo() {
        return this.giveDamage
    }

    weaponsTargets(dt) {
        let a = dt * this.speed * Math.sin(this.direction + Constants.PI_25 + this.hitAnimation)
        let b = dt * this.speed * Math.cos(this.direction + Constants.PI_25 + this.hitAnimation)
        this.weaponX = this.x + a * 16
        this.weaponY = this.y - b * 16
        a = dt * this.speed * Math.sin(this.direction + Constants.PI_40 + this.hitAnimation)
        b = dt * this.speed * Math.cos(this.direction + Constants.PI_40 + this.hitAnimation)
        this.weaponX2 = this.x + a * 9
        this.weaponY2 = this.y - b * 9
    }

    weaponsHit(object) {
        const dx = this.weaponX - object.x
        const dy = this.weaponY - object.y
        const dx2 = this.weaponX2 - object.x
        const dy2 = this.weaponY2 - object.y
        return Math.min(Math.sqrt(dx * dx + dy * dy), Math.sqrt(dx2 * dx2 + dy2 * dy2))
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
                newChar.atk = 1
                newChar.hp = 1
                newChar.reg = 0.3
                newChar.str = 1
                break
            case "agility":
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
            hitAnimation: this.hitAnimation,
            weaponX: this.weaponX,
            weaponY: this.weaponY,
            weaponX2: this.weaponX2,
            weaponY2: this.weaponY2,
            damage: this.damage,
            atkSpeed: this.attackSpeed
        }
    }
}

module.exports = Warrior
