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

    let scale = 20

    if(bullet.modificator.mega)
        scale  *= 1.2

    let halfScale = scale / 2

    if(bullet.modificator.slow)
        context.drawImage(
            getAsset('arrow_slow.svg'),
            - Constants.BULLET_RADIUS * halfScale,
            - Constants.BULLET_RADIUS * halfScale,
            Constants.BULLET_RADIUS * scale,
            Constants.BULLET_RADIUS * scale,
        )
    else if (bullet.modificator.stun) {
        context.save()
        context.rotate(-Math.PI/2)
        context.drawImage(
            getAsset('paladin_weapon_4.svg'),
            - 4 * halfScale,
            - 2 * halfScale,
            8 * scale,
            2 * scale,
        )
        context.restore()
    }
    else
        context.drawImage(
            getAsset('arrow.svg'),
            - Constants.BULLET_RADIUS * halfScale,
            - Constants.BULLET_RADIUS * halfScale,
            Constants.BULLET_RADIUS * scale,
            Constants.BULLET_RADIUS * scale,
        )
    context.restore()
}
