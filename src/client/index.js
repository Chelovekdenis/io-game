import { connect, play, chosenServer, informationAboutServers } from './networking'
import { startRendering, stopRendering } from './render'
import { startCapturingInput, stopCapturingInput } from './input'
import { downloadAssets } from './assets'
import { initState } from './state'

// I'm using a tiny subset of Bootstrap here for convenience - there's some wasted CSS,
// but not much. In general, you should be careful using Bootstrap because it makes it
// easy to unnecessarily bloat your site.
import './css/bootstrap-reboot.css'
import './css/main.css'

const playMenu = document.getElementById('play-menu')
const playButton = document.getElementById('play-button')
const usernameInput = document.getElementById('username-input')
const serverList = document.getElementById('server_list')


Promise.all([
  downloadAssets(),
  connect(onGameOver),
]).then(() => {
  informationAboutServers()
  playMenu.classList.remove('hidden')
  usernameInput.focus()
  playButton.onclick = () => {
    let value = serverList.options[serverList.selectedIndex].value // Значение value для выбранного option
    chosenServer(value)
    // Play!
    play(usernameInput.value)
    playMenu.classList.add('hidden')
    initState()
    startCapturingInput()
    startRendering()
  }
}).catch(console.error)

function onGameOver() {
  console.log("OnGameOver")
  $('#server_list').find('option').remove(); //удаление старых данных
  informationAboutServers()
  stopCapturingInput()
  stopRendering()
  playMenu.classList.remove('hidden')
}
