import { _decorator, Component, NodeEventType, Prefab, UITransform } from 'cc';
import { ILevel, ILevelDialog } from '../../../game/fight_entity/level';
import { util } from '../../../util/util';
import { HolLevel } from '../../../prefab/HolLevel';
import { common, sceneCommon } from '../../../common/common/common';
import { LEVELTYPE, SCENE } from '../../../common/enums';
import { getConfig } from '../../../common/config/config';
import { log } from '../../../util/out/log';
const { ccclass, property } = _decorator;

@ccclass('LevelList')
export class LevelList extends Component {


    protected async start() {
        await this.renderAllLevels()
    }
    
    // 渲染所有的关卡
    public async renderAllLevels() {
        const config = getConfig()
        const levels = config.userData.levelProcess.levels
        log('currentLevel', config.userData.levelProcess.currentLevel)
        log('levels', levels)
        // 加载动画
        const close = await util.message.load()
        const nodePool = util.resource.getNodePool(
            await util.bundle.load('prefab/HolLevel', Prefab)
        )
        for (const key in levels) {
            const node = nodePool.get()
            const holLevel = node.getComponent(HolLevel)
            await holLevel.setLevel(levels[key])
            if (config.userData.levelProcess.currentLevel >= levels[key].id) {
                node.on(NodeEventType.TOUCH_END, () => {
                    this.clickLevel(levels[key])
                }, node)
            } else {
                node.on(NodeEventType.TOUCH_END, async() => {
                    await util.message.prompt({message: "关卡未解锁"})
                }, node)
            }
            this.node.addChild(node)
        }
        close()
    }

    // 点击关卡
    public async clickLevel(level: ILevel) {
        common.level = level
        // const close = await util.message.load()
        const result = await util.message.levelDetail(level.levelDetail)
        if (result === false) {
            common.level = null
            return
        } 
        // levelDetailNode.setPosition(level.position)
        // close()
        if (level.dialogs) {
            this.showDialog(level.dialogs)
        } else {
            if (level.type === LEVELTYPE.FIGHT)
                util.subdry.sceneDirector(SCENE.HOME, SCENE.FIGHT)
            else
                util.subdry.sceneDirector(SCENE.HOME, SCENE.GAME)
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
                if (common.level.type === LEVELTYPE.FIGHT)
                    util.subdry.sceneDirector(SCENE.HOME, SCENE.FIGHT)
                else
                    util.subdry.sceneDirector(SCENE.HOME, SCENE.GAME)       
            }
        })
        close()
    }

}
