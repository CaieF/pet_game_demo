import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { getConfig } from '../../../common/config/config';
import { util } from '../../../util/util';
import { HeroAllHeros } from './HeroAllHeros';
import { CharacterStateCreate } from '../../../game/fight/character/CharacterState';
import { CharacterEnum } from '../../../game/fight/character/CharacterEnum';
import { HolAnimation } from '../../../prefab/HolAnimation';
import { HeroCharacterProperty } from './CharacterDetail/HeroCharacterProperty';
const { ccclass, property } = _decorator;

@ccclass('HeroCharacterDetail')
export class HeroCharacterDetail extends Component {

    // 所有角色的节点
    @property(Node) HeroAllHeroNode: Node

    // 返回
    async goBack() {
        this.node.active = false
        const config = getConfig()
        const close = await util.message.load()
        const characterQueue = []
        config.userData.characterQueue.forEach(cq => cq.forEach(c => { if(c) characterQueue.push(c) }))
        await this.HeroAllHeroNode.getComponent(HeroAllHeros).render([].concat(characterQueue, config.userData.characters))
        close()
    }
    
    // 上一次的角色动画
    private $lastAnimation: Node
    // 设置角色
    async setCharacter(create: CharacterStateCreate) {
        const propertyNode = this.node.getChildByName('Property')
        const close = await util.message.load()
        const characterAnimationNode = this.node.getChildByName('CharacterAnimation')
        if (this.$lastAnimation) characterAnimationNode.removeChild(this.$lastAnimation)
        const meta = CharacterEnum[create.id]
        const holAnimationPrefab = await util.bundle.load('prefab/HolAnimation', Prefab)
        const holAnimationNode = instantiate(holAnimationPrefab)
        characterAnimationNode.addChild(holAnimationNode)
        await holAnimationNode.getComponent(HolAnimation).initBones({
            animationScale: meta.AnimationScale * 1.7,
            animationDir: meta.AnimationDir,
            animationType: meta.AnimationType,
            animationPosition: meta.AnimationPosition,
        })
        characterAnimationNode.addChild(holAnimationNode)
        this.$lastAnimation = holAnimationNode
        holAnimationNode.active = false
        // 设置属性
        await propertyNode.getComponent(HeroCharacterProperty).renderProperty(create)
        close()
        setTimeout(async() => {
            holAnimationNode.active = true
            holAnimationNode.getComponent(HolAnimation).playAnimation('rebirth', 1, 'rest')
        }, 50)
        return
    }
}


