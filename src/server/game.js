const Constants = require('../shared/constants')
const Player = require('./player')
const Tree = require('./tree')
const Enemy = require('./enemy')
const Boss = require('./classes/boss')
const {applyCollisions, circleToCircleWithReturn, circleToCircleLite, hitPlayer, spawn} = require('./collisions')
const shortid = require('shortid')

class Game {
    constructor() {
        this.sockets = {}
        this.players = {}
        this.trees = {}
        this.enemies = {}
        this.boss = {}
        this.bullets = []
        this.lastUpdateTime = Date.now()
        this.shouldSendUpdate = false
        setInterval(this.update.bind(this), Constants.MAP_FPS)
    }

    addPlayer(socket, username) {
        // Проверка на максимальное кол-во игроков
        if (Object.keys(this.players).length + 1 > Constants.GAME_MAX_PLAYER) {
            socket.emit(Constants.MSG_TYPES.GAME_OVER)
            return null
        }

        this.sockets[socket.id] = socket
        // Generate a position to start this player at.
        let t = Object.values(this.trees)
        let e = Object.values(this.enemies)
        let b = Object.values(this.boss)
        let p = Object.values(this.players)
        let xy = spawn(e.concat(t, b, p), Constants.TREE_RADIUS, Constants.PLAYER_RADIUS)
        this.players[socket.id] = new Player(socket.id, username, xy.x, xy.y)
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
        if (this.players[socket.id])
            this.players[socket.id].setAbility(item, 0.4)
    }

    ifChosenSkill(socket, item) {
        let player = this.players[socket.id]
        if (player) {
            if (player.skillPoints > 0) {
                player.setAttributes(item)
                // player.skills[item]++
                player.skillPoints--
                player.sendMsgSP = true
                // console.log(player.setAttributes())

                // switch (item) {
                //     case "attack":
                //         player.setDamage()
                //         break
                //     case "defense":
                //         player.setDefense()
                //         break
                //     case "maxHp":
                //         player.setHp()
                //         break
                // }
            }
        }
    }

    ifChosenClass(socket, c) {
        let player = this.players[socket.id]
        if (player) {
            if(player.classPoint > 0) {
                player.classPoint--
                player.sendMsgCP = true
                switch (c) {
                    case "warrior":
                        player.chosenClass(Constants.CLASSES.WARRIOR)
                        break
                    case "archer":
                        player.chosenClass(Constants.CLASSES.ARCHER)
                        break
                    case "warlord":
                        player.chosenClass("warlord")
                        break
                    case "sniper":
                        player.chosenClass("sniper")
                        break
                }
            }
        }
    }

