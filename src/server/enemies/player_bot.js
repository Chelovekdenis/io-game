const Enemy = require('./enemy')
const Constants = require('../../shared/constants')

class PlayerBot extends Enemy {
    constructor(id, x, y, speed, lvl, username) {
        super(id, x, y, Constants.PLAYER_SPEED, lvl)
        this.maxHp = 70 + 50 * lvl
        this.hp = this.maxHp
        this.radius = Constants.PLAYER_RADIUS
        this.damage = 0.4 + 0.05 * lvl
        // this.damage = 0.2
        this.className = Constants.CLASSES.MELEE.WARRIOR
        this.defense = 0.90

        this.weaponX = 0
        this.weaponY = 0
        this.weaponX2 = 0
        this.weaponY2 = 0

        this.username = username
        this.score = Constants.EXP_FOR_LEVEL_UP[lvl]
        this.leaderBuff = 1

        this.skills = {
            attack: Math.round(Math.random() * 3),
            defense: 0,
            maxHp: 0,
            regeneration: Math.round(Math.random() * 8),
            speed: 0,
            atkSpeed: 0,
            bltSpeed: 0,
        }

        this.attributes = {
            strength: 0,
            agility: 0,
            intelligence: 0
        }

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
            double: {
                yes: false,
                time: 0
            },
            immortal: {
                yes: false,
                time: 0
            },
        }
    }

    update(dt, x, y) {
        super.update(dt, x, y)

        this.score += dt * Constants.SCORE_PER_SECOND * (this.level + 1)

        if(this.maxHp > this.hp) {
            this.hp += dt * this.skills.regeneration
            if(this.maxHp < this.hp) {
                this.hp = this.maxHp
            }
        }

        let a = dt * 400 * Math.sin(this.direction + Constants.PI_25 + this.hitAnimation)
        let b = dt * 400 * Math.cos(this.direction + Constants.PI_25 + this.hitAnimation)
        this.weaponX = this.x + a * 12
        this.weaponY = this.y - b * 12
        a = dt * 400 * Math.sin(this.direction + Constants.PI_40 + this.hitAnimation)
        b = dt * 400 * Math.cos(this.direction + Constants.PI_40 + this.hitAnimation)
        this.weaponX2 = this.x + a * 7
        this.weaponY2 = this.y - b * 7
    }

    weaponsHit(object) {
        // const dx = (this.weaponX - object.x)/10
        // const dy = (this.weaponY - object.y)/10
        // return Math.sqrt(dx * dx + dy * dy)
        const dx = this.weaponX - object.x
        const dy = this.weaponY - object.y
        const dx2 = this.weaponX2 - object.x
        const dy2 = this.weaponY2 - object.y
        return Math.min(Math.sqrt(dx * dx + dy * dy), Math.sqrt(dx2 * dx2 + dy2 * dy2))
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            weaponX: this.weaponX,
            weaponY: this.weaponY,
            weaponX2: this.weaponX2,
            weaponY2: this.weaponY2,
            username: this.username,
            score: this.score,
            skills: this.skills,
            attributes: this.attributes,
            className: this.className,
        }
    }
}

module.exports = PlayerBot
