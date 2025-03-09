import { Vec3 } from "cc"
import { ILevel, ILevelDialog } from "."
import { LEVELTYPE } from "../../../common/enums"

const id: number = 2

// 关卡图标
const icon: string = 'image/map_icon/map_icon_lever/spriteFrame'

const name: string = '杠杆式过桥'

const position: Vec3 = new Vec3(120, -151, 0)

const dialogs: ILevelDialog[] = [
   { character: {id: 'cat1', lv: 1, star: 1, equipment: [] }, dialog: '这儿有个断桥，我们跳过去吧' },
   { character: {id: 'catGril', lv: 1, star: 1, equipment: [] }, dialog: '！！！！！Stop!！！！！！, 你们是成了精的猫咪，跳得过去, 我还只是个女孩，怎么可能跳得过去' },
   { character: {id: 'cat4', lv: 1, star: 1, equipment: [] }, dialog: '这有跟木棍，不如我们用杠杆原理想办法带你过去吧 ' },
]

const level: ILevel = {
    id,
    type: LEVELTYPE.GAME,
    icon,
    star: 0,
    isUnlock: false,
    name,
    position,
    dialogs,
    unlockPageId: 3,
}

export default level