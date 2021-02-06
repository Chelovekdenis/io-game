import {onChooseClass, onChooseSkill} from "../input"
import {getAsset} from "../assets"
import {fillRoundedRect} from "../canvas_functions"
const Constants = require('../../shared/constants')
const canvas = document.getElementById('game-canvas')
const context = canvas.getContext('2d')

export function renderHUD(me, boss, leader, leaderboard, currentWScale, currentHScale, newSkillPoint, newClassPoint) {
    // Quick bar
    let qikBarW = canvas.width > 1600 ? canvas.width / 7 : canvas.width / 5
    let qikBarWHalf = qikBarW / 2
    let qikBarItemInter = (qikBarW - 200) / 3
    for(let i = 0; i < 4; i++) {
      //  canvas.width/2 - 4 * 40 + 20 + 80 * i, canvas.height - 80, 40, 40
      context.fillStyle = "rgba(51, 46, 61,0.7)"
      fillRoundedRect(context, canvas.width/2 - qikBarWHalf + i * (50 + qikBarItemInter),
          canvas.height - 120 * currentHScale, 50, 50, Math.PI*1.5)
      context.fillStyle = 'white'
      context.textBaseline = "middle"
      context.textAlign = 'center'
      context.font = "16px Verdana"
      context.fillText(`${i+1}`, canvas.width/2 - qikBarWHalf + i * (50 + qikBarItemInter), canvas.height - 120)
      if(i === 0 && me.availableAbilities.first) {
          if(me.abilityCd.first > 0)
              context.fillText(`${me.abilityCd.first.toFixed(1)}`, canvas.width/2 - qikBarWHalf + i * (50 + qikBarItemInter) + 25, canvas.height - 95)
          else
              context.fillText(`${me.abilityName1}`, canvas.width/2 - qikBarWHalf + i * (50 + qikBarItemInter) + 25, canvas.height - 95)
      }
      else if(i === 1  && me.availableAbilities.second) {
            if(me.abilityCd.second > 0)
                context.fillText(`${me.abilityCd.second.toFixed(1)}`, canvas.width/2 - qikBarWHalf + i * (50 + qikBarItemInter) + 25, canvas.height - 95)
            else
                context.fillText(`${me.abilityName2}`, canvas.width/2 - qikBarWHalf + i * (50 + qikBarItemInter) + 25, canvas.height - 95)
        }
    }
    // Mini map
    context.fillStyle = "rgba(51, 46, 61,0.7)"
    // context.fillRect( 20 * currentWScale, (canvas.height - 220) * currentHScale, 200 , 200)
    fillRoundedRect(context, 20 * currentWScale, (canvas.height - 220) * currentHScale, 200, 200, Math.PI*1.5)

    let mmScale = Constants.MAP_SIZE / 200
    let mmPlayerX = me.x / mmScale
    let mmPlayerY = me.y / mmScale
    let mmPlayerSize = 6
    let mmPlayerSizeHalf = mmPlayerSize/2

    context.fillStyle = "rgba(255, 222, 3, 1)"

    if(me.leader)
        context.drawImage(
            getAsset(`crown.svg`),
            20 + mmPlayerX - 8,
            canvas.height - 220 + mmPlayerY - 8,
            16,
            16,
        )
    else
        context.fillRect( 20 + mmPlayerX - mmPlayerSizeHalf,
            canvas.height - 220 + mmPlayerY - mmPlayerSizeHalf,
            mmPlayerSize, mmPlayerSize)

    if(leader)
        context.drawImage(
            getAsset(`crown.svg`),
            20 + leader.x / mmScale - 8,
            canvas.height - 220 + leader.y / mmScale - 8,
            16,
            16,
        )

    if(boss.length !== 0) {
        let mmBossX = boss[0].x / mmScale
        let mmBossY = boss[0].y / mmScale
        let mmBossSize = 5
        let mmBossSizeHalf = mmBossSize/2

        // context.fillStyle = "red"
        //
        // context.fillRect( 20 + mmBossX - mmBossSizeHalf,
        //     canvas.height - 220 + mmBossY - mmBossSizeHalf,
        //     mmBossSize, mmBossSize)

        context.fillStyle = 'white'
        context.textBaseline = "middle"
        context.textAlign = 'center'
        context.font = "12px Verdana"
        context.fillText("B", 20 + mmBossX, canvas.height - 220 + mmBossY)
    }

    // Statsboard
    let xImg = canvas.width/2 - canvas.width/10 - 164
    let yImg = canvas.height - 45

    context.fillStyle = "rgba(51, 46, 61, 0.7)"
    fillRoundedRect(context, xImg - 20, yImg - 80, 180, 110, Math.PI*1.5)
    context.fillStyle = 'white'
    context.textBaseline = "middle"
    context.textAlign = 'center'
    context.font = "16px Verdana"
    context.drawImage(
        getAsset('str.svg'),
        xImg, yImg - 60,
        20,
        20,
    )
    context.fillText(`${me.attributes.strength}`, xImg+35, yImg - 50)
    context.drawImage(
        getAsset('agl.svg'),
        xImg, yImg - 35,
        20,
        20,
    )
    context.fillText(`${me.attributes.agility}`, xImg+35, yImg - 25)
    context.drawImage(
        getAsset('int.svg'),
        xImg, yImg - 10,
        20,
        20,
    )
    context.fillText(`${me.attributes.intelligence}`, xImg+35, yImg)

    xImg += 60
    yImg = canvas.height - 20

    context.drawImage(
        getAsset('defense.svg'),
        xImg, yImg - 100 - 10 + 20,
        20,
        20,
    )
    context.fillText(`${((1 - me.defense)*100).toFixed(0)}%`, xImg+50, yImg - 100 + 20)
    context.drawImage(
        getAsset('damage.svg'),
        xImg, yImg - 80 - 10 + 20,
        20,
        20,
    )
    context.fillText(`${me.damage.toFixed(2)}`, xImg+50, yImg - 80 + 20)
    context.drawImage(
        getAsset('atkspd.svg'),
        xImg, yImg - 60 - 10 + 20,
        20,
        20,
    )
    context.fillText(`${me.atkSpeed.toFixed(2)}`, xImg+50, yImg - 60 + 20)
    context.drawImage(
        getAsset('speed.svg'),
        xImg, yImg - 40 - 10 + 20,
        20,
        20,
    )
    context.fillText(`${me.speed}`, xImg+50, yImg - 40 + 20)

    // Leaderboard
    let aa_x = canvas.width-200
    context.fillStyle = "rgba(51, 46, 61, 0.7)"
    // context.fillRect( canvas.width-170, 10, 160, 200)
    fillRoundedRect(context, aa_x, 10, 190, 200, Math.PI*1.5)

    context.fillStyle = 'white'
    context.textBaseline = "middle"
    context.textAlign = 'center'
    context.font = "16px Verdana"
    context.fillText("Name", aa_x + 60, 30)
    context.fillText("Score", aa_x + 140, 30)
    context.drawImage(
        getAsset('crown.svg'),
        aa_x + 5, 45,
        30,
        30,
    )

    for(let i = 0; i < leaderboard.length; i++) {
        context.fillText(leaderboard[i].username.slice(0,7), aa_x + 60, 60+i*30)
        context.fillText(leaderboard[i].score, aa_x + 140, 60+i*30)
    }
    // Полоска ХП
    let expBarH = canvas.height - 64
    let expBarW = canvas.width / 5

    let red = me.hp/me.maxHp > 0.5 ? 510 * (1 - me.hp/me.maxHp) : 255
    let green = me.hp/me.maxHp > 0.5 ? 255 : 510 * me.hp/me.maxHp
    // context.fillStyle = "rgba(132,132,132,0.7)"
    // context.fillRect( expBarW, expBarH, expBarW, 30)
    // fillRoundedRect(context, expBarW, expBarH, expBarW, 30, Math.PI*1.5)
    context.fillStyle = "rgba(51, 46, 61, 0.7)"
    // context.fillRect( expBarW + 10, expBarH + 5, expBarW - 20, 20)
    fillRoundedRect(context, canvas.width/2 - expBarW/2, expBarH + 5, expBarW, 20, Math.PI*1.5)
    context.fillStyle = `rgba(${red}, ${green}, 0, 1)`
    // context.fillRect( expBarW + 10, expBarH + 5, (expBarW - 20)/
    //     ((Constants.EXP_FOR_LEVEL_UP[me.level+1] - Constants.EXP_FOR_LEVEL_UP[me.level])/
    //         (me.score - Constants.EXP_FOR_LEVEL_UP[me.level])), 20)
    fillRoundedRect(context, canvas.width/2 - expBarW/2, expBarH + 5, expBarW/
        (me.maxHp/me.hp), 20, Math.PI*1.5)
    context.fillStyle = 'white'
    context.textBaseline = "middle"
    context.textAlign = 'center'
    context.font = "16px Verdana"
    context.fillText(`${Math.round(me.hp)}/${Math.round(me.maxHp)}`, canvas.width/2, expBarH + 16)
    context.font = "14px Verdana"
    context.fillText(`+${me.skills.regeneration.toFixed(1)}`, canvas.width/2 + expBarW/2 - 24, expBarH + 16)
    // Experience bar
    expBarH = canvas.height - 40
    // context.fillStyle = "rgba(132,132,132,0.7)"
    // context.fillRect( expBarW, expBarH, expBarW, 30)
    // fillRoundedRect(context, expBarW, expBarH, expBarW, 30, Math.PI*1.5)
    context.fillStyle = "rgba(51, 46, 61, 0.7)"
    // context.fillRect( expBarW + 10, expBarH + 5, expBarW - 20, 20)
    fillRoundedRect(context, canvas.width/2 - expBarW/2, expBarH + 5, expBarW, 20, Math.PI*1.5)
    context.fillStyle = "rgba(0, 150, 136, 1)"
    // context.fillRect( expBarW + 10, expBarH + 5, (expBarW - 20)/
    //     ((Constants.EXP_FOR_LEVEL_UP[me.level+1] - Constants.EXP_FOR_LEVEL_UP[me.level])/
    //         (me.score - Constants.EXP_FOR_LEVEL_UP[me.level])), 20)
    fillRoundedRect(context, canvas.width/2 - expBarW/2, expBarH + 5, expBarW/
        ((Constants.EXP_FOR_LEVEL_UP[me.level+1] - Constants.EXP_FOR_LEVEL_UP[me.level])/
            (me.score - Constants.EXP_FOR_LEVEL_UP[me.level])), 20, Math.PI*1.5)

    context.fillStyle = 'white'
    context.textBaseline = "middle"
    context.textAlign = 'center'
    context.font = "16px Verdana"
    context.fillText(`level: ${me.level}`, canvas.width/2, expBarH + 16)

    // Distribution of skill points
    if (newSkillPoint > 0) {
        let thisHeight = canvas.height/2 * currentHScale - 100

        context.fillStyle = "rgba(51, 46, 61, 0.7)"
        // context.fillRect( 20, thisHeight, 200 , 200)
        fillRoundedRect(context, 20, thisHeight, 200 , 200, Math.PI*1.5)

        context.fillStyle = 'white'
        context.textBaseline = "bottom"
        context.textAlign = 'center'
        context.font = "16px Verdana"
        context.fillText(`Choose skill`, 120, thisHeight + 24)

        context.textAlign = 'start'

        let skillCoordinates = []
        let attributes = ['strength', 'agility', 'intelligence']
        for (let i = 0; i < attributes.length; i++) {
            skillCoordinates.push({skill: attributes[i], x: 160, y: thisHeight + 40 * (i+1), w: 20, h: 20})
            context.fillStyle = "rgba(51, 46, 61, 0.7)"
            context.fillRect( 160, thisHeight + 40 * (i+1), 20 , 20)
            context.fillStyle = 'white'
            context.fillText(`+`, 160 + 4, thisHeight + 40 * (i+1) + 18)
        }

        context.fillText(`Strength`, skillCoordinates[0].x - 120, skillCoordinates[0].y + skillCoordinates[0].h)
        context.fillText(`Agility`, skillCoordinates[1].x - 120, skillCoordinates[1].y + skillCoordinates[1].h)
        context.fillText(`Intelligence`, skillCoordinates[2].x - 120, skillCoordinates[2].y + skillCoordinates[2].h)
        onChooseSkill(skillCoordinates)
    }

    if (newClassPoint > 0) {
        if(me.classStage === 1) {
            let thisHeight = 120 * currentHScale - 100

            context.fillStyle = "rgba(51, 46, 61, 0.7)"
            // context.fillRect( 20, thisHeight, 270 , 200)
            fillRoundedRect(context, 20, thisHeight, 270 , 200, Math.PI*1.5)

            context.fillStyle = 'white'
            context.textBaseline = "bottom"
            context.textAlign = 'center'
            context.font = "16px Verdana"
            context.fillText(`Choose class`, 155, thisHeight + 24)

            context.textAlign = 'start'

            let skillCoordinates = []
            let attributes = me.className === "warrior" ? "warlord" : "sniper"
            for (let i = 0; i < 1; i++) {
                skillCoordinates.push({c: attributes, x: 240, y: thisHeight + 70 * (i+1), w: 20, h: 20})
                context.save()
                context.drawImage(
                    getAsset(`${attributes}1.svg`),
                    -Constants.PLAYER_RADIUS * 4 + 150,
                    -Constants.PLAYER_RADIUS * 4 + thisHeight + 80 * (i+1),
                    Constants.PLAYER_RADIUS * 8,
                    Constants.PLAYER_RADIUS * 8,
                )
                context.restore()
                context.fillStyle = "rgba(51, 46, 61, 0.7)"
                context.fillRect( 240, thisHeight + 70 * (i+1), 20 , 20)
                context.fillStyle = 'white'
                context.fillText(`+`, 240 + 4, thisHeight + 70 * (i+1) + 18)
            }
            if(attributes === 'warlord')
                context.fillText(`Warlord`, skillCoordinates[0].x - 200, skillCoordinates[0].y + skillCoordinates[0].h)
            else
                context.fillText(`Sniper`, skillCoordinates[0].x - 200, skillCoordinates[0].y + skillCoordinates[0].h)

            onChooseClass(skillCoordinates)
        } else {

            let thisHeight = 120 * currentHScale - 100

            context.fillStyle = "rgba(51, 46, 61, 0.7)"
            context.fillRect( 20, thisHeight, 270 , 200)

            context.fillStyle = 'white'
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
                    getAsset(`${attributes[i]}1.svg`),
                    -Constants.PLAYER_RADIUS * 4 + 150,
                    -Constants.PLAYER_RADIUS * 4 + thisHeight + 80 * (i+1),
                    Constants.PLAYER_RADIUS * 8,
                    Constants.PLAYER_RADIUS * 8,
                )
                context.restore()
                context.fillStyle = "rgba(51, 46, 61, 0.7)"
                context.fillRect( 240, thisHeight + 70 * (i+1), 20 , 20)
                context.fillStyle = 'white'
                context.fillText(`+`, 240 + 4, thisHeight + 70 * (i+1) + 18)
            }

            context.fillText(`Warrior`, skillCoordinates[0].x - 200, skillCoordinates[0].y + skillCoordinates[0].h)
            context.fillText(`Archer`, skillCoordinates[1].x - 200, skillCoordinates[1].y + skillCoordinates[1].h)
            onChooseClass(skillCoordinates)
        }
    }
}
