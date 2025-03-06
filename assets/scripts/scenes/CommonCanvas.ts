import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import { getConfig } from '../common/config/config';
import { util } from '../util/util';
const { ccclass, property } = _decorator;

@ccclass('CommonCanvas')
export class CommonCanvas extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    // 初始化音乐
    public async initMusic(folder: string, volumeDetail: number) {
        const config = getConfig();
        // 音乐
        const musics = await util.bundle.loadDir<AudioClip>("sound/" + folder, AudioClip)
        const music = musics[Math.floor(Math.random() * musics.length)]
        const audioSource = this.node.getComponent(AudioSource);
        audioSource.clip = music;
        audioSource.volume = config.volume * volumeDetail;
        audioSource.play();
    }
}


