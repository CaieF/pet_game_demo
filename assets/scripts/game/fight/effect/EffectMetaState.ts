import { AssetManager, resources } from "cc";
import { BasicMetaState } from "../BasicMetaState";
import { EffectState } from "./EffectState";


export class EffectMetaState extends BasicMetaState {
    
    // 动画所处文件夹
    AnimationDir: string

    // 动画缩放
    AnimationScale: number = 1.0

    // 动画位置
    AnimationPosition: { x: number, y: number } = { x: 0, y: 0 }

    // 动画方向 1: 右 -1: 左
    AnimationForward: number = 1

    // 动画类型
    AnimationType: 'DragonBones' | 'Spine' = 'DragonBones'

    // 动画bundle
    AnimationBundle: AssetManager.Bundle = resources

    /**
     * 创建时的函数
     */
    GetOnCreate():(self: EffectState, option: any) => Promise<void> {
      return async (self: EffectState, option: any) => {}
    }
}