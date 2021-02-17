//
//     COUNT_BACKS: MAP_SIZE / 1000
//     COUNT_SWAMP_BACKS: COUNT_BACKS + 2

let obj = {
    GAME_MAX_PLAYER: 40,

    PLAYER_RADIUS: 25,
    PLAYER_MAX_HP: 100,
    PLAYER_SPEED: 400,
    PLAYER_FIRE_COOLDOWN: 1,

    BULLET_RADIUS: 3,
    BULLET_SPEED: 800,
    BULLET_DAMAGE: 10,

    ENEMY_RADIUS: 20,

    BOSS_RADIUS: 80,

    TREE_RADIUS: 50,

    SCORE_BULLET_HIT: 20,
    SCORE_PER_SECOND: 1,
    EXP_FOR_LEVEL_UP: expForLevelUp(),

    PI_15: Math.PI * 1.5,
    PI_25: Math.PI / 2.5,
    PI_30: Math.PI / 3,
    PI_40: Math.PI / 4,

    MAP_SIZE: 16000,
    HALF_MAP_SIZE: 8000,
    COUNT_BACKS: 16,
    COUNT_SWAMP_BACKS: 18,

    MAP_FPS: 1000/90,
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
        FIGHTER: "fighter",
        WARRIOR: "warrior",
        ARCHER: "archer",
        WARLORD: "warlord",
        SNIPER: "sniper"
    }
}


module.exports = Object.freeze(obj)



function expForLevelUp() {
  let levels = [0, 100, 200]
  for (let i = 2; i <= 100; i++) {
    levels.push(levels[i]+ i*i*30)
  }
  return levels
}

// 0: 0
// 1: 100
// 2: 200
// 3: 320
// 4: 590
// 5: 1070
// 6: 1820
// 7: 2900
// 8: 4370
// 9: 6290
// 10: 8720
// 11: 11720
// 12: 15350
// 13: 19670
// 14: 24740
// 15: 30620
// 16: 37370
// 17: 45050
// 18: 53720
// 19: 63440
// 20: 74270
// 21: 86270
// 22: 99500
// 23: 114020
// 24: 129890
// 25: 147170
// 26: 165920
// 27: 186200
// 28: 208070
// 29: 231590
// 30: 256820
// 31: 283820
// 32: 312650
// 33: 343370
// 34: 376040
// 35: 410720
// 36: 447470
// 37: 486350
// 38: 527420
// 39: 570740
// 40: 616370
// 41: 664370
// 42: 714800
// 43: 767720
// 44: 823190
// 45: 881270
// 46: 942020
// 47: 1005500
// 48: 1071770
// 49: 1140890
// 50: 1212920
// 51: 1287920
// 52: 1365950
// 53: 1447070
// 54: 1531340
// 55: 1618820
// 56: 1709570
// 57: 1803650
// 58: 1901120
// 59: 2002040
// 60: 2106470
// 61: 2214470
// 62: 2326100
// 63: 2441420
// 64: 2560490
// 65: 2683370
// 66: 2810120
// 67: 2940800
// 68: 3075470
// 69: 3214190
// 70: 3357020
// 71: 3504020
// 72: 3655250
// 73: 3810770
// 74: 3970640
// 75: 4134920
// 76: 4303670
// 77: 4476950
// 78: 4654820
// 79: 4837340
// 80: 5024570
// 81: 5216570
// 82: 5413400
// 83: 5615120
// 84: 5821790
// 85: 6033470
// 86: 6250220
// 87: 6472100
// 88: 6699170
// 89: 6931490
// 90: 7169120
// 91: 7412120
// 92: 7660550
// 93: 7914470
// 94: 8173940
// 95: 8439020
// 96: 8709770
// 97: 8986250
// 98: 9268520
// 99: 9556640
// 100: 9850670
// 101: 10150670
