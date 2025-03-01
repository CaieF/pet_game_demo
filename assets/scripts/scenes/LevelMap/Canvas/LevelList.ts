import { _decorator, Component, NodeEventType, Prefab } from 'cc';
import levels, { ILevel, ILevelDialog } from '../../../game/fight_entity/level';
import { util } from '../../../util/util';
import { HolLevel } from '../../../prefab/HolLevel';
import { common, sceneCommon } from '../../../common/common/common';
import { SCENE } from '../../../common/enums';
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
        common.level = level
        if (level.dialogs) {
            this.showDialog(level.dialogs)
        } else {
            util.subdry.sceneDirector(SCENE.HOME, SCENE.FIGHT)
        }
    }

    // 显示对话
    public async showDialog(dialog: ILevelDialog[]) {
        const close = await util.message.load()
        const node = await util.message.dialogBox({dialog: dialog[0]})
        node.getChildByName('background').on(NodeEventType.TOUCH_END, async()=> {
            if (dialog.length > 1) {
                await this.showDialog(dialog.slice(1))
            } else {
                util.subdry.sceneDirector(SCENE.HOME, SCENE.FIGHT)
            }
        })
        close()
    }

}
