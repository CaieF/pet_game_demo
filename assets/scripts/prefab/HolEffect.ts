import { _decorator, AnimationState, Component, Node } from 'cc';
import { HolAnimation } from './HolAnimation';
import { FightMap } from '../scenes/Fight/Canvas/FightMap';
import { EffectState, EffectStateCreate } from '../game/fight/effect/EffectState';
import { EffectEnum } from '../game/fight/effect/EffectEnum';
const { ccclass, property } = _decorator;

@ccclass('HolEffect')
export class HolEffect extends Component {

    // 动画组件
    private $holAnimation: HolAnimation
    public get holAnimation(): HolAnimation {
        return this.$holAnimation;
    }

    // 当前战斗场景
    private $fightMap: FightMap

    state: EffectState

    // 所处方位
    direction: 'left' | 'right';

    /**
     * 初始化特效
     * create 特效创建数据
     */
    async initEffect(create: EffectStateCreate, direction: 'left' | 'right') {
        // 创建特效状态
        this.state = new EffectState(create, this);
        this.direction = direction
        const meta = EffectEnum[create.id]
        // 动画设置
        const animationNode = this.node.getChildByName("HolAnimation")
        this.$holAnimation = animationNode.getComponent(HolAnimation)
        animationNode.setPosition(0, 0)
        await this.$holAnimation.initBones({
            animationScale: this.state.meta.AnimationScale ,
            animationDir: this.state.meta.AnimationDir ,
            animationType: this.state.meta.AnimationType ,
            animationPosition: this.state.meta.AnimationPosition
        })
        this.node.addChild(animationNode)
        this.$holAnimation.playAnimation('Effect')
        // 朝向
        // 角色面朝向
        if (this.direction === 'left') this.$holAnimation.node.setScale(Math.abs(this.$holAnimation.node.scale.x) * this.state.meta.AnimationForward, this.$holAnimation.node.scale.y, this.$holAnimation.node.scale.z)
        else this.$holAnimation.node.setScale(Math.abs(this.$holAnimation.node.scale.x) * -this.state.meta.AnimationForward, this.$holAnimation.node.scale.y, this.$holAnimation.node.scale.z)
    }
}


