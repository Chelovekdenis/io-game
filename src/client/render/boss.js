import {getAsset} from "../assets"
const Constants = require('../../shared/constants')
const canvas = document.getElementById('game-canvas')
const context = canvas.getContext('2d')

export function renderBoss(me, boss) {
    const { x, y, direction, hitAnimation } = boss
    const canvasX = canvas.width / 2 + x - me.x
    const canvasY = canvas.height / 2 + y - me.y
    // Draw player
    context.save()
    context.translate(canvasX, canvasY)

    // Animation hit
    context.rotate(direction + hitAnimation)


    context.drawImage(
        getAsset(`boss.svg`),
        -Constants.PLAYER_RADIUS * 16,
        -Constants.PLAYER_RADIUS * 16,
        Constants.PLAYER_RADIUS * 32,
        Constants.PLAYER_RADIUS * 32,
    )
    context.restore()

    // context.fillRect(
    //     canvas.width / 2 + boss.weaponX - me.x - 5,
    //     canvas.height / 2 + boss.weaponY - me.y - 5,
    //     10,
    //     10,
    // )
    // context.fillRect(
    //     canvas.width / 2 + boss.weaponX2 - me.x - 5,
    //     canvas.height / 2 + boss.weaponY2 - me.y - 5,
    //     10,
    //     10,
    // )

    context.fillStyle = 'white'
    context.fillRect(
        canvasX - Constants.PLAYER_RADIUS * 2.5,
        canvasY + Constants.PLAYER_RADIUS * 5 + 8,
        Constants.PLAYER_RADIUS * 5,
        3,
    )
    context.fillStyle = 'red'
    context.fillRect(
        canvasX - Constants.PLAYER_RADIUS * 2.5 + Constants.PLAYER_RADIUS * 5 * boss.hp / boss.maxHp,
        canvasY + Constants.PLAYER_RADIUS * 5 + 8,
        Constants.PLAYER_RADIUS * 5 * (1 - boss.hp / boss.maxHp),
        3,
    )
}
