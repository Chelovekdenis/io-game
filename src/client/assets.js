const ASSET_NAMES = [
  'arrow.svg',
  'tree.svg',
  'enemy.svg',
  'back.svg',
  'back_swamp.svg',
  'boss.svg',
  'fighter1.svg',
  'fighter2.svg',
  'warrior1.svg',
  'archer1.svg',
  'warrior2.svg',
  'archer2.svg',
  'warrior3.svg',
  'archer3.svg',
  'warrior4.svg',
  'archer4.svg',
  'warrior5.svg',
  'archer5.svg',
  'sniper1.svg',
  'warlord1.svg',
  'sniper2.svg',
  'warlord2.svg',
  'sniper3.svg',
  'warlord3.svg',
  'sniper4.svg',
  'warlord4.svg',
  'sniper5.svg',
  'warlord5.svg',
  'agl.svg',
  'atkspd.svg',
  'damage.svg',
  'defense.svg',
  'int.svg',
  'speed.svg',
  'str.svg',

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
