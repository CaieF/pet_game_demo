import { Vec3 } from "cc";
import { CharacterStateCreate } from "../../fight/character/CharacterState";
import level1 from "./level1";
import level2 from "./level2";
import level3 from "./level3";

// 用户关卡进度
export interface IUserLevelProcess {
  levels: Record<string, ILevel>, // 所有关卡的进度
  currentLevel: number, // 当前关卡
}

// 关卡类型
export interface ILevel {
  id: number, // 关卡id
  isUnlock: boolean, // 是否解锁
  enemyQueue: CharacterStateCreate[][], // 敌人队列
  star: number, // 星级
  map: string, // 地图
  icon: string, // 图标
  name: string, // 名称
  position: Vec3, // 位置
  dialogs?: ILevelDialog[] // 对话
} 

// 关卡对话类型
export interface ILevelDialog {
  character: CharacterStateCreate
  dialog: string
}

const levels: Record<string, ILevel> = {
  level1,
  level2,
  level3
}

export default levels