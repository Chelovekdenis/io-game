import {getAsset} from "../assets"
const Constants = require('../../shared/constants')

export function renderBackground(context, canvas, x, y) {
    const HALF_MAP_SIZE = Constants.MAP_SIZE / 2

    const backgroundX = HALF_MAP_SIZE - x + canvas.width / 2
    const backgroundY = HALF_MAP_SIZE - y + canvas.height / 2

    context.fillStyle = "rgba(51, 46, 61, 0.7)"
    context.fillRect(0, 0, canvas.width, canvas.height)

    for(let i = 0; i < 4; i++) {
        let y = -Constants.MAP_SIZE + 1000*i
        for(let j = 0; j < 4; j++) {
            let x = -Constants.MAP_SIZE + 1000*j
            if(y === -2000 || x === -2000 || y === 1000 || x === 1000) {
                context.drawImage(
                    getAsset('back_swamp.svg'),
                    backgroundX - x - 1000,
                    backgroundY - y - 1000,
                    1000,
                    1000,
                )
            } else {
                context.drawImage(
                    getAsset('back.svg'),
                    backgroundX - x - 1000,
                    backgroundY - y - 1000,
                    1000,
                    1000,
                )
            }
        }
    }
}
