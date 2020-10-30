const express = require('express')
const socket = require('socket.io')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')

const Constants = require('../shared/constants')
const Game = require('./game')
const webpackConfig = require('../../webpack.dev.js')

const app = express()

app.use(express.static('public'))

if (process.env.NODE_ENV === 'development') {
    const compiler = webpack(webpackConfig)
    app.use(webpackDevMiddleware(compiler))
} else {
    app.use(express.static('dist'))
}

const port = process.env.PORT || 3000
const server = app.listen(port)
console.log(`Server listening on port ${port}`)

const io = socket(server)


io.on('connection', socket => {
    console.log('Player connected!', socket.id)

    socket.on("server", num => {
        socket.gameNum = num
    })

    socket.on("servers_info", () => {
        let information = []
        games.forEach(game => {
            information.push(game.gameInfo())
        })
        const reducer = (accumulator, currentValue) => accumulator + currentValue
        // Добовление сервера если игроков на всех сервера максимум игроков
        if(information.reduce(reducer) >= games.length * Constants.GAME_MAX_PLAYER - 1) {
            games.push(new Game())
            games[games.length-1].initGame()
        }

        socket.emit("number_of_players", information)
    })

    socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame)
    socket.on(Constants.MSG_TYPES.INPUT, handleInput)
    socket.on(Constants.MSG_TYPES.MOVEMENT, movement)
    socket.on(Constants.MSG_TYPES.MOUSE_CLICK, mouseClick)
    socket.on("chosen_skill", chosenSkill)
    socket.on("quick_bar_item", quickBarItem)
    socket.on('disconnect', onDisconnect)
})

// Setup the Game
let games = []
games.push(new Game())
games[0].initGame()



function joinGame(username) {
    games[this.gameNum].addPlayer(this, username.slice(0,13) || "user123")
}

function handleInput(dir) {
    games[this.gameNum].handleInput(this, dir)
}

function onDisconnect() {
    if (this.gameNum) games[this.gameNum].removePlayer(this)
}

function movement(move) {
    games[this.gameNum].ifMovement(this, move)
}

function mouseClick(click) {
    games[this.gameNum].ifMouseClick(this, click)
}

function quickBarItem(item) {
    games[this.gameNum].ifQuickBar(this, item)
}

function chosenSkill(skill) {
    games[this.gameNum].ifChosenSkill(this, skill)
}
