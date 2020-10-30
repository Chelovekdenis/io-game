import { debounce } from 'throttle-debounce'
import { getAsset } from './assets'
import {getCurrentState, setNewSkillPoint, getNewSkillPoint, getNewClassPoint, setNewClassPoint} from './state'
import {myDir, onChooseClass, onChooseSkill} from './input'

const Constants = require('../shared/constants')

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE, MAP_FPS } = Constants

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
  const { me, others, bullets, leaderboard, trees, enemies } = getCurrentState()
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

  // Draw background
  renderBackground(me.x, me.y)
  // Draw boundaries
  context.strokeStyle = 'black'
  context.lineWidth = 1
  context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE)

  // Draw all bullets
  bullets.forEach(renderBullet.bind(null, me))
  // Draw Enemies
  enemies.forEach(renderEnemies.bind(null, me))
  // Draw all players
  let me2 = me
  me2.direction = myDir()
  others.forEach(renderPlayer.bind(null, me))
  renderPlayer(me2, me)
  // Draw mapObjects
  renderObjects(me, trees)

  // Draw HUD
  renderHUD(me, leaderboard, currentWScale, currentHScale, getNewSkillPoint(), getNewClassPoint())
}


function renderBackground(x, y) {
  const HALF_MAP_SIZE = MAP_SIZE / 2

  const backgroundX = HALF_MAP_SIZE - x + canvas.width / 2
  const backgroundY = HALF_MAP_SIZE - y + canvas.height / 2

  context.fillStyle = "gray"
  context.fillRect(0, 0, canvas.width, canvas.height)

  for(let i = 0; i < 4; i++) {
    let y = -Constants.MAP_SIZE + 1000*i
    for(let j = 0; j < 4; j++) {
      let x = -Constants.MAP_SIZE + 1000*j
      if(y === -2000 || x === -2000 || y === 1000 || x === 1000) {
        context.drawImage(
            getAsset('back_swamp.svg'),
            backgroundX - x - 1000,
            backgroundY - y - 1000,
            1000,
            1000,
        )
      } else {
        context.drawImage(
            getAsset('back.svg'),
            backgroundX - x - 1000,
            backgroundY - y - 1000,
            1000,
            1000,
        )
      }
    }
  }
  // for(let i = 0; i < 12; i++) {
  //   context.drawImage(
  //       getAsset('back_swamp.svg'),
  //       backgroundX,
  //       backgroundY,
  //       1000,
  //       1000,
  //   )
  // }
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  const { x, y, direction, className, hitAnimation } = player
  const canvasX = canvas.width / 2 + x - me.x
  const canvasY = canvas.height / 2 + y - me.y
  // Draw player
  context.save()
  context.translate(canvasX, canvasY)

  // Animation hit
  context.rotate(direction + hitAnimation)

  context.drawImage(
    getAsset(`${className}.svg`),
    -PLAYER_RADIUS * 5,
    -PLAYER_RADIUS * 5,
    PLAYER_RADIUS * 10,
    PLAYER_RADIUS * 10,
  )
  context.restore()
  // context.fillStyle = "red"
  // // console.log(canvas.width / 2 + x - me.weaponX - PLAYER_RADIUS, canvas.height / 2 + y - me.weaponY - PLAYER_RADIUS)
  //
  // context.fillRect(
  //     canvas.width / 2 + player.weaponX - me.x - 5,
  //     canvas.height / 2 + player.weaponY - me.y - 5,
  //     10,
  //     10,
  // )

  // Draw name
  context.fillStyle = 'white'
  context.textBaseline = "middle"
  context.textAlign = 'center'
  context.fillText(player.username, canvasX, canvasY - PLAYER_RADIUS - 12)
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
    canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp / player.maxHp,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 * (1 - player.hp / player.maxHp),
    2,
  )
}


