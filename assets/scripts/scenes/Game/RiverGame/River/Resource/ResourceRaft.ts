import { _decorator, Component, find, Node, tween, Vec3 } from 'cc';
import { GameCanvas } from '../../../GameCanvas';
const { ccclass, property } = _decorator;

const raftPos: Vec3[] = [new Vec3(-510, 229), new Vec3(-510, 10), new Vec3(30, 10), new Vec3(30, -200), new Vec3(-400, -200)]

@ccclass('ResourceRaft')
export class ResourceRaft extends Component {
    @property(Node) GameCanvas: Node
    
    changePos() {

        tween(this.node)
        .to(2, { position: raftPos[0] })
        .to(1, { position: raftPos[1] })
        .call(() => { this.node.setScale(-1, 1, 1) })
        .to(1.5, { position: raftPos[2] })
        .to(1, { position: raftPos[3] })
        .call(() => { this.node.setScale(1, 1, 1) })
        .to(1.5, { position: raftPos[4] })
        .call(() => {
            find('Canvas').getComponent(GameCanvas).fightSuccess()
        })
        .start()
    }
}


