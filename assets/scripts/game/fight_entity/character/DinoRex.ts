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
import { EffectState } from "../../fight/effect/EffectState";
import { log } from "../../../util/out/log";

@RegisterCharacter({id: "DinoRex"})
class Character extends CharacterMetaState {

    name: string = "佩克龙"

    AnimationDir: string = "game/fight_entity/character/DinoRex"

    AnimationType: "DragonBones" | "Spine" = "DragonBones"

    AvatarPath: string = "game/fight_entity/character/DinoRex/avatar/spriteFrame"

    CharacterCamp: "ordinary" | "gold" | "tree" | "water" | "fire"|"stone" = "water"

    CharacterQuality: number = 4

    AnimationScale: number = 1.5

    AnimationPosition: { x: number; y: number; } = { x: 0, y: 50};

    HpGrowth: number = 80

    AttackGrowth: number = 20

    DefenceGrowth: number = 14

    PierceGrowth: number = 8

    SpeedGrowth: number = 12

    Block: number = 30;

    Energy: number = 60

    AttackIntroduce: string = `
    对敌人造成 100 % 的伤害
    并恢复自身 20% 的生命值
    `.replace(/ /ig , "")

    PassiveIntroduceOne: string = `
    额外获得 25% 生命值
    额外获得 25% 防御值
    获得 15% 格挡率
    `.replace(/ /ig , "")

    PassiveIntroduceTwo: string = `
    额外获得 30% 生命值
    获得 15% 格挡值
    `.replace(/ /ig , "")

    SkillIntroduce: string = `
    对敌人造成250%攻击力的伤害
    并恢复自身 30% 的生命值
    并且眩晕敌人1回合
    `.replace(/ /ig , "")

    onCreateState(self: CharacterState): void {
        if (self.star >= 2) {
            self.maxHp *= 1.25
            self.defence *= 1.25
            self.block += 15
        }
        if (self.star >= 4) {
            self.maxHp *= 1.3
            self.block += 15
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
                if (fightMap.isPlayAnimation) {
                    // 生成水龙卷特效
                    const waterblast = new EffectState({id: "WaterBlast"})
                    await selfComponent.showEffect(waterblast, -3, 0)
                }
                await selfComponent.holAnimation.playAnimation("attack" , 1 , selfComponent.defaultState)
            }
            // 造成伤害
            for (const target of actionState.targets) {
                await selfComponent.attack(self.attack * 1.0 , target.component)
            }
            await selfComponent.cure(self.maxHp * 0.1, selfComponent)  // 恢复生命
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
                // 一回合后去掉
                fightMap.listenRoundEvent(1 , () => target.component.deleteBuff(vertigo) )
                // 攻击
                fightMap.actionAwaitQueue.push(
                    selfComponent.attack(self.attack * 2.5 , target.component)
                )
            }
            await selfComponent.cure(self.maxHp * 0.15, selfComponent)  // 恢复生命
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
