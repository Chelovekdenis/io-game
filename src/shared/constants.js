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
    PLAYER_FIRE_COOLDOWN: 1,
    PLAYER_REGENERATION: 2,
    PLAYER_RAISE_SPEED: 2,
    PLAYER_RAISE_ATK_SPEED: 0.005,
    PLAYER_RAISE_BLT_SPEED: 0.1,
    PLAYER_LEVEL_SKILL_RICE: 0.1,

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
    levels.push(levels[i]+ i*i*40)
  }
  return levels
}

// 0: 0
// 1: 100
// 2: 200
// 3: 320
// 4: 1230
// 5: 2230
// 6: 3670
// 7: 5630
// 8: 8190
// 9: 11430
// 10: 15430
// 11: 20270
// 12: 26030
// 13: 32790
// 14: 40630
// 15: 49630
// 16: 59870
// 17: 71430
// 18: 84390
// 19: 98830
// 20: 114830
// 21: 132470
// 22: 151830
// 23: 172990
// 24: 196030
// 25: 221030
// 26: 248070
// 27: 277230
// 28: 308590
// 29: 342230
// 30: 378230
// 31: 416670
// 32: 457630
// 33: 501190
// 34: 547430
// 35: 596430
// 36: 648270
// 37: 703030
// 38: 760790
// 39: 821630
// 40: 885630
// 41: 952870
// 42: 1023430
// 43: 1097390
// 44: 1174830
// 45: 1255830
// 46: 1340470
// 47: 1428830
// 48: 1520990
// 49: 1617030
// 50: 1717030
// 51: 1821070
// 52: 1929230
// 53: 2041590
// 54: 2158230
// 55: 2279230
// 56: 2404670
// 57: 2534630
// 58: 2669190
// 59: 2808430
// 60: 2952430
// 61: 3101270
// 62: 3255030
// 63: 3413790
// 64: 3577630
// 65: 3746630
// 66: 3920870
// 67: 4100430
// 68: 4285390
// 69: 4475830
// 70: 4671830
// 71: 4873470
// 72: 5080830
// 73: 5293990
// 74: 5513030
// 75: 5738030
// 76: 5969070
// 77: 6206230
// 78: 6449590
// 79: 6699230
// 80: 6955230
// 81: 7217670
// 82: 7486630
// 83: 7762190
// 84: 8044430
// 85: 8333430
// 86: 8629270
// 87: 8932030
// 88: 9241790
// 89: 9558630
// 90: 9882630
// 91: 10213870
// 92: 10552430
// 93: 10898390
// 94: 11251830
// 95: 11612830
// 96: 11981470
// 97: 12357830
// 98: 12741990
// 99: 13134030
// 100: 13534030
