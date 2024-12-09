import { _decorator, Component, Node, Event, Label, director, toDegree } from 'cc';
import { HolCharacter } from '../../../prefab/HolCharacter';
import { util } from '../../../util/util';
import { FightMap } from './FightMap';
import { common, sceneCommon } from '../../../common/common/common';
import { log } from '../../../util/out/log';
import { SCENE } from '../../../common/enums';
const { ccclass, property } = _decorator;

@ccclass('FightUi')
export class FightUi extends Component {

    @property(Node) FightMapNode: Node

    // 当前倍数
    // private timeScale: number = 1

    protected start() {
        this.node.getChildByName('TimeScale').getChildByName('Value').getComponent(Label).string = 'x' + common.timeScale
    }
    
    // 倍数
    setTimeScale(e: Event) {
        common.timeScale++
        if (common.timeScale > 3) common.timeScale = 1
        for (const node of this.FightMapNode.children)
            node.getComponent(HolCharacter).holAnimation.timeScale = common.timeScale
        e.target.getChildByName('Value').getComponent(Label).string = 'x' + common.timeScale
        return
    }

    // 跳过战斗
    async skipFight() {
        const result = await util.message.confirm({message: '确定要跳过战斗吗？'})

        if (result) {
            this.FightMapNode.getComponent(FightMap).isPlayAnimation = false
        }
    }

    // 返回
    // 回到主页
    async GoBack() {
        const close = await util.message.load()
        director.preloadScene('Home', () => {
            sceneCommon.lastScene = SCENE.FIGHT
            sceneCommon.currentScene = SCENE.HOME
            close()
        })
        director.loadScene('Home')
    }
}


