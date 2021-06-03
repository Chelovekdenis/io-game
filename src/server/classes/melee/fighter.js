const Constants = require('../../../shared/constants')

class Fighter {
    constructor(id, x, y, click, direction, speed, damage, atkSpeed) {
        this.id = id
        this.x = x
        this.y = y
        this.click = click
        this.direction = direction
        this.speed = speed
        this.count = 0
        this.giveDamage = false
        this.damage = damage
        this.attackSpeed = atkSpeed
        this.lastMove = {}
        this.lastClick = false

        this.weaponX = 0
        this.weaponY = 0
        this.weaponX2 = 0
        this.weaponY2 = 0
        this.hitAnimation = 0

        this.availableAbilities = {
            first: false,
            second: false,
            third: false,
            fourth: false,
        }
        this.abilitiesPassivActive = {
            first: false,
            second: false,
            third: false,
            fourth: false,
        }
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

        // console.log("rrrr " + this.ifStun)
        // Ставит точку где оружие, которая наносит урон при попадании
        this.weaponsTargets(dt)
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
        let a = dt * 400 * Math.sin(this.direction + Constants.PI_25 + this.hitAnimation)
        let b = dt * 400 * Math.cos(this.direction + Constants.PI_25 + this.hitAnimation)
        this.weaponX = this.x + a * 11
        this.weaponY = this.y - b * 11
        a = dt * 400 * Math.sin(this.direction + Constants.PI_40 + this.hitAnimation)
        b = dt * 400 * Math.cos(this.direction + Constants.PI_40 + this.hitAnimation)
        this.weaponX2 = this.x + a * 7
        this.weaponY2 = this.y - b * 7
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
                newChar.atk = 1.4
                newChar.hp = 1
                newChar.reg = 0.6
                newChar.str = 1
                break
            case "agility":
                newChar.def = 1
                newChar.atkSpeed = 0.005
                newChar.speed = 0.2
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
            atkSpeed: this.attackSpeed,
            availableAbilities: this.availableAbilities
        }
    }
}

module.exports = Fighter
