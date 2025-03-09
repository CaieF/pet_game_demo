import { _decorator, Component, EventTouch, Node, Prefab } from 'cc';
import { getConfig } from 'db://assets/scripts/common/config/config';
import { IBookPage } from 'db://assets/scripts/game/fight_entity/bookPages';
import { HolBookPage } from 'db://assets/scripts/prefab/HolBookPage';
import { load } from 'db://assets/scripts/util/bundle/load';
import { getNodePool } from 'db://assets/scripts/util/resource/getNodePool';
import { util } from 'db://assets/scripts/util/util';
const { ccclass, property } = _decorator;

@ccclass('Book')
export class Book extends Component {
    @property(Node) BookListNode: Node;

    async clickTitle(e: EventTouch, titleId: string) {
        const id = parseInt(titleId);
        const config = getConfig();
        if (!config.userData.bookPageProgress[id - 1] || !config.userData.bookPageProgress[id - 1].isUnlock) {
            return await util.message.prompt({message: "该内容未解锁，请尝试通关解锁"})
        }
        const close = await util.message.load()
        this.BookListNode.active = false;
        const page = config.userData.bookPageProgress[id - 1];
        await this.addPage(page);
        if (page.isNearPage && page.isLeft && config.userData.bookPageProgress[id].isUnlock) await this.addPage(config.userData.bookPageProgress[id]);
        if (page.isNearPage && !page.isLeft && config.userData.bookPageProgress[id - 2].isUnlock) await this.addPage(config.userData.bookPageProgress[id - 2]);
        close();
    }

    async addPage(page: IBookPage) {
        const nodePool = getNodePool(await load("prefab/HolBookPage", Prefab))
        const node = nodePool.get();
        const holBookPage = node.getComponent(HolBookPage);
        await holBookPage.setBookPage(page);
        this.node.addChild(node);
        if (page.isLeft) {
            node.setPosition(-255, 0);
        } else {
            node.setPosition(255, 0);
        }
    }
}


