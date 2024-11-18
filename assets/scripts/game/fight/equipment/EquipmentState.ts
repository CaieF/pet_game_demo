import { BasicState } from "../BasicState"
import { CharacterState } from "../character/CharacterState"
import { EquipmentEnum } from "./EquipmentEnum"
import { EquipmentMetaState } from "./EquipmentMetaStata"


export type EquipmentStateCreate = {
    // id
    id: string
    // uuid
    uuid?: number
    // 等级
    lv: number
    // 品质
    quality: number
}

export class EquipmentState extends BasicState<EquipmentMetaState> {
    
    // 所属角色
    character: CharacterState

    // 最大生命值
    maxHp: number
    // 攻击力
    attack: number
    // 防御值
    defence: number
    // 速度
    speed: number
    // 治疗效率
    curePercent: number
    // 伤害率
    hurtPercent: number
    // 暴击
    critical: number
    // 格挡
    block: number

    // 构造器
    constructor(create: EquipmentStateCreate, character: CharacterState) {
        const meta = EquipmentEnum[create.id]
        super(meta)
        this.character = character

        this.maxHp = create.lv * meta.HpGrowth
        this.attack = create.lv * meta.AttackGrowth
        this.defence = create.lv * meta.DefenceGrowth
        this.speed = create.lv * meta.SpeedGrowth
        this.curePercent = meta.CurePercent
        this.hurtPercent = meta.HurtPercent
        this.critical = meta.Critical
        this.block = meta.Block
    }

    // 添加属性到角色
    AddPropertyToCharacter: (self: this) => Promise<any>
}