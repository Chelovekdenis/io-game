import {getAsset} from "../assets"
const Constants = require('../../shared/constants')
const canvas = document.getElementById('game-canvas')
const context = canvas.getContext('2d')

export function renderPlayer(me, player) {
    if(player.effects.invis.yes)
        return null
    const { x, y, direction, className, hitAnimation} = player
    const canvasX = canvas.width / 2 + x - me.x
    const canvasY = canvas.height / 2 + y - me.y
    // Draw player
    context.save()
    context.translate(canvasX, canvasY)


    // Animation hit
    context.rotate(direction + hitAnimation)

    let tempX = -125
    let tempY = -50
    let tempW = 250
    let tempH = 50

    let hands = ""

    let weaponLvl = player.skills.attack
    if(className === Constants.CLASSES.MELEE.FIGHTER && player.skills.attack > 0) {
        weaponLvl = 1
    } else if (className === Constants.CLASSES.MELEE.KNIGHT) {
        tempX = -74
        tempY = -100
        tempW = 140
        tempH = 120
    }


    const isRangeClass = Object.values(Constants.CLASSES.RANGE).filter(
        e => e === className,
    )
    if(isRangeClass[0]) {
        tempX = -100
        tempY = -100
        tempW = 200
        tempH = 100
        hands = "arch_"
    }


    // context.drawImage(
    //     getAsset(`${className}${weaponName.toFixed(0)}.svg`),
    //     -Constants.PLAYER_RADIUS * 5,
    //     -Constants.PLAYER_RADIUS * 5,
    //     Constants.PLAYER_RADIUS * 10,
    //     Constants.PLAYER_RADIUS * 10,
    // )
    // console.log("className -> ", className)
    context.drawImage(
        getAsset(`${className}_weapon_${weaponLvl}.svg`),
        tempX,
        tempY,
        tempW,
        tempH,
    )

    context.drawImage(
        getAsset(`${hands}hands_0.svg`),
        -Constants.PLAYER_RADIUS * 5,
        -Constants.PLAYER_RADIUS * 5,
        Constants.PLAYER_RADIUS * 10,
        Constants.PLAYER_RADIUS * 10,
    )

    context.drawImage(
        getAsset(`body_0.svg`),
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
