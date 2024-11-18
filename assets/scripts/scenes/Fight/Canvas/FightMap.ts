import { _decorator, Component, Node } from 'cc';
import { HolCharacter } from '../../../prefab/HolCharacter';
import { HolPreLoad } from '../../../prefab/HolPreLoad';
const { ccclass, property } = _decorator;

@ccclass('FightMap')
export class FightMap extends Component {

    // 当前回合数
    currentRound: number = 1

    // 是否播放动画
    isPlayAnimation: boolean = true;

    // 所有回合任务
    allRoundQueue: Map<number, Function[]> = new Map

    // 所有存活的jues
    allLiveCharacter: HolCharacter[] = []

    // 所有死亡角色
    allDeadCharacter: HolCharacter[] = []

    // 行动等待队列，若队列有未完成任务则等待完成后进入下一个角色行动
    actionAwaitQueue: Promise<any>[] = []
    
    protected async start() {
        const holPreLoad = this.node.parent.getChildByName('HolPreLoad').getComponent(HolPreLoad);
        holPreLoad.setTips([
            "提示\n不同属性之间相互克制，巧用属性可以出奇制胜" ,
        ])
    }

    update(deltaTime: number) {
        
    }
}


