const ObjectClass = require('./object')

class Tree extends ObjectClass {
    constructor(id, x, y) {
        super(id, x, y, 0)
        this.damage = 0
        this.hp = 100
        this.lastHit = 0
        this.defense = 0
    }

    takeDamage(damage, id) {
        this.hp -= damage * this.defense
        this.lastHit = id
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate())
        }
    }
}

module.exports = Tree
