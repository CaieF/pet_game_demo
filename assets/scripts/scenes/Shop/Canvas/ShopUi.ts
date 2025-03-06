import { _decorator, Component, Label, Node, Sprite, UIOpacity } from 'cc';
import { log } from '../../../util/out/log';
import { util } from '../../../util/util';
import { SCENE } from '../../../common/enums';
import { ShopTips } from '../../../common/Tips';
const { ccclass, property } = _decorator;

@ccclass('ShopUi')
export class ShopUi extends Component {
    // 回到主页
    async GoBack() {
        await util.subdry.sceneDirector(SCENE.SHOP, SCENE.HOME)
    }

    async clickWomen() {
        this.changeTips(ShopTips)
    }

    changeTips(tips: string[]) {
        let tip: string = tips[Math.floor(Math.random() * tips.length)]
        while (tip === this.node.getChildByName('DialogBox').getComponentInChildren(Label).string) {
            tip = tips[Math.floor(Math.random() * tips.length)]
        }
        this.node.getChildByName('DialogBox').getComponentInChildren(Label).string = tip
    }
    
}


