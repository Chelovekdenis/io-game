const ASSET_NAMES = [
  'bullet.svg',
  'background.png',
  'background2.png',
  'fighter.svg',
  'warrior.svg',
  'archer.svg',
  'axe.png',
  'gun.png',
  'hand.png',
  'tree.svg',
  'enemy.svg',
  'back.svg',
  'back_swamp.svg',
]

const assets = {}

const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset))

function downloadAsset(assetName) {
  return new Promise(resolve => {
    const asset = new Image()
    asset.onload = () => {
      console.log(`Downloaded ${assetName}`)
      assets[assetName] = asset
      resolve()
    }
    asset.src = `/assets/${assetName}`
  })
}

export const downloadAssets = () => downloadPromise

export const getAsset = assetName => assets[assetName]
