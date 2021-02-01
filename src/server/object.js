class Object {
  constructor(id, x, y, speed, radius) {
    this.id = id
    this.x = x
    this.y = y
    this.speed = speed
    this.radius = radius

    this.needKick = {
      need:false,
      dir: 0
    }
  }

  distanceTo(object) {
    const dx = this.x - object.x
    const dy = this.y - object.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  setDirection(dir) {
    this.direction = dir
  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    }
  }
}

module.exports = Object
