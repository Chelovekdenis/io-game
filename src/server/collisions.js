const Constants = require('../shared/constants')

// Returns an array of bullets to be destroyed.
exports.applyCollisions = (objects, bullets) => {
    const destroyedBullets = []
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i]
        for (let j = 0; j < objects.length; j++) {
            const object = objects[j]
            if (
                bullet.parentID !== object.id &&
                object.distanceTo(bullet) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
            ) {
                destroyedBullets.push(bullet)
                object.takeDamage(bullet.attack, bullet.parentID)
                break
            }
        }
    }
    return destroyedBullets
}

circleToCircle = (objects1, objects2, r1, r2) => {
    for (let i = 0; i < objects1.length; i++) {
        for (let j = 0; j < objects2.length; j++) {
            const object1 = objects1[i]
            const object2 = objects2[j]
            if (object1.distanceTo(object2) <= r1 + r2)
                return true
        }
    }
    return false
}

exports.circleToCircleLite = (object1, objects2, r1, r2, i) => {
    for (let j = 0 + i; j < objects2.length; j++) {
        if (object1.distanceTo(objects2[j]) <= r1 + r2)
            return true
    }
    return false
}

exports.hitPlayer = (object1, objects2, r) => {
    for (let j = 0; j < objects2.length; j++) {
        if (object1.weaponsHit(objects2[j]) <= r)
            return objects2[j]
    }
    return false
}

exports.spawn = (arr, r1, r2) => {
    while (true) {
        let x = Constants.MAP_SIZE * (0.1 + Math.random() * 0.8)
        let y = Constants.MAP_SIZE * (0.1 + Math.random() * 0.8)
        if (
            !circleToCircle(arr, [{x: x, y: y}], r1, r2)
        ) {
            return {x: x, y: y}
        }
    }
}

exports.circleToCircle = circleToCircle
