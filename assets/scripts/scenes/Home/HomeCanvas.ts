import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import { getConfig } from '../../common/config/config';
import { util } from '../../util/util';
import { common, sceneCommon } from '../../common/common/common';
import { MUSICFOLDER, SCENE } from '../../common/enums';
import { CommonCanvas } from '../CommonCanvas';
const { ccclass, property } = _decorator;

@ccclass('HomeCanvas')
export class HomeCanvas extends Component {
    protected async start() {
        const close = await util.message.load({});

        // 初始化音乐
        await this.node.getComponent(CommonCanvas).initMusic(MUSICFOLDER.HOME, getConfig().volumeDetail.home)
        if (sceneCommon.lastScene === SCENE.FIGHT && sceneCommon.currentScene === SCENE.HOME) 
            this.node.getChildByName('HolLevelMap').active = true
        close();
    }
}


