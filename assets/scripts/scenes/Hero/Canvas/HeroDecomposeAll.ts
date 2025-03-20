import { _decorator, Component, Node, Event, Toggle, toDegree, Label, find } from 'cc';
import { getConfig, stockConfig } from '../../../common/config/config';
import { util } from '../../../util/util';
import { HeroAllHeros } from './HeroAllHeros';
import { log } from '../../../util/out/log';
import { CharacterStateCreate } from '../../../game/fight/character/CharacterState';
import { CharacterEnum } from '../../../game/fight/character/CharacterEnum';
import { formateNumber } from '../../../util/subdry/formateNumber';
import { HolUserResource } from '../../../prefab/HolUserResource';
import { qualitySouls } from '../../../common/factors';
const { ccclass, property } = _decorator;

@ccclass('HeroDecomposeAll')
export class HeroDecomposeAll extends Component {

    // 所有角色的节点
    @property(Node) HeroAllHeroNode: Node
    // 复选框节点
    @property(Node) RadiosNode: Node

    @property(Node) TipNode: Node


    allSouls: number = 0 // 分解角色的灵魂总和
    decomposeCharacter: Set<CharacterStateCreate> = new Set() // 分解角色的列表

    // 返回
    async goBack() {
        for (let i = 0; i < this.RadiosNode.children.length; i++) {
            const radio = this.RadiosNode.children[i].getComponent(Toggle)
            radio.isChecked = false
        }
        this.node.active = false
        const config = getConfig()
        const close = await util.message.load()
        const characterQueue = []
        config.userData.characterQueue.forEach(cq => cq.forEach(c => { if(c) characterQueue.push(c) }))
        await this.HeroAllHeroNode.getComponent(HeroAllHeros).render([].concat(characterQueue, config.userData.characters))
        close()
    }

    // 确认分解
    async confirmDecompose() {
        const config = getConfig()
        const close = await util.message.load()
        config.userData.soul += this.allSouls
        // 移除分解角色
        for (const character of this.decomposeCharacter) {
            config.userData.deleteCharacter(character.uuid);
        }
        await this.goBack()
        find("Canvas/HolUserResource").getComponent(HolUserResource).render()
        stockConfig()
        close() 
    }

    // 选了对应的checkbox
    async checkboxSelect(toggle: Toggle, characterQuality: string) {

        // log(characterQuality)
        if (toggle.isChecked) {
            // 选中对应品质的角色计算灵魂
            this.filterCharacterByQuality(parseInt(characterQuality))
        } else {
            // 取消选中对应品质的角色
            this.cancelSelect(parseInt(characterQuality))        
        }
        this.updateTip()
    }

    // 筛选对应品质并且等级为1的角色加入分解列表
    filterCharacterByQuality(quality: number) {
        const config = getConfig()
        // log(config.userData.characters)
        let characterNumbers = 0
        // 检测是否在characterQueue中
        for (let i = 0; i < config.userData.characterQueue.length; i++) {
            for (let j = 0; j < config.userData.characterQueue[i].length; j++) {
                if (config.userData.characterQueue[i][j] && config.userData.characterQueue[i][j].lv === 1 && config.userData.characterQueue[i][j].star === 1
                     && CharacterEnum[config.userData.characterQueue[i][j].id].CharacterQuality === quality) {
                        this.decomposeCharacter.add(config.userData.characterQueue[i][j])
                        characterNumbers++
                }
            }
        }
        // 检测是否在characters中
        for (let i = 0; i < config.userData.characters.length; i++) {
            if (CharacterEnum[config.userData.characters[i].id].CharacterQuality === quality && 
                config.userData.characters[i].lv === 1 && config.userData.characters[i].star ===1 
                ) {
                this.decomposeCharacter.add(config.userData.characters[i])
                characterNumbers++
            }
        }

        // 计算灵魂总和
        this.allSouls += qualitySouls[quality - 1] * characterNumbers

        // log('筛选出', characterNumbers, '个品质为', quality, '的角色', this.decomposeCharacter)
    }

    // 取消勾选对应品质的角色
    cancelSelect(characterQuality: number) {
        // 过滤出需要保留的角色
        const toKeep = Array.from(this.decomposeCharacter).filter(
            (character) => CharacterEnum[character.id].CharacterQuality !== characterQuality
        );

        // 计算需要移除的角色数量
        const removedCount = this.decomposeCharacter.size - toKeep.length;

        // 更新 decomposeCharacter
        this.decomposeCharacter = new Set(toKeep);

        // 更新灵魂总和
        this.allSouls -= qualitySouls[characterQuality - 1] * removedCount;

        // log('取消选中了', characterQuality, '品质的角色', removedCount, '个', this.decomposeCharacter)
    }

    updateTip() {
        this.TipNode.getComponent(Label).string = `分解将获得灵魂     : ${formateNumber(this.allSouls)}`
    }
}


