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

@RegisterCharacter({id: "OrcArmored"})
class Character extends CharacterMetaState {

    name: string = "哥布林盾兵"

    AnimationDir: string = "game/fight_entity/character/OrcArmored"

    AnimationType: "DragonBones" | "Spine" = "DragonBones"

    AvatarPath: string = "game/fight_entity/character/OrcArmored/avatar/spriteFrame"

    CharacterCamp: "ordinary" | "gold" | "tree" | "water" | "fire"|"stone" = "stone"

    CharacterQuality: number = 2

    AnimationScale: number = 6

    HpGrowth: number = 55

    AttackGrowth: number = 12

    DefenceGrowth: number = 15

    PierceGrowth: number = 7

    SpeedGrowth: number = 9

    Energy: number = 40

    AttackIntroduce: string = `
    对敌人造成 100 % 的伤害
    `

    PassiveIntroduceOne: string = `
    
    额外获得 20% 生命值
    额外获得 20% 防御值
    获得 50% 免伤值
    `.replace(/ /ig , "")

    PassiveIntroduceTwo: string = `
    
    额外获得 30% 生命值
    `.replace(/ /ig , "")

    SkillIntroduce: string = `
    
    对敌人造成120%攻击力的伤害
    并且眩晕敌人1回合
    `.replace(/ /ig , "")

    onCreateState(self: CharacterState): void {
        if (self.star >= 1) {
            self.maxHp *= 1.2
            self.defence *= 1.2
            self.FreeInjuryPercent += 0.5
        }
        if (self.star >= 2) {
            self.maxHp *= 1.5
        }
    }

    GetOnAttack(): (self: CharacterState, actionState: ActionState, fightMap: FightMap) => Promise<any> {
        return async (self: CharacterState, actionState: ActionState, fightMap: FightMap) => {
            const selfComponent = self.component
            const enemys = selfComponent.getEnimies(fightMap.allLiveCharacter)  
                .sort((a , b) => a.coordinate.col - b.coordinate.col)  // 获取所有敌人, 并按列排序
            const sameRowEnemies = enemys.filter(e => e.coordinate.row === selfComponent.coordinate.row)  // 获取与自己同一行上的敌人
            let enemy;
            // 优先攻击同一行上的敌人, 若没有则攻击第一排敌人
            if (sameRowEnemies.length > 0) {
                enemy = sameRowEnemies.sort((a, b) => a.coordinate.col - b.coordinate.col)[0]
            } else {
                enemy = enemys[0]
            }
            if (!enemy) return
            actionState.targets.push(enemy.state)
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
            const enemys = selfComponent.getEnimies(fightMap.allLiveCharacter)  
                .sort((a , b) => a.coordinate.col - b.coordinate.col)  // 获取所有敌人, 并按列排序
            const sameRowEnemies = enemys.filter(e => e.coordinate.row === selfComponent.coordinate.row)  // 获取与自己同一行上的敌人
            let enemy;
            // 优先攻击同一行上的敌人, 若没有则攻击第一排敌人
            if (sameRowEnemies.length > 0) {
                enemy = sameRowEnemies.sort((a, b) => a.coordinate.col - b.coordinate.col)[0]
            } else {
                enemy = enemys[0]
            }
            if (!enemy) return
            actionState.targets.push(enemy.state)
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
                await selfComponent.holAnimation.playAnimation("skill" , 1)
                selfComponent.holAnimation.playAnimation(selfComponent.defaultState)
            }
            // 造成伤害 ...
            for (const target of actionState.targets) {
                // 添加眩晕状态
                const vertigo = new BuffState({id: "vertigo"})
                await target.component.addBuff(selfComponent , vertigo)
                // 两回合后去掉
                fightMap.listenRoundEvent(1 , () => target.component.deleteBuff(vertigo) )
                // 攻击
                fightMap.actionAwaitQueue.push(
                    selfComponent.attack(self.attack * 1.2 , target.component)
                )
            }
            // 回到原位
            if (fightMap.isPlayAnimation) 
                await util.subdry.moveNodeToPosition(selfComponent.node , {
                    moveCurve: true ,
                    targetPosition: GetCharacterCoordinatePosition(
                        selfComponent.direction , 
                        selfComponent.coordinate.row ,
                        selfComponent.coordinate.col ,
                    ) ,
                    moveTimeScale: self.component.holAnimation.timeScale
                })
            return
        }
    }
}
