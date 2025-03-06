import { _decorator, Component, Label, Node } from 'cc';
import { getConfig } from '../common/config/config';
import { util } from '../util/util';
const { ccclass, property } = _decorator;

@ccclass('HolDrawResource')
export class HolDrawResource extends Component {
    protected start(): void {
        this.render()
    }

    public render() {
        const config = getConfig()
        this.node.getChildByName('Draw').getChildByName('Value').getComponent(Label).string = 
            util.subdry.formateNumber(config.userData.draw)
    }
}


