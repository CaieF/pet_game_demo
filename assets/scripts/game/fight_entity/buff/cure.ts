import { math } from "cc"
import { FightMap } from "../../../scenes/Fight/Canvas/FightMap"
import { ActionState } from "../../fight/ActionState"
import { BasicState } from "../../fight/BasicState"
import { RegisterBuff } from "../../fight/buff/BuffEnum"
import { BuffMetaState } from "../../fight/buff/BuffMetaState"
import { BuffState } from "../../fight/buff/BuffState"
import { RoundState } from "../../fight/RoundState"


// 免伤buff
export type FreeInjuryOption = {
    // 添加的免伤值
    FreeInjuryPercent?: number
}

@RegisterBuff({id: 'cure'})
export class FreeInjury extends BuffMetaState {
    
    // 眩晕buff
    name: string = '守护'

    // buff 类型
    isDeBuff: boolean = false

    introduce: string = '每回合恢复自身 10% 生命值， 同时获得10%的免伤'

    buffIcon: string = 'game/fight_entity/buff/cure/spriteFrame'


    GetOnRoundEnd(): (self: BasicState<any>, roundState: RoundState, fightMap: FightMap) => Promise<void> {
        return async (self: BuffState, roundState: RoundState, fightMap: FightMap) => {
          if (self.character.hp > 0) {
            // 输出文字
            if (fightMap.isPlayAnimation) await self.character.component.showString('恢复')
            // 恢复生命
            await self.character.component.cure(self.character.maxHp * 0.1, self.character.component)
            // self.character.hp += self.character.maxHp * 0.2 * self.character.curePercent
            // if (fightMap.isPlayAnimation) await self.character.component.showNumber(+self.character.maxHp * 0.2, new math.Color(50, 220, 50, 255), 25)
            // await self.character.component.updateUi()
          } 
        }
    }

    GetOnAddToCharacter(): (self: BuffState) => Promise<void> {
        return async (self: BuffState) => {
            // 增加免伤
            self.character.FreeInjuryPercent += 0.20
        }
    }

    GetOnDeleteFromCharacter(): (self: BuffState) => Promise<void> {
        return async (self: BuffState) => {
            // 恢复免伤
            self.character.FreeInjuryPercent -= 0.20
        }
    }
}