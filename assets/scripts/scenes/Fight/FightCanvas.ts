import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import { getConfig } from '../../common/config/config';
import { util } from '../../util/util';
import { CommonCanvas } from '../CommonCanvas';
import { MUSICFOLDER } from '../../common/enums';
const { ccclass, property } = _decorator;

@ccclass('FightCanvas')
export class FightCanvas extends Component {
    protected async start() {
        // 初始化音乐
        this.node.getComponent(CommonCanvas).initMusic(MUSICFOLDER.FIGHT, getConfig().volumeDetail.fight);
    }

}


