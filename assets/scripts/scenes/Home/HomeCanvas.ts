import { _decorator, Component } from 'cc';
import { getConfig, stockConfig } from '../../common/config/config';
import { util } from '../../util/util';
import { sceneCommon } from '../../common/common/common';
import { MUSICFOLDER, SCENE } from '../../common/enums';
import { CommonCanvas } from '../CommonCanvas';

const { ccclass, property } = _decorator;

@ccclass('HomeCanvas')
export class HomeCanvas extends Component {
    protected async start() {
        const close = await util.message.load();

        // 初始化音乐
        await this.node.getComponent(CommonCanvas).initMusic(MUSICFOLDER.HOME, getConfig().volumeDetail.home)
        if ((sceneCommon.lastScene === SCENE.FIGHT || sceneCommon.lastScene === SCENE.GAME) && sceneCommon.currentScene === SCENE.HOME) 
            await util.message.levelMap()
        

        const config = getConfig();
        // config.userData.getAllLevel(7);
        if (config.userData.isNew) {
            util.message.newTip();
            config.userData.isNew = false;
            stockConfig()
        }

        close();
    }

    
}


