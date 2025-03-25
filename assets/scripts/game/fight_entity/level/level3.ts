import { Vec3 } from "cc";
import { ILevel, ILevelDialog } from ".";
import { CharacterStateCreate } from "../../fight/character/CharacterState";
import { LEVELTYPE } from "../../../common/enums";
import { HolLevelDetailOption } from "../../../prefab/HolLevelDetail";

// 关卡敌人
const enemyQueue: CharacterStateCreate[][] = [
  [null, {id: 'Orc', lv: 5, star: 1, equipment: [] }, null],
  [{id: 'Orc', lv: 5, star: 1, equipment: [] }, null, null],
  [null, null, {id: 'Orc', lv: 5, star: 1, equipment: [] }]
]

const id: number = 3
const map: string = '9'

// 关卡图标
const icon: string = 'image/map_enemy/orc/spriteFrame'

const name: string = '部落之战1'

const position: Vec3 = new Vec3(82, -58, 0)

// {x: number, y: number} = { x: -115, y: 66 }

const levelDetail: HolLevelDetailOption = {
  title: name,
  introduce: '击败所有的敌人获得胜利',
  enemyQueue: enemyQueue,
  position
}

const dialogs: ILevelDialog[] = [
  { character: {id: 'catGril', lv: 1, star: 1, equipment: [] }, dialog: '我们已经彻底进入敌人的部落了， 据罗盘显示，消失的五行之力就在这附近。' },
  { character: {id: 'cat3', lv: 1, star: 1, equipment: [] }, dialog: '这片山林地势复杂，我们还需小心行事' },
  { character: {id: 'cat1', lv: 1, star: 1, equipment: [] }, dialog: '那好像有更多的敌人！' },
  { character: {id: 'Orc', lv: 1, star: 1, equipment: [] }, dialog: '没想到有人能突破断桥的守卫，兄弟们，给我上 ' }
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
  levelDetail,
}


export default level