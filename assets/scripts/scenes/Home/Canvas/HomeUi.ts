import { _decorator, Component, director, Node } from 'cc';
import { util } from '../../../util/util';
import { CharacterBagpack } from '../../Team/Canvas/CharacterBagpack';
import { SCENE } from '../../../common/enums';
import { BookUi } from './Book/BookUi';
const { ccclass, property } = _decorator;

@ccclass('HomeUi')
export class HomeUi extends Component {
    // 打开宠物背包
    async OpenHero() {
        await util.subdry.sceneDirector(SCENE.HOME, SCENE.HERO)
    }

    // 打开布阵
    async OpenTeam() {
        const close = await util.message.load();
        this.node.parent.getChildByName("HolTeam").active = true;
        await this.node.parent.getChildByName("HolTeam").getChildByName('CharacterBagpack').getComponent(CharacterBagpack).renderAllCharacter();
        close();
    }

    // 打开星图界面
    async OpenStarMap() {
        const close = await util.message.load();
        
        this.node.parent.getChildByName("HolStarMap").active = true;
        close();
    }

    // 打开科普界面
    async OpenBook() {
        const close = await util.message.load();
        this.node.parent.getChildByName("HolBook").active = true;
        await this.node.parent.getChildByName("HolBook").getChildByName("Ui").getComponent(BookUi).goFirst();
        close()
    }
    
}


