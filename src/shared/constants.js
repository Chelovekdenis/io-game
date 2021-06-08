//
//     COUNT_BACKS: MAP_SIZE / 1000
//     COUNT_SWAMP_BACKS: COUNT_BACKS + 2

let obj = {
    GAME_MAX_PLAYER: 40,
    GAME_PLAYERS_NICKS: ["Носок судьбы", "Cr1stal",
        "IceStorm" , "Летучий Олень", "Fluffy",  "ShOoTeR",
        "Lemon4ik ", "Mr.Negotive", "Утка_в_тапках",
        "АНТИ ПЕТУХ", "Enigma", "V1RUS", "3Jlou_4uTep",
        "-=HarDcore=- ", "Mr.Zadrot", "Шаман-наркоман",
        "K_I_N_G", "Haker", "Mirrox", "Agressor",
        "W1zarD", "_LegenDa_ ", "KiSS_Ka", "Ceme4ka"],

    PLAYER_RADIUS: 25,
    PLAYER_MAX_HP: 100,
    PLAYER_SPEED: 300,
    PLAYER_BASE_DAMAGE: 10,
    PLAYER_DAMAGE: 6,
    PLAYER_ATK_SPEED: 0.6,
    PLAYER_ATK_SPEED_MAX: 0.28,
    PLAYER_FIRE_COOLDOWN: 1,
    PLAYER_REGENERATION: 2,
    PLAYER_RAISE_SPEED: 4,
    PLAYER_RAISE_ATK_SPEED: 0.025,
    PLAYER_RAISE_BLT_SPEED: 0.1,
    PLAYER_LEVEL_SKILL_RICE: 0.1,
    PLAYER_RESURRECT_SCORE: 0.1,

    BULLET_RADIUS: 3,
    BULLET_SPEED: 800,
    BULLET_DAMAGE: 10,
    BULLET_MODIFICATOR: {
        PURE: {
            slow: false,
            mega: false,
            stun: false,
        },
        SLOW: {
            slow: true,
            mega: false,
            stun: false,
        },
        MEGA: {
            slow: false,
            mega: true,
            stun: false,
        },
        STUN: {
            slow: false,
            mega: false,
            stun: true,
        },
    },

    ENEMY_RADIUS: 20,

    BOSS_RADIUS: 80,

    TREE_RADIUS: 50,
    TREE_TYPES: ["fir_tree", "tree", "bush"],

    SCORE_BULLET_HIT: 5,
    SCORE_PER_SECOND: 0.5,
    EXP_FOR_LEVEL_UP: expForLevelUp(),

    PI_15: Math.PI * 1.5,
    PI_25: Math.PI / 2.5,
    PI_30: Math.PI / 3,
    PI_40: Math.PI / 4,

    MAP_SIZE: 8000,
    HALF_MAP_SIZE: 4000,
    COUNT_BACKS: 8,
    COUNT_SWAMP_BACKS: 10,

    MAP_FPS: 1000/60,
    MSG_TYPES: {
      JOIN_GAME: 'join_game',
      GAME_UPDATE: 'update',
      INPUT: 'input',
      GAME_OVER: 'dead',
      MOVEMENT: "movement",
      MOUSE_CLICK: "mouse_click",
      SKILL_POINTS: "skill_points"
    },
    CLASSES: {
        MELEE: {
            FIGHTER: "fighter",
            WARRIOR: "warrior",
            WARLORD: "warlord",
            KNIGHT: "knight",
            PALADIN: "paladin",
            DUELIST: "duelist",
        },
        RANGE: {
            ARCHER: "archer",
            SNIPER: "sniper",
            CROSSBOWMAN: "crossbowman",
            RANGER: "ranger",
            SHOOTER: "shooter",
        },

    }
}


module.exports = Object.freeze(obj)



function expForLevelUp() {
    let levels = [0, 100, 200]
    for (let i = 2; i <= 100; i++) {
        if(i >= 50)
            levels.push(levels[i]+ i*i*100)
        else
            levels.push(levels[i]+ i*i*20)
        // console.log(i-2,":",levels[i-2])
    }
    return levels
}

// 0:0
// 1:100
// 2:200
// 3:300
// 4:525
// 5:925
// 6:1550
// 7:2450
// 8:3675
// 9:5275
// 10:7300
// 11:9800
// 12:12825
// 13:16425
// 14:20650
// 15:25550
// 16:31175
// 17:37575
// 18:44800
// 19:52900
// 20:61925
// 21:71925
// 22:82950
// 23:95050
// 24:108275
// 25:122675
// 26:138300
// 27:155200
// 28:173425
// 29:193025
// 30:214050
// 31:236550
// 32:260575
// 33:286175
// 34:313400
// 35:342300
// 36:372925
// 37:405325
// 38:439550
// 39:475650
// 40:513675
// 41:553675
// 42:595700
// 43:639800
// 44:686025
// 45:734425
// 46:785050
// 47:837950
// 48:893175
// 49:950775
// 50:1010800
// 51:1260800
// 52:1520900
// 53:1791300
// 54:2072200
// 55:2363800
// 56:2666300
// 57:2979900
// 58:3304800
// 59:3641200
// 60:3989300
// 61:4349300
// 62:4721400
// 63:5105800
// 64:5502700
// 65:5912300
// 66:6334800
// 67:6770400
// 68:7219300
// 69:7681700
// 70:8157800
// 71:8647800
// 72:9151900
// 73:9670300
// 74:10203200
// 75:10750800
// 76:11313300
// 77:11890900
// 78:12483800
// 79:13092200
// 80:13716300
// 81:14356300
// 82:15012400
// 83:15684800
// 84:16373700
// 85:17079300
// 86:17801800
// 87:18541400
// 88:19298300
// 89:20072700
// 90:20864800
// 91:21674800
// 92:22502900
// 93:23349300
// 94:24214200
// 95:25097800
// 96:26000300
// 97:26921900
// 98:27862800
