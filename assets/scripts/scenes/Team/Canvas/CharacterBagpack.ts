import { _decorator, Button, Component, math, Node, NodeEventType, Prefab, Sprite } from 'cc';
import { getConfig } from '../../../common/config/config';
import { HolCharacterAvatar } from '../../../prefab/HolCharacterAvatar';
import { util } from '../../../util/util';
import { CharacterStateCreate } from '../../../game/fight/character/CharacterState';
import { HolCharactersQueue } from '../../../prefab/HolCharactersQueue';
import { HeroCharacterDetail } from '../../Hero/Canvas/HeroCharacterDetail';
const { ccclass, property } = _decorator;

@ccclass('CharacterBagpack')
export class CharacterBagpack extends Component {

    @property(Node) characterTeamQueue: Node;  // 角色队伍队列

    @property(Node) content: Node;  // 背包内容

    private characterAvatarNode: Node[] = [];  // 角色头像

    // 当前选择角色
    private $currentCharacterAvatar: HolCharacterAvatar = null
    public get currentCharacterAvatar() {
        return this.$currentCharacterAvatar;
    }
    public set currentCharacterAvatar(c) {
        // 九宫格发光提示
        if (c) {
            // 发光
            this.characterTeamQueue.children.forEach(n => n.getChildByName('Light').active = true)
        } else {
            // 关闭所有发光
            this.characterTeamQueue.children.forEach(n => n.getChildByName('Light').active = false)
        }
        this.$currentCharacterAvatar = c;
    }
    

    protected async start() {
        // await this.renderAllCharacter();
    }

    // 渲染所有角色
    public async renderAllCharacter() {
        // 第一次渲染所有角色
        const config = getConfig();
        // 加载动画
        const close = await util.message.load();
        // 删除所有已有角色
        this.content.removeAllChildren();
        // 制空选择
        this.characterAvatarNode = [];
        const characterQueue = [];
        // 加载所有的character
        const nodePool = util.resource.getNodePool(
            await util.bundle.load('prefab/HolCharacterAvatar', Prefab)
        )
        // 遍历二维数组
        for (let i=0; i<config.userData.characters.length; i++) {
            const character = config.userData.characters[i];
            const node = nodePool.get();
            const characterAvatar = node.getComponent(HolCharacterAvatar)
            await characterAvatar.setCharacter(character);
            node.on(NodeEventType.TOUCH_END, () => {
                this.clickAvatar(node);
            }, node)
            this.content.addChild(node);
            this.characterAvatarNode.push(node);
        }
        close()
    }

    async render(characterQueue: CharacterStateCreate[]) {
        await this.node.getChildByName("HolCharactersQueue")
        .getComponent(HolCharactersQueue).render(characterQueue, async(c , n) => {
            
        })
    }

    // 头像点击事件
    public async clickAvatar(avatarNode: Node) {
        // 全部设置为半黑
        this.characterAvatarNode.forEach(node => {
            if (node === avatarNode) {
                node.getChildByName('Mask').active = true
                return
            }
            
            node.off(NodeEventType.TOUCH_END)
        })
        // 重复点击
        const currentCharacter = avatarNode.getComponent(HolCharacterAvatar)
        if (this.currentCharacterAvatar === currentCharacter) {
            this.renderAllCharacter()
            this.currentCharacterAvatar = null
            return
        }
        this.currentCharacterAvatar = avatarNode.getComponent(HolCharacterAvatar)
    }
}


