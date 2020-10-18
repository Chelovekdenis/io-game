import { updateDirection, moveEmit, mouseClickEmit, quickBarItemEmit } from './networking'

let movement = {
  up: false,
  down: false,
  left: false,
  right: false
}

let quickBarItem = 1

function onMouseInput(e) {
  handleInput(e.clientX, e.clientY)
}

function onTouchInput(e) {
  const touch = e.touches[0]
  handleInput(touch.clientX, touch.clientY)
}

function handleInput(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y)
  updateDirection(dir)
}

function handleInputKey() {
  moveEmit(movement)
}

function onMouseDown() {
  mouseClickEmit(true)
}

function onMouseUp() {
  mouseClickEmit(false)
}

function onKeyDown(e) {
  switch (e.keyCode) {
    case 65: // A
      movement.left = true
      break
    case 87: // W
      movement.up = true
      break
    case 68: // D
      movement.right = true
      break
    case 83: // S
      movement.down = true
      break
    case 49: // 1
      quickBarItemEmit(1)
      break
    case 50: // 2
      quickBarItemEmit(2)
      break
    case 51: // 3
      quickBarItemEmit(3)
      break
    case 52: // 4
      quickBarItemEmit(4)
      break
  }
  handleInputKey()
}

function onKeyUp(e) {
  switch (e.keyCode) {
    case 65: // A
      movement.left = false
      break
    case 87: // W
      movement.up = false
      break
    case 68: // D
      movement.right = false
      break
    case 83: // S
      movement.down = false
      break
  }
  handleInputKey()
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput)
  // window.addEventListener('click', onMouseClick)
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('touchstart', onTouchInput)
  window.addEventListener('touchmove', onTouchInput)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput)
  // window.removeEventListener('click', onMouseClick)
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  window.removeEventListener('touchstart', onTouchInput)
  window.removeEventListener('touchmove', onTouchInput)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
}

