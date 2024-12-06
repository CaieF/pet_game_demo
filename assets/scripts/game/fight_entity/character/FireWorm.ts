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

@RegisterCharacter({id: "FireWorm"})
class Character extends CharacterMetaState {

    name: string = "火山沙虫"

    AnimationDir: string = "game/fight_entity/character/FireWorm"

    AnimationType: "DragonBones" | "Spine" = "DragonBones"

    AvatarPath: string = "game/fight_entity/character/FireWorm/avatar/spriteFrame"

    CharacterCamp: "ordinary" | "gold" | "tree" | "water" | "fire"|"stone" = "fire"

    CharacterQuality: number = 4

    AnimationScale: number = 4

    AnimationPosition: { x: number; y: number; } = { x: 0, y: 0};

    HpGrowth: number = 70

    AttackGrowth: number = 20

    DefenceGrowth: number = 13

    PierceGrowth: number = 15

    SpeedGrowth: number = 15

    Block: number = 5;

    Energy: number = 60

    AttackIntroduce: string = `
    给敌人增加烧伤buff持续两回合
    并对敌人造成 100 % 的伤害
    `.replace(/ /ig , "")

    PassiveIntroduceOne: string = `
    
    额外获得 25% 生命值
    额外获得 25% 攻击力
    额外获得 25% 防御值
    `.replace(/ /ig , "")

    PassiveIntroduceTwo: string = `
    获得 25% 暴击
    额外获得 25% 速度
    `.replace(/ /ig , "")

    SkillIntroduce: string = `
    对一排敌人增加烧伤buff持续三回合
    并对敌人造成 150 % 的伤害
    `.replace(/ /ig , "")

    onCreateState(self: CharacterState): void {
        if (self.star >= 2) {
            self.maxHp *= 1.25
            self.defence *= 1.25
            self.attack *= 1.25
        }
        if (self.star >= 4) {
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
                // 添加烧伤效果
                const fire = new BuffState({id: 'fire'})
                await target.component.addBuff(selfComponent, fire)
                // 两回合去掉
                fightMap.listenRoundEvent(2, () => target.component.deleteBuff(fire))
                // 攻击
                await selfComponent.attack(self.attack * 1.0 , target.component)
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
            // 获取一行的敌人
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
                if (fightMap.isPlayAnimation){
                    // 生成火球特效
                    const fireball = new EffectState({id: 'FireBall'})
                    await selfComponent.showEffect(fireball, -9, 0)
                }
                selfComponent.holAnimation.playAnimation(selfComponent.defaultState)
            }
            // 造成伤害 ...
            for (const target of actionState.targets) {
                // 添加烧伤效果
                const fire = new BuffState({id: 'fire'})
                await target.component.addBuff(selfComponent, fire)
                // 3回合去掉
                fightMap.listenRoundEvent(3, () => target.component.deleteBuff(fire))
                // 攻击
                fightMap.actionAwaitQueue.push(
                    selfComponent.attack(self.attack * 1.5 , target.component)
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
