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

@RegisterCharacter({id: "WereWolf"})
class Character extends CharacterMetaState {

    name: string = "蓝魂儿"

    AnimationDir: string = "game/fight_entity/character/WereWolf"

    AnimationType: "DragonBones" | "Spine" = "DragonBones"

    AvatarPath: string = "game/fight_entity/character/WereWolf/avatar/spriteFrame"

    CharacterCamp: "ordinary" | "gold" | "tree" | "water" | "fire"|"stone" = "gold"

    CharacterQuality: number = 4

    AnimationScale: number = 6

    HpGrowth: number = 55

    AttackGrowth: number = 20

    DefenceGrowth: number = 12

    PierceGrowth: number = 23

    SpeedGrowth: number = 15

    Energy: number = 60

    Critical: number = 20

    AttackIntroduce: string = `
    优先攻击最后排的敌人造成 100% 攻击力的伤害
    `.replace(/ /ig , "")

    PassiveIntroduceOne: string = `
    额外获得 25% 速度
    额外获得 25% 攻击力
    额外获得 25% 护甲穿透
    `.replace(/ /ig , "")

    PassiveIntroduceTwo: string = `
    获得 30% 暴击率
    额外获得 50% 攻击力
    `.replace(/ /ig , "")

    SkillIntroduce: string = `
    优先攻击最后排的敌人造成 200% 攻击力的伤害
    `.replace(/ /ig , "")

    onCreateState(self: CharacterState): void {
        if (self.star >= 2) {
            self.speed *= 1.25
            self.attack *= 1.25
            self.pierce *= 1.25
        }
        if (self.star >= 4) {
            self.critical += 30
            self.attack *= 1.50
        }
    }

    GetOnAttack(): (self: CharacterState, actionState: ActionState, fightMap: FightMap) => Promise<any> {
        return async (self: CharacterState, actionState: ActionState, fightMap: FightMap) => {
            const selfComponent = self.component
            const enemys = selfComponent.getEnimies(fightMap.allLiveCharacter)  
                .sort((a , b) => b.coordinate.col - a.coordinate.col)  // 获取所有敌人, 并按列排序
            const sameRowEnemies = enemys.filter(e => e.coordinate.row === selfComponent.coordinate.row)  // 获取与自己同一行上的敌人
            // 获取最后一排的敌人
            const lastRowEnemies = enemys.filter(e => e.coordinate.col === 3)
            // 获取最后一排而与自己同一行上的敌人
            const sameRowLastEnemies = lastRowEnemies.filter(e => e.coordinate.row === selfComponent.coordinate.row)
            let enemy;
            // 优先攻击最后排的敌人
            if (sameRowLastEnemies.length > 0) {
                enemy = sameRowLastEnemies.sort((a, b) => b.coordinate.col - a.coordinate.col)[0]
            } else if (lastRowEnemies.length > 0) {
                enemy = lastRowEnemies[0]
            } else if (sameRowEnemies.length > 0) {
                enemy = sameRowEnemies.sort((a, b) => b.coordinate.col - a.coordinate.col)[0]
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
                .sort((a , b) => b.coordinate.col - a.coordinate.col)  // 获取所有敌人, 并按列排序
            const sameRowEnemies = enemys.filter(e => e.coordinate.row === selfComponent.coordinate.row)  // 获取与自己同一行上的敌人
            // 获取最后一排的敌人
            const lastRowEnemies = enemys.filter(e => e.coordinate.col === 3)
            // 获取最后一排而与自己同一行上的敌人
            const sameRowLastEnemies = lastRowEnemies.filter(e => e.coordinate.row === selfComponent.coordinate.row)
            let enemy;
            // 优先攻击最后排的敌人
            if (sameRowLastEnemies.length > 0) {
                enemy = sameRowLastEnemies.sort((a, b) => b.coordinate.col - a.coordinate.col)[0]
            } else if (lastRowEnemies.length > 0) {
                enemy = lastRowEnemies[0]
            } else if (sameRowEnemies.length > 0) {
                enemy = sameRowEnemies.sort((a, b) => b.coordinate.col - a.coordinate.col)[0]
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
            return
        }
    }
}
