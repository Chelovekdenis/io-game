const Constants = require('../shared/constants')
const Player = require('./player')
const Tree = require('./tree')
const applyCollisions = require('./collisions')
const shortid = require('shortid')

class Game {
  constructor() {
    this.sockets = {}
    this.players = {}
    this.trees = {}
    this.bullets = []
    this.lastUpdateTime = Date.now()
    this.shouldSendUpdate = false
    setInterval(this.update.bind(this), Constants.MAP_FPS)
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket
    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5)
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5)
    this.players[socket.id] = new Player(socket.id, username, x, y)


    if (Object.keys(this.players).length > Constants.GAME_MAX_PLAYER) {
      socket.emit(Constants.MSG_TYPES.GAME_OVER)
      this.removePlayer(socket)
    }
  }

  removePlayer(socket) {
    delete this.sockets[socket.id]
    delete this.players[socket.id]
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir)
    }
  }

  ifMovement(socket, move) {
    if (this.players[socket.id]) {
      this.players[socket.id].setMovement(move)
    }
  }

  ifMouseClick(socket, click) {
    if (this.players[socket.id]) {
      this.players[socket.id].setMouseClick(click)
    }
  }

  ifQuickBar(socket, item) {
    if (this.players[socket.id]) {
      this.players[socket.id].setItem(item)
    }
  }

  ifChosenSkill(socket, item) {
    if (this.players[socket.id]) {
      if (this.players[socket.id].skillPoints > 0) {
        this.players[socket.id].skills[item]++
        this.players[socket.id].skillPoints--
        this.players[socket.id].sendMsgSP = true
        console.log(this.players[socket.id].skills)
      }
    }
  }

  initGame() {
    for(let i = 0; i < 5; i++) {
      const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5)
      const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5)
      const id = shortid()
      this.trees[id] = new Tree(id, x, y)
    }
  }

  gameInfo() {
    return Object.keys(this.players).length
  }

  update() {
    // Calculate time elapsed
    const now = Date.now()
    const dt = (now - this.lastUpdateTime) / 1000
    this.lastUpdateTime = now

    // Update each bullet
    const bulletsToRemove = []
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet)
      }
    })
    this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet))

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID]
      const earlyX = player.x
      const earlyY = player.y
      const newBullet = player.update(dt)
      // Player to Player collision
      let players = Object.values(this.players)
      let trees = Object.values(this.trees)
      for(let i = 0; i < players.length; i++) {
        for(let j = i+1; j < players.length; j++) {
          if (
              players[i].distanceTo(players[j]) <= Constants.PLAYER_RADIUS * 2
          ) {
            player.x = earlyX
            player.y = earlyY
          }
        }
        for(let j = 0; j < players.length; j++) {
          if (
              players[i].item === 2 &&
              players[i].giveDamage === true &&
              players[i].weaponsHit(players[j]) <= Constants.PLAYER_RADIUS
          ) {
            // TODO надо сделать чтобы один персонаж получал лишь урон лишь один раз за удар
            // console.log(`${players[i].username} HIT ${players[j].username}`)
            players[j].takeBulletDamage(players[i].skills.attack)
            players[i].onDealtDamage(1)
          }
        }
        for(let j = 0; j < trees.length; j++) {
          if (
              players[i].distanceTo(trees[j]) <= Constants.TREE_RADIUS + Constants.PLAYER_RADIUS
          ) {
            player.x = earlyX
            player.y = earlyY
            // console.log(player.x, player.y)
            // const dx = player.x - trees[j].x
            // const dy = player.y - trees[j].y
            // const a = Math.sqrt(dx * dx + dy * dy)

            // let dir = Math.atan2(player.x - trees[j].x, trees[j].y - player.y)
            // console.log((Constants.PLAYER_RADIUS * 3 * Math.cos(dir))/1000,
            //     (Constants.PLAYER_RADIUS * 3 * Math.sin(dir))/1000)
            // player.x += (trees[j].x + Constants.PLAYER_RADIUS * 3 * Math.cos(dir))/1000
            // player.y += (trees[j].y + Constants.PLAYER_RADIUS * 3 * Math.sin(dir))/1000

            // console.log(trees[j].x + Constants.PLAYER_RADIUS * 3 * Math.cos(dir),
            //     trees[j].y + Constants.PLAYER_RADIUS * 3 * Math.sin(dir))
            // console.log(player.x, player.y)
          }
        }
      }
      if (newBullet) {
        this.bullets.push(newBullet)
      }
    })

    // Apply collisions, give players score for hitting bullets
    const destroyedBullets = applyCollisions(Object.values(this.players), this.bullets)
    destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage(Constants.SCORE_BULLET_HIT)
      }
    })
    // destroyedBullets.push(applyCollisions.acgo(this.trees, this.bullets))
    // console.log(destroyedBullets)
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet))

    // Check if any players are dead and if any players have skillPoints
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID]
      const player = this.players[playerID]
      if (player.skills.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER)
        this.removePlayer(socket)
      }
      if (player.sendMsgSP) {
        socket.emit(Constants.MSG_TYPES.SKILL_POINTS, player.skillPoints)
        console.log("Emit new level ", player.username, "skill points: " + player.skillPoints)
        player.sendMsgSP = false
      }
    })


    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard()
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID]
        const player = this.players[playerID]
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard))
      })
      this.shouldSendUpdate = true
    } else {
      this.shouldSendUpdate = true
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }))
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    )
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    )
    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      trees: this.trees,
      leaderboard,
    }
  }
}

module.exports = Game
