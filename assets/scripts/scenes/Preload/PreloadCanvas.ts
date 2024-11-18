import { _decorator, Component, director, Node, SpriteFrame } from 'cc';
import { HolPreLoad } from '../../prefab/HolPreLoad';
import { util } from '../../util/util';
const { ccclass, property } = _decorator;

@ccclass('PreloadCanvas')
export class PreloadCanvas extends Component {
    // 预加载
    async start() {
        // HolPreLoad节点
        const holPreLoad = this.node.getChildByName("HolPreLoad").getComponent(HolPreLoad);
        director.preloadScene("Home");
        holPreLoad.setProcess(20);

        await util.message.preloadConfirm(); // 预加载确认框
        holPreLoad.setProcess(30);
        await util.message.preloadPrompt();   // 预加载提示框
        holPreLoad.setProcess(40);
        await util.message.preloadLoad();  // 预加载加载框
        holPreLoad.setProcess(60);
        await util.bundle.loadDir('image/number', SpriteFrame); // 加载数字图片
        holPreLoad.setProcess(70);
        util.message.preloadIntroduce(); // 预加载介绍
        holPreLoad.setProcess(80);

        holPreLoad.setProcess(100);

        // 监听进度条完成函数
        holPreLoad.listenComplete(() => {
            director.loadScene("Home");
        });
    }

    update(deltaTime: number) {
        
    }
}

