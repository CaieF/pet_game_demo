import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { CharacterStateCreate } from '../game/fight/character/CharacterState';
import { CharacterEnum } from '../game/fight/character/CharacterEnum';
import { util } from '../util/util';
const { ccclass, property } = _decorator;

@ccclass('HolCharacterAvatar')
export class HolCharacterAvatar extends Component {

    @property(Node) AvatarNode: Node; // 头像节点

    @property(Node) LegendBorderNode: Node; // 头像框边框节点

    @property(Node) BorderNode: Node;  // 头像框节点

    @property(Node) CampNode: Node;  // 属性节点

    @property(Node) LvNode: Node;  // 等级节点
    
    async setCharacter(create: CharacterStateCreate) {
        const meta = CharacterEnum[create.id];
        this.AvatarNode.getComponent(Sprite).spriteFrame = 
            await util.bundle.load(meta.AvatarPath , SpriteFrame)
        if (meta.CharacterQuality < 5) this.LegendBorderNode.active = false
        this.BorderNode.getComponent(Sprite).spriteFrame = 
            await util.bundle.load(`image/quality_border/${meta.CharacterQuality}/spriteFrame` , SpriteFrame)
        this.CampNode.getComponent(Sprite).spriteFrame = 
            await util.bundle.load(`image/camp_icon/${meta.CharacterCamp}/spriteFrame` , SpriteFrame)
        this.LvNode.getComponent(Label).string = 'Lv: ' + create.lv
    }
}


