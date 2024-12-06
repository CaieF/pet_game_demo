import { _decorator, Component, director, Node, NodeEventType, Prefab } from 'cc';
import levels, { ILevel } from '../../../game/fight_entity/level';
import { util } from '../../../util/util';
import { HolLevel } from '../../../prefab/HolLevel';
import { FightMap } from '../../Fight/Canvas/FightMap';
import { common } from '../../../common/common/common';
const { ccclass, property } = _decorator;

@ccclass('LevelList')
export class LevelList extends Component {

    protected async start() {
        await this.renderAllLevels()
    }
    
    // 渲染所有的关卡
    public async renderAllLevels() {
        const leves = levels
        // 加载动画
        const close = await util.message.load()
        const nodePool = util.resource.getNodePool(
            await util.bundle.load('prefab/HolLevel', Prefab)
        )
        for (const key in leves) {
            const node = nodePool.get()
            const holLevel = node.getComponent(HolLevel)
            await holLevel.setLevel(leves[key])
            node.on(NodeEventType.TOUCH_END, () => {
                this.clickLevel(levels[key])
            }, node)
            this.node.addChild(node)
        }
        close()
    }

    // 点击关卡
    public async clickLevel(level: ILevel) {
        // 加载动画
        const close = await util.message.load()
        director.preloadScene("Fight", async()=> {
            common.level = level

            close();
        })
        director.loadScene("Fight");
    }
}


