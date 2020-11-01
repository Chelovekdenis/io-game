class Warrior {
    constructor(x, y, click, direction, speed) {
        this.x = x
        this.y = y
        this.click = click
        this.direction = direction
        this.speed = speed
        this.count = 0
        this.giveDamage = false

        this.weaponX = 0
        this.weaponY = 0
        this.weaponX2 = 0
        this.weaponY2 = 0
        this.hitAnimation = 0
    }
    update(dt) {
        // Анимация удара
        let animationTime = 60
        // Обнуление анимации при смени того что в руках
        // if (this.item !== 2 ) {
        //     this.count = 0
        //     this.hitAnimation = 0
        // }
        if (this.click && this.count === 0) {
            this.count = 1
        }
        if (this.count >= animationTime / 2 ) {
            this.hitAnimation += Math.PI * 1.5 / animationTime
            this.giveDamage = false
        }
        else if (this.count >= 1) {
            this.hitAnimation -= Math.PI * 1.5 / animationTime
            this.giveDamage = true
        }
        if (this.count !== 0) {
            this.count++
        }
        // console.log(this.direction)
        if (this.count === animationTime) {
            this.count = 0
            this.hitAnimation = 0
        }
        // Ставит точку где оружие, которая наносит урон при попадании
        let a = dt * this.speed * Math.sin(this.direction + Math.PI/3 + this.hitAnimation)
        let b = dt * this.speed * Math.cos(this.direction + Math.PI/3 + this.hitAnimation)
        this.weaponX = this.x + a * 15
        this.weaponY = this.y - b * 15
        a = dt * this.speed * Math.sin(this.direction + Math.PI/4 + this.hitAnimation)
        b = dt * this.speed * Math.cos(this.direction + Math.PI/4 + this.hitAnimation)
        this.weaponX2 = this.x + a * 7
        this.weaponY2 = this.y - b * 7
    }

    setInfo(x, y, click, direction) {
        this.x = x
        this.y = y
        this.click = click
        this.direction = direction
    }

    getInfo() {
        return this.giveDamage
    }

    weaponsHit(object) {
        const dx = this.weaponX - object.x
        const dy = this.weaponY - object.y
        const dx2 = this.weaponX2 - object.x
        const dy2 = this.weaponY2 - object.y
        return Math.min(Math.sqrt(dx * dx + dy * dy), Math.sqrt(dx2 * dx2 + dy2 * dy2))
    }

    serializeForUpdate() {
        return {
            hitAnimation: this.hitAnimation,
            weaponX: this.weaponX,
            weaponY: this.weaponY,
            weaponX2: this.weaponX2,
            weaponY2: this.weaponY2,
        }
    }
}

module.exports = Warrior
