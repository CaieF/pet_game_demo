import { AssetManager, resources } from "cc";
import { BasicMetaState } from "../BasicMetaState";
import { ActionState } from "../ActionState";
import { CharacterState } from "./CharacterState";
import { FightMap } from "../../../scenes/Fight/Canvas/FightMap";
import { util } from "../../../util/util";
import { GetCharacterCoordinatePosition } from "../../../prefab/HolCharacter";

// 金木水火土
export type CampType =  'ordinary'|'gold'|'tree'|'water'|'fire'|'stone'

// 获取伤害率
export function getCampHurtPercent(self: CampType, target: CampType): number {
    switch (self) {
        case 'gold': {
            if (target === 'fire') return 0.5;
            if (target === 'tree') return 2.0;
            return 1;
        }
        case 'tree': {
            if (target === 'stone') return 2.0;
            if (target === 'gold') return 0.5;
            return 1;
        }
        case 'water': {
            if (target === 'fire') return 2.0;
            if (target === 'stone') return 0.5;
            return 1;
        }
        case 'fire': {
            if (target === 'gold') return 2.0;
            if (target === 'water') return 0.5;
            return 1;
        }
        case 'stone': {
            if (target === 'water') return 2.0;
            if (target === 'tree') return 0.5;
            return 1;
        }
        default: return 1;
    }
}

export class CharacterMetaState extends BasicMetaState {

    // 动画所处文件夹
    AnimationDir: string;

    // 动画缩放
    AnimationScale: number = 1.0;

    // 动画位置
    AnimationPosition: { x: number, y: number } = { x: 0, y: 0 };

    // 动画方向 1：右 -1：左
    AnimationForward: number = 1;

    // 动画类型
    AnimationType: 'DragonBones' | 'Spine' = 'DragonBones'

    // 动画bundle
    AnimationBundle: AssetManager.Bundle = resources;

    // 头像路径
    AvatarPath: string;

    // 角色属性
    CharacterCamp: CampType = 'gold';

    // 角色品质 1 r 2 sr 3 ssr
    CharacterQuality: number = 1;

    // 角色能量条 10 ~ 200
    Energy: number = 200;

    // 角色生命成长属性 30 ~ 100
    HpGrowth: number = 100;

    // 角色攻击成长属性 5 ~ 40
    AttackGrowth: number = 40;

    // 角色防御成长属性 1 ~ 30
    DefenceGrowth: number = 10;

    // 角色速度成长属性 10 ~ 30
    SpeedGrowth: number = 20;

    // 角色穿透 10 ~ 20
    PierceGrowth: number = 20;

    // 格挡原型 1 ~ 100
    Block: number = 5;

    // 暴击原型
    Critical: number = 5;

    // 攻击描述
    AttackIntroduce: string = `普通攻击

    对一个敌人造成攻击力 100% 的伤害
    `

    // 被动技能一描述
    PassiveIntroduceOne: string = `技能1
    
    无
    `

    // 被动技能二描述
    PassiveIntroduceTwo: string = `技能2
    
    无
    `

    // 技能描述
    SkillIntroduce: string = `普通攻击
    
    对一个敌人造成攻击力 130% 的伤害
    `

    // 默认普通攻击
    GetOnAttack(): (self: CharacterState, actionState: ActionState, fightMap: FightMap) => Promise<any> {
        return async (self: CharacterState, actionState: ActionState, fightMap: FightMap) => {
            let enemies = self.component.getEnimies(fightMap.allLiveCharacter)
            if (enemies.length <= 0) return;
            enemies = enemies.sort((a, b) => a.coordinate.col - b.coordinate.col);
            actionState.targets.push(enemies[0].state)
            // 播放动画
            if (fightMap.isPlayAnimation) {
                await util.subdry.moveNodeToPosition(
                    self.component.node,
                    {
                        targetPosition: GetCharacterCoordinatePosition(
                            actionState.targets[0].component.direction,
                            actionState.targets[0].component.coordinate.row,
                            actionState.targets[0].component.coordinate.col,
                            'attack',
                        ),
                        moveCurve: true,
                        moveTimeScale: actionState.targets[0].component.holAnimation.timeScale
                    }
                )
                await self.component.holAnimation.playAnimation('attack', 1, self.component.defaultState)
            }
            // 结算
            for (const state of actionState.targets)
                await self.component.attack(self.attack * 1.0, state.component)
            // 播放动画
            if (fightMap.isPlayAnimation) {
                await util.subdry.moveNodeToPosition(
                    self.component.node,
                    {
                        targetPosition: GetCharacterCoordinatePosition(
                            self.component.direction,
                            self.component.coordinate.row,
                            self.component.coordinate.col,
                            'ordinary',
                        ),
                        moveCurve: true,
                        moveTimeScale: self.component.holAnimation.timeScale
                    }
                )
            }
            return
        }

    }
}