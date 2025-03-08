import { _decorator, Component, director, Label, Node, Prefab } from 'cc';
import { ILevelDialog } from '../game/fight_entity/level';
import { HolCharacterAvatar } from './HolCharacterAvatar';
import { CharacterEnum } from '../game/fight/character/CharacterEnum';
import { util } from '../util/util';
import { LEVELTYPE, SCENE } from '../common/enums';
import { common } from '../common/common/common';
const { ccclass, property } = _decorator;

export type HolDialogBoxOption = {
    dialog: ILevelDialog
}

@ccclass('HolDialogBox')
export class HolDialogBox extends Component {
    @property(Node) DialogBox: Node

    // 关闭时的函数
    private $closeQueue: (() => any)[] = [];

    async initDialogBox(dialog: ILevelDialog) {
        await this.DialogBox.getChildByName('HolCharacterAvatar').getComponent(HolCharacterAvatar).setCharacter(dialog.character)
        this.DialogBox.getChildByName('Name').getComponent(Label).string = CharacterEnum[dialog.character.id].name
        this.DialogBox.getChildByName('Content').getComponent(Label).string = dialog.dialog
    }

    public async skip() {
        const nodePool = util.resource.getNodePool(
            await util.bundle.load('prefab/HolDialogBox', Prefab)
        )
        nodePool.put(this.node)
        if (common.level.type === LEVELTYPE.FIGHT)
            await util.subdry.sceneDirector(SCENE.HOME, SCENE.FIGHT)
        else 
            await util.subdry.sceneDirector(SCENE.HOME, SCENE.GAME)
        // await this.intoFightMap()
    }

    listen(event: 'close', call: () => any) {
        if (event === 'close') this.$closeQueue.push(call)
    }

    /** 
     * 关闭本界面
     */
    closeConfirm() { this.$closeQueue.forEach(c => c()) }
}


