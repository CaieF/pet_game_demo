import { _decorator, AudioSource, Component, find, Label, Node, sp } from 'cc';
import { getConfig, stockConfig } from 'db://assets/scripts/common/config/config';
import { CharacterEnum } from 'db://assets/scripts/game/fight/character/CharacterEnum';
import { CharacterState, CharacterStateCreate } from 'db://assets/scripts/game/fight/character/CharacterState';
import { HolUserResource } from 'db://assets/scripts/prefab/HolUserResource';
import { util } from 'db://assets/scripts/util/util';
import { HeroAllHeros } from '../HeroAllHeros';
import { HeroLevelUpAll } from './HeroLevelUpAll';
const { ccclass, property } = _decorator;

@ccclass('HeroCharacterProperty')
export class HeroCharacterProperty extends Component {
    
    // 角色状态
    public $state: CharacterState

    // 是否询问升级
    private $answerLevelUp: boolean = true

    // 是否询问升星
    private $answerLevelStar: boolean = true

    @property(Node) HeroAllHeroNode: Node

    @property(Node) HeroLevelUpAllNode: Node

    // 渲染属性
    async renderProperty(create: CharacterStateCreate) {
        this.$state = new CharacterState(create, null)
        this.node.getChildByName('Name').getComponent(Label).string = '名称：' + this.$state.meta.name
        this.node.getChildByName('Lv').getComponent(Label).string = 'Lv：' + this.$state.lv
        this.node.getChildByName("Hp").getChildByName("Value").getComponent(Label).string = Math.ceil(this.$state.maxHp) + ''
        this.node.getChildByName("Attack").getChildByName("Value").getComponent(Label).string = Math.ceil(this.$state.attack) + ''
        this.node.getChildByName("Defence").getChildByName("Value").getComponent(Label).string = Math.ceil(this.$state.defence) + ''
        this.node.getChildByName("Speed").getChildByName("Value").getComponent(Label).string = Math.ceil(this.$state.speed) + ''

        // 渲染星级
        const starNode = this.node.getChildByName("Star")
        starNode.children.forEach(n => n.active = false)
        starNode.children.forEach(n => n.children[0].active = false)
        for (let i = 0; i < CharacterEnum[create.id].CharacterQuality; i++) 
            starNode.children[i].active = true
        for (let i = 0; i < create.star; i++) 
            starNode.children[i].children[0].active = true

        // 是否满级
        if (create.lv >= 100) {
            this.node.getChildByName("LevelUp").active = false
            this.node.getChildByName("MaxLevel").active = true
        } else {
            this.node.getChildByName("MaxLevel").active = false
            this.node.getChildByName("LevelUp").active = true
            // 升级所需资源
            this.node.getChildByName("LevelUp")
                .getChildByName("LevelUpGold")
                .getChildByName("Value")
                .getComponent(Label).string = util.subdry.formateNumber(util.resourceCost.levelUpNeedGold(create))
        }

        // 是否满星
        if (create.star >= CharacterEnum[create.id].CharacterQuality) {
            this.node.getChildByName("LevelStar").active = false
            this.node.getChildByName("MaxStar").active = true
        } else {
            this.node.getChildByName("MaxStar").active = false
            this.node.getChildByName("LevelStar").active = true
            this.node.getChildByName("LevelStar")
                .getChildByName("LevelStarSoul")
                .getChildByName("Value")
                .getComponent(Label).string = util.subdry.formateNumber(util.resourceCost.levelStarNeedSoule(create))
        }
    }
    // 显示所有的属性
    async showAllProperty() {
        let message = ``
        message += ` 生命值: ${Math.ceil(this.$state.maxHp)}\n`
        message += ` 攻击力: ${Math.ceil(this.$state.attack)}\n`
        message += ` 防御力: ${Math.ceil(this.$state.defence)}\n`
        message += ` 速度值: ${Math.ceil(this.$state.speed)}\n`
        message += ` 穿透值: ${Math.ceil(this.$state.pierce)}\n`
        message += ` 格挡率: ${Math.ceil(this.$state.block)}%\n`
        message += ` 暴击率: ${Math.ceil(this.$state.critical)}%\n`
        message += ` 免伤率: ${Math.ceil(this.$state.FreeInjuryPercent * 100)}%\n`
        message += ` 最大能量: ${Math.ceil(this.$state.maxEnergy)}\n`
        const res = await util.message.introduce({message})
    }

    // 显示攻击介绍
    async showAttackIntroduce() {
        let message = ``
        message += `普通攻击介绍：\n`
        message += `${this.$state.meta.AttackIntroduce}`
        const res = await util.message.introduce({message})
    }

    // 显示技能介绍
    async showSkillIntroduce() {
        let message = ``
        message += `技能介绍：\n`
        message += `${this.$state.meta.SkillIntroduce}`
        const res = await util.message.introduce({message})
    }

