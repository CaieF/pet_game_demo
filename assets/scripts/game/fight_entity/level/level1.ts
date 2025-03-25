import { SpriteFrame, Vec3 } from "cc";
import { ILevel, ILevelDialog } from ".";
import { CharacterStateCreate } from "../../fight/character/CharacterState";
import { util } from "../../../util/util";
import { LEVELTYPE } from "../../../common/enums";
import { HolLevelDetailOption } from "../../../prefab/HolLevelDetail";

// 关卡敌人
const enemyQueue: CharacterStateCreate[][] = [
  [{id: 'Orc', lv: 1, star: 1, equipment: [] }, null, null],
  [null, {id: 'Orc', lv: 1, star: 1, equipment: [] }, null],
  [null, null, {id: 'Orc', lv: 1, star: 1, equipment: [] }]
]

const id: number = 1
// 关卡地图
const map: string = '9'
//const map: SpriteFrame = await util.bundle.load('image/fightMap/9', SpriteFrame)

// 关卡图标
const icon: string = 'image/map_enemy/orc/spriteFrame'

const name: string = '断桥之战'

const position: Vec3 = new Vec3(122, -227, 0)

const dialogs: ILevelDialog[] = [
  { character: {id: 'cat1', lv: 1, star: 1, equipment: [] }, dialog: '看那弥漫的山气，仿佛天地未分，正如‘混沌初开’。' },
  { character: {id: 'cat2', lv: 1, star: 1, equipment: [] }, dialog: '古人说‘阴阳未判，万物生于混沌’，我们必须小心行事。' },
  { character: {id: 'cat4', lv: 1, star: 1, equipment: [] }, dialog: '小心！那边的断桥似乎有敌人！' },
  { character: {id: 'Orc', lv: 1, star: 1, equipment: [] }, dialog: '有不明入侵者，做好战斗准备！ ' }
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
  isUnlock: true,
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