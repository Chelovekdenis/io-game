const ObjectClass = require('./object')
const Constants = require('../shared/constants')

class Tree extends ObjectClass {
    constructor(id, x, y) {
        super(id, x, y, 0)
        this.hp = Constants.PLAYER_MAX_HP
    }

    update(dt) {

    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate())
        }
    }
}

module.exports = Tree
