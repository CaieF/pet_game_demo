import { _decorator, Component } from 'cc';
import { util } from 'db://assets/scripts/util/util';
import { RiverGame } from '../RiverGame';
const { ccclass, property } = _decorator;

@ccclass('RiverUi')
export class RiverUi extends Component {

    public async sureAns() {
        if (this.node.parent.getComponent(RiverGame).isGameOver) return
        if (this.node.parent.getComponent(RiverGame).checkWaterChanel()) {
            this.node.parent.getComponent(RiverGame).fightSuccess()
            return
        } else {
            return await util.message.prompt({message: "水渠方向不正确，请重新调整"})
        }
    }
}


