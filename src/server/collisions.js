const Constants = require('../shared/constants')

// Returns an array of bullets to be destroyed.
function applyCollisions(players, bullets) {
  const destroyedBullets = []
  for (let i = 0; i < bullets.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < players.length; j++) {
      const bullet = bullets[i]
      const player = players[j]
      if (
        bullet.parentID !== player.id &&
        player.distanceTo(bullet) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet)
        player.takeBulletDamage(Constants.BULLET_DAMAGE * bullet.attack)
        break
      }
    }
  }
  return destroyedBullets
}

function applyCollisionsGameObjects(objects, bullets) {
  const destroyedBullets = []
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < objects.length; j++) {
      const bullet = bullets[i]
      const object = objects[j]
      if (
          object.distanceTo(bullet) <= Constants.TREE_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet)
        break
      }
    }
  }
  return destroyedBullets
}

module.exports = applyCollisions
// module.exports.ad = applyCollisionsGameObjects
