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

@RegisterCharacter({id: "OrcRider"})
class Character extends CharacterMetaState {

    name: string = "哥布林骑手"

    AnimationDir: string = "game/fight_entity/character/OrcRider"

    AnimationType: "DragonBones" | "Spine" = "DragonBones"

    AvatarPath: string = "game/fight_entity/character/OrcRider/avatar/spriteFrame"

    CharacterCamp: "ordinary" | "gold" | "tree" | "water" | "fire"|"stone" = "gold"

    CharacterQuality: number = 3

    AnimationScale: number = 6

    HpGrowth: number = 50

    AttackGrowth: number = 20

    DefenceGrowth: number = 10

    PierceGrowth: number = 20

    SpeedGrowth: number = 13

    Energy: number = 100

    AttackIntroduce: string = `
    
    攻击目标以目标同列的敌人造成 100% 攻击力的伤害,
    `.replace(/ /ig , "")

    PassiveIntroduceOne: string = `
    
    额外获得 20% 速度
    额外获得 20% 攻击力
    额外获得 20% 护甲穿透
    `.replace(/ /ig , "")

    PassiveIntroduceTwo: string = `
    获得30%免伤
    额外获得 20% 生命值
    额外获得 20% 攻击力
    `.replace(/ /ig , "")

    SkillIntroduce: string = `
    
    攻击目标以目标同列的敌人造成 150% 攻击力的伤害,
    `.replace(/ /ig , "")

    onCreateState(self: CharacterState): void {
        if (self.star >= 2) {
            self.speed *= 1.2
            self.attack *= 1.2
            self.pierce *= 1.2
        }
        if (self.star >= 3) {
            self.FreeInjuryPercent += 0.3
            self.maxHp *= 1.2
            self.attack *= 1.2
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
            // 获取同列的敌人
            enemys.forEach((e, i) => {
                if (e.coordinate === enemy.coordinate) return
                if (e.coordinate.col === enemy.coordinate.col)
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
            // 获取同列的敌人
            enemys.forEach((e, i) => {
                if (e.coordinate === enemy.coordinate) return
                if (e.coordinate.col === enemy.coordinate.col)
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
                    selfComponent.attack(self.attack * 2.0 , target.component)
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
            // 再次出手 20% 概率
            // if (Math.random() < (self.star >= 3 ? 0.4 : 0.2) ) {
            //     if (fightMap.isPlayAnimation) await self.component.showString("再次出手")
            //     await self.component.action()
            // }
            return
        }
    }
}
