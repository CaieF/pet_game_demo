import { _decorator, Component, Node, Prefab } from 'cc';
import { load } from 'db://assets/scripts/util/bundle/load';
import { getNodePool } from 'db://assets/scripts/util/resource/getNodePool';
import { util } from 'db://assets/scripts/util/util';
const { ccclass, property } = _decorator;

@ccclass('BookUi')
export class BookUi extends Component {
    @property(Node) BookNode: Node;
    // 返回
    public async goBack() {
        const close = await util.message.load()
        this.node.parent.active = false;
        close()
    }

    // 返回目录
    public async goFirst() {
        if (this.BookNode.getChildByName("BookList").active) return;
        const close = await util.message.load()
        const nodePool = getNodePool(await load("prefab/HolBookPage", Prefab))
        let i = this.BookNode.children.length - 1;
        while (i > 0) {
            nodePool.put(this.BookNode.children[i])
            i--;
        }
        this.BookNode.getChildByName("BookList").active = true;
        close()
    }
}


