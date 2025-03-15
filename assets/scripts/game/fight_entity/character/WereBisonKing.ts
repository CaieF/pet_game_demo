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

@RegisterCharacter({id: "WereBisonKing"})
class Character extends CharacterMetaState {

    name: string = "牛魔王"

    AnimationDir: string = "game/fight_entity/character/WereBisonKing"

    AnimationType: "DragonBones" | "Spine" = "DragonBones"

    AvatarPath: string = "game/fight_entity/character/WereBisonKing/avatar/spriteFrame"

    CharacterCamp: "ordinary" | "gold" | "tree" | "water" | "fire"|"stone" = "fire"

    CharacterQuality: number = 5

    AnimationScale: number = 5

    AnimationPosition: { x: number; y: number; } = { x: 0, y: 80};

    HpGrowth: number = 80

    AttackGrowth: number = 20

    DefenceGrowth: number = 17

    PierceGrowth: number = 25

    SpeedGrowth: number = 16

    Block: number = 20;

    Energy: number = 100

    AttackIntroduce: string = `
    无视敌人防御以及免伤值
    对敌人造成 100 % 的伤害
    `.replace(/ /ig , "")

    PassiveIntroduceOne: string = `
    
    额外获得 25% 生命值
    额外获得 25% 攻击力
    额外获得 25% 防御值
    `.replace(/ /ig , "")

    PassiveIntroduceTwo: string = `
    获得 25% 伤害率
    获得 25% 暴击率
    额外获得 25% 速度
    `.replace(/ /ig , "")

    SkillIntroduce: string = `
    无视敌人防御以及免伤值
    对敌人造成 300 % 的伤害
    `.replace(/ /ig , "")

    onCreateState(self: CharacterState): void {
        if (self.star >= 2) {
            self.maxHp *= 1.25
            self.defence *= 1.25
            self.attack *= 1.25
        }
        if (self.star >= 4) {
            self.hurtPercent += 0.25
            self.critical += 25
            self.speed *= 1.25
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
            for (const target of actionState.targets) {
                const FreeInjuryPercentTemp = target.component.state.FreeInjuryPercent // 保存免伤率
                const defenceTemp = target.component.state.defence // 保存防御
                target.component.state.FreeInjuryPercent = 0 // 免伤为0
                target.component.state.defence = 0
                if (fightMap.isPlayAnimation) {
                    await selfComponent.showString('无视免伤')
                    await selfComponent.showString('无视防御')
                }
                // 攻击
                await selfComponent.attack(self.attack * 1 , target.component)
                target.component.state.defence = defenceTemp  // 回复免伤
                target.component.state.FreeInjuryPercent = FreeInjuryPercentTemp  // 回复防御
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
                const FreeInjuryPercentTemp = target.component.state.FreeInjuryPercent // 保存免伤率
                const defenceTemp = target.component.state.defence // 保存防御
                target.component.state.FreeInjuryPercent = 0 // 免伤为0
                target.component.state.defence = 0
                if (fightMap.isPlayAnimation) {
                    await selfComponent.showString('无视免伤')
                    await selfComponent.showString('无视防御')
                }
                //攻击
                await selfComponent.attack(self.attack * 3 , target.component)
                // fightMap.actionAwaitQueue.push(
                //    selfComponent.attack(self.attack * 3 , target.component)
                // )
                target.component.state.defence = defenceTemp  // 回复免伤
                target.component.state.FreeInjuryPercent = FreeInjuryPercentTemp  // 回复防御
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
