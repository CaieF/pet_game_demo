import { Vec3 } from "cc"
import { ILevel, ILevelDialog } from "."
import { GAMETYPE, LEVELTYPE } from "../../../common/enums"
import { HolLevelDetailOption } from "../../../prefab/HolLevelDetail"

const id: number = 6

// 关卡图标
const icon: string = 'image/map_icon/map_icon_river/spriteFrame'

const name: string = '水利工程'

const position: Vec3 = new Vec3(-325, -205, 0)

const dialogs: ILevelDialog[] = [
   { character: {id: 'cat1', lv: 1, star: 1, equipment: [] }, dialog: '这又有一条河，猫姐你要怎么过去' },
   { character: {id: 'catGril', lv: 1, star: 1, equipment: [] }, dialog: '这有一个木筏，但是水流是往下的' },
   { character: {id: 'cat4', lv: 1, star: 1, equipment: [] }, dialog: '橘猫你挖个水渠改变下河流流向，让木筏过来吧 ' },
   { character: {id: 'cat3', lv: 1, star: 1, equipment: [] }, dialog: '挖好水渠了？我施展下魔法，让里面的水流动起来'},
   { character: {id: 'cat2', lv: 1, star: 1, equipment: [] }, dialog: '/(ㄒoㄒ)/~~ 我水渠方向还没有调整好，你就放水'}
]

const levelDetail: HolLevelDetailOption = {
  title: name,
  introduce: '调整水渠方向以改变木筏流向',
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
    unlockPageId: [4],
    levelDetail,
    gameType: GAMETYPE.RIVER
}

export default level