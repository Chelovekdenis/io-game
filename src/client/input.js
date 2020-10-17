import { updateDirection, moveEmit, mouseClickEmit } from './networking'

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

let movement = {
  up: false,
  down: false,
  left: false,
  right: false
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

