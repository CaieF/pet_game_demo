import { Vec3 } from "cc";
import { ILevel } from ".";
import { CharacterStateCreate } from "../../fight/character/CharacterState";

// 关卡敌人
const enemyQueue: CharacterStateCreate[][] = [
  [null, {id: 'Orc', lv: 5, star: 1, equipment: [] }, null],
  [{id: 'Orc', lv: 5, star: 1, equipment: [] }, null, null],
  [null, null, {id: 'Orc', lv: 5, star: 1, equipment: [] }]
]

const map: string = '9'

// 关卡图标
const icon: string = 'image/map_icon/level2/spriteFrame'

const name: string = '哥布林石阵'

const position: Vec3 = new Vec3(-115, 66, 0)

// {x: number, y: number} = { x: -115, y: 66 }

const level: ILevel = {
  enemyQueue,
  map,
  icon,
  name,
  position
}


export default level