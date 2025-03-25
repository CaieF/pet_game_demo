import { _decorator, Component, Node, Prefab } from 'cc';
import { HolAnimation, HolAnimationOption } from '../../../prefab/HolAnimation';
import { addCharacterAnimation, standCharacterAnimation } from '../../../common/Game/addCharacterAnimation';
import { util } from '../../../util/util';
import { GameCanvas } from '../GameCanvas';
const { ccclass, property } = _decorator;

@ccclass('LeverGame')
export class LeverGame extends Component {

    @property(Node) moveCharacter: Node = null! // 移动的角色
    @property(Node) rotationNode: Node = null! // 旋转的节点
    @property(Node) Characters: Node = null! // 角色节点
    @property(Node) standCharacter: Node = null! // 站立的角色
    // 杠杆原理：F1 * D1 = F2 * D2
    // 杠杆的力度F，杠杆的长度D，杠杆的转角θ，杠杆的初始角度θ0
    // 杠杆的转动角度θ = θ0 + (F1 * D1 - F2 * D2) / (F1 + F2)
    LeverLength: number = 330
    LeverAngle: number = 0

    isGameStart: boolean = false    // 游戏是否开始
    addCatNum: number = 0   // 增加的猫数量

    // 移动时间
    moveTime: number = 10
    // 左边长度D1不断增加，右边需要增加F2，使得F1 * D1 = F2 * D2
    // 相关数据
    F1: number = 100
    F2: number = 100
    D1: number = 35
    D2: number = 35
    D2MIN: number = 35
    D2MAX: number = 220

    async initGame() {
        await this.renderCat(addCharacterAnimation[0], this.Characters)
        for (let i = 0; i < standCharacterAnimation.length; i++) {
            await this.renderCat(standCharacterAnimation[i], this.standCharacter)
        }
        this.isGameStart = true
    }

    async update(deltaTime: number) {
        if (!this.isGameStart) return
        if (this.D2 >= this.D2MAX) {
            // 游戏成功
            this.isGameStart = false
            this.node.parent.parent.getComponent(GameCanvas).fightSuccess()
            return
        }
        this.D2 += (this.D2MAX - this.D2MIN) / this.moveTime * deltaTime
        this.moveCharacter.setPosition(-this.D2, 0, 0)
        
        this.LeverAngle = (this.F2 * this.D2 - this.F1 * this.D1) / (this.F1 + this.F2)
        this.rotationNode.angle = this.LeverAngle
        if (this.LeverAngle > 23 || this.LeverAngle < -5) {
            // 游戏失败
            this.isGameStart = false
            this.node.parent.parent.getComponent(GameCanvas).fightFailure()
            return await util.message.prompt({message: "倾斜角度过大，游戏失败，请重新开始"})
        }
    }

    async addCat() {
        if (this.addCatNum >= 3) return
        const nodePool = util.resource.getNodePool(await util.bundle.load('prefab/HolAnimation', Prefab))
        nodePool.put(this.standCharacter.children[0])
        // this.standCharacter.children[this.addCatNum].active = false
        this.addCatNum += 1
        this.F1 += 100
        this.renderCat(addCharacterAnimation[this.addCatNum])
    }

    async renderCat(catAnimation: HolAnimationOption, parent: Node = this.Characters) {
        const close = await util.message.load()
        const nodePool = util.resource.getNodePool(await util.bundle.load('prefab/HolAnimation', Prefab))
        const node = nodePool.get()
        node.setPosition(0, 0, 0)
        const holAnimation = node.getComponent(HolAnimation)
        await holAnimation.initBones(catAnimation)
        holAnimation.playAnimation('rest')
        node.setScale(-5,5)
        parent.addChild(node)

        close()
    }
}


