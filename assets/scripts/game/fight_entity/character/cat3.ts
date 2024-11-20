import { math } from "cc";
import { GetCharacterCoordinatePosition, HolCharacter } from "../../../prefab/HolCharacter";
import { FightMap } from "../../../scenes/Fight/Canvas/FightMap";
import { util } from "../../../util/util";
import { ActionState } from "../../fight/ActionState";
import { BasicState } from "../../fight/BasicState";
import { BuffState } from "../../fight/buff/BuffState";
import { RegisterCharacter } from "../../fight/character/CharacterEnum";
import { CharacterMetaState } from "../../fight/character/CharacterMetaState";
import { CharacterState } from "../../fight/character/CharacterState";

@RegisterCharacter({id: "cat3"})
class Character extends CharacterMetaState {

    name: string = "黑白猫"

    AnimationDir: string = "game/fight_entity/character/cat3"

    AnimationType: "DragonBones" | "Spine" = "DragonBones"

    AvatarPath: string = "game/fight_entity/character/cat3/avatar/spriteFrame"

    CharacterCamp: "ordinary" | "gold" | "tree" | "water" | "fire"|"stone" = "fire"

    CharacterQuality: number = 3

    AnimationScale: number = 6

    HpGrowth: number = 45

    AttackGrowth: number = 20

    DefenceGrowth: number = 8

    PierceGrowth: number = 5

    SpeedGrowth: number = 10

    Energy: number = 80

    PassiveIntroduceOne: string = `
    
    额外获得 20% 速度
    额外获得 20% 攻击力
    额外获得 20% 护甲穿透
    攻击目标以及目标身后的敌人
    `.replace(/ /ig , "")

    PassiveIntroduceTwo: string = `
    
    额外获得 20% 生命值
    额外获得 20% 攻击力 
    `.replace(/ /ig , "")

    SkillIntroduce: string = `
    
    治疗友方所有队友 20% 生命值
    `.replace(/ /ig , "")

    OnCreateState(self: CharacterState): void {
        if (self.star >= 2) {
            self.speed *= 1.2
            self.attack *= 1.2
            self.pierce *= 1.2
        }
        if (self.star >= 4) {
            self.maxHp *= 1.2
            self.attack *= 1.2
        }
    }

    GetOnAttack(): (self: CharacterState, actionState: ActionState, fightMap: FightMap) => Promise<any> {
        return async (self: CharacterState, actionState: ActionState, fightMap: FightMap) => {
            const selfComponent = self.component
            // 获取敌人
            const enemys = selfComponent.getEnimies(fightMap.allLiveCharacter)
                .sort((a , b) => a.coordinate.col - b.coordinate.col)
            const enemy = enemys[0]
            if (!enemy) return
            actionState.targets.push(enemy.state)
            enemys.forEach((e , i) => {
                if (i === 0) return
                if (e.coordinate.row === enemy.coordinate.row && e.coordinate.col === enemy.coordinate.col + 1) 
                    // 获取与目标同一行并且在后面的敌人
                    actionState.targets.push(e.state)
            })
            // 播放动画
            if (fightMap.isPlayAnimation) {
                // 移动过去
                await util.subdry.moveNodeToPosition(selfComponent.node , {
                    moveCurve: true ,
                    targetPosition: GetCharacterCoordinatePosition(
                        enemy.direction , 
                        enemy.coordinate.row ,
                        enemy.coordinate.col ,
                        "attack"
                    ) ,
                    moveTimeScale: self.component.holAnimation.timeScale
                })
                await selfComponent.holAnimation.playAnimation("attack" , 1 , selfComponent.defaultState)
            }
            // 造成伤害
            for (const target of actionState.targets)
                await selfComponent.attack(self.attack * 1.0 , target.component)
            // 回到原位
            if (fightMap.isPlayAnimation) {
                await util.subdry.moveNodeToPosition(selfComponent.node , {
                    moveCurve: true ,
                    targetPosition: GetCharacterCoordinatePosition(
                        selfComponent.direction , 
                        selfComponent.coordinate.row ,
                        selfComponent.coordinate.col ,
                    ) ,
                    moveTimeScale: self.component.holAnimation.timeScale
                })
            }
            return
        }
    }

    GetOnSkill(): (self: CharacterState, actionState: ActionState, fightMap: FightMap) => Promise<any> {
        return async (self: CharacterState, actionState: ActionState, fightMap: FightMap) => {
            const selfComponent = self.component
            // 获取队友
            const friends = selfComponent.getFriends(fightMap.allLiveCharacter)
                .sort((a , b) => a.coordinate.col - b.coordinate.col)
            friends.forEach((friend, i) => {
                actionState.targets.push(friend.state)
            })
            // 播放动画
            if (fightMap.isPlayAnimation) {
                await selfComponent.holAnimation.playAnimation("skill" , 1)
                selfComponent.holAnimation.playAnimation(selfComponent.defaultState)
            }
            // 治疗队友
            for (const target of actionState.targets) {
                fightMap.actionAwaitQueue.push(
                    selfComponent.cure(target.maxHp * 0.2 , target.component)
                )
            }
            return
        }
    }
}
