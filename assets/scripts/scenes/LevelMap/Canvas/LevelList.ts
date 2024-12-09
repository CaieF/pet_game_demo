import { _decorator, Component, director, find, Node, NodeEventType, Prefab } from 'cc';
import levels, { ILevel, ILevelDialog } from '../../../game/fight_entity/level';
import { util } from '../../../util/util';
import { HolLevel } from '../../../prefab/HolLevel';
import { common, sceneCommon } from '../../../common/common/common';
import { SCENE } from '../../../common/enums';
import { HolDialogBox } from '../../../prefab/HolDialogBox';
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
        //const close = await util.message.load()
        common.level = level
        if (level.dialogs) {
            this.showDialog(level.dialogs)
        } else {
            this.intoFightMap()
        }

        
    }

    // 显示对话
    public async showDialog(dialog: ILevelDialog[]) {
        const close = await util.message.load()
        const nodePool = util.resource.getNodePool(
            await util.bundle.load('prefab/HolDialogBox', Prefab)
        )
        const node = nodePool.get()
        const holDialogBox = node.getComponent(HolDialogBox)
        await holDialogBox.initDialogBox(dialog[0])
        node.getChildByName('background').on(NodeEventType.TOUCH_END, async()=> {
            if (dialog.length > 1) {
                //close()
                nodePool.put(node)
                await this.showDialog(dialog.slice(1))
            } else {
                //close()
                nodePool.put(node)
                this.intoFightMap()
            }
        })
        node.setParent(find('Canvas'))
        close()
    }

    public async intoFightMap() {
        const close = await util.message.load()
        director.preloadScene("Fight", async()=> {
            sceneCommon.lastScene = SCENE.HOME
            sceneCommon.currentScene = SCENE.FIGHT
            close();
        })
        director.loadScene("Fight");
    }
}
