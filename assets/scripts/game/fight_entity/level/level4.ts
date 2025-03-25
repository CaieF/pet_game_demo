import { Vec3 } from "cc";
import { ILevel, ILevelDialog } from ".";
import { CharacterStateCreate } from "../../fight/character/CharacterState";
import { LEVELTYPE } from "../../../common/enums";
import { HolLevelDetailOption } from "../../../prefab/HolLevelDetail";

// 关卡敌人
const enemyQueue: CharacterStateCreate[][] = [
  [null, {id: 'OrcArmored', lv: 10, star: 1, equipment: [] }, {id: 'Orc', lv: 10, star: 1, equipment: [] }],
  [{id: 'Orc', lv: 10, star: 1, equipment: [] }, null, null],
  [null, null, {id: 'Orc', lv: 10, star: 1, equipment: [] }]
]

const map: string = '9'

const id: number = 4
// 关卡图标
const icon: string = "game/fight_entity/character/OrcArmored/avatar/spriteFrame"

const name: string = '部落之战2'

const position: Vec3 = new Vec3(-43.3, -152.5, 0)

// {x: number, y: number} = { x: -115, y: 66 }

const levelDetail: HolLevelDetailOption = {
  title: name,
  introduce: '击败所有的敌人获得胜利',
  enemyQueue: enemyQueue,
  position
}

const dialogs: ILevelDialog[] = [
  { character: {id: 'OrcArmored', lv: 1, star: 1, equipment: [] }, dialog: '谁敢侵犯我们的防线？今日便让你们尝尝盾之威！' },
  { character: {id: 'catGril', lv: 1, star: 1, equipment: [] }, dialog: '看那家伙的盾牌，如同凝固的金刚，坚不可摧' },
  { character: {id: 'cat3', lv: 1, star: 1, equipment: [] }, dialog: '但‘以柔克刚’总有破绽，我们寻找看敌人阵法的破绽，优先攻击弱势的敌人吧' },
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