function renderBullet(me, bullet) {
  const { x, y } = bullet
  const canvasX = canvas.width / 2 + x - me.x
  const canvasY = canvas.height / 2 + y - me.y
  // Draw player
  context.save()
  context.translate(canvasX, canvasY)

  // Animation hit
  context.rotate(bullet.direction)


  context.drawImage(
    getAsset('bullet.svg'),
      - BULLET_RADIUS*10,
     - BULLET_RADIUS*10,
    BULLET_RADIUS * 20,
    BULLET_RADIUS * 20,
  )
  context.restore()
}


function renderObjects(me, trees) {
  const backgroundX =  canvas.width / 2 - me.x
  const backgroundY =  canvas.height / 2 - me.y
  Object.keys(trees).forEach(treeId => {
    const tree = trees[treeId]
    // context.beginPath()
    // context.arc(backgroundX + tree.x, backgroundY + tree.y, 50, 0, 2*Math.PI, false)
    // context.closePath()
    // context.stroke()
    context.drawImage(
        getAsset('tree.svg'),
        backgroundX + tree.x - 300, backgroundY + tree.y - 300, 600, 600
    )
  })
}

function renderEnemies(me, enemy) {
  const { x, y, direction, hitAnimation } = enemy
  const canvasX = canvas.width / 2 + x - me.x
  const canvasY = canvas.height / 2 + y - me.y
  // Draw player
  context.save()
  context.translate(canvasX, canvasY)

  // Animation hit
  context.rotate(direction + hitAnimation)


  context.drawImage(
      getAsset(`enemy.svg`),
      -PLAYER_RADIUS * 4,
      -PLAYER_RADIUS * 4,
      PLAYER_RADIUS * 8,
      PLAYER_RADIUS * 8,
  )
  context.restore()

  context.fillStyle = 'white'
  context.fillRect(
      canvasX - PLAYER_RADIUS,
      canvasY + PLAYER_RADIUS + 8,
      PLAYER_RADIUS * 2,
      2,
  )
  context.fillStyle = 'red'
  context.fillRect(
      canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * enemy.hp / enemy.maxHp,
      canvasY + PLAYER_RADIUS + 8,
      PLAYER_RADIUS * 2 * (1 - enemy.hp / enemy.maxHp),
      2,
  )
}


