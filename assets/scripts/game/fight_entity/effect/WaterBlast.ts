import { RegisterEffect } from "../../fight/effect/EffectEnum";
import { EffectMetaState } from "../../fight/effect/EffectMetaState";


@RegisterEffect({ id: 'WaterBlast'})
export class WaterBlast extends EffectMetaState {

    // 动画所处文件夹
    AnimationDir: string = 'game/fight_entity/effect/WaterBlast';

    AnimationScale: number = 2;

    AnimationType: "DragonBones" | "Spine" = "DragonBones";

    AnimationPosition: { x: number; y: number; } = { x: 0, y: 20 };

}