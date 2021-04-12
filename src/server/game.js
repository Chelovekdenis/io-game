const Constants = require('../shared/constants')
const Player = require('./player')
const Tree = require('./tree')
const Enemy = require('./enemies/enemy')
const EnemyWarrior = require('./enemies/enemy_warrior')
const Boss = require('./enemies/boss')
const {applyCollisions, circleToCircleWithReturn, circleToCircleLite, hitPlayer, spawn, circleToCircleLiteNew} = require('./collisions')
const shortid = require('shortid')

class Game {
    constructor() {
        this.sockets = {}
        this.players = {}
        this.resPlayers = {}
        this.trees = {}
        this.enemies = {}
        this.enemies_warrior = {}
        this.boss = {}
        this.bullets = []
        this.leader = null
        this.lastUpdateTime = Date.now()
        this.shouldSendUpdate = false
        setInterval(this.update.bind(this), Constants.MAP_FPS)
    }

    // Надо вывести в отдельный скрипт
    randomInteger(min, max) {
        // получить случайное число от (min-0.5) до (max+0.5)
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }

    addPlayer(socket, username) {
        // Проверка на максимальное кол-во игроков
        console.log(Object.keys(this.players))
        if (Object.keys(this.players).length + 1 > Constants.GAME_MAX_PLAYER) {
            console.log("addPlayer ", Object.keys(this.players).length + 1, Constants.GAME_MAX_PLAYER)
            socket.emit(Constants.MSG_TYPES.GAME_OVER, "Limit players")
            return null
        }

        this.sockets[socket.id] = socket
        // Generate a position to start this player at.
        let t = Object.values(this.trees)
        let e = Object.values(this.enemies)
        let b = Object.values(this.boss)
        let p = Object.values(this.players)
        let ew = Object.values(this.enemies_warrior)
        // Может лучше радиус Босса?
        let xy = spawn(e.concat(t, b, p, ew), Constants.TREE_RADIUS, Constants.PLAYER_RADIUS, 0.1, 0.9, 0.05, 0.9)
        this.players[socket.id] = new Player(socket.id, username, xy.x, xy.y, 0)
    }

    resurrectPlayer(socket) {
        this.sockets[socket.id] = socket
        console.log(Object.keys(this.players))
        // Generate a position to start this player at.
        let t = Object.values(this.trees)
        let e = Object.values(this.enemies)
        let b = Object.values(this.boss)
        let p = Object.values(this.players)
        let ew = Object.values(this.enemies_warrior)
        // Может лучше радиус Босса?
        let xy = spawn(e.concat(t, b, p, ew), Constants.TREE_RADIUS, Constants.PLAYER_RADIUS, 0.1, 0.9, 0.05, 0.9)
        console.log("game.js socket.id " + socket.id)
        this.players[socket.id] = new Player(socket.id, this.resPlayers[socket.id].username,
            xy.x, xy.y, this.resPlayers[socket.id].rewardedLevel)
        console.log("game.js", this.players[socket.id].level, this.players[socket.id].score)
        socket.emit("player_ready")
    }

    removePlayer(socket, canResurrection) {
        if(!canResurrection) {
            delete this.sockets[socket.id]
            delete this.players[socket.id]
        } else {
            this.resPlayers[socket.id] = socket
            this.resPlayers[socket.id].username = this.players[socket.id].username
            this.resPlayers[socket.id].rewardedLevel = Math.ceil(this.players[socket.id].level * 0.4)
            delete this.players[socket.id]
            socket.emit("resurrect", this.resPlayers[socket.id].rewardedLevel)
        }
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
        for (let i = 0; i < 150; i++) {
            const x = Constants.MAP_SIZE * (0.05 + Math.random() * 0.95)
            const y = Constants.MAP_SIZE * (0.05 + Math.random() * 0.95)
            const id = shortid()
            this.trees[id] = new Tree(id, x, y)
        }
        for (let i = 0; i < 40; i++) {
            this.spawnEnemy()
        }
        for (let i = 0; i < 30; i++) {
            this.spawnEnemyWarrior()
        }
        this.spawnBoss()
    }

