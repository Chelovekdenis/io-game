import {getAsset} from "../assets"
const Constants = require('../../shared/constants')
const canvas = document.getElementById('game-canvas')
const context = canvas.getContext('2d')

export function renderBullet(me, bullet) {
    const { x, y } = bullet
    const canvasX = canvas.width / 2 + x - me.x
    const canvasY = canvas.height / 2 + y - me.y
    // Draw player
    context.save()
    context.translate(canvasX, canvasY)

    // Animation hit
    context.rotate(bullet.direction)

    if(bullet.isSlow)
        context.drawImage(
            getAsset('arrow_slow.svg'),
            - Constants.BULLET_RADIUS*10,
            - Constants.BULLET_RADIUS*10,
            Constants.BULLET_RADIUS * 20,
            Constants.BULLET_RADIUS * 20,
        )
    else
        context.drawImage(
            getAsset('arrow.svg'),
            - Constants.BULLET_RADIUS*10,
            - Constants.BULLET_RADIUS*10,
            Constants.BULLET_RADIUS * 20,
            Constants.BULLET_RADIUS * 20,
        )
    context.restore()
}
