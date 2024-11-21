import { _decorator, Button, Component, director, find, Node } from 'cc';
import { util } from '../../../util/util';
const { ccclass, property } = _decorator;

@ccclass('TeamUi')
export class TeamUi extends Component {

    // 返回
    public async goBack() {
        const close = await util.message.load()
        this.node.parent.active = false;
        close()
    }
}


