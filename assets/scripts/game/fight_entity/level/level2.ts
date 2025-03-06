import { Vec3 } from "cc";
import { ILevel } from ".";
import { CharacterStateCreate } from "../../fight/character/CharacterState";

// 关卡敌人
const enemyQueue: CharacterStateCreate[][] = [
  [null, {id: 'Orc', lv: 5, star: 1, equipment: [] }, null],
  [{id: 'Orc', lv: 5, star: 1, equipment: [] }, null, null],
  [null, null, {id: 'Orc', lv: 5, star: 1, equipment: [] }]
]

const id: number = 2
const map: string = '9'

// 关卡图标
const icon: string = 'image/map_enemy/orc/spriteFrame'

const name: string = '部落之战1'

const position: Vec3 = new Vec3(82, -58, 0)

// {x: number, y: number} = { x: -115, y: 66 }

const level: ILevel = {
  id,
  isUnlock: false,
  star: 0,
  enemyQueue,
  map,
  icon,
  name,
  position
}


export default level