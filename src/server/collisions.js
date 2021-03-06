const Constants = require('../shared/constants')

// Returns an array of bullets to be destroyed.
exports.applyCollisions = (objects, bullets, r) => {
    const destroyedBullets = []
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i]
        for (let j = 0; j < objects.length; j++) {
            const object = objects[j]
            if (
                bullet.parentID !== object.id &&
                object.distanceTo(bullet) <= r + Constants.BULLET_RADIUS
            ) {
                destroyedBullets.push(bullet)
                let damageForObject = bullet.attack
                if(bullet.ifCrossbow && object.defense !== 0)
                    damageForObject /= object.defense
                if(bullet.modificator.stun)
                    object.setStun(3)
                object.takeDamage(damageForObject, bullet.parentID)
                object.needKick.need = true
                object.needKick.dir = bullet.direction
                object.needKick.power = 75
                if(bullet.modificator.slow)
                    object.setSlow(5)
                break
            }
        }
    }
    return destroyedBullets
}

exports.circleToCircleRetObjSame = (objects, r) => {
    const revertedObjects = []
    for (let i = 0; i < objects.length; i++) {
        const object1 = objects[i]
        for (let j = 0; j < objects.length; j++) {
            const object2 = objects[j]
            if (object1.id !== object2.id && object1.distanceTo(object2) <= r*2)
                revertedObjects.push(object1)
        }
    }
    return revertedObjects
}

exports.circleToCircleRetObj = (objects1, objects2, r1, r2) => {
    const revertedObjects = []
    for (let i = 0; i < objects1.length; i++) {
        const object1 = objects1[i]
        for (let j = 0; j < objects2.length; j++) {
            const object2 = objects2[j]
            if (object1.distanceTo(object2) <= r1 + r2)
                revertedObjects.push(object1)
        }
    }
    return revertedObjects
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

exports.circleToCircleLite = (object1, objects2, r1, r2) => {
    for (let j = 0; j < objects2.length; j++) {
        if (object1.distanceTo(objects2[j]) <= r1 + r2)
            return true
    }
    return false
}

exports.circleToCircleLiteNew = (object1, objects2) => {
    for (let j = 0; j < objects2.length; j++) {
        // console.log(object1.id, object1.radius, " <---> ", objects2[j].id, objects2[j].radius, " == ", object1.distanceTo(objects2[j]))
        if (object1.distanceTo(objects2[j]) <= object1.radius + objects2[j].radius)
            return true
    }
    return false
}

exports.circleToCircleWithReturn = (object1, objects2) => {
    for (let j = 0; j < objects2.length; j++) {
        if (object1.distanceTo(objects2[j]) <= object1.radius + objects2[j].radius)
            return objects2[j]
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


exports.spawn = (arr, r1, r2, x, y, x2, y2) => {
    // xy это левый верхний угол первого сектора, x2y2 второго

    let tempX = x/Constants.MAP_SIZE
    let tempY = y/Constants.MAP_SIZE
    while (true) {
        let x3 = Constants.MAP_SIZE * (tempX + Math.random() * (1 - tempX * 2))
        let y3 = Constants.MAP_SIZE * (tempY + Math.random() * (1 - tempY * 2))
        if (
            !circleToCircle(arr, [{x: x3, y: y3}], r1, r2) &&
            !(x3 >= x2 && x3 <= Constants.MAP_SIZE - x2 &&
                y3 >= y2 && y3 <= Constants.MAP_SIZE - y2)
        ) return {x: x3, y: y3}
    }
}




exports.circleToCircle = circleToCircle
