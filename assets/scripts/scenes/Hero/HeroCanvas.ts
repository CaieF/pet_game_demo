import { _decorator, Component, Node } from 'cc';
import { util } from '../../util/util';
import { CommonCanvas } from '../CommonCanvas';
import { MUSICFOLDER } from '../../common/enums';
import { getConfig } from '../../common/config/config';
const { ccclass, property } = _decorator;

@ccclass('HeroCanvas')
export class HeroCanvas extends Component {
    protected async start() {
        const close = await util.message.load({});

        // 初始化音乐
        await this.node.getComponent(CommonCanvas).initMusic(MUSICFOLDER.HERO, getConfig().volumeDetail.character)
        close();
    }
}


