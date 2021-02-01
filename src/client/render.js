import { debounce } from 'throttle-debounce'
import { getCurrentState, setNewSkillPoint, getNewSkillPoint, getNewClassPoint, setNewClassPoint } from './state'
import { myDir, myMovement } from './input'
import { renderBackground } from './render/background'
import { renderPlayer } from './render/player'
import { renderBullet } from './render/bullet'
import { renderObjects } from './render/objects'
import { renderEnemies } from './render/enemies'
import { renderEnemiesWarrior } from './render/enemies_warrior'
import { renderBoss } from './render/boss'
import { renderHUD } from './render/hud'

const Constants = require('../shared/constants')

const { MAP_SIZE, MAP_FPS } = Constants

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas')
const context = canvas.getContext('2d')
setCanvasDimensions()
const initialCanvasWidth = canvas.width
const initialCanvasHeight = canvas.height
let currentWScale = 1
let currentHScale = 1


function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth)
  canvas.width = scaleRatio * window.innerWidth
  canvas.height = scaleRatio * window.innerHeight
}

window.addEventListener('resize', debounce(40, setCanvasDimensions))


function render() {
  const { me, others, bullets, leaderboard, trees, enemies, enemies_warrior, boss } = getCurrentState()
  if (!me) {
    return
  }

  let wScale = canvas.width / initialCanvasWidth
  let hScale = canvas.height / initialCanvasHeight

  if (wScale !== currentWScale || hScale !== currentHScale) {
    currentWScale = canvas.width / initialCanvasWidth
    currentHScale = canvas.height / initialCanvasHeight
    // console.log(currentWScale, currentHScale)
    context.scale(currentWScale, currentHScale)
  }

  let me2 = me
  me2.direction = myDir()
  me2.move = myMovement()
  me2.speed2 = 2
  let upDown = me2.move.left || me2.move.right ? me2.speed2 * 0.7 : me2.speed2

  if (me2.move.up) {
    me.y = ((me2.y - upDown) + me.y)/2
  }

  if (me2.move.down) {
    me.y = ((me2.y + upDown) + me.y)/2
  }

  let leftRight = me2.move.up || me2.move.down ? me2.speed2 * 0.7 : me2.speed2

  if (me2.move.left) {
    me.x = ((me2.x - leftRight) + me.x)/2
  }

  if (me2.move.right) {
    me.x = ((me2.x + leftRight) + me.x)/2
  }

  let leader = null
  if(me.id === leaderboard[0].id) {
    me.leader = true
  } else {
  Object.keys(others).forEach(id => {
    if (others[id].id === leaderboard[0].id) {
      others[id].leader = true
      leader = others[id]
    }
  })
}

  // Draw background
  renderBackground(context, canvas, me.x, me.y)
  // Draw boundaries
  context.strokeStyle = 'black'
  context.lineWidth = 1
  context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE)
  // Draw all bullets
  bullets.forEach(renderBullet.bind(null, me))
  // Draw Enemies
  enemies.forEach(renderEnemies.bind(null, me))
  // Draw EnemiesWarrior
  enemies_warrior.forEach(renderEnemiesWarrior.bind(null, me))
  // Draw all players
  others.forEach(renderPlayer.bind(null, me))
  renderPlayer(me2, me)
  // Draw mapObjects
  renderObjects(me, trees)
  // Draw BOSS
  if(boss.length !== 0)
    boss.forEach(renderBoss.bind(null, me))
  // Draw HUD
  renderHUD(me, boss, leader, leaderboard, currentWScale, currentHScale, getNewSkillPoint(), getNewClassPoint())
}


// TODO убрать костыль
let bb = 0
function renderMainMenu() {
  // из-за того что renderBackground(x, y) начинает
  // рендерить до загрузки картинок, получается ошибка
  bb++
  if (bb > 45) {
    const t = Date.now() / 7500
    const x = MAP_SIZE / 2 + 800 * Math.cos(t)
    const y = MAP_SIZE / 2 + 800 * Math.sin(t)
    renderBackground(context, canvas, x, y)
  }
}


let renderInterval = setInterval(renderMainMenu, 1000/60)


// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval)
  renderInterval = setInterval(render, 1000/60)
}


// Replaces game rendering with main menu rendering.
export function stopRendering() {
  setNewSkillPoint(0)
  setNewClassPoint(0)
  clearInterval(renderInterval)
  renderInterval = setInterval(renderMainMenu, 1000/60)
}
