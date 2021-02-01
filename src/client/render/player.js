import {getAsset} from "../assets"
const Constants = require('../../shared/constants')
const canvas = document.getElementById('game-canvas')
const context = canvas.getContext('2d')

export function renderPlayer(me, player) {
    const { x, y, direction, className, hitAnimation, skills } = player
    const canvasX = canvas.width / 2 + x - me.x
    const canvasY = canvas.height / 2 + y - me.y
    // Draw player
    context.save()
    context.translate(canvasX, canvasY)


    // Animation hit
    context.rotate(direction + hitAnimation)

    let atk = skills.attack
    if(className === "fighter") {
        if(player.level >= 2) {
            atk = 2
        } else
            atk = 1
    } else {
        if(atk > 15)
            atk = 5
        else if (atk > 11)
            atk = 4
        else if (atk > 7)
            atk = 3
        else if (atk > 3)
            atk = 2
        else if (atk >= 0)
            atk = 1
    }



    context.drawImage(
        getAsset(`${className}${atk}.svg`),
        -Constants.PLAYER_RADIUS * 5,
        -Constants.PLAYER_RADIUS * 5,
        Constants.PLAYER_RADIUS * 10,
        Constants.PLAYER_RADIUS * 10,
    )
    context.restore()

    context.fillStyle = "red"
    // console.log(canvas.width / 2 + x - me.weaponX - Constants.PLAYER_RADIUS, canvas.height / 2 + y - me.weaponY - Constants.PLAYER_RADIUS)
    // console.log(player.weaponX, player.weaponY)

    context.fillRect(
        canvas.width / 2 + player.weaponX - me.x - 5,
        canvas.height / 2 + player.weaponY - me.y - 5,
        10,
        10,
    )
    context.fillRect(
        canvas.width / 2 + player.weaponX2 - me.x - 5,
        canvas.height / 2 + player.weaponY2 - me.y - 5,
        10,
        10,
    )

    // Draw name
    let lvlString = "lvl"
    if(player.effects.stunned.yes === true) {
        player.username = "STUN"
        player.level = player.effects.stunned.time.toFixed(1)
        lvlString = ""
    }
    context.fillStyle = 'white'
    context.textBaseline = "middle"
    context.textAlign = 'center'
    context.fillText(player.username, canvasX, canvasY - Constants.PLAYER_RADIUS - 12)
    context.save()

    // Draw crown
    if(player.leader)
        context.drawImage(
            getAsset(`crown.svg`),
            canvasX - 12,
            canvasY - Constants.PLAYER_RADIUS - 50,
            24,
            24,
        )
    // Draw level
    context.font = "12px Verdana"
    context.fillText(`${player.level} ${lvlString}`, canvasX, canvasY - Constants.PLAYER_RADIUS - 24)
    context.restore()
    // Draw health bar
    context.fillRect(
        canvasX - Constants.PLAYER_RADIUS,
        canvasY + Constants.PLAYER_RADIUS + 8,
        Constants.PLAYER_RADIUS * 2,
        2,
    )
    context.fillStyle = 'red'
    context.fillRect(
        canvasX - Constants.PLAYER_RADIUS + Constants.PLAYER_RADIUS * 2 * player.hp / player.maxHp,
        canvasY + Constants.PLAYER_RADIUS + 8,
        Constants.PLAYER_RADIUS * 2 * (1 - player.hp / player.maxHp),
        2,
    )

}
