import { Vec3 } from "cc";
import { ILevel } from ".";
import { CharacterStateCreate } from "../../fight/character/CharacterState";
import { LEVELTYPE } from "../../../common/enums";
import { HolLevelDetailOption } from "../../../prefab/HolLevelDetail";

// 关卡敌人
const enemyQueue: CharacterStateCreate[][] = [
  [null, {id: 'Orc', lv: 10, star: 1, equipment: [] }, {id: 'Orc', lv: 10, star: 1, equipment: [] }],
  [{id: 'Orc', lv: 10, star: 1, equipment: [] }, null, null],
  [null, null, {id: 'Orc', lv: 10, star: 1, equipment: [] }]
]

const map: string = '9'

const id: number = 4
// 关卡图标
const icon: string = 'image/map_enemy/orc/spriteFrame'

const name: string = '部落之战2'

const position: Vec3 = new Vec3(-43.3, -152.5, 0)

// {x: number, y: number} = { x: -115, y: 66 }

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
  levelDetail
}


export default level