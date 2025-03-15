import { _decorator, Button, Component, Label, Node, Prefab, Sprite, SpriteFrame, Vec3 } from 'cc';
import { CharacterStateCreate } from '../game/fight/character/CharacterState';
import { util } from '../util/util';
import { HolCharacterAvatar } from './HolCharacterAvatar';
const { ccclass, property } = _decorator;

export type HolLevelDetailOption = {
    title: string,
    introduce: string,
    enemyQueue?: CharacterStateCreate[][],
    position?: Vec3
    icon?: string
}

@ccclass('HolLevelDetail')
export class HolLevelDetail extends Component {
    @property(Node) TitleNode: Node
    @property(Node) IntroduceNode: Node
    @property(Node) EnemyTeamQueue: Node
    @property(Node) icon: Node

    characterAvatarNode: Node[] = []

    // 关闭时的函数
    private $closeQueue: (() => any)[] = []

    // 确认的回调
    private $sureQueue: (() => any)[] = []

    // 取消的回头
    private $cancelQueue: (() => any)[] = []

    async initLevelDetail(option: HolLevelDetailOption) {
        this.TitleNode.getComponent(Label).string = option.title
        this.IntroduceNode.getComponent(Label).string = option.introduce
        this.EnemyTeamQueue.active = false
        this.icon.active = false
        if (option.icon) {
            await this.renderIcon(option.icon)
        }
        if (option.enemyQueue) {
            await this.renderAllEnemy(option.enemyQueue)
        }
        if (option.position) {this.node.setPosition(option.position)}
    }

    listen(event: 'sure'|'close'|'cancel', call: () => any) {
        if (event === "sure") return this.$sureQueue.push(call)
        if (event === 'close') this.$closeQueue.push(call)
        if (event === 'cancel') this.$cancelQueue.push(call)
    }

    // 关闭本界面
    closeConfirm() { this.$closeQueue.forEach(c => c()) }

    sureConfirm() { this.$sureQueue.forEach(c => c()) }

    cancelConfirm() { this.$cancelQueue.forEach(c => c()) }

    async renderIcon(icon: string) {
        const close = await util.message.load()
        this.icon.active = true
        this.icon.getComponent(Sprite).spriteFrame = await util.bundle.load(icon, SpriteFrame)
        close()
    }

    async renderAllEnemy(enemyQueue: CharacterStateCreate[][]) {
        const close = await util.message.load()
        // 清除所有头像
        this.characterAvatarNode.forEach(c => {
            c.parent.removeChild(c)
            c.destroy()
        })
        this.characterAvatarNode = []
        const nodePool = util.resource.getNodePool(await util.bundle.load('prefab/HolCharacterAvatar', Prefab))
        // 添加角色
        this.EnemyTeamQueue.active = true
        for (let row = 0; row < enemyQueue.length; row++) {
            for (let col = 0; col < enemyQueue[row].length; col++) {
                const enemy = enemyQueue[row][col]
                if (enemy) {
                    const node = nodePool.get()
                    node.getComponent(Button).interactable = false
                    await node.getComponent(HolCharacterAvatar).setCharacter(enemy, true)
                    const enemyCoordinate = this.EnemyTeamQueue.getChildByName('EnemyItem' + (row + 1) + (col + 1))
                    node.setScale(0.5, 0.5)
                    enemyCoordinate.addChild(node)
                    this.characterAvatarNode.push(node)
                }
            }
        }
        close()
    }
}


