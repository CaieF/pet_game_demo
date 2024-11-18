import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import { getConfig } from '../../common/config/config';
import { util } from '../../util/util';
const { ccclass, property } = _decorator;

@ccclass('HomeCanvas')
export class HomeCanvas extends Component {
    protected async start() {
        const close = await util.message.load({});

        // 初始化音乐
        await this.initMusic();

        close();
    }

    // 初始化音乐
    private async initMusic() {
        const config = getConfig();
        // 音乐们
        const musics = await util.bundle.loadDir<AudioClip>("sound/home", AudioClip); 
        const music = musics[Math.floor(Math.random() * musics.length)]
        const audioSource = this.node.getComponent(AudioSource);
        audioSource.clip = music;
        audioSource.volume = config.volume * config.volumeDetail.home;
        audioSource.play();
    }
}


