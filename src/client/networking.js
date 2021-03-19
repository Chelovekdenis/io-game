import io from 'socket.io-client'
import { throttle } from 'throttle-debounce'
import { processGameUpdate, setNewSkillPoint, setNewClassPoint } from './state'

const Constants = require('../shared/constants')

console.log("net")
const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws'
console.log(socketProtocol)
// const socket = io(`${socketProtocol}://84.201.139.216:3001`, { reconnection: false })
const socket = io(`wss://medievalwar.ru`, { reconnection: false })
// const socket = io(`${socketProtocol}:medievalwar.ru`, { reconnection: false })
const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!')
    resolve()
  })
})

export const connect = onGameOver => (
  connectedPromise.then(() => {
    // Register callbacks
    socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate)
    socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver)
    socket.on(Constants.MSG_TYPES.SKILL_POINTS, (data) => setNewSkillPoint(data))
    socket.on("class_point", (data) => setNewClassPoint(data))
    socket.on("number_of_players", serversInfo => {
        const serverList = document.getElementById('server_list')
        for (let i = 0; i < serversInfo.length; i++) {
            let newOption = new Option(`Server ${i+1} - ${serversInfo[i]}/${Constants.GAME_MAX_PLAYER}`, `${i}`)
            serverList.append(newOption)
        }
    })
    socket.on('disconnect', () => {
      console.log('Disconnected from server.')
      document.getElementById('disconnect-modal').classList.remove('hidden')
      document.getElementById('reconnect-button').onclick = () => {
        window.location.reload()
      }
    })
  })
)

export const play = username => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username)
}

export const updateDirection = throttle(5, dir => {
  socket.emit(Constants.MSG_TYPES.INPUT, dir)
})

export const moveEmit = movement => {
  socket.emit(Constants.MSG_TYPES.MOVEMENT, movement)
}

export const mouseClickEmit = click => {
  socket.emit(Constants.MSG_TYPES.MOUSE_CLICK, click)
}

export const quickBarItemEmit = item => {
    socket.emit("quick_bar_item", item)
}

export const chosenSkill = skill => {
    socket.emit("chosen_skill", skill)
}

export const chosenClass = c => {
    socket.emit("chosen_class", c)
}

export const chosenServer = num => {
    socket.emit("server", num)
}

export const informationAboutServers = () => {
    socket.emit("servers_info")
}




