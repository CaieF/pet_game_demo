import { math } from "cc"
import { FightMap } from "../../../scenes/Fight/Canvas/FightMap"
import { ActionState } from "../../fight/ActionState"
import { BasicState } from "../../fight/BasicState"
import { RegisterBuff } from "../../fight/buff/BuffEnum"
import { BuffMetaState } from "../../fight/buff/BuffMetaState"
import { BuffState } from "../../fight/buff/BuffState"
import { RoundState } from "../../fight/RoundState"


@RegisterBuff({id: 'fire'})
export class VertigoBuff extends BuffMetaState {
    
    // 眩晕buff
    name: string = '烧伤'

    // buff 类型
    isDeBuff: boolean = true

    introduce: string = '每回合受到生命值 10% 伤害'

    buffIcon: string = 'game/fight_entity/buff/fire/spriteFrame'

    GetOnRoundEnd(): (self: BasicState<any>, roundState: RoundState, fightMap: FightMap) => Promise<void> {
        return async (self: BuffState, roundState: RoundState, fightMap: FightMap) => {
          if (self.character.hp > 0) {
            // 输出文字
            if (fightMap.isPlayAnimation) await self.character.component.showString('烧伤')
              // 受到伤害
            self.character.hp -= self.character.maxHp * 0.1
            if (fightMap.isPlayAnimation) await self.character.component.showNumber(-self.character.maxHp * 0.1, new math.Color(200, 200, 200, 255), 25)
            await self.character.component.updateUi()
          } 
        }
    }

}