import { _decorator, Component, Layout, Node, UITransform } from 'cc';
import { util } from '../../../util/util';
import { CharacterEnum } from '../../../game/fight/character/CharacterEnum';
import { getConfig } from '../../../common/config/config';
import { log } from '../../../util/out/log';
import { DrawCharacterQueue } from './DrawCharacterQueue';
import { CharacterStateCreate } from '../../../game/fight/character/CharacterState';
import { HolDrawResource } from '../../../prefab/HolDrawResource';
const { ccclass, property } = _decorator;

// 品质概率
const qualityProbabilities = {
    5: 0.01, // 1%
    4: 0.05, // 5%
    3: 0.14, // 14%
    2: 0.30, // 30%
    1: 0.50  // 50%
};


@ccclass('ShoppingUi')
export class ShoppingUi extends Component {
    private drawCharacters: CharacterStateCreate[] = []

    @property(Node) DrawResourceNode: Node = null

    // 返回
    public async goBack() {
        const close = await util.message.load()
        this.node.parent.active = false;
        close()
    }

    // 单抽
    public async singleDraw() {
        const config = getConfig()
        const result = await util.message.confirm({
            message: '确认花费一个罗盘进行召唤吗？'
        })
        if (result === false) return;
        // 资源不足
        if (config.userData.draw < 1)   return await util.message.prompt({message: "星象罗盘不足"})
        // 资源减少
        config.userData.draw -= 1
        // 开始抽奖
        const close = await util.message.load() 
        this.drawCharacters = []  // 先清空抽过的角色
        await this.draw()
        this.node.parent.getChildByName('CharacterQueue').getComponent(DrawCharacterQueue).characters = this.drawCharacters
        this.node.parent.getChildByName('CharacterQueue').active = true
        this.node.parent.getChildByName('CharacterQueue').getChildByName('DrawCharacterQueue').getComponent(UITransform).height = 150
        this.node.parent.getChildByName('CharacterQueue').getComponent(DrawCharacterQueue).renderDrawCharacter()
        this.DrawResourceNode.getComponent(HolDrawResource).render()
        close()
    }

    // 十连抽
    public async tenDraw() {
        const config = getConfig()
        const result = await util.message.confirm({
            message: '确认花费十个罗盘进行召唤吗？'
        })
        if (result === false) return;
        // 资源不足
        if (config.userData.draw < 10)   return await util.message.prompt({message: "星象罗盘不足"})
        // 资源减少
        config.userData.draw -= 10
        const close = await util.message.load()
        this.drawCharacters = []
        for (let i = 0; i < 10; i++) {
            await this.draw()
        }
        this.node.parent.getChildByName('CharacterQueue').getComponent(DrawCharacterQueue).characters = this.drawCharacters
        this.node.parent.getChildByName('CharacterQueue').active = true
        this.node.parent.getChildByName('CharacterQueue').getChildByName('DrawCharacterQueue').getComponent(UITransform).height = 300
        this.node.parent.getChildByName('CharacterQueue').getComponent(DrawCharacterQueue).renderDrawCharacter()
        this.DrawResourceNode.getComponent(HolDrawResource).render()
        close()
    }

    // 抽奖
    public async draw() {
        const config = getConfig()
        // 生成随机数以确定品质
        const randomValue = Math.random();
        let cumulativeProbability = 0;
        let selectedQuality: number | null = null;

        // 确定抽中的品质
        for (const quality in qualityProbabilities) {
            cumulativeProbability += qualityProbabilities[quality];
            if (randomValue < cumulativeProbability) {
                selectedQuality = parseInt(quality); // 确定品质
                break;
            }
        }

        const filteredCharacters: [string, typeof CharacterEnum[keyof typeof CharacterEnum]][] = [];
        if (selectedQuality) {
            // 使用 for...in 循环遍历角色
            for (const key in CharacterEnum) {
                const character = CharacterEnum[key];
                if (character.CharacterQuality === selectedQuality) {
                    filteredCharacters.push([key, character]); // 将符合条件的角色及其键存入数组
                }
            }
            if (filteredCharacters.length > 0) {
                const randomIndex = Math.floor(Math.random() * filteredCharacters.length);
                const selectedCharacter = filteredCharacters[randomIndex];
                this.drawCharacters.push({ id: selectedCharacter[0], lv: 1, star: 1, equipment: [] }); // 抽中角色加入队列中                
                config.userData.addNewCharacter({ id: selectedCharacter[0], lv: 1, star: 1, equipment: [] }); // 添加角色到用户数据
            } else {
                log('没有该品质的角色');
            }
        }
    }
}


