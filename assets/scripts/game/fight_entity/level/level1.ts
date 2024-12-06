import { SpriteFrame, Vec3 } from "cc";
import { ILevel } from ".";
import { CharacterStateCreate } from "../../fight/character/CharacterState";
import { util } from "../../../util/util";

// 关卡敌人
const enemyQueue: CharacterStateCreate[][] = [
  [{id: 'Orc', lv: 1, star: 1, equipment: [] }, null, null],
  [null, {id: 'Orc', lv: 1, star: 1, equipment: [] }, null],
  [null, null, {id: 'Orc', lv: 1, star: 1, equipment: [] }]
]

// 关卡地图
const map: string = '9'
//const map: SpriteFrame = await util.bundle.load('image/fightMap/9', SpriteFrame)

// 关卡图标
const icon: string = 'image/map_icon/level1/spriteFrame'

const name: string = '哥布林村口'

const position: Vec3 = new Vec3(-100, -100, 0)

const level: ILevel = {
  enemyQueue,
  map,
  icon,
  name,
  position
}



export default level