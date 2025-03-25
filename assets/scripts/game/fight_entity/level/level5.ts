import { Vec3 } from "cc";
import { ILevel, ILevelDialog } from ".";
import { CharacterStateCreate } from "../../fight/character/CharacterState";
import { LEVELTYPE } from "../../../common/enums";
import { HolLevelDetailOption } from "../../../prefab/HolLevelDetail";

// 关卡敌人
const enemyQueue: CharacterStateCreate[][] = [
  [{id: 'OrcArmored', lv: 15, star: 1, equipment: []}, {id: 'Orc', lv: 15, star: 1, equipment: [] }, {id: 'Orc', lv: 15, star: 1, equipment: [] }],
  [{id: 'OrcArmored', lv: 15, star: 1, equipment: [] }, null, null],
  [null, null, {id: 'Orc', lv: 15, star: 1, equipment: [] }]
]

const map: string = '9'

const id: number = 5
// 关卡图标

const icon: string = "game/fight_entity/character/OrcArmored/avatar/spriteFrame"

const name: string = '部落之战3'

const position: Vec3 = new Vec3(-165, -256, 0)

// {x: number, y: number} = { x: -115, y: 66 }

const levelDetail: HolLevelDetailOption = {
  title: name,
  introduce: '击败所有的敌人获得胜利',
  enemyQueue: enemyQueue,
  position
}

const dialogs: ILevelDialog[] = [
  { character: {id: 'cat1', lv: 1, star: 1, equipment: [] }, dialog: '怎么办，敌人的盾兵越来越多，我的剑快砍不动了' },
  { character: {id: 'cat4', lv: 1, star: 1, equipment: [] }, dialog: '橘猫，保护我，看我集中火力，打破这坚固的阵线' },
]

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