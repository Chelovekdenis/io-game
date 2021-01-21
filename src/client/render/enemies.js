import {getAsset} from "../assets"
const Constants = require('../../shared/constants')
const canvas = document.getElementById('game-canvas')
const context = canvas.getContext('2d')

export function renderEnemies(me, enemy) {
    const { x, y, direction, hitAnimation } = enemy
    const canvasX = canvas.width / 2 + x - me.x
    const canvasY = canvas.height / 2 + y - me.y
    // Draw player
    context.save()
    context.translate(canvasX, canvasY)

    // Animation hit
    context.rotate(direction + hitAnimation)

    let lvl = enemy.level

    if(lvl > 9)
        lvl = 5
    else if (lvl > 6)
        lvl = 4
    else if (lvl > 4)
        lvl = 3
    else if (lvl > 2)
        lvl = 2
    else
        lvl = 1



    context.drawImage(
        getAsset(`enemy_bandit${lvl}.svg`),
        -Constants.PLAYER_RADIUS * 4,
        -Constants.PLAYER_RADIUS * 4,
        Constants.PLAYER_RADIUS * 8,
        Constants.PLAYER_RADIUS * 8,
    )
    context.restore()
    // Draw level
    let lvlString = "lvl"
    context.font = "12px Verdana"
    context.fillStyle = 'white'
    context.textBaseline = "middle"
    context.textAlign = 'center'
    context.fillText(`${enemy.level} ${lvlString}`, canvasX, canvasY - Constants.ENEMY_RADIUS - 18)
    context.restore()

    context.fillStyle = 'white'
    context.fillRect(
        canvasX - Constants.PLAYER_RADIUS,
        canvasY + Constants.PLAYER_RADIUS + 8,
        Constants.PLAYER_RADIUS * 2,
        2,
    )
    context.fillStyle = 'red'
    context.fillRect(
        canvasX - Constants.PLAYER_RADIUS + Constants.PLAYER_RADIUS * 2 * enemy.hp / enemy.maxHp,
        canvasY + Constants.PLAYER_RADIUS + 8,
        Constants.PLAYER_RADIUS * 2 * (1 - enemy.hp / enemy.maxHp),
        2,
    )
}
