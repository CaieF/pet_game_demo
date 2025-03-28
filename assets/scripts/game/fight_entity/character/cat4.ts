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

@RegisterCharacter({id: "cat4"})
class Character extends CharacterMetaState {

    name: string = "三花猫"

    AnimationDir: string = "game/fight_entity/character/cat4"

    AnimationType: "DragonBones" | "Spine" = "DragonBones"

    AvatarPath: string = "game/fight_entity/character/cat4/avatar/spriteFrame"

    CharacterCamp: "ordinary" | "gold" | "tree" | "water" | "fire"|"stone" = "tree"

    CharacterQuality: number = 3

    AnimationScale: number = 6

    HpGrowth: number = 38

    AttackGrowth: number = 23

    DefenceGrowth: number = 6

    PierceGrowth: number = 26

    SpeedGrowth: number = 16

    Energy: number = 50

    AttackIntroduce: string = `
    攻击目标造成200% 伤害
    `.replace(/ /ig , "")

    PassiveIntroduceOne: string = `
    获得 20% 伤害率
    额外获得 20% 攻击力
    获得 20% 暴击率
    `.replace(/ /ig , "")

    PassiveIntroduceTwo: string = `
    额外获得 50% 攻击力
    `.replace(/ /ig , "")

    SkillIntroduce: string = `
    攻击一横排敌人，造成100% 伤害
    `.replace(/ /ig , "")

    onCreateState(self: CharacterState): void {
        if (self.star >= 2) {
            self.hurtPercent += 0.2
            self.attack *= 1.2
            self.critical += 20
        }
        if (self.star >= 3) {
            self.attack *= 1.5
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
                await selfComponent.attack(self.attack * 2.0 , target.component)
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
            // 获取所有敌人
            const enemys = selfComponent.getEnimies(fightMap.allLiveCharacter)
                .sort((a , b) => a.coordinate.col - b.coordinate.col)
            // 获取当前角色的行
            const selfRow = selfComponent.coordinate.row
            // 先筛选与自己同一行上的敌人
            const sameRowEnemies = enemys.filter(e => e.coordinate.row === selfRow)
            let enemy;
            if (sameRowEnemies.length > 0) {
                enemy = sameRowEnemies[0]
            } else {
                enemy = enemys[0]
            }
            if (!enemy) return
            actionState.targets.push(enemy.state)
            enemys.forEach((e , i) => {
                if (e.coordinate === enemy.coordinate) return
                if (e.coordinate.row === enemy.coordinate.row)
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
                await selfComponent.holAnimation.playAnimation("skill" , 1)
                selfComponent.holAnimation.playAnimation(selfComponent.defaultState)
            }
            // 造成伤害 ...
            for (const target of actionState.targets) {
                // 攻击
                fightMap.actionAwaitQueue.push(
                    selfComponent.attack(self.attack * 1.0 , target.component)
                )
            }
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
}
