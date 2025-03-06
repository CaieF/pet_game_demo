import { RESOURCE } from "../../../common/enums";
import { introduce } from "../../../util/message/introduce";

// 商品类型
export interface IGOOD {
    buyResource: RESOURCE,      // 购买的资源
    buyNum: number,            // 购买数量
    buyName: string,           // 购买名称
    costResource: RESOURCE,     // 消耗的资源
    costNum: number,           // 消耗数量
    costName: string,          // 消耗名称
    //introduce: string,         // 商品介绍
}

export const resource_icon: string = 'image/resource_icon/'

const good1: IGOOD = {
    buyResource: RESOURCE.GOLD,
    buyNum: 10000,
    buyName: '铜钱',
    costResource: RESOURCE.DIAMOND,
    costNum: 100,
    costName: '钻石'
}

const good2: IGOOD = {
    buyResource: RESOURCE.SOUL,
    buyNum: 100,
    buyName: '元气',
    costResource: RESOURCE.DIAMOND,
    costName: '钻石',
    costNum: 100
}

const good3: IGOOD = {
    buyResource: RESOURCE.DRAW,
    buyNum: 1,
    buyName: '星象罗盘',
    costResource: RESOURCE.DIAMOND,
    costNum: 100,
    costName: '钻石'
}

const good4: IGOOD = {
    buyResource: RESOURCE.DRAW,
    buyNum: 5,
    buyName: '星象罗盘',
    costResource: RESOURCE.DIAMOND,
    costNum: 400,
    costName: '钻石',
}

export const goods: IGOOD[] = [good1, good2, good3, good4];