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

@RegisterCharacter({id: "catGril"})
class Character extends CharacterMetaState {

    name: string = "猫咪少女"

    AnimationDir: string = "game/fight_entity/character/catGril"

    AnimationType: "DragonBones" | "Spine" = "DragonBones"

    AvatarPath: string = "game/fight_entity/character/catGril/avatar/spriteFrame"

    CharacterCamp: "ordinary" | "gold" | "tree" | "water" | "fire"|"stone" = "water"

    CharacterQuality: number = 3

    AnimationScale: number = 5

    AnimationPosition: { x: number; y: number; } = { x: 0, y: 10 };

    HpGrowth: number = 39

    AttackGrowth: number = 20

    DefenceGrowth: number = 6

    PierceGrowth: number = 13

    SpeedGrowth: number = 11

    Energy: number = 80

    AttackIntroduce: string = `
    攻击目标造成 100% 伤害 
    并为自己添加一回合免伤buff
    并增加60点能量 
    `.replace(/ /ig , "")

    PassiveIntroduceOne: string = `
    额外获得 20% 穿透值
    额外获得 20% 攻击力
    额外获得 20% 暴击率
    `.replace(/ /ig , "")

    PassiveIntroduceTwo: string = `
    获得 50% 伤害率
    `.replace(/ /ig , "")

    SkillIntroduce: string = `
    召唤水龙卷攻击所有敌人
    造成150% 的伤害
    `.replace(/ /ig , "")

    onCreateState(self: CharacterState): void {
        if (self.star >= 2) {
            self.pierce *= 1.2
            self.attack *= 1.2
            self.critical += 20
        }
        if (self.star >= 3) {
            self.hurtPercent += 0.5
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
            // 添加免伤buff
            const FreeInjury = new BuffState({id: 'freeinjury'})
            selfComponent.addBuff(selfComponent, FreeInjury)
            // 一回合后去掉
            fightMap.listenRoundEvent(1 , () => selfComponent.deleteBuff(FreeInjury))
            // 增加能量
            self.energy += 60
            await selfComponent.updateUi()

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
            // 获取敌人
            const enemys = selfComponent.getEnimies(fightMap.allLiveCharacter)
            if (enemys.length === 0) return

            enemys.forEach((enemy, i) => {
                actionState.targets.push(enemy.state)
            })

            // 播放动画
            if (fightMap.isPlayAnimation) {
                await selfComponent.holAnimation.playAnimation("skill" , 1)
                selfComponent.holAnimation.playAnimation(selfComponent.defaultState)
            }
            // 攻击所有敌人
            for (const target of actionState.targets) {
                if (fightMap.isPlayAnimation) {
                    // 生成水龙卷特效
                    const waterblast = new EffectState({id: "WaterBlast"})
                    // selfComponent.showEffect(waterblast, 0, 0)
                    target.component.showEffect(waterblast, 0, 0)
                }
                fightMap.actionAwaitQueue.push(
                    selfComponent.attack(self.attack * 1.5,target.component)
                )
            }
            return
        }
    }
}
