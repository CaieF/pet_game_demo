import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { IBookPage } from '../game/fight_entity/bookPages';
import { util } from '../util/util';
const { ccclass, property } = _decorator;

@ccclass('HolBookPage')
export class HolBookPage extends Component {
    public page: IBookPage = null;

    @property(Node) TitleNode: Node;

    @property(Node) ContentNode: Node;

    @property(Node) IconNode: Node;

    async setBookPage(page: IBookPage) {
        this.page = page;
        this.TitleNode.getComponent(Label).string = page.title;
        this.ContentNode.getComponent(Label).string = page.content;
        this.IconNode.getComponent(Sprite).spriteFrame =
            await util.bundle.load(page.icon, SpriteFrame)
    }
}


