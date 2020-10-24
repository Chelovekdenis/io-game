class Object {
  constructor(id, x, y, speed) {
    this.id = id
    this.x = x
    this.y = y
    this.speed = speed
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
