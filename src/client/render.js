import {debounce} from 'throttle-debounce'
import {getAsset} from './assets'
import {getCurrentState} from './state'
import {myDir} from './input'

const Constants = require('../shared/constants')

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE, MAP_FPS } = Constants

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas')
const context = canvas.getContext('2d')
setCanvasDimensions()


function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth)
  canvas.width = scaleRatio * window.innerWidth
  canvas.height = scaleRatio * window.innerHeight
}

window.addEventListener('resize', debounce(40, setCanvasDimensions))


function render() {
  const { me, others, bullets, leaderboard } = getCurrentState()
  if (!me) {
    return
  }
  // Draw background
  renderBackground(me.x, me.y)
  // Draw boundaries
  context.strokeStyle = 'black'
  context.lineWidth = 1
  context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE)
  // Draw all bullets
  bullets.forEach(renderBullet.bind(null, me))
  let me2 = me
  me2.direction = myDir()
  // Draw all players
  renderPlayer(me2, me)
  others.forEach(renderPlayer.bind(null, me))
  // Draw HUD
  renderHUD(me, leaderboard)
}


function renderBackground(x, y) {
  const HALF_MAP_SIZE = MAP_SIZE / 2

  const backgroundX = HALF_MAP_SIZE - x + canvas.width / 2
  const backgroundY = HALF_MAP_SIZE - y + canvas.height / 2

  context.fillStyle = "darkgreen"
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.drawImage(
      getAsset('background2.png'),
      backgroundX-HALF_MAP_SIZE,
      backgroundY-HALF_MAP_SIZE,
      HALF_MAP_SIZE,
      HALF_MAP_SIZE,
  )
  context.drawImage(
      getAsset('background.png'),
      backgroundX,
      backgroundY,
      HALF_MAP_SIZE,
      HALF_MAP_SIZE,
  )
  context.drawImage(
      getAsset('background.png'),
      backgroundX-HALF_MAP_SIZE,
      backgroundY,
      HALF_MAP_SIZE,
      HALF_MAP_SIZE,
  )
  context.drawImage(
      getAsset('background2.png'),
      backgroundX,
      backgroundY-HALF_MAP_SIZE,
      HALF_MAP_SIZE,
      HALF_MAP_SIZE,
  )
}


// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  const { x, y, direction, item } = player
  const canvasX = canvas.width / 2 + x - me.x
  const canvasY = canvas.height / 2 + y - me.y
  // Draw player
  context.save()
  context.translate(canvasX, canvasY)
  context.rotate(direction)
  context.drawImage(
    getAsset(`player${Math.round(item)}.svg`),
    -PLAYER_RADIUS * 4,
    -PLAYER_RADIUS * 4,
    PLAYER_RADIUS * 8,
    PLAYER_RADIUS * 8,
  )
  context.restore()
  // Draw name
  // Из за интерполяции в конец имени добовляется NaN, можно реализовать через одельный метод
  // в обход интерпляции и чтобы методо сюда присылал имя, но это излишне и костыль снизу все
  // испровляет player.username.length - 3
  context.fillStyle = 'white'
  context.textBaseline = "middle"
  context.textAlign = 'center'
  context.fillText(player.username.slice(0, player.username.length - 3), canvasX, canvasY - PLAYER_RADIUS - 12)
  // Draw health bar
  context.fillStyle = 'white'
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2,
    2,
  )
  context.fillStyle = 'red'
  context.fillRect(
    canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp / PLAYER_MAX_HP,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 * (1 - player.hp / PLAYER_MAX_HP),
    2,
  )
}


function renderBullet(me, bullet) {
  const { x, y } = bullet
  context.drawImage(
    getAsset('bullet.svg'),
    canvas.width / 2 + x - me.x - BULLET_RADIUS,
    canvas.height / 2 + y - me.y - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  )
}


function renderHUD(me, leaderboard) {
  // Quick bar
  let items = ['hand.png', 'axe.png', 'gun.png', 'hand.png']

  for(let i = -2; i < 2; i++) {
    context.fillStyle = "rgba(132,132,132,0.7)"
    context.fillRect( canvas.width/2 + 80 * i, canvas.height - 80, 40, 40)
    context.drawImage(
        getAsset(items[i+2]),
        canvas.width/2 + 80 * i, canvas.height - 80, 40, 40
    )
    context.fillStyle = 'black'
    context.textBaseline = "middle"
    context.textAlign = 'center'
    context.font = "16px Verdana"
    context.fillText(`${i+3}`,canvas.width/2 + 80 * i, canvas.height - 80)
  }
  // Mini map
  context.fillStyle = "rgba(132,132,132,0.7)"
  context.fillRect( 20, canvas.height - 220, 200, 200)

  let mmScale = MAP_SIZE / 200
  let mmPlayerX = me.x / mmScale
  let mmPlayerY = me.y / mmScale
  let mmPlayerSize = 5
  let mmPlayerSizeHalf = mmPlayerSize/2

  context.fillStyle = "yellow"

  context.fillRect( 20 + mmPlayerX - mmPlayerSizeHalf,
      canvas.height - 220 + mmPlayerY - mmPlayerSizeHalf,
      mmPlayerSize, mmPlayerSize)

  // Leaderboard
  context.fillStyle = "rgba(235,235,235,0.7)"
  context.fillRect( canvas.width-170, 10, 160, 200)

  context.fillStyle = 'black'
  context.textBaseline = "middle"
  context.textAlign = 'center'
  context.font = "16px Verdana"
  context.fillText("Name", canvas.width-130, 30)
  context.fillText("Score", canvas.width-50, 30)

  for(let i = 0; i < leaderboard.length; i++) {
    context.fillText(leaderboard[i].username, canvas.width-130, 60+i*30)
    context.fillText(leaderboard[i].score, canvas.width-50, 60+i*30)
  }
}


function renderMainMenu() {
  // из-за того что renderBackground(x, y) начинает
  // рендерить до загрузки картинок, получается ошибка
  const t = Date.now() / 7500
  const x = MAP_SIZE / 2 + 800 * Math.cos(t)
  const y = MAP_SIZE / 2 + 800 * Math.sin(t)
  renderBackground(x, y)
}


let renderInterval = setInterval(renderMainMenu, MAP_FPS)


// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval)
  renderInterval = setInterval(render, MAP_FPS)
}


// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval)
  renderInterval = setInterval(renderMainMenu, MAP_FPS)
}
