import { _decorator, Component, Node, Event, Label, director } from 'cc';
import { HolCharacter } from '../../../prefab/HolCharacter';
import { util } from '../../../util/util';
import { FightMap } from './FightMap';
const { ccclass, property } = _decorator;

@ccclass('FightUi')
export class FightUi extends Component {

    @property(Node) FightMapNode: Node

    // 当前倍数
    private timeScale: number = 1
    
    // 倍数
    setTimeScale(e: Event) {
        this.timeScale++
        if (this.timeScale > 3) this.timeScale = 1
        for (const node of this.FightMapNode.children)
            node.getComponent(HolCharacter).holAnimation.timeScale = this.timeScale
        e.target.getChildByName('Value').getComponent(Label).string = 'x' + this.timeScale
        return
    }

    // 跳过战斗
    async skipFight() {
        const result = await util.message.confirm({message: '确定要跳过战斗吗？'})

        if (result) {
            this.FightMapNode.getComponent(FightMap).isPlayAnimation = false
        }
    }

    // 返回
    // 回到主页
    async GoBack() {
        const close = await util.message.load()
        director.preloadScene('Home', () => close())
        director.loadScene('Home')
    }
}


