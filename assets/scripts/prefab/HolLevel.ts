import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { ILevel } from '../game/fight_entity/level';
import { util } from '../util/util';
const { ccclass, property } = _decorator;

@ccclass('HolLevel')
export class HolLevel extends Component {
    @property(Node) title: Node;

    
    async setLevel(Level: ILevel) {
        this.title.getComponent(Label).string = Level.name;
        this.node.getComponent(Sprite).spriteFrame = await util.bundle.load(Level.icon, SpriteFrame)
        this.node.setPosition(Level.position);
    }
}


