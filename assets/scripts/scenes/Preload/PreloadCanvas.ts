import { _decorator, Component, director, Node, Scene, SpriteFrame } from 'cc';
import { HolPreLoad } from '../../prefab/HolPreLoad';
import { util } from '../../util/util';
import { SCENE } from '../../common/enums';
import { sceneCommon } from '../../common/common/common';
import { PreloadTips } from '../../common/Tips';
import { getConfig, stockConfig } from '../../common/config/config';
const { ccclass, property } = _decorator;

@ccclass('PreloadCanvas')
export class PreloadCanvas extends Component {
    // 预加载
    async start() {
        
        const holPreLoad = this.node.getChildByName("HolPreLoad").getComponent(HolPreLoad);
        director.preloadScene("Home");
        // HolPreLoad节点
        holPreLoad.setTips(PreloadTips)
        holPreLoad.setProcess(10);
        const config = getConfig();
        if (config.userData.isNew) {
            await util.message.preloadNewTip(); // 预加载新手提示框
            this.giveNewCharacter();
            stockConfig();
        }
        await util.game.preloadLever(); // 预加载 lever游戏
        await util.game.preloadRiver(); // 预加载 river游戏
        await util.game.preloadFire(); // 预加载 fire游戏
        holPreLoad.setProcess(20);
        await util.message.preloadConfirm(); // 预加载确认框
        holPreLoad.setProcess(30);
        await util.message.preloadPrompt();   // 预加载提示框
        holPreLoad.setProcess(40);
        await util.message.preloadLoad();  // 预加载加载框
        holPreLoad.setProcess(50);
        await util.message.preloadDialogBox(); // 预加载对话框
        holPreLoad.setProcess(60);
        await util.bundle.loadDir('image/number', SpriteFrame); // 加载数字图片
        holPreLoad.setProcess(70);
        await util.message.preloadIntroduce(); // 预加载介绍
        await util.message.preloadShop(); // 预加载商店
        holPreLoad.setProcess(80);
        await util.message.preloadLevelMap(); // 预加载关卡地图
        await util.message.preloadLevelDetail(); // 预加载关卡详情
        holPreLoad.setProcess(90);
        await util.message.preloadExchange(); // 预加载兑换框
        await util.message.preloadStarMap(); // 预加载星图框
        await util.message.preloadBook(); // 预加载书籍框
        await util.message.preloadTeam(); // 预加载队伍框
        holPreLoad.setProcess(95);
        
        holPreLoad.setProcess(100);
        

        // 监听进度条完成函数
        holPreLoad.listenComplete(() => {
            sceneCommon.lastScene = SCENE.Preload;
            sceneCommon.currentScene = SCENE.HOME;
            director.loadScene("Home");
        });
    }

    giveNewCharacter() {
        const config = getConfig();
        config.userData.addNewCharacter({
            id: 'cat1',
            lv: 5,
            star: 1,
            equipment: [],
        })
        config.userData.addNewCharacter({
            id: 'cat2',
            lv: 5,
            star: 1,
            equipment: [],
        })
        config.userData.addNewCharacter({
            id: 'cat3',
            lv: 5,
            star: 1,
            equipment: [],
        })
        config.userData.addNewCharacter({
            id: 'cat4',
            lv: 5,
            star: 1,
            equipment: [],
        })
        config.userData.addNewCharacter({
            id: 'catGril',
            lv: 5,
            star: 3,
            equipment: [],
        })
    }
}


