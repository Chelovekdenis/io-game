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
                if(bullet.ifCrossbow)
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

let balanser = 0
exports.spawn = (arr, r1, r2, a, b, min, max) => {
    let temp1 = min
    let temp2 = max
    let temp3 = 0.05
    let temp4 = 0.9
    if(balanser === 0) {
        temp1 = min
        temp2 = a - temp1
        temp3 = min
        temp4 = max
        balanser = 1
        // Y all
    }
    else if (balanser === 1) {
        temp1 = b
        temp2 = max - b
        temp3 = min
        temp4 = max
        balanser = 2
        //y all
    }
    else if (balanser === 2) {
        temp1 = min
        temp2 = max
        temp3 = min
        temp4 = a - temp3
        balanser = 3
        //X all
    }
    else {
        temp1 = min
        temp2 = max
        temp3 = b
        temp4 = max - b
        balanser = 0
        //X all
    }
    while (true) {
        let x = Constants.MAP_SIZE * (temp1 + Math.random() * temp2)
        let y = Constants.MAP_SIZE * (temp3 + Math.random() * temp4)
        if (
            !circleToCircle(arr, [{x: x, y: y}], r1, r2)
        ) {
            return {x: x, y: y}
        }
    }
}

exports.circleToCircle = circleToCircle