function renderHUD(me, leaderboard, currentWScale, currentHScale, newSkillPoint, newClassPoint) {
  // Quick bar
  // let items = ['hand.png', 'axe.png', 'gun.png', 'hand.png']
  // for(let i = 0; i < 4; i++) {
  //   context.fillStyle = "rgba(132,132,132,0.7)"
  //   context.fillRect(canvas.width/2 - 4 * 40 + 20 + 80 * i, canvas.height - 80, 40, 40)
  //   context.drawImage(
  //       getAsset(items[i]),
  //       canvas.width/2 - 4 * 40 + 20 + 80 * i, canvas.height - 80, 40, 40
  //   )
  //   context.fillStyle = 'black'
  //   context.textBaseline = "middle"
  //   context.textAlign = 'center'
  //   context.font = "16px Verdana"
  //   context.fillText(`${i+1}`,canvas.width/2 - 4 * 40 + 20 + 80 * i, canvas.height - 80)
  // }
  // Mini map
  context.fillStyle = "rgba(132,132,132,0.7)"
  context.fillRect( 20 * currentWScale, (canvas.height - 220) * currentHScale, 200 , 200)

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

  // Experience bar
  let expBarH = canvas.height - 150
  let expBarW = canvas.width / 3
  context.fillStyle = "rgba(132,132,132,0.7)"
  context.fillRect( expBarW, expBarH, expBarW, 30)
  context.fillStyle = "rgba(235,235,235,0.7)"
  context.fillRect( expBarW + 10, expBarH + 5, expBarW - 20, 20)
  context.fillStyle = "rgba(255,206,88,1)"
  context.fillRect( expBarW + 10, expBarH + 5, (expBarW - 20)/
      ((Constants.EXP_FOR_LEVEL_UP[me.level+1] - Constants.EXP_FOR_LEVEL_UP[me.level])/
          (me.score - Constants.EXP_FOR_LEVEL_UP[me.level])), 20)

  context.fillStyle = 'black'
  context.textBaseline = "middle"
  context.textAlign = 'center'
  context.font = "16px Verdana"
  context.fillText(`level: ${me.level}`, canvas.width/2, expBarH + 16)

  // Distribution of skill points
  if (newSkillPoint > 0) {
    let thisHeight = canvas.height/2 * currentHScale - 100

    context.fillStyle = "rgba(132,132,132,0.7)"
    context.fillRect( 20, thisHeight, 200 , 200)

    context.fillStyle = 'black'
    context.textBaseline = "bottom"
    context.textAlign = 'center'
    context.font = "16px Verdana"
    context.fillText(`Choose skill`, 120, thisHeight + 24)

    context.textAlign = 'start'

    let skillCoordinates = []
    let attributes = ['attack', 'defense', 'regeneration', 'maxHp']
    for (let i = 0; i < 4; i++) {
      skillCoordinates.push({skill: attributes[i], x: 160, y: thisHeight + 40 * (i+1), w: 20, h: 20})
      context.fillStyle = "rgba(235,235,235,0.7)"
      context.fillRect( 160, thisHeight + 40 * (i+1), 20 , 20)
      context.fillStyle = 'black'
      context.fillText(`+`, 160 + 4, thisHeight + 40 * (i+1) + 18)
    }

    context.fillText(`Attack`, skillCoordinates[0].x - 120, skillCoordinates[0].y + skillCoordinates[0].h)
    context.fillText(`Defense`, skillCoordinates[1].x - 120, skillCoordinates[1].y + skillCoordinates[1].h)
    context.fillText(`Regeneration`, skillCoordinates[2].x - 120, skillCoordinates[2].y + skillCoordinates[2].h)
    context.fillText(`Max HP`, skillCoordinates[3].x - 120, skillCoordinates[3].y + skillCoordinates[3].h)
    onChooseSkill(skillCoordinates)
  }

  if (newClassPoint > 0) {
    let thisHeight = canvas.height/4 * currentHScale - 100

    context.fillStyle = "rgba(132,132,132,0.7)"
    context.fillRect( 20, thisHeight, 270 , 200)

    context.fillStyle = 'black'
    context.textBaseline = "bottom"
    context.textAlign = 'center'
    context.font = "16px Verdana"
    context.fillText(`Choose class`, 155, thisHeight + 24)

    context.textAlign = 'start'

    let skillCoordinates = []
    let attributes = ['warrior', 'archer']
    for (let i = 0; i < 2; i++) {
      skillCoordinates.push({c: attributes[i], x: 240, y: thisHeight + 70 * (i+1), w: 20, h: 20})
      context.save()
      context.drawImage(
          getAsset(`${attributes[i]}.svg`),
          -PLAYER_RADIUS * 4 + 150,
          -PLAYER_RADIUS * 4 + thisHeight + 80 * (i+1),
          PLAYER_RADIUS * 8,
          PLAYER_RADIUS * 8,
      )
      context.restore()
      context.fillStyle = "rgba(235,235,235,0.7)"
      context.fillRect( 240, thisHeight + 70 * (i+1), 20 , 20)
      context.fillStyle = 'black'
      context.fillText(`+`, 240 + 4, thisHeight + 70 * (i+1) + 18)
    }

    context.fillText(`Warrior`, skillCoordinates[0].x - 200, skillCoordinates[0].y + skillCoordinates[0].h)
    context.fillText(`Archer`, skillCoordinates[1].x - 200, skillCoordinates[1].y + skillCoordinates[1].h)
    onChooseClass(skillCoordinates)
  }
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
    renderBackground(x, y)
  }
}


let renderInterval = setInterval(renderMainMenu, MAP_FPS)


// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval)
  renderInterval = setInterval(render, MAP_FPS)
}


// Replaces game rendering with main menu rendering.
export function stopRendering() {
  setNewSkillPoint(0)
  setNewClassPoint(0)
  clearInterval(renderInterval)
  renderInterval = setInterval(renderMainMenu, MAP_FPS)
}
