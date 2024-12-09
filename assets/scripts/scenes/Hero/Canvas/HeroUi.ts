import { _decorator, Component, director, EventTouch, Node } from 'cc';
import { util } from '../../../util/util';
import { HeroAllHeros } from './HeroAllHeros';
import { CharacterStateCreate } from '../../../game/fight/character/CharacterState';
import { getConfig } from '../../../common/config/config';
import { CharacterEnum } from '../../../game/fight/character/CharacterEnum';
import { sceneCommon } from '../../../common/common/common';
import { SCENE } from '../../../common/enums';
const { ccclass, property } = _decorator;

@ccclass('HeroUi')
export class HeroUi extends Component {
    
    // 回到主页
    async GoBack() {
        const close = await util.message.load()
        director.preloadScene('Home', () => {
            sceneCommon.lastScene = SCENE.HERE
            sceneCommon.currentScene = SCENE.HOME
            close()
        })
        director.loadScene('Home')
    }

    // 当前过滤阵容
    private $currentCamp: string = ''
    // 阵容过滤
    async filterByCamp(e: EventTouch, camp: string) {
        const allHeros = this.node.parent.getChildByName('AllHeros').getComponent(HeroAllHeros)
        let characterQueue: CharacterStateCreate[] = []
        this.node.children.forEach(node => {
            const light = node.getChildByName('Light')
            if (light) light.active = false
        })
        if (this.$currentCamp === camp) {
            const config = getConfig()
            const close = await util.message.load()
            config.userData.characterQueue.forEach(cq => cq.forEach(c => {if(c) characterQueue.push(c)}))
            characterQueue = characterQueue.concat(config.userData.characters)
            await allHeros.render(characterQueue)
            close()
            this.$currentCamp = ''
        } else {
            this.$currentCamp = camp
            const config = getConfig()
            const close = await util.message.load()
            config.userData.characterQueue.forEach(cq => cq.forEach(c => {if(c) characterQueue.push(c)}))
            characterQueue = characterQueue.concat(config.userData.characters)
            characterQueue = characterQueue.filter(c => CharacterEnum[c.id].CharacterCamp === camp)
            await allHeros.render(characterQueue)
            close()
            e.target.getChildByName('Light').active = true
        }
    }
}


