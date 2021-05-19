import {getAsset} from "../assets"
const canvas = document.getElementById('game-canvas')
const context = canvas.getContext('2d')

export function renderObjects(me, trees) {
    const backgroundX =  canvas.width / 2 - me.x
    const backgroundY =  canvas.height / 2 - me.y
    Object.keys(trees).forEach(treeId => {
        const tree = trees[treeId]
        if(tree.className === "bush")
            context.drawImage(
                getAsset(`bush.svg`),
                backgroundX + tree.x - 200,
                backgroundY + tree.y - 200,
                400,
                400
            )
        else
            context.drawImage(
                getAsset(`${tree.className}.svg`),
                backgroundX + tree.x - 300,
                backgroundY + tree.y - 300,
                600,
                600
            )
    })
}
