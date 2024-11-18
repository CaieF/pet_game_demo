import { _decorator, Component, Node } from 'cc';
import { getConfig } from '../../../common/config/config';
import { util } from '../../../util/util';
import { CharacterStateCreate } from '../../../game/fight/character/CharacterState';
import { HolCharactersQueue } from '../../../prefab/HolCharactersQueue';
import { HeroCharacterDetail } from './HeroCharacterDetail';
const { ccclass, property } = _decorator;

@ccclass('HeroAllHeros')
export class HeroAllHeros extends Component {
    protected async start() {
        // 第一次渲染所有角色
        const config = getConfig();
        const close = await util.message.load();
        const characterQueue = [];
        // 遍历二维数组
        config.userData.characterQueue.forEach(cq => cq.forEach(c => {
            if (c) characterQueue.push(c);
        }))
        await this.render([].concat(characterQueue, config.userData.characters))
        close()
    }

    async render(characterQueue: CharacterStateCreate[]) {
        await this.node.getChildByName("HolCharactersQueue")
        .getComponent(HolCharactersQueue).render(characterQueue, async(c , n) => {
            const characterDetail = this.node.parent.getChildByName('CharacterDetail')
            characterDetail.active = true;
            await characterDetail.getComponent(HeroCharacterDetail).setCharacter(c)
        })
    }
}


