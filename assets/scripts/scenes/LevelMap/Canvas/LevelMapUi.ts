import { _decorator, Component, Node, Prefab } from 'cc';
import { util } from '../../../util/util';
const { ccclass, property } = _decorator;

@ccclass('LevelMapUi')
export class LevelMapUi extends Component {
    // 返回
    public async goBack() {
        const close = await util.message.load()
        const nodePool = util.resource.getNodePool(await util.bundle.load('prefab/HolLevelMap', Prefab))
        nodePool.put(this.node.parent);
        close()
    }
}


