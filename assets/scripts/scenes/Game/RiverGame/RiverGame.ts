import { _decorator, Component, Node, Vec2 } from 'cc';
import { ResourceRaft } from './River/Resource/ResourceRaft';
const { ccclass, property } = _decorator;

const waterChanelsAngle: number[] = [0, 0, 0, 90, 180, 180, 180, 90, 0, 0]

@ccclass('RiverGame')
export class RiverGame extends Component {
    @property(Node) WaterChanelNode: Node

    isGameOver: boolean = false

    fightSuccess() {
        this.isGameOver = true
        // this.node.parent.getComponent(GameCanvas).fightSuccess();
        this.node.getComponentInChildren(ResourceRaft).changePos();
    }

    checkWaterChanel() {
        for (let i = 0; i < this.WaterChanelNode.children.length; i++) {
            if ((this.WaterChanelNode.children[i].angle % 360) !== waterChanelsAngle[i]) {
                return false
            } 
        }
        return true
    }
}