    initGame() {
        for (let i = 0; i < 5; i++) {
            const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5)
            const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5)
            const id = shortid()
            this.trees[id] = new Tree(id, x, y)
        }
        // for (let i = 0; i < 3; i++) {
        //     this.spawnEnemy()
        // }
        // this.spawnBoss()
    }

    spawnEnemy() {
        let t = Object.values(this.trees)
        let p = Object.values(this.players)
        let b = Object.values(this.boss)
        let e = Object.values(this.enemies)
        // Нужно передать больший радиус из массива объектов
        let xy = spawn(p.concat(t, b, e), Constants.BOSS_RADIUS, Constants.ENEMY_RADIUS)
        const id = shortid()
        this.enemies[id] = new Enemy(id, xy.x, xy.y, Constants.PLAYER_SPEED * 0.6)
    }

    spawnBoss() {
        let t = Object.values(this.trees)
        let p = Object.values(this.players)
        let e = Object.values(this.enemies)
        // Нужно передать больший радиус из массива объектов
        let xy = spawn(p.concat(t, e), Constants.TREE_RADIUS, Constants.BOSS_RADIUS)
        const id = shortid()
        this.boss[id] = new Boss(id, xy.x, xy.y, Constants.PLAYER_SPEED)
    }

    gameInfo() {
        return Object.keys(this.players).length
    }

    update() {
        let trees = Object.values(this.trees)
        let enemies = Object.values(this.enemies)
        let boss = Object.values(this.boss)
        let players = []


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

            if(player.needStun)
                player.setStun(3)
            else if(player.needKick.need)
                player.setKick(0.1)
            // Player to Player collision
            players = Object.values(this.players).filter( p => p !== player)
            if (
                circleToCircleLite(player, players, Constants.PLAYER_RADIUS, Constants.PLAYER_RADIUS) ||
                circleToCircleLite(player, enemies, Constants.PLAYER_RADIUS, Constants.ENEMY_RADIUS) ||
                circleToCircleLite(player, boss, Constants.PLAYER_RADIUS, Constants.BOSS_RADIUS) ||
                circleToCircleLite(player, trees, Constants.PLAYER_RADIUS, Constants.TREE_RADIUS)
            ) {
                player.x = earlyX
                player.y = earlyY
            }

            if((player.className === Constants.CLASSES.WARRIOR || player.className === Constants.CLASSES.FIGHTER
                || player.className === "warlord")
                && player.giveDamage === true) {
                let beaten = hitPlayer(player, players, Constants.PLAYER_RADIUS)
                let beatenEnemy = hitPlayer(player, enemies, Constants.ENEMY_RADIUS)
                let beatenBoss = hitPlayer(player, boss, Constants.BOSS_RADIUS)
                let canHit = player.listDamaged.find(element => {
                    if (element.id === beaten.id)
                        return true
                })
                if(beaten && !canHit) {
                    beaten.takeDamage(player.damage, player.id)
                    beaten.needKick.need = true
                    beaten.needKick.dir = Math.atan2(beaten.x - player.x, player.y - beaten.y)
                    beaten.needKick.power = player.className === Constants.CLASSES.WARLORD ? 200 : 150
                    player.listDamaged.push({id: beaten.id, count: player.attackSpeed})
                    player.onDealtDamage(0)
                }
                canHit = player.listDamaged.find(element => {
                    if (element.id === beatenEnemy.id)
                        return true
                })
                if(beatenEnemy && !canHit) {
                    beatenEnemy.takeDamage(player.damage, player.id)
                    beatenEnemy.needKick.need = true
                    beatenEnemy.needKick.dir = Math.atan2(beatenEnemy.x - player.x, player.y - beatenEnemy.y)
                    beatenEnemy.needKick.power = player.className === Constants.CLASSES.WARLORD ? 300 : 250
                    player.listDamaged.push({id: beatenEnemy.id, count: player.attackSpeed})
                    player.onDealtDamage(0)

                }
                canHit = player.listDamaged.find(element => {
                    // console.log("find")
                    if (element.id === beatenBoss.id)
                        return true
                })
                if(beatenBoss && !canHit) {
                    beatenBoss.takeDamage(player.damage, player.id)
                    player.listDamaged.push({id: beatenBoss.id, count: player.attackSpeed})
                    player.onDealtDamage(0)

                }
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
            if (newBullet)
                this.bullets.push(newBullet)
        })

        // Apply collisions, give players score for hitting bullets
        players = Object.values(this.players)

        let destroyedBullets = applyCollisions(players, this.bullets, Constants.PLAYER_RADIUS)
            .concat(
                applyCollisions(enemies, this.bullets, Constants.ENEMY_RADIUS),
                applyCollisions(boss, this.bullets, Constants.BOSS_RADIUS)
            )
        destroyedBullets.forEach(b => {
            if (this.players[b.parentID])
                this.players[b.parentID].onDealtDamage(Constants.BULLET_DAMAGE)
        })
        destroyedBullets = destroyedBullets.concat(applyCollisions(trees, this.bullets, Constants.TREE_RADIUS))
        this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet))

        boss = Object.values(this.boss)

        // Обновление противников
        Object.keys(this.enemies).forEach(enemyId => {
            const enemy = this.enemies[enemyId]
            const earlyX = enemy.x
            const earlyY = enemy.y
            let closest = {
                dis: 0,
                x: null,
                y: null
            }

            enemies = enemies.filter( e => e !== enemy)

            for (let i = 0; i < players.length; i++) {
                let dis = enemy.distanceTo(players[i])
                if( dis <= 300) {
                    if (closest.dis !== 0) {
                        if (closest.dis > dis) {
                            closest.dis = dis
                            closest.x = players[i].x
                            closest.y = players[i].y
                        }
                    } else {
                        closest.dis = dis
                        closest.x = players[i].x
                        closest.y = players[i].y
                    }
                } else if (dis <= 1000) {
                    if(this.players[enemy.lastHit]) {
                        closest.dis = dis
                        closest.x = this.players[enemy.lastHit].x
                        closest.y = this.players[enemy.lastHit].y
                    }
                }

            }

            if(closest.x) {
                enemy.toAttack = closest.dis <= 100
                enemy.update(dt, closest.x, closest.y)
            }

            if (enemy.needKick.need)
                enemy.hitKick()

            if (
                circleToCircleLite(enemy, players, Constants.ENEMY_RADIUS, Constants.PLAYER_RADIUS) ||
                circleToCircleLite(enemy, enemies, Constants.ENEMY_RADIUS, Constants.ENEMY_RADIUS) ||
                circleToCircleLite(enemy, trees, Constants.ENEMY_RADIUS, Constants.TREE_RADIUS) ||
                circleToCircleLite(enemy, boss, Constants.ENEMY_RADIUS, Constants.BOSS_RADIUS)
            ) {
                enemy.x = earlyX
                enemy.y = earlyY
            }

            if(enemy.giveDamage === true) {
                let beaten = hitPlayer(enemy, players, Constants.PLAYER_RADIUS)
                if (beaten)
                    beaten.takeDamage(enemy.damage, enemy.id)
            }
        })
        // Убиты ли противники
        Object.keys(this.enemies).forEach(enemyId => {
            const enemy = this.enemies[enemyId]
            if (enemy.hp <= 0) {
                this.players[enemy.lastHit].onKill(enemy.level)
                delete this.enemies[enemyId]
                this.spawnEnemy()
            }
        })


        players = Object.values(this.players)
        enemies = Object.values(this.enemies)

        // БОСС
        Object.keys(this.boss).forEach((enemyId) => {
            boss = this.boss[enemyId]
            const earlyX = boss.x
            const earlyY = boss.y

            let targetId = boss.chosenTarget(players, 1000, 500)

            if (targetId) {
                let player = this.players[targetId]
                boss.toAttack = player.distanceTo(boss)<= 200
                boss.update(dt, player.x, player.y)
            }


            if (
                circleToCircleLite(boss, players, Constants.BOSS_RADIUS, Constants.PLAYER_RADIUS) ||
                circleToCircleLite(boss, enemies, Constants.BOSS_RADIUS, Constants.ENEMY_RADIUS)
            ) {
                boss.x = earlyX
                boss.y = earlyY
            }
            let destroyedTree = circleToCircleWithReturn(boss, trees, Constants.BOSS_RADIUS, Constants.TREE_RADIUS)
            if (destroyedTree)
                delete this.trees[destroyedTree.id]

            if (boss.giveDamage === true) {
                let beaten = hitPlayer(boss, players, Constants.PLAYER_RADIUS)
                if (beaten)
                    beaten.takeDamage(boss.damage, boss.id)
            }
        })

        // Убит ли БОСС>
        Object.keys(this.boss).forEach((enemyId) => {
            const boss = this.boss[enemyId]
            if (boss.hp <= 0) {
                this.players[boss.lh].onKill(boss.level)
                delete this.boss[enemyId]
            }
        })

        // Check if any players are dead and if any players have skillPoints
        Object.keys(this.sockets).forEach(playerID => {
            const socket = this.sockets[playerID]
            const player = this.players[playerID]
            if (player.hp <= 0) {
                socket.emit(Constants.MSG_TYPES.GAME_OVER)
                if(this.players[player.lastHit])
                    this.players[player.lastHit].onKill(player.level)
                this.removePlayer(socket)
            }
            if (player.sendMsgSP) {
                socket.emit(Constants.MSG_TYPES.SKILL_POINTS, player.skillPoints)
                player.sendMsgSP = false
            }
            if (player.sendMsgCP) {
                socket.emit("class_point", player.classPoint)
                player.sendMsgCP = false
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
            this.shouldSendUpdate = false
        } else {
            this.shouldSendUpdate = true
        }
    }

    getLeaderboard() {
        return Object.values(this.players)
            .sort((p1, p2) => p2.score - p1.score)
            .slice(0, 5)
            .map(p => ({username: p.username, score: Math.round(p.score)}))
    }

    createUpdate(player, leaderboard) {
        const nearbyPlayers = Object.values(this.players).filter(
            p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
        )
        const nearbyEnemies = Object.values(this.enemies).filter(
            e => e.distanceTo(player) <= Constants.MAP_SIZE / 2,
        )
        // const nearbyBoss = Object.values(this.boss).filter(
        //     boss => boss.distanceTo(player) <= Constants.MAP_SIZE / 2,
        // )
        const nearbyBullets = this.bullets.filter(
            b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
        )
        return {
            t: Date.now(),
            me: player.serializeForUpdate(),
            others: nearbyPlayers.map(p => p.serializeForUpdate()),
            bullets: nearbyBullets.map(b => b.serializeForUpdate()),
            trees: this.trees,
            enemies: nearbyEnemies.map(e => e.serializeForUpdate()),
            boss: Object.values(this.boss).map(boss => boss.serializeForUpdate()),
            leaderboard,
        }
    }
}

module.exports = Game
