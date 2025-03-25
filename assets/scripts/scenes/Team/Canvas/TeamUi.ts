import { _decorator, Button, Component, director, find, Node, Prefab } from 'cc';
import { util } from '../../../util/util';
const { ccclass, property } = _decorator;

@ccclass('TeamUi')
export class TeamUi extends Component {

    // 返回
    public async goBack() {
        const close = await util.message.load()
        const nodePool = util.resource.getNodePool(await util.bundle.load('prefab/HolTeam', Prefab))
        nodePool.put(this.node.parent);
        close()
    }
}


