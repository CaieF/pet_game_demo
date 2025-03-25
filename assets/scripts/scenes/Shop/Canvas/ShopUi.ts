import { _decorator, Component, Label, Node, Prefab } from 'cc';
import { util } from '../../../util/util';
import { ShopTips } from '../../../common/Tips';
const { ccclass, property } = _decorator;

@ccclass('ShopUi')
export class ShopUi extends Component {
    // 回到主页
    async GoBack() {
        const close = await util.message.load();
        const nodePool = util.resource.getNodePool(await util.bundle.load('prefab/HolShop', Prefab))
        nodePool.put(this.node.parent)
        close();
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


