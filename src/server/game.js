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
        this.trees = {}
        this.enemies = {}
        this.enemies_warrior = {}
        this.boss = {}
        this.bullets = []
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
        let ew = Object.values(this.enemies_warrior)
        // Может лучше радиус Босса?
        let xy = spawn(e.concat(t, b, p, ew), Constants.TREE_RADIUS, Constants.PLAYER_RADIUS)
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
        for (let i = 0; i < 10; i++) {
            this.spawnEnemy()
            // this.spawnEnemyWarrior()
        }
        // this.spawnBoss()
    }

    spawnEnemy() {
        let t = Object.values(this.trees)
        let p = Object.values(this.players)
        let b = Object.values(this.boss)
        let e = Object.values(this.enemies)
        let ew = Object.values(this.enemies_warrior)
        // Нужно передать больший радиус из массива объектов
        let xy = spawn(p.concat(t, b, e, ew), Constants.BOSS_RADIUS, Constants.ENEMY_RADIUS)
        const id = shortid()
        this.enemies[id] = new Enemy(id, xy.x, xy.y, Constants.PLAYER_SPEED * 0.6 * 0.2, this.randomInteger(1, 10))
    }

    spawnEnemyWarrior() {
        let t = Object.values(this.trees)
        let p = Object.values(this.players)
        let b = Object.values(this.boss)
        let e = Object.values(this.enemies)
        let ew = Object.values(this.enemies_warrior)
        // Нужно передать больший радиус из массива объектов
        let xy = spawn(p.concat(t, b, e, ew), Constants.BOSS_RADIUS, Constants.PLAYER_RADIUS)
        const id = shortid()
        this.enemies_warrior[id] = new EnemyWarrior(id, xy.x, xy.y, Constants.PLAYER_SPEED * 0.9 * 0.2, this.randomInteger(11, 20))
    }

    spawnBoss() {
        let t = Object.values(this.trees)
        let p = Object.values(this.players)
        let e = Object.values(this.enemies)
        let ew = Object.values(this.enemies_warrior)
        // Нужно передать больший радиус из массива объектов
        let xy = spawn(p.concat(t, e, ew), Constants.TREE_RADIUS, Constants.BOSS_RADIUS)
        const id = shortid()
        this.boss[id] = new Boss(id, xy.x, xy.y, Constants.PLAYER_SPEED * 0.1)
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
                    if (element.id === beatenEnemyWarrior.id)
                        return true
                })
                if(beatenEnemyWarrior && !canHit) {
                    beatenEnemyWarrior.takeDamage(player.damage, player.id)
                    beatenEnemyWarrior.needKick.need = true
                    beatenEnemyWarrior.needKick.dir = Math.atan2(beatenEnemyWarrior.x - player.x, player.y - beatenEnemyWarrior.y)
                    beatenEnemyWarrior.needKick.power = player.className === Constants.CLASSES.WARLORD ? 200 : 150
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
        this.enemyUpdate(this.enemies, players, 300, enemies, dt,
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
        this.enemyUpdate(this.enemies_warrior, players, 400, enemies_warrior, dt,
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

        // БОСС
        // Если заагрить БОССа лучником и между поставить война,
        // то война он атаковать не сможет, а к лучнику пройти
        Object.keys(this.boss).forEach((enemyId) => {
            boss = this.boss[enemyId]
            let targetId = boss.chosenTarget(players, 1000, 500)
            if (targetId) {
                const earlyX = boss.x
                const earlyY = boss.y

                let player = this.players[targetId]
                boss.toAttack = player.distanceTo(boss)<= 200
                boss.update(dt, player.x, player.y)

                if (
                    circleToCircleLite(boss, players, Constants.BOSS_RADIUS, Constants.PLAYER_RADIUS) ||
                    circleToCircleLite(boss, enemies_warrior, Constants.BOSS_RADIUS, Constants.PLAYER_RADIUS) ||
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
                person.toAttack = player.distanceTo(person)<= 100
                person.update(dt, player.x, player.y)

                if (circleToCircleLiteNew(person, othersUnits.concat(unitsWom))){
                    // console.log(person.id, "OTKAT")
                    person.x = earlyX
                    person.y = earlyY
                }
                if(person.giveDamage === true) {
                    let beaten = hitPlayer(person, players, Constants.PLAYER_RADIUS)
                    if (beaten)
                        beaten.takeDamage(person.damage, person.id)
                }
            }
        })
    }

    getLeaderboard() {
        return Object.values(this.players)
            .sort((p1, p2) => p2.score - p1.score)
            .slice(0, 5)
            .map(p => ({username: p.username, score: Math.round(p.score), id: p.id}))
    }

    createUpdate(player, leaderboard) {
        const nearbyPlayers = Object.values(this.players).filter(
            p => p !== player && (p.distanceTo(player) <= Constants.MAP_SIZE / 2 || p.id === leaderboard[0].id),
        )
        const nearbyEnemies = Object.values(this.enemies).filter(
            e => e.distanceTo(player) <= Constants.MAP_SIZE / 2,
        )
        const nearbyEnemiesWarrior = Object.values(this.enemies_warrior).filter(
            ew => ew.distanceTo(player) <= Constants.MAP_SIZE / 2,
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
            enemies_warrior: nearbyEnemiesWarrior.map(ew => ew.serializeForUpdate()),
            boss: Object.values(this.boss).map(boss => boss.serializeForUpdate()),
            leaderboard,
        }
    }
}

module.exports = Game
