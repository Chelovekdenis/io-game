const Enemy = require('./enemy')
const Constants = require('../shared/constants')

class Boss extends Enemy {
    constructor(id, x, y, speed) {
        super(id, x, y, speed)
        this.hp = 2000
        this.maxHp = 2000
        this.level = 20

        this.damage = 1

        this.lastHit = []
        this.lh = ''

        this.weaponX = 0
        this.weaponY = 0
    }

    update(dt, x, y) {
        super.update(dt, x, y)

        // Уменьшение показателя агресивности со временем
        this.lastHit.forEach(item => {
            item.count -= item.count >= 0? dt * 0.1 : 0
        })

        let a = dt * this.speed * Math.sin(this.direction + Math.PI/3 + this.hitAnimation)
        let b = dt * this.speed * Math.cos(this.direction + Math.PI/3 + this.hitAnimation)
        this.weaponX = this.x + a * 30
        this.weaponY = this.y - b * 30
    }

    weaponsHit(object) {
        const dx = (this.weaponX - object.x)/10
        const dy = (this.weaponY - object.y)/10
        return Math.sqrt(dx * dx + dy * dy)
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
            weaponX: this.weaponX,
            weaponY: this.weaponY,
        }
    }
}

module.exports = Boss
