import { BOOKPAGETYPE } from "../../../common/enums";

export interface IBookPage {
    title: string;
    id: number;
    icon: string; 
    content: string;
    type: BOOKPAGETYPE;
    isLeft: boolean;
    isUnlock: boolean;    // 是否解锁
    isNearPage: boolean;    // 是否有相邻页
}

export const book_icon_url: string = 'image/book_icon/'



const page1: IBookPage = {
    title: '五行学说',
    id: 1,
    icon: book_icon_url + 'icon_fiveElement/spriteFrame',
    content: '古人用五行学说解释物质构成和变化，虽非现代物理学，但反映了对物质世界的思考。\n天方大陆的宠物们根据五行的组成拥有不同的属性，不同属性之间相生相克',
    type: BOOKPAGETYPE.SUBSTANCE,
    isLeft: true,
    isUnlock: true,
    isNearPage: true,
}

const page2: IBookPage = {
    title: '元气论',
    id: 2,
    icon: book_icon_url + 'icon_soul/spriteFrame',
    content: '中国古人关于构成生命与自然的基本物质观念, 元气论认为万物由“气”构成，涉及物质本质的探讨。\n天方大陆的万物由气构成，宠物吸收气可以变得更强，宠物分解也可以得到气',
    type: BOOKPAGETYPE.SUBSTANCE,
    isLeft: false,
    isUnlock: true,
    isNearPage: true,
}

const page3: IBookPage = {
    title: '杠杆原理',
    id: 3,
    icon: book_icon_url + 'icon_lever/spriteFrame',
    content: '墨子及其学派在《墨经》中详细描述了杠杆原理，书中提到，杠杆平衡时，力与力臂的乘积相等，即“标”与“权”的关系决定了平衡状态。\n这一描述与现代杠杆原理一致，即 F1 X L1 = F2 X L2',
    type: BOOKPAGETYPE.MECHANICS,
    isLeft: true,
    isUnlock: false,
    isNearPage: true,
}

const page4: IBookPage = {
    title: '流体力学',
    id: 4,
    icon: 'image/map_icon/map_icon_river/spriteFrame',
    content: '古代水利工程中对水流运动规律的理解和应用，如都江堰工程通过分流和引导水流，展示了古人对流体动力学的深刻认识。',
    type: BOOKPAGETYPE.MECHANICS,
    isLeft: false,
    isUnlock: false,
    isNearPage: true,
}

export const bookPages: IBookPage[] = [page1, page2, page3, page4]