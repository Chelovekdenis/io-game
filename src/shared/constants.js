let obj = {
    GAME_MAX_PLAYER: 40,

    PLAYER_RADIUS: 25,
    PLAYER_MAX_HP: 100,
    PLAYER_SPEED: 400,
    PLAYER_FIRE_COOLDOWN: 0.1,

    BULLET_RADIUS: 3,
    BULLET_SPEED: 800,
    BULLET_DAMAGE: 10,

    TREE_RADIUS: 80,

    SCORE_BULLET_HIT: 20,
    SCORE_PER_SECOND: 1,
    EXP_FOR_LEVEL_UP: expForLevelUp(),

    MAP_SIZE: 2560,
    MAP_FPS: 1000/90,
    MSG_TYPES: {
      JOIN_GAME: 'join_game',
      GAME_UPDATE: 'update',
      INPUT: 'input',
      GAME_OVER: 'dead',
      MOVEMENT: "movement",
      MOUSE_CLICK: "mouse_click",
      SKILL_POINTS: "skill_points"
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
