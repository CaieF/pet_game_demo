import { _decorator, Component, director, Node, Scene, SpriteFrame } from 'cc';
import { HolPreLoad } from '../../prefab/HolPreLoad';
import { util } from '../../util/util';
import { SCENE } from '../../common/enums';
import { sceneCommon } from '../../common/common/common';
const { ccclass, property } = _decorator;

@ccclass('PreloadCanvas')
export class PreloadCanvas extends Component {
    // 预加载
    async start() {
        
        const holPreLoad = this.node.getChildByName("HolPreLoad").getComponent(HolPreLoad);
        director.preloadScene("Home");
        // HolPreLoad节点
        holPreLoad.setTips([
            "Steady we ride, Watching scenes playing out from our past\n Like the smell of her hair, Those times always fly by so fast" ,
            "気づいたんだ 自分の中 育つのは悪魔の子\n 正義の裏 犠牲の中 心には悪魔の子",
            "Needles broken, The feeling's woken\n Should we just let it all fade, Is it just time", 
        ])
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
            sceneCommon.lastScene = SCENE.Preload;
            sceneCommon.currentScene = SCENE.HOME;
            director.loadScene("Home");
        });
    }

    update(deltaTime: number) {
        
    }
}


