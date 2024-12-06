import { _decorator, Component, Node } from 'cc';
import { util } from '../../../util/util';
const { ccclass, property } = _decorator;

@ccclass('LevelMapUi')
export class LevelMapUi extends Component {
    // 返回
    public async goBack() {
        const close = await util.message.load()
        this.node.parent.active = false;
        close()
    }
}


