const ObjectClass = require('../object')
const Constants = require('../../shared/constants')

class Enemy extends ObjectClass {
    constructor(id, x, y, speed, lvl) {
        super(id, x, y, speed, Constants.ENEMY_RADIUS)
        this.direction = 0
        this.maxHp = 35 + 20 * lvl
        this.hp = this.maxHp
        this.level = lvl
        this.className = "e"

        this.toAttack = false
        this.count = 0
        this.hitAnimation = 0
        this.giveDamage = false

        this.weaponX = 0
        this.weaponY = 0

        this.damage = 0.3 + 0.15 * lvl
        this.defense = 0.99
        // this.damage = 0.1
        this.lastHit = []
        this.lh = ''

        this.functionStack = []

        this.effects = {
            stunned: {
                yes: false,
                time: 0
            },
            slowed: {
                yes: false,
                time: 0
            },
            rage: {
                yes: false,
                time: 0
            },
            storm: {
                yes: false,
                time: 0
            },
            invis: {
                yes: false,
                time: 0
            },
        }

        this.needKick = {
            need:false,
            dir: 0,
            power: 0
        }
        this.needStun = false

        this.pureSpeed = this.speed
        this.ifStun = false
        this.canSpell = true
        this.canAttack = true

        this.directionPoint = 0
        this.timeTravel = 0
        this.dirPiece = 0
        this.timeRorate = 0
        this.timeStay = 0
        this.xForProminade = x
        this.yForProminade = y
    }

    update(dt, x, y) {
        this.functionStack.forEach((item, i) => {
            item.sec -= dt
            item.func(dt, item.sec)
            if(item.sec <= 0) {
                if(item.rec)
                    item.rec(item.recData)
                this.functionStack.splice(i, 1)
            }
        })

        // Уменьшение показателя агресивности со временем
        this.lastHit.forEach(item =>
            item.count -= dt * 0.03
        )
        this.lastHit = this.lastHit.filter(item =>
            item.count > 0
        )

        if (!this.effects.stunned.yes)
            this.direction = Math.atan2(x - this.x, this.y - y)
        this.x = this.x + dt * this.speed * Math.sin(this.direction)
        this.y = this.y - dt * this.speed * Math.cos(this.direction)

        this.xForProminade = this.x
        this.yForProminade = this.y

        if(this.canAttack) {
            let animationTime = 60
            if (this.toAttack && this.count === 0) {
                this.count = 1
            }
            if (this.count >= animationTime / 2) {
                this.hitAnimation += Math.PI * 1.5 / animationTime
                this.giveDamage = false
            }
            else if (this.count >= 1) {
                this.hitAnimation -= Math.PI * 1.5 / animationTime
                this.giveDamage = true
                let a = dt * 400 * Math.sin(this.direction + Constants.PI_25 + this.hitAnimation)
                let b = dt * 400 * Math.cos(this.direction + Constants.PI_25 + this.hitAnimation)
                this.weaponX = this.x + a * 9
                this.weaponY = this.y - b * 9
            }
            if (this.count !== 0) {
                this.count++
            }
            // console.log(this.direction)
            if (this.count >= animationTime) {
                this.count = 0
                this.hitAnimation = 0
            }
        }

    }

    promenade(dt) {
        if(this.timeTravel <= 0) {
            this.timeTravel = 180 + Math.random() * Constants.MAP_FPS * 20
            this.directionPoint = - 3.1415 + Math.random() * 6.2830
            this.dirPiece = this.direction > this.directionPoint ?
                (this.directionPoint - this.direction) / Constants.MAP_FPS :
                (this.direction - this.directionPoint) / Constants.MAP_FPS
            this.timeRorate = Constants.MAP_FPS
            this.timeStay = 180 + Math.random() * Constants.MAP_FPS * 20
        }

         if(this.timeStay > 0) {
            this.timeStay--
        } else if(this.timeRorate > 0) {
            this.direction += this.dirPiece / 5
            this.timeRorate--
        } else {
            let tempX = this.x
            let tempY = this.y
            this.timeTravel--
            this.x = this.x + dt * this.speed * Math.sin(this.direction) / 5
            this.y = this.y - dt * this.speed * Math.cos(this.direction) / 5

            if(this.x > this.xForProminade + 200 || this.x < this.xForProminade - 200 ||
                this.y > this.yForProminade + 200 || this.y < this.yForProminade - 200) {
                this.x = tempX
                this.y = tempY
                this.direction += 1.57
            }
            // Не дает зайти за барьер
            if(this.x > Constants.MAP_SIZE || this.y > Constants.MAP_SIZE
                || this.x < 0 || this.y < 0)
                this.direction += 1.57
            this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x))
            this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y))
        }
    }

    weaponsHit(object) {
        const dx = this.weaponX - object.x
        const dy = this.weaponY - object.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    setKick(sec) {
        this.functionStack.push({
            func: this.hitKick.bind(this),
            sec: sec,
            rec: this.afterKick.bind(this),
            recData: this.pureSpeed
        })
    }

    setStun(sec) {
        this.effects.stunned.time = sec
        this.functionStack.push({
            func: this.stun.bind(this),
            sec: sec,
            rec: this.afterStun.bind(this),
            recData: this.pureSpeed
        })
    }

    setSlow(sec) {
        this.effects.slowed.time = sec
        this.functionStack.push({
            func: this.slow.bind(this),
            sec: sec,
            rec: this.afterSlow.bind(this),
            recData: this.pureSpeed
        })
    }

    hitKick(dt) {
        this.speed = this.pureSpeed * 0.8
        this.x += this.needKick.power * Math.sin(this.needKick.dir) * dt
        this.y -= this.needKick.power * Math.cos(this.needKick.dir) * dt
        this.needKick.need = false
    }

    afterKick(speed) {
        this.speed = speed
    }

    stun(dt, sec) {
        this.speed = 0
        this.needStun = false
        this.canSpell = false
        this.canAttack = false
        this.giveDamage = false
        this.effects.stunned.yes = true
        this.effects.stunned.time = sec
    }

    afterStun(speed) {
        this.speed = speed
        this.canSpell = true
        this.canAttack = true
        this.effects.stunned.yes = false
        this.effects.stunned.time = 0
    }

    slow(dt, sec) {
        this.speed = this.pureSpeed * 0.8
        this.effects.slowed.yes = true
        this.effects.slowed.time = sec
    }

    afterSlow(speed) {
        this.speed = speed
        this.effects.slowed.yes = false
        this.effects.slowed.time = 0
    }

    // hitKick(dt) {
    //     this.x += this.needKick.power * Math.sin(this.needKick.dir) / 10
    //     this.y -= this.needKick.power * Math.cos(this.needKick.dir) / 10
    //     this.needKick.need = false
    // }

    chosenTarget(players, biggerDis, smallerDis) {
        let moreAggressive = {}
        // Отсеиваем игроков которые в радиусе
        players = players.filter(
            p => (this.distanceTo(p) <= biggerDis) && !p.effects.invis.yes
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
            level: this.level,
            effects: this.effects,
            weaponX: this.weaponX,
            weaponY: this.weaponY,
        }
    }
}

module.exports = Enemy
