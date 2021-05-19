const ASSET_NAMES = [
  'arrow.svg',
  'arrow_slow.svg',
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
  'obsidian.svg',
  'human.svg',
  's1.svg',
  's2.svg',
  's3.svg',
  'kldsg.svg',

  'body_0.svg',
  'body_1.svg',
  'body_2.svg',
  'body_3.svg',
  'body_4.svg',
  'body_5.svg',
  'body_6.svg',
  'body_7.svg',
  'body_8.svg',

  'hands_0.svg',
  'hands_1.svg',
  'hands_2.svg',
  'hands_3.svg',
  'hands_4.svg',
  'hands_5.svg',
  'hands_6.svg',
  'hands_7.svg',
  'hands_8.svg',

  'arch_hands_0.svg',
  'arch_hands_1.svg',
  'arch_hands_2.svg',
  'arch_hands_3.svg',
  'arch_hands_4.svg',
  'arch_hands_5.svg',
  'arch_hands_6.svg',
  'arch_hands_7.svg',
  'arch_hands_8.svg',

  'fighter_weapon_0.svg',
  'fighter_weapon_1.svg',

  'warrior_weapon_0.svg',
  'warrior_weapon_1.svg',
  'warrior_weapon_2.svg',
  'warrior_weapon_3.svg',
  'warrior_weapon_4.svg',
  'warrior_weapon_5.svg',
  'warrior_weapon_6.svg',
  'warrior_weapon_7.svg',
  'warrior_weapon_8.svg',

  'warlord_weapon_0.svg',
  'warlord_weapon_1.svg',
  'warlord_weapon_2.svg',
  'warlord_weapon_3.svg',
  'warlord_weapon_4.svg',
  'warlord_weapon_5.svg',
  'warlord_weapon_6.svg',
  'warlord_weapon_7.svg',
  'warlord_weapon_8.svg',

  'paladin_weapon_0.svg',
  'paladin_weapon_1.svg',
  'paladin_weapon_2.svg',
  'paladin_weapon_3.svg',
  'paladin_weapon_4.svg',
  'paladin_weapon_5.svg',
  'paladin_weapon_6.svg',
  'paladin_weapon_7.svg',
  'paladin_weapon_8.svg',

  'duelist_weapon_0.svg',
  'duelist_weapon_1.svg',
  'duelist_weapon_2.svg',
  'duelist_weapon_3.svg',
  'duelist_weapon_4.svg',
  'duelist_weapon_5.svg',
  'duelist_weapon_6.svg',
  'duelist_weapon_7.svg',
  'duelist_weapon_8.svg',

  'knight_weapon_0.svg',
  'knight_weapon_1.svg',
  'knight_weapon_2.svg',
  'knight_weapon_3.svg',
  'knight_weapon_4.svg',
  'knight_weapon_5.svg',
  'knight_weapon_6.svg',
  'knight_weapon_7.svg',
  'knight_weapon_8.svg',

  'tree.svg',
  'fir_tree.svg',
  'bush.svg',

  'crossbowman_weapon_0.svg',

  'ranger_weapon_0.svg',

  'shooter_weapon_0.svg',

  'sniper_weapon_0.svg',
]

const assets = {}

const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset))

function downloadAsset(assetName) {
  return new Promise(resolve => {
    const asset = new Image()
    asset.onload = () => {
      // console.log(`Downloaded ${assetName}`)
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
