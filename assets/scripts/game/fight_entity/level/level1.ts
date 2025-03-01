import { SpriteFrame, Vec3 } from "cc";
import { ILevel, ILevelDialog } from ".";
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
const icon: string = 'image/map_enemy/orc/spriteFrame'

const name: string = '断桥之战'

const position: Vec3 = new Vec3(122, -227, 0)

const dialogs: ILevelDialog[] = [
   { character: {id: 'Orc', lv: 1, star: 1, equipment: [] }, dialog: '有入侵者 ！' },
   { character: {id: 'catGril', lv: 1, star: 1, equipment: [] }, dialog: '哪来的哥布林，去si吧 ' }
]

const level: ILevel = {
  enemyQueue,
  map,
  icon,
  name,
  position,
  dialogs
}



export default level