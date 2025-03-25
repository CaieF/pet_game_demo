import { Vec3 } from "cc"
import { ILevel, ILevelDialog } from "."
import { GAMETYPE, LEVELTYPE } from "../../../common/enums"
import { HolLevelDetailOption } from "../../../prefab/HolLevelDetail"
import { CharacterStateCreate } from "../../fight/character/CharacterState"

const id: number = 8

// 关卡敌人
const enemyQueue: CharacterStateCreate[][] = [
  [{id: 'OrcArmored', lv: 20, star: 1, equipment: []}, {id: 'OrcElite', lv: 20, star: 1, equipment: [] }, {id: 'Orc', lv: 20, star: 1, equipment: [] }],
  [{id: 'OrcArmored', lv: 20, star: 1, equipment: [] }, null, {id: 'Orc', lv: 20, star: 1, equipment: [] }],
  [null, null, {id: 'Orc', lv: 20, star: 1, equipment: [] }]
]

// 关卡图标
const icon: string = "game/fight_entity/character/OrcElite/avatar/spriteFrame"

const name: string = '深入敌营'

const map: string = '9'

const position: Vec3 = new Vec3(-418, -28, 0)

const dialogs: ILevelDialog[] = [
    { character: {id: 'OrcElite', lv: 1, star: 1, equipment: [] }, dialog: '桀桀桀，来吧，让我用这烈焰斧刃将你们烧尽' },
    { character: {id: 'cat3', lv: 1, star: 1, equipment: [] }, dialog: '火虽热，却也蕴含能量转化之理，保持冷静' },
    { character: {id: 'catGril', lv: 1, star: 1, equipment: [] }, dialog: '利用火的无常，寻找机会反击。记住‘火者，变也’！' }
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