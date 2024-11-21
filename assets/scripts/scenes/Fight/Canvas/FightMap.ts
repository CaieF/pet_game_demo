import { _decorator, Component, instantiate, math, Node, NodeEventType, Prefab, Sprite, SpriteFrame } from 'cc';
import { HolCharacter } from '../../../prefab/HolCharacter';
import { HolPreLoad } from '../../../prefab/HolPreLoad';
import { util } from '../../../util/util';
import { common } from '../../../common/common/common';
import { CharacterStateCreate } from '../../../game/fight/character/CharacterState';
import { RoundState } from '../../../game/fight/RoundState';
import { getConfig } from '../../../common/config/config';
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
            "金->木->土->水->火->金\n不同属性之间相互克制，巧用属性可以出奇制胜" ,
        ])
        holPreLoad.setProcess(20)
        // 随机地图
        const images = await util.bundle.loadDir('image/fightMap', SpriteFrame)
        this.node.getComponent(Sprite).spriteFrame = images[Math.floor(math.randomRange(0, images.length))]
        holPreLoad.setProcess(50)
        // 当前进度
        let process = 50
        common.leftCharacter = new Map
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const character = getConfig().userData.characterQueue[row][col]
                if (character) {
                    await common.leftCharacter.set({row: row + 1, col: col + 1}, character)
                }
            }

        }

        // 设置角色
        for (const character of common.leftCharacter) {
            await this.setCharacter(character[1], 'left', character[0])
            holPreLoad.setProcess(process = process + 20 / common.leftCharacter.size)
        }
        for (const character of common.rightCharacter) {
            await this.setCharacter(character[1], 'right', character[0])
            holPreLoad.setProcess(process = process + 20 / common.rightCharacter.size)
        }
        // 监听进度条完成函数
        holPreLoad.listenComplete(async () => {
            await new Promise(res => setTimeout(res, 500))
            // 战斗开始
            const result = await this.fightStart()
            if (result) this.fightSuccess()  // 战斗胜利结算
            else this.fightEnd()  // 战斗失败结算
        })
        holPreLoad.setProcess(100)
    }

    // 设置角色
    private async setCharacter(create: CharacterStateCreate, direct: 'left' | 'right', coordinate: { row: number; col: number }) {
        const holCharacterPrefab = await util.bundle.load('prefab/HolCharacter', Prefab)
        const character = instantiate(holCharacterPrefab)
        this.node.addChild(character)
        const holCharacter = character.getComponent(HolCharacter)
        await holCharacter.initCharacter(create, direct, coordinate, this)
        this.node.on(NodeEventType.NODE_DESTROYED, () => {
            character.parent.removeChild(character)  // 角色销毁时移除
        })
        this.allLiveCharacter.push(holCharacter)
    }

    // 监听回合函数
    public listenRoundEvent(round: number , call: Function) {
        let roundEvents = this.allRoundQueue.get(this.currentRound + round + 1)
        if (!roundEvents) 
            return this.allRoundQueue.set(this.currentRound + round + 1 , roundEvents = [call])
        roundEvents.push(call)
    }

    // 战斗开始
    private async fightStart(): Promise<boolean> {
        // 调用战斗开始回调
        for (const character of this.allLiveCharacter) {
            for (const buff of character.state.buff) 
                await buff.OnFightBegan(buff, this)
            for (const equipment of character.state.equipment)
                await equipment.OnFightBegan(equipment, this)
            await character.state.OnFightBegan(character.state, this)
        }
        // 回合开始
        while(this.currentRound <= 150) {
            const roundState = new RoundState
            const allLiveCharacter = [].concat(this.allLiveCharacter).sort((a , b) => {
                return b.state.speed - a.state.speed
            })
            // 调用回合任务
            for (const task of this.allRoundQueue.get(this.currentRound) || []) await task()
            // 调用回合开始回调
            for (const character of allLiveCharacter) {
                if (this.allLiveCharacter.indexOf(character) === -1) break
                for (const buff of character.state.buff)
                    await buff.OnRoundBegan(buff, roundState, this)
                for (const equipment of character.state.equipment)
                    await equipment.OnRoundBegan(equipment, roundState, this)
                await character.state.OnRoundBegan(character.state, roundState, this)
            }
            // 角色行动
            for (const character of allLiveCharacter) {
                if (this.allLiveCharacter.indexOf(character) === -1) break
                await character.action()
                // 等待行动队列清空
                await Promise.all(this.actionAwaitQueue)
                this.actionAwaitQueue = []
                // 判断是否结束
                if (this.allLiveCharacter.filter(c => c.direction === "left").length <= 0) return false
                else if (this.allLiveCharacter.filter(c => c.direction === "right").length <= 0) return true
            }
            // 调用回合结束回调
            for (const character of allLiveCharacter) {
                if (this.allLiveCharacter.indexOf(character) === -1) break
                for (const buff of character.state.buff)
                    await buff.OnRoundEnd(buff, roundState, this)
                for (const equipment of character.state.equipment)
                    await equipment.OnRoundEnd(equipment, roundState, this)
                await character.state.OnRoundEnd(character.state, roundState, this)
            }
            this.currentRound++
            // 等待
            if (this.isPlayAnimation) await new Promise(res => setTimeout(res, 300))
            // 判断是否结束
            if (this.allLiveCharacter.filter(c => c.direction === "left").length <= 0) return false
            else if (this.allLiveCharacter.filter(c => c.direction === "right").length <= 0) return true
        }
        return false
    }
    
    // 战斗胜利结算
    private async fightSuccess() {
        this.node.parent.getChildByName("FightUi").getChildByName("GoBack").active = true
        this.node.parent.getChildByName("FightFailure").active = false
        this.node.parent.getChildByName("FightSuccess").active = true
    }

    // 战斗失败结算
    private async fightEnd() {
        this.node.parent.getChildByName("FightUi").getChildByName("GoBack").active = true
        this.node.parent.getChildByName("FightSuccess").active = false
        this.node.parent.getChildByName("FightFailure").active = true
    }

}


