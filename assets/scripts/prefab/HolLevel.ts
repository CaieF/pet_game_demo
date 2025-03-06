import { _decorator, Button, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { ILevel } from '../game/fight_entity/level';
import { util } from '../util/util';
import { log } from '../util/out/log';
const { ccclass, property } = _decorator;

@ccclass('HolLevel')
export class HolLevel extends Component {
    @property(Node) title: Node;

    
    async setLevel(Level: ILevel) {
        if (Level.isUnlock) {
            this.node.getComponent(Sprite).grayscale = false;
            this.node.getChildByName('Star').active = true;
            for (let i = 0; i < Level.star; i++) {
                this.node.getChildByName('Star').getChildByName(`S${i + 1}`).getChildByName('S').active = true;
            }
        }
        this.title.getComponent(Label).string = Level.name;
        this.node.getComponent(Sprite).spriteFrame = await util.bundle.load(Level.icon, SpriteFrame)
        this.node.setPosition(Level.position);
    }
}


