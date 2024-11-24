import { FightMap } from "../../../scenes/Fight/Canvas/FightMap"
import { ActionState } from "../../fight/ActionState"
import { BasicState } from "../../fight/BasicState"
import { RegisterBuff } from "../../fight/buff/BuffEnum"
import { BuffMetaState } from "../../fight/buff/BuffMetaState"
import { BuffState } from "../../fight/buff/BuffState"


// 免伤buff
export type FreeInjuryOption = {
    // 添加的免伤值
    FreeInjuryPercent?: number
}

@RegisterBuff({id: 'freeinjury'})
export class FreeInjury extends BuffMetaState {
    
    // 眩晕buff
    name: string = '免伤'

    // buff 类型
    isDeBuff: boolean = false

    introduce: string = '增加100%免伤'

    buffIcon: string = 'game/fight_entity/buff/freeinjury/spriteFrame'

    // GetOnCreate(): (self: BuffState, option: FreeInjuryOption) => Promise<void> {
    //     return async (self: BuffState, option: FreeInjuryOption) => {
    //         // 增加免伤
    //         self.character.component.showString('免伤')
    //         self.character.FreeInjuryPercent += option.FreeInjuryPercent || 1
    //     }
    // }

    GetOnAddToCharacter(): (self: BuffState) => Promise<void> {
        return async (self: BuffState) => {
            // 增加免伤
            self.character.FreeInjuryPercent += 0.99
        }
    }

    GetOnDeleteFromCharacter(): (self: BuffState) => Promise<void> {
        return async (self: BuffState) => {
            // 恢复免伤
            self.character.FreeInjuryPercent -= 0.99
        }
    }


    // GetAfterAction(): (self: BasicState<any>, fightMap: FightMap) => Promise<any> {
    //     return async (self: BuffState, fightMap: FightMap) => {
    //         // 恢复免伤
    //         self.character.FreeInjuryPercent = 0
    //     }
    // }
}