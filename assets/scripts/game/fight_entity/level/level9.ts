import { Vec3 } from "cc"
import { ILevel, ILevelDialog } from "."
import { GAMETYPE, LEVELTYPE } from "../../../common/enums"
import { HolLevelDetailOption } from "../../../prefab/HolLevelDetail"
import { CharacterStateCreate } from "../../fight/character/CharacterState"

const id: number = 8

// 关卡敌人
const enemyQueue: CharacterStateCreate[][] = [
  [{id: 'OrcArmored', lv: 25, star: 1, equipment: []}, {id: 'OrcElite', lv: 25, star: 1, equipment: [] }, {id: 'Orc', lv: 25, star: 1, equipment: [] }],
  [null, {id: 'OrcRider', lv: 25, star: 1, equipment: [] }, null],
  [{id: 'OrcArmored', lv: 25, star: 1, equipment: [] }, {id: 'OrcElite', lv: 25, star: 1, equipment: [] }, {id: 'Orc', lv: 25, star: 1, equipment: [] }]
]

// 关卡图标
const icon: string = "game/fight_entity/character/OrcRider/avatar/spriteFrame"

const name: string = '哥布林精锐'

const map: string = '9'

const position: Vec3 = new Vec3(-210, 140, 0)

const dialogs: ILevelDialog[] = [
    { character: {id: 'OrcRider', lv: 1, star: 1, equipment: [] }, dialog: '追击！别给他们喘息之机！' },
    { character: {id: 'cat2', lv: 1, star: 1, equipment: [] }, dialog: '他们的攻势快如风暴，我们该怎么应对！' },
    { character: {id: 'cat4', lv: 1, star: 1, equipment: [] }, dialog: '风力无形，利用敌人的急速让他们露出破绽！' }
  ]  

const levelDetail: HolLevelDetailOption = {
  title: name,
  introduce: '击败所有的敌人获得胜利',
  enemyQueue: enemyQueue,
  position
}

const level: ILevel = {
  id,
  type: LEVELTYPE.FIGHT,
  isUnlock: false,
  star: 0,
  enemyQueue,
  map,
  icon,
  name,
  position,
  dialogs,
  levelDetail
}

export default level