    async showPassiveIntroduce() {
        let message = ``
        if (this.$state.meta.CharacterQuality < 3) {
            message += `一星增益：\n`
        } else {
            message += `二星增益：\n`
        }
        message += `${this.$state.meta.PassiveIntroduceOne}\n`
        if (this.$state.meta.CharacterQuality === 2) {
            message += `二星增益：\n`
        } else if (this.$state.meta.CharacterQuality === 3) {
            message += `三星增益：\n`
        } else if (this.$state.meta.CharacterQuality >= 4) {
            message += `四星增益：\n`
        }
        if (this.$state.meta.CharacterQuality > 1)
            message += `${this.$state.meta.PassiveIntroduceTwo}\n`
        const res = await util.message.introduce({message})
    }

    // 英雄升级
    async characterLevelUp() {
        const config = getConfig()
        // 是否询问
        if (this.$answerLevelUp) {
            const result = await util.message.confirm({
                message: "确定要升级吗?" ,
                selectBoxMessage: "不再询问" ,
                selectBoxCallback: (b: boolean) => {this.$answerLevelUp = !b}
            })
            // 是否确定
            if (result === false) return
        }
        // 资源不足
        if (config.userData.gold < util.resourceCost.levelUpNeedGold(this.$state.create)) return await util.message.prompt({message: "铜钱不足"})
        // 资源减少
        config.userData.gold -= util.resourceCost.levelUpNeedGold(this.$state.create)
        // 角色等级提升
        this.$state.create.lv++
        stockConfig()
        this.LevelUpEffect()
        
    }

    async LevelUpEffect() {
        const config = getConfig()
        // 重新渲染
        await this.renderProperty(this.$state.create)
        find("Canvas/HolUserResource").getComponent(HolUserResource).render() // 资源渲染 
        const levelUpEffectSkeleton = this.node.getChildByName("LevelUpEffect").getComponent(sp.Skeleton)
        //播放声音
        const audioSource = levelUpEffectSkeleton.node.getComponent(AudioSource)
        audioSource.volume = config.volume * config.volumeDetail.character
        audioSource.play()
        // 播放动画
        levelUpEffectSkeleton.node.active = true
        levelUpEffectSkeleton.node.children[0]?.getComponent(sp.Skeleton).setAnimation(0 , "animation" , false)
        // levelUpEffectSkeleton.setAnimation(0 , "animation" , false)
        levelUpEffectSkeleton.setCompleteListener(() => levelUpEffectSkeleton.node.active = false)
    }

    // 角色升星
    async characterLevelStar() {
        const config = getConfig()
        // 是否询问
        if (this.$answerLevelStar) {
            const result = await util.message.confirm({
                message: "确定要升星吗?" ,
                selectBoxMessage: "不再询问" ,
                selectBoxCallback: (b: boolean) => {this.$answerLevelStar = !b}
            })
            // 是否确定
            if (result === false) return
        }
        // 资源不足
        if (config.userData.soul < util.resourceCost.levelStarNeedSoule(this.$state.create)) return await util.message.prompt({message: "灵魂不足"})
        // 资源减少
        config.userData.soul -= util.resourceCost.levelStarNeedSoule(this.$state.create)
        // 角色星级提升
        this.$state.create.star++
        // 重新渲染
        await this.renderProperty(this.$state.create)
        find("Canvas/HolUserResource").getComponent(HolUserResource).render() // 资源渲染
        const levelStarEffectSkeleton = this.node.getChildByName("LevelStarEffect").getComponent(sp.Skeleton)
        stockConfig()
        // //播放声音
        const audioSource = levelStarEffectSkeleton.node.getComponent(AudioSource)
        audioSource.volume = config.volume * config.volumeDetail.character
        audioSource.play()
        // 播放动画
        levelStarEffectSkeleton.node.active = true
        levelStarEffectSkeleton.node.children[0]?.getComponent(sp.Skeleton).setAnimation(0 , "animation" , false)
        levelStarEffectSkeleton.setAnimation(0 , "animation" , false)
        levelStarEffectSkeleton.setCompleteListener(() => {
            levelStarEffectSkeleton.node.active = false     
        })
        
    }

    // 分解角色
    async decomposeCharacter() {
        const config = getConfig()
        const { gold, soul } = util.resourceCost.getDecomposeGoldSoul(this.$state.create)
        const result = await util.message.confirm({
            message: `是否分解角色?
                    分解获得的铜钱: ${gold}
                    分解获得的元气: ${soul}`
        })
        // 是否确定
        if (result === false) return
        config.userData.gold += gold
        config.userData.soul += soul
        // 角色移除 todo
        config.userData.deleteCharacter(this.$state.create.uuid)
        // 重新渲染
        this.node.parent.active = false
        find("Canvas/HolUserResource").getComponent(HolUserResource).render() // 资源渲染 
        const close = await util.message.load()
        const characterQueue = []
        config.userData.characterQueue.forEach(cq => cq.forEach(c => { if(c) characterQueue.push(c) }))
        await this.HeroAllHeroNode.getComponent(HeroAllHeros).render([].concat(characterQueue, config.userData.characters))
        stockConfig()
        close()
    }

    // 点击一键升级角色按钮
    async characterLevelUpAll() {
        this.HeroLevelUpAllNode.active = true
        // this.HeroLevelUpAllNode.getComponent(HeroLevelUpAll).state = this.$state
    }
}