    spawnEnemy() {
        let t = Object.values(this.trees)
        let p = Object.values(this.players)
        let b = Object.values(this.boss)
        let e = Object.values(this.enemies)
        let ew = Object.values(this.enemies_warrior)
        // Нужно передать больший радиус из массива объектов
        let xy = spawn(p.concat(t, b, e, ew), Constants.BOSS_RADIUS, Constants.ENEMY_RADIUS, 0.2, 0.8, 0.05, 0.9)
        const id = shortid()

        let sum = 0
        p.forEach(item => {
            sum += item.level
        })
        if(p.length) {
            sum /= p.length
        }
        this.enemies[id] = new Enemy(id, xy.x, xy.y, Constants.PLAYER_SPEED * 0.8, this.randomInteger(1 , Math.min(2 + sum, 10)))
    }

    spawnEnemyWarrior() {
        let t = Object.values(this.trees)
        let p = Object.values(this.players)
        let b = Object.values(this.boss)
        let e = Object.values(this.enemies)
        let ew = Object.values(this.enemies_warrior)
        // Нужно передать больший радиус из массива объектов
        let xy = spawn(p.concat(t, b, e, ew), Constants.BOSS_RADIUS, Constants.PLAYER_RADIUS, 0.45, 0.55, 0.25, 0.7)
        const id = shortid()
        this.enemies_warrior[id] = new EnemyWarrior(id, xy.x, xy.y, Constants.PLAYER_SPEED, this.randomInteger(11, 20))
    }

    spawnBoss() {
        let t = Object.values(this.trees)
        let p = Object.values(this.players)
        let e = Object.values(this.enemies)
        let ew = Object.values(this.enemies_warrior)
        // Нужно передать больший радиус из массива объектов
        let xy = spawn(p.concat(t, e, ew), Constants.TREE_RADIUS, Constants.BOSS_RADIUS, 0.5, 0.5, 0.5, 0.5)
        const id = shortid()
        this.boss[id] = new Boss(id, xy.x, xy.y, Constants.PLAYER_SPEED * 1.2)
    }

    gameInfo() {
        return Object.keys(this.players).length
    }

