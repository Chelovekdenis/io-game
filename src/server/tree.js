const ObjectClass = require('./object')
const Constants = require('../shared/constants')

class Tree extends ObjectClass {
    constructor(id, x, y, className) {
        super(id, x, y, 0, Constants.TREE_RADIUS)
        this.damage = 0
        this.hp = 100
        this.lastHit = 0
        this.defense = 0
        this.className = className
    }

    hitKick(dir) {

    }

    setSlow(sec) {

    }

    setStun(sec) {

    }

    takeDamage(damage, id) {
        this.hp -= damage * this.defense
        this.lastHit = id
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            className: this.className
        }
    }
}

module.exports = Tree
