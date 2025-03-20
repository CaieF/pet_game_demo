import { Vec3 } from "cc"
import { ILevel, ILevelDialog } from "."
import { GAMETYPE, LEVELTYPE } from "../../../common/enums"
import { HolLevelDetailOption } from "../../../prefab/HolLevelDetail"

const id: number = 7

// 关卡图标
const icon: string = 'image/ui/IconSword/spriteFrame'

const name: string = '锻剑之屋'

const position: Vec3 = new Vec3(-531, -229, 0)

const dialogs: ILevelDialog[] = [
    { character: {id: 'cat2', lv: 1, star: 1, equipment: [] }, dialog: '后面的敌人越来越强了。我们在这休息一下吧' },
    { character: {id: 'cat1', lv: 1, star: 1, equipment: [] }, dialog: '刚好我的剑磨损，在这修复一下吧' },
    { character: {id: 'cat3', lv: 1, star: 1, equipment: [] }, dialog: '交给我吧，看我对火焰和“热学”的理解(*^_^*)' }
  ]  

const levelDetail: HolLevelDetailOption = {
  title: name,
  introduce: '利用热胀冷缩使剑到达合适的大小',
  position,
  icon,
}

const level: ILevel = {
    id,
    type: LEVELTYPE.GAME,
    icon,
    star: 0,
    isUnlock: false,
    name,
    position,
    dialogs,
    unlockPageId: [5, 6],
    levelDetail,
    gameType: GAMETYPE.FIREGAME
}

export default level