const ASSET_NAMES = [
  'arrow.svg',
  'arrow_slow.svg',
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
  'enemy_bandit1.svg',
  'enemy_bandit2.svg',
  'enemy_bandit3.svg',
  'enemy_bandit4.svg',
  'enemy_bandit5.svg',
  'enemy_warrior1.svg',
  'enemy_warrior2.svg',
  'enemy_warrior3.svg',
  'enemy_warrior4.svg',
  'enemy_warrior5.svg',
  'crown.svg',

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
    // asset.src = `https://medievalwar.ru/assets/${assetName}`
    asset.src = `http://localhost:3001/assets/${assetName}`
  })
  // https://medievalwar.ru/assets/${assetName}
}

export const downloadAssets = () => downloadPromise

export const getAsset = assetName => assets[assetName]
