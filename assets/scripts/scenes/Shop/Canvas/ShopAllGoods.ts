import { _decorator, Component, Label, Node, NodeEventType, Prefab, ScrollView } from 'cc';
import { goods, IGOOD } from '../../../game/fight_entity/goods';
import { util } from '../../../util/util';
import { HolGood } from '../../../prefab/HolGood';
import { ShopUi } from './ShopUi';
const { ccclass, property } = _decorator;

@ccclass('ShopAllGoods')
export class ShopAllGoods extends Component {
    @property(Node) content: Node = null;
    // @property(Node) dialogBoxLabel: Label = null;
    @property(ShopUi) shopUi: ShopUi = null;

    selectedGood: IGOOD = null;
    selectedGoodNode: Node = null;

    // 渲染所有的商品
    public async renderAllGoods() {
        this.content.removeAllChildren()
        const goodList = goods
        const close = await util.message.load()
        const nodePool = util.resource.getNodePool(
            await util.bundle.load('prefab/HolGood', Prefab)
        )
        for (let i = 0; i < goodList.length; i++) {
            const node = nodePool.get()
            const holGood = node.getComponent(HolGood)
            await holGood.setGood(goodList[i])
            this.content.addChild(node)
        }
        close()
    }
}


