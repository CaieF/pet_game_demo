import { _decorator, Button, CharacterController, Component, EventTouch, Node, Prefab } from 'cc';
import { getConfig, stockConfig } from '../../../common/config/config';
import { util } from '../../../util/util';
import { common } from '../../../common/common/common';
import { HolCharacterAvatar } from '../../../prefab/HolCharacterAvatar';
import { CharacterBagpack } from './CharacterBagpack';
const { ccclass, property } = _decorator;

@ccclass('CharacterTeamQueue')
export class CharacterTeamQueue extends Component {

    @property(Node)
    characterBagpackNode: Node

    // 保存所有角色的头像节点
    private characterAvatarNode: Node[] = []
    async start() {
        this.renderAllCharacter()
    }

    // 渲染所有角色
    public async renderAllCharacter() {
        const config = getConfig()
        // 清除所有头像
        this.characterAvatarNode.forEach(c => {
            c.parent.removeChild(c)
            c.destroy()
        })
        this.characterAvatarNode = []
        // 加载动画
        const close = await util.message.load()
        const nodePool = util.resource.getNodePool(
            await util.bundle.load('prefab/HolCharacterAvatar', Prefab)
        )
        // 循环添加已经存在队伍的角色
        for (let row = 0; row < config.userData.characterQueue.length; row++) {
            for (let col = 0; col < config.userData.characterQueue[row].length; col++) {
                const character = config.userData.characterQueue[row][col];
                if (character) {
                    const node = nodePool.get();
                    node.getComponent(Button).interactable = false;
                    await node.getComponent(HolCharacterAvatar).setCharacter(character);
                    const characterCoordinate = this.node.getChildByName('CharacterItem' + (row + 1) + (col + 1));
                    characterCoordinate.addChild(node);
                    node.setPosition(0, 0)
                    this.characterAvatarNode.push(node);
                }
            }
        }
        stockConfig()
        close()
    }

    // 卸下角色
    public async unMountCharacter(event: EventTouch, arg: string) {
        const config = getConfig()
        // 获取行
        // 获取行列
        const row = parseInt(arg.split("-")[0]) 
        const clo = parseInt(arg.split("-")[1])
        const position = {row: row, col:clo}
        //const character = common.leftCharacter.get(position)
        const character = config.userData.characterQueue[row-1][clo-1]
        console.log(character);
        
        if (character) {
            // common.leftCharacter.delete(position)
            config.userData.characters.push(character)
            config.userData.characterQueue[row-1][clo-1] = null
            //this.renderAllCharacter()
        }
        // 如果已经选择了一个角色 则替换角色
        const currentCharacterAvatar = this.characterBagpackNode.getComponent(CharacterBagpack).currentCharacterAvatar
        if (currentCharacterAvatar && currentCharacterAvatar.character) {
            // 设置掉九宫格中
            config.userData.characterQueue[row-1][clo-1] = currentCharacterAvatar.character
            // common.leftCharacter.set(position, currentCharacterAvatar.character)
            // 从背包删除
            config.userData.characters.splice(config.userData.characters.indexOf(currentCharacterAvatar.character) , 
            1)
            this.characterBagpackNode.getComponent(CharacterBagpack).currentCharacterAvatar = null
        }
        if (character || currentCharacterAvatar) {
            // 保存
            stockConfig()
            // 重新渲染
            this.renderAllCharacter()
            // 背包重新渲染
            await this.characterBagpackNode.getComponent(CharacterBagpack).renderAllCharacter()
        }
        return
    }
}


