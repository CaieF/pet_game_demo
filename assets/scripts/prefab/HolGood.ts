import { _decorator, Component, find, Label, Node, Sprite, SpriteFrame } from 'cc';
import { IGOOD, resource_icon } from '../game/fight_entity/goods';
import { util } from '../util/util';
import { RESOURCE } from '../common/enums';
import { getConfig } from '../common/config/config';
import { HolUserResource } from './HolUserResource';
const { ccclass, property } = _decorator;

@ccclass('HolGood')
export class HolGood extends Component {
    @property(Node) PriceNode: Node = null;

    good: IGOOD
    buy_reource_icon: string
    cost_resource_icon: string

    async setGood(good: IGOOD) {
        this.good = good
        this.buy_reource_icon = resource_icon + `resource_${good.buyResource}/spriteFrame`
        this.cost_resource_icon = resource_icon + `resource_${good.costResource}/spriteFrame`

        this.node.getChildByName('icon').getComponent(Sprite).spriteFrame = await util.bundle.load(this.buy_reource_icon, SpriteFrame)
        this.PriceNode.getChildByName('icon').getComponent(Sprite).spriteFrame = await util.bundle.load(this.cost_resource_icon, SpriteFrame)
        this.node.getChildByName('nums').getComponent(Label).string = good.buyName + ' X ' + good.buyNum.toString()
        this.PriceNode.getChildByName('nums').getComponent(Label).string = 'X ' + good.costNum.toString()
    }

    async clickButton() {
        if (!this.good) return
        
        const config = getConfig()
        const result = await util.message.confirm({
            message:'是否花费 ' + this.good.costNum.toString() + ' ' + this.good.costName + '购买' + this.good.buyName + ' X ' + this.good.buyNum.toString() + '？'
        })

        if (result === false) return
        // 资源不足
        if (config.userData.diamond < this.good.costNum) return await util.message.prompt({message: '钻石不足'})
        // 资源减少
        config.userData.diamond -= this.good.costNum
        // 获得的资源
        switch (this.good.buyResource) {
            case RESOURCE.GOLD:
                config.userData.gold += this.good.buyNum
                break;
            case RESOURCE.SOUL:
                config.userData.soul += this.good.buyNum
                break;
            case RESOURCE.DIAMOND:
                config.userData.diamond += this.good.buyNum
                break;
            case RESOURCE.DRAW:
                config.userData.draw += this.good.buyNum
                break;
            default:
                break;
        }
        find("Canvas/HolUserResource").getComponent(HolUserResource).render() // 资源渲染 
        // 购买成功
        return await util.message.prompt({message: '购买成功'})
    }
}


