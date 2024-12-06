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

@RegisterCharacter({id: "Panda"})
class Character extends CharacterMetaState {

    name: string = "熊猫大侠"

    AnimationDir: string = "game/fight_entity/character/Panda"

    AnimationType: "DragonBones" | "Spine" = "DragonBones"

    AvatarPath: string = "game/fight_entity/character/Panda/avatar/spriteFrame"

    CharacterCamp: "ordinary" | "gold" | "tree" | "water" | "fire"|"stone" = "tree"

    CharacterQuality: number = 5

    AnimationScale: number = 6.5

    AnimationPosition: { x: number; y: number; } = { x: 40, y: 30};

    HpGrowth: number = 80

    AttackGrowth: number = 25

    DefenceGrowth: number = 16

    PierceGrowth: number = 20

    SpeedGrowth: number = 18

    Block: number = 20;

    Energy: number = 100

    AttackIntroduce: string = `
    对敌人造成 100 % 的伤害
    为自己添加 恢复buff(每回合恢复 10% 的生命值， 同时获得10%的免伤) 持续 1回合
    同时恢复自身 50 能量值
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
    
    对目标造成 300% 的伤害
    对目标列周围的 敌人造成 150 % 的伤害
    同时为自己添加一回合 免伤buff
    (免伤超过100%时有奇效)
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
            let enemy: HolCharacter;
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
                await selfComponent.attack(self.attack * 1.0, target.component)
            }
            // 添加恢复buff
            const cure = new BuffState({id: 'cure'})
            selfComponent.addBuff(selfComponent, cure)
            // 1回合去掉
            fightMap.listenRoundEvent(1, () => selfComponent.deleteBuff(cure))
            // 增加五十能量值
            self.energy += 50
            await self.component.updateUi()
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
            // 获取目标列周围的敌人
            enemys.forEach((e, i) => {
                if((e.coordinate.row === enemy.coordinate.row + 1 || e.coordinate.row === enemy.coordinate.row - 1) && e.coordinate.col === enemy.coordinate.col) {
                    actionState.targets.push(e.state)
                }
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
                let hurtPer = 1.5; // 伤害倍率
                if (target === enemy) {
                    hurtPer = 3
                }
                fightMap.actionAwaitQueue.push(
                    selfComponent.attack(self.attack * hurtPer , target.component)
                )
            }
            // 添加免伤buff
            const freeinjury = new BuffState({id: 'freeinjury'})
            await selfComponent.addBuff(selfComponent, freeinjury)
            // 一回合去掉
            fightMap.listenRoundEvent(1, () => selfComponent.deleteBuff(freeinjury))
            // 回到原位
            if (fightMap.isPlayAnimation){ 
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
