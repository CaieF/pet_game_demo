import { _decorator, Component, director, Node, Prefab } from 'cc';
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
        await util.message.team()
        close();
    }

    // 打开星图界面
    async OpenStarMap() {
        const close = await util.message.load();
        
        await util.message.starMap()
        close();
    }

    // 打开科普界面
    async OpenBook() {
        const close = await util.message.load();
        const node = await util.message.book()
        await node.getChildByName("Ui").getComponent(BookUi).goFirst();
        close()
    }

    // 打开兑换码界面
    async OpenExchange() {
        const close = await util.message.load();
        await util.message.exchange()
        
        close()
    
    }
    
}


