export enum SCENE {
  Preload = 'Preload',
  HOME = 'Home',
  HERO = 'Hero',
  FIGHT = 'Fight',
  SHOP = 'Shop',
  GAME = 'Game',
}

export enum MUSICFOLDER {
  SHOP = 'shop',
  FIGHT = 'fight/back',
  HOME = 'home',
  HERO = 'hero',
}

// 资源种类
export enum RESOURCE {
  GOLD = 'gold',  // 金币
  SOUL = 'soul',  // 魂石
  DIAMOND = 'diamond',  // 钻石
  DRAW = 'draw',  // 抽奖券
}

// 关卡类型
export enum LEVELTYPE {
  FIGHT = 'fight',  // 战斗关卡
  GAME = 'game',  // 小游戏关卡
}

export enum GAMETYPE {
  LEVER = 'Lever',  // 杠杆关卡
  RIVER = 'River',  // 河流关卡
}

// 科普知识类型类型
export enum BOOKPAGETYPE {
  SUBSTANCE = 'substance',  // 物质学
  MECHANICS ='mechanics',  // 力学
  HOT = 'hot',  // 热学
  OPTICS = 'optics',  // 光学
}