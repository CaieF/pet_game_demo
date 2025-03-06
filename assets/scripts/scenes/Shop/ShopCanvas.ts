import { _decorator, Component, Node } from 'cc';
import { CommonCanvas } from '../CommonCanvas';
import { util } from '../../util/util';
import { getConfig } from '../../common/config/config';
import { MUSICFOLDER } from '../../common/enums';
const { ccclass, property } = _decorator;

@ccclass('ShopCanvas')
export class ShopCanvas extends Component {
    protected async start() {
        const close = await util.message.load({})
        await this.node.getComponent(CommonCanvas).initMusic(MUSICFOLDER.SHOP, getConfig().volumeDetail.shop);
        close();
    }

    // 初始化音乐
}


