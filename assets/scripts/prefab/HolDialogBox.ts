import { _decorator, Component, Label, Node } from 'cc';
import { ILevelDialog } from '../game/fight_entity/level';
import { HolCharacterAvatar } from './HolCharacterAvatar';
import { CharacterEnum } from '../game/fight/character/CharacterEnum';
const { ccclass, property } = _decorator;

@ccclass('HolDialogBox')
export class HolDialogBox extends Component {
    @property(Node) DialogBox: Node

    async initDialogBox(dialog: ILevelDialog) {
        await this.DialogBox.getChildByName('HolCharacterAvatar').getComponent(HolCharacterAvatar).setCharacter(dialog.character)
        this.DialogBox.getChildByName('Name').getComponent(Label).string = CharacterEnum[dialog.character.id].name
        this.DialogBox.getChildByName('Content').getComponent(Label).string = dialog.dialog
    }
}


