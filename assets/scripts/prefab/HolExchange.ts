import { _decorator, Component, EditBox, find, Node } from 'cc';
import { getConfig, stockConfig } from '../common/config/config';
import { RESOURCE, REWARDType } from '../common/enums';
import { IExchangeLabel } from '../game/fight_entity/exchangeLabel';
import { util } from '../util/util';
import { HolUserResource } from './HolUserResource';
const { ccclass, property } = _decorator;

@ccclass('HolExchange')
export class HolExchange extends Component {
    
    // 关闭的函数
    private $closeQueue: (() => any)[] = [];

    async initEditBox() {
        this.node.getComponentInChildren(EditBox).string = ''
    }

    listen(event: 'close', call: () => any) {
        if (event === 'close') this.$closeQueue.push(call)
    }

    /** 
     * 关闭本界面
     */
    closeConfirm() { this.$closeQueue.forEach(c => c()) }

    // 确认输入框
    async confirmInput() {
        const input = this.node.getComponentInChildren(EditBox).string
        this.compareInput(input)
        this.node.getComponentInChildren(EditBox).string = ''
    }

    // 比较输入框内容
    compareInput(input: string) {
        const config = getConfig()
        for (const label of config.userData.exchangeRecord) {
            if (label.string === input) {
                if (label.isRepeat || (!label.isRepeat && !label.isExchange)) {   // 重复使用
                    this.getReward(label)
                    return
                } else if (label.isExchange && !label.isRepeat) {
                    return util.message.prompt({message: '该奖励已被兑换'})
                }
            }
        }
        util.message.prompt({message: '输入内容有误'})

    }

    getReward(label: IExchangeLabel) {
        const config = getConfig()
        switch (label.rewardType) {
            case REWARDType.RESOURCE:
                switch (label.resourceReward) {
                    case RESOURCE.GOLD:
                        config.userData.gold += label.rewardNum;
                        util.message.prompt({message: `获得 ${label.rewardNum} 铜钱`})
                        break;
                    case RESOURCE.SOUL:
                        config.userData.soul += label.rewardNum;
                        util.message.prompt({message: `获得 ${label.rewardNum} 气`})
                        break;
                    case RESOURCE.DIAMOND:
                        config.userData.diamond += label.rewardNum;
                        util.message.prompt({message: `获得 ${label.rewardNum} 钻石`})
                        break;
                    case RESOURCE.DRAW:
                        config.userData.draw += label.rewardNum;
                        util.message.prompt({message: `获得 ${label.rewardNum} 抽奖券`})
                        break;
                    default:
                        break;
                }
                find("Canvas/Ui/HolUserResource").getComponent(HolUserResource).render() // 资源渲染 
                break;
            case REWARDType.PET:
                config.userData.addNewCharacter(label.petReward)
                util.message.prompt({message: `成功获得宠物`})
                break;
            default:
                break;
        }
        if (!label.isRepeat) {
            label.isExchange = true
        }
        stockConfig()
    }
}


