const ObjectClass = require('../object')
const Constants = require('../../shared/constants')

class Enemy extends ObjectClass {
    constructor(id, x, y, speed, lvl) {
        super(id, x, y, speed)
        this.direction = 0
        this.maxHp = 35 + 15 * lvl
        this.hp = this.maxHp
        this.level = lvl

        this.toAttack = false
        this.count = 0
        this.hitAnimation = 0
        this.giveDamage = false

        this.weaponX = 0
        this.weaponY = 0

        // this.damage = 0.3 + 0.1 * lvl
        this.damage = 0.1
        this.lastHit = []
        this.lh = ''
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

    hitKick(dt) {
        this.x += this.needKick.power * Math.sin(this.needKick.dir) / 10
        this.y -= this.needKick.power * Math.cos(this.needKick.dir) / 10
        this.needKick.need = false
    }

    chosenTarget(players, biggerDis, smallerDis) {
        let moreAggressive = {}
        // Отсеиваем игроков которые в радиусе
        players = players.filter(
            p => this.distanceTo(p) <= biggerDis
        )
        // Если таки игроков нет, то возвращаем 0
        if(players.length === 0)
            return false
        // В lastHit только те кто находятся в радиусе
        this.lastHit = this.lastHit.filter(
            p => players.find(element => {
                if (element.id === p.id)
                    return p
            })
        )
        // Если такой один, то его и записываем
        if(this.lastHit.length === 1)
            moreAggressive = this.lastHit[0]
        // Выбор самого агрессивного
        for (let j = 0; j < this.lastHit.length - 1; j++) {
            moreAggressive = this.lastHit[j].count > this.lastHit[j + 1].count ?
                this.lastHit[j] : this.lastHit[j + 1]
        }
        // Отправляем его
        if (Object.keys(moreAggressive).length !== 0 )
            return moreAggressive.id

        let minDis =  {
            id: false,
            dis: smallerDis
        }
        // Выбираем самого ближайщего
        players.forEach(item => {
            let dis = this.distanceTo(item)
            if(dis <= minDis.dis) {
                minDis.id = item.id
                minDis.dis = dis
            }
        })
        return minDis.id
    }

    takeDamage(damage, id) {
        this.hp -= damage
        this.lh = id
        let finded = this.lastHit.find(element => {
            if(element.id === id)
                return element
        })
        if(finded) {
            finded.count++
            if (finded.count > 5)
                finded.count = 5
        } else
            this.lastHit.push({id:id, count: 1})
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            direction: this.direction,
            hp: this.hp,
            maxHp: this.maxHp,
            hitAnimation: this.hitAnimation,
            level: this.level
        }
    }
}

module.exports = Enemy