    update() {
        let trees = Object.values(this.trees)
        let enemies = Object.values(this.enemies)
        let enemies_warrior = Object.values(this.enemies_warrior)
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
        Object.keys(this.players).forEach(playerID => {
            const player = this.players[playerID]
            const earlyX = player.x
            const earlyY = player.y
            const newBullet = player.update(dt)

            // if(player.needStun)
            //     player.setStun(3)
            if(player.needKick.need && !player.effects.stunned.yes)
                player.setKick(0.1)
            // Player to Player collision
            players = Object.values(this.players).filter( p => p !== player)
            let collided = circleToCircleWithReturn(player, [].concat(enemies, enemies_warrior, players))
            if (collided) {
                if(player.ifStun) {
                    collided.setStun(3)
                    collided.takeDamage(0, player.id)
                    player.ifStun = false
                }
                player.x = earlyX
                player.y = earlyY
            }

            if (circleToCircleLiteNew(player, [].concat(boss, trees))){
                player.x = earlyX
                player.y = earlyY
            }

            if((player.className === Constants.CLASSES.WARRIOR || player.className === Constants.CLASSES.FIGHTER
                || player.className === "warlord")
                && player.giveDamage === true) {
                let beaten = hitPlayer(player, players, Constants.PLAYER_RADIUS)
                let beatenEnemy = hitPlayer(player, enemies, Constants.ENEMY_RADIUS)
                let beatenEnemyWarrior = hitPlayer(player, enemies_warrior, Constants.PLAYER_RADIUS)
                let beatenBoss = hitPlayer(player, boss, Constants.BOSS_RADIUS)
                let canHit = player.listDamaged.find(element => {
                    if (element.id === beaten.id)
                        return true
                })
                if(beaten && !canHit) {
                    beaten.takeDamage(player.damage, player.id)
                    beaten.needKick.need = true
                    beaten.needKick.dir = Math.atan2(beaten.x - player.x, player.y - beaten.y)
                    beaten.needKick.power = player.className === Constants.CLASSES.WARLORD ? 300 : 200
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
                    beatenEnemy.needKick.power = player.className === Constants.CLASSES.WARLORD ? 400 : 300
                    player.listDamaged.push({id: beatenEnemy.id, count: player.attackSpeed})
                    player.onDealtDamage(0)

                }
                canHit = player.listDamaged.find(element => {
                    if (element.id === beatenEnemyWarrior.id)
                        return true
                })
                if(beatenEnemyWarrior && !canHit) {
                    beatenEnemyWarrior.takeDamage(player.damage, player.id)
                    beatenEnemyWarrior.needKick.need = true
                    beatenEnemyWarrior.needKick.dir = Math.atan2(beatenEnemyWarrior.x - player.x, player.y - beatenEnemyWarrior.y)
                    beatenEnemyWarrior.needKick.power = player.className === Constants.CLASSES.WARLORD ? 300 : 200
                    player.listDamaged.push({id: beatenEnemyWarrior.id, count: player.attackSpeed})
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
                applyCollisions(enemies_warrior, this.bullets, Constants.PLAYER_RADIUS),
                applyCollisions(boss, this.bullets, Constants.BOSS_RADIUS)
            )
        destroyedBullets.forEach(b => {
            if (this.players[b.parentID])
                this.players[b.parentID].onDealtDamage(Constants.BULLET_DAMAGE)
        })
        destroyedBullets = destroyedBullets.concat(applyCollisions(trees, this.bullets, Constants.TREE_RADIUS))
        this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet))

        boss = Object.values(this.boss)
        enemies_warrior = Object.values(this.enemies_warrior)

        // Обновление противников
        this.enemyUpdate(this.enemies, players, 200, enemies, dt,
            [].concat(players, enemies_warrior, trees, boss))

        // Убиты ли противники
        Object.keys(this.enemies).forEach(enemyId => {
            const enemy = this.enemies[enemyId]
            if (enemy.hp <= 0) {
                this.players[enemy.lh].onKill(enemy.level)
                delete this.enemies[enemyId]
                this.spawnEnemy()
            }
        })

        players = Object.values(this.players)
        enemies = Object.values(this.enemies)
        enemies_warrior = Object.values(this.enemies_warrior)

        // Обновление противников-войнов
        this.enemyUpdate(this.enemies_warrior, players, 300, enemies_warrior, dt,
            [].concat(players, enemies, trees, boss))

        Object.keys(this.enemies_warrior).forEach(enemyId => {
            const enemy_warrior = this.enemies_warrior[enemyId]
            if (enemy_warrior.hp <= 0) {
                this.players[enemy_warrior.lh].onKill(enemy_warrior.level)
                delete this.enemies_warrior[enemyId]
                this.spawnEnemyWarrior()
            }
        })

        players = Object.values(this.players)
        enemies = Object.values(this.enemies)
        enemies_warrior = Object.values(this.enemies_warrior)

        Object.keys(this.boss).forEach((enemyId) => {
            boss = this.boss[enemyId]
            const earlyX = boss.x
            const earlyY = boss.y
            let targetId = boss.chosenTarget(players, 1000, 500)
            if(!targetId) {
                boss.functionStack.forEach((item, i) => {
                    if(item.rec)
                        item.rec(item.recData)
                    boss.functionStack.splice(i, 1)
                })
                boss.promenade(dt)
                if (circleToCircleLiteNew(boss, [].concat(players, enemies, trees, enemies_warrior))){
                    boss.x = earlyX
                    boss.y = earlyY
                }
            }
            if (targetId) {
                let player = this.players[targetId]
                boss.toAttack = player.distanceTo(boss)<= 240
                boss.update(dt, player.x, player.y)

                let returnedPlayer = circleToCircleWithReturn(boss, players, Constants.BOSS_RADIUS, Constants.PLAYER_RADIUS)
                if (returnedPlayer) {
                    boss.x = earlyX
                    boss.y = earlyY
                    for (let i = 0; i < 5; i++) {
                        boss.takeDamage(0, returnedPlayer.id)
                    }
                }
                let destroyedTree = circleToCircleWithReturn(boss, trees, Constants.BOSS_RADIUS, Constants.TREE_RADIUS)
                if (destroyedTree)
                    delete this.trees[destroyedTree.id]

                let destroyedEnemies = circleToCircleWithReturn(boss, enemies, Constants.BOSS_RADIUS, Constants.ENEMY_RADIUS)
                if (destroyedEnemies) {
                    delete this.enemies[destroyedEnemies.id]
                    this.spawnEnemy()
                }

                let destroyedEW = circleToCircleWithReturn(boss, enemies_warrior, Constants.BOSS_RADIUS, Constants.PLAYER_RADIUS)
                if (destroyedEW) {
                    delete this.enemies_warrior[destroyedEW.id]
                    this.spawnEnemyWarrior()
                }


                if (boss.giveDamage === true) {
                    let beaten = hitPlayer(boss, players, Constants.PLAYER_RADIUS)
                    if (beaten) {
                        beaten.takeDamage(boss.damage, boss.id)
                        beaten.needKick.need = true
                        beaten.needKick.dir = Math.atan2(beaten.x - boss.x, boss.y - beaten.y)
                        beaten.needKick.power = 250

                    }
                }
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
        Object.keys(this.players).forEach(playerID => {
            const socket = this.sockets[playerID]
            const player = this.players[playerID]
            if (player.hp <= 0) {
                socket.emit(Constants.MSG_TYPES.GAME_OVER, "player.hp <= 0")
                if(this.players[player.lastHit])
                    this.players[player.lastHit].onKill(player.level)
                this.removePlayer(socket, true)
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
            Object.keys(this.players).forEach(playerID => {
                const socket = this.sockets[playerID]
                const player = this.players[playerID]
                socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard))
            })
            this.shouldSendUpdate = false
        } else {
            this.shouldSendUpdate = true
        }
    }

    enemyUpdate(object, players, agrDist, units, dt, othersUnits) {
        Object.keys(object).forEach(id => {
            const person = object[id]
            const earlyX = person.x
            const earlyY = person.y
            let unitsWom = units.filter( e => e !== person)

            let targetId = person.chosenTarget(players, 1000, agrDist)
            if(!targetId) {
                person.functionStack.forEach((item, i) => {
                    if(item.rec)
                        item.rec(item.recData)
                    person.functionStack.splice(i, 1)
                })
                person.promenade(dt)
                if (circleToCircleLiteNew(person, othersUnits.concat(unitsWom))){
                    person.x = earlyX
                    person.y = earlyY
                }
            }
            // if(enemy.needStun)
            //     enemy.setStun(3)
            if(person.needKick.need && !person.effects.stunned.yes)
                person.setKick(0.1)

            if (targetId) {
                let player = this.players[targetId]
                person.toAttack = player.distanceTo(person)<= 140
                person.update(dt, player.x, player.y)

                if (circleToCircleLiteNew(person, othersUnits.concat(unitsWom))){
                    // console.log(person.id, "OTKAT")
                    person.x = earlyX
                    person.y = earlyY
                }
                if (person.giveDamage === true) {
                    let beaten = hitPlayer(person, players, Constants.PLAYER_RADIUS)
                    if (beaten) {
                        beaten.takeDamage(person.damage, person.id)
                        beaten.needKick.need = true
                        beaten.needKick.dir = Math.atan2(beaten.x - person.x, person.y - beaten.y)
                        beaten.needKick.power = person.className === "ew" ? 200 : 100
                    }
                }
            }
        })
    }

    getLeaderboard() {
        let leaderBoard = Object.values(this.players)
            .sort((p1, p2) => p2.score - p1.score)
            .slice(0, 5)
            .map(p => ({username: p.username, score: Math.round(p.score), id: p.id}))
        if(leaderBoard[0]) {
            if (this.leader === null) {
                this.leader = this.players[leaderBoard[0].id]
                this.leader.leaderBuff = 1.5
            }
            if (this.leader !== this.players[leaderBoard[0].id]) {
                this.leader.leaderBuff = 1
                this.leader = this.players[leaderBoard[0].id]
                this.leader.leaderBuff = 1.5
            }
        }
        return leaderBoard
    }

    createUpdate(player, leaderboard) {
        const nearbyPlayers = Object.values(this.players).filter(
            p => p !== player && (p.distanceTo(player) <= 2000 || p.id === leaderboard[0].id),
        )
        const nearbyEnemies = Object.values(this.enemies).filter(
            e => e.distanceTo(player) <= 2000,
        )
        const nearbyEnemiesWarrior = Object.values(this.enemies_warrior).filter(
            ew => ew.distanceTo(player) <= 2000,
        )
        // const nearbyBoss = Object.values(this.boss).filter(
        //     boss => boss.distanceTo(player) <= Constants.MAP_SIZE / 2,
        // )
        const nearbyBullets = this.bullets.filter(
            b => b.distanceTo(player) <= 2000,
        )
        return {
            t: Date.now(),
            me: player.serializeForUpdate(),
            others: nearbyPlayers.map(p => p.serializeForUpdate()),
            bullets: nearbyBullets.map(b => b.serializeForUpdate()),
            trees: this.trees,
            enemies: nearbyEnemies.map(e => e.serializeForUpdate()),
            enemies_warrior: nearbyEnemiesWarrior.map(ew => ew.serializeForUpdate()),
            boss: Object.values(this.boss).map(boss => boss.serializeForUpdate()),
            leaderboard,
        }
    }
}

module.exports = Game
