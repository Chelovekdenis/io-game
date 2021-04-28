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

    let atk = 0
    if(className === "warrior") {
        atk = (player.skills.attack - 5) < 0 ? 0 : (player.skills.attack - 5)
    }
    else if (className === "warlord") {
        atk = (player.skills.attack / 5)
    }
    else if (className === "archer") {
        atk = (player.skills.attack + 2)
    }
    else if (className === "sniper") {
        atk = (player.skills.attack / 3)
    }
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
        getAsset(`${className}${atk.toFixed(0)}.svg`),
        -Constants.PLAYER_RADIUS * 5,
        -Constants.PLAYER_RADIUS * 5,
        Constants.PLAYER_RADIUS * 10,
        Constants.PLAYER_RADIUS * 10,
    )
    context.restore()

    context.fillStyle = "red"
    // console.log(canvas.width / 2 + x - me.weaponX - Constants.PLAYER_RADIUS, canvas.height / 2 + y - me.weaponY - Constants.PLAYER_RADIUS)
    // console.log(player.weaponX, player.weaponY)

    // context.fillRect(
    //     canvas.width / 2 + player.weaponX - me.x - 5,
    //     canvas.height / 2 + player.weaponY - me.y - 5,
    //     10,
    //     10,
    // )
    // context.fillRect(
    //     canvas.width / 2 + player.weaponX2 - me.x - 5,
    //     canvas.height / 2 + player.weaponY2 - me.y - 5,
    //     10,
    //     10,
    // )

    // Draw name
    context.font = "14px Verdana"
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
    let lvlString = "lvl"
    let tempLevel = player.level
    let tempColor = ""
    if(player.effects.stunned.yes) {
        player.level = "STUN"
        tempColor = "gold"
        lvlString = player.effects.stunned.time.toFixed(1)
    } else if (player.effects.slowed.yes) {
        player.level = "SLOWED"
        tempColor = "skyblue"
        lvlString = player.effects.slowed.time.toFixed(1)

    } else if (player.effects.rage.yes) {
        player.level = "RAGE"
        tempColor = "mediumvioletred"
        lvlString = player.effects.rage.time.toFixed(1)

    } else if (player.effects.storm.yes) {
        tempColor = "blueviolet"
        player.level = "STORM"
        lvlString = player.effects.storm.time.toFixed(1)

    }
    if (tempColor)
        context.fillStyle = tempColor
    context.font = "12px Verdana"
    context.fillText(`${player.level} ${lvlString}`, canvasX, canvasY - Constants.PLAYER_RADIUS - 24)
    player.level = tempLevel
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
