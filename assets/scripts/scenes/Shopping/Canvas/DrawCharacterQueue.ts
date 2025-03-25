import { _decorator, Component, Prefab } from 'cc';
import { util } from '../../../util/util';
import { CharacterStateCreate } from '../../../game/fight/character/CharacterState';
import { HolCharacterAvatar } from '../../../prefab/HolCharacterAvatar';

const { ccclass, property } = _decorator;

@ccclass('DrawCharacterQueue')
export class DrawCharacterQueue extends Component {


    public characters: CharacterStateCreate[] = []
    async start() {
        // this.renderDrawCharacter()
    }

    public async renderDrawCharacter() {
        // 加载动画
        const close = await util.message.load()
        this.node.getChildByName('DrawCharacterQueue').removeAllChildren()
        const nodePool = util.resource.getNodePool(
            await util.bundle.load('prefab/HolCharacterAvatar', Prefab)
        )
        // 遍历数组
        for (let i=0; i < this.characters.length; i++) {
            const character = this.characters[i]
            const node = nodePool.get()
            const characterAvatar = node.getComponent(HolCharacterAvatar)
            await characterAvatar.setCharacter(character)
            this.node.getChildByName('DrawCharacterQueue').addChild(node)  
        }
        close()
    }

    public async closeDraw() {
        const close = await util.message.load()
        this.node.getChildByName('DrawCharacterQueue').removeAllChildren()
        this.characters = []
        this.node.active = false
        close()
    }
}


