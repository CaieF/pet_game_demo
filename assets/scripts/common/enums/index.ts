export enum SCENE {
  Preload = 'Preload',
  HOME = 'Home',
  HERO = 'Hero',
  FIGHT = 'Fight',
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
  GameLEVER = 'GameLever',  // 杠杆关卡
  GameRIVER = 'GameRiver',  // 河流关`卡
  GameFIRE = 'GameFire',  // 火焰关卡
}

// 科普知识类型类型
export enum BOOKPAGETYPE {
  SUBSTANCE = 'substance',  // 物质学
  MECHANICS ='mechanics',  // 力学
  HOT = 'hot',  // 热学
  OPTICS = 'optics',  // 光学
}

// 奖励类型
export enum REWARDType {
  RESOURCE = 'resource',
  PET = 'pet',
}