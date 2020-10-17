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

    socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame)
    socket.on(Constants.MSG_TYPES.INPUT, handleInput)
    socket.on(Constants.MSG_TYPES.MOVEMENT, movement)
    socket.on(Constants.MSG_TYPES.MOUSE_CLICK, mouseClick)
    socket.on('disconnect', onDisconnect)
})

// Setup the Game
const game = new Game()

function joinGame(username) {
    game.addPlayer(this, username.slice(0,13))
}

function handleInput(dir) {
    game.handleInput(this, dir)
}

function onDisconnect() {
    game.removePlayer(this)
}

function movement(move) {
    game.ifMovement(this, move)
}

function mouseClick(click) {
    game.ifMouseClick(this, click)
}
