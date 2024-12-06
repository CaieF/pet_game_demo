import { Vec3 } from "cc";
import { CharacterStateCreate } from "../../fight/character/CharacterState";
import level1 from "./level1";
import level2 from "./level2";

// 关卡类型
export interface ILevel {
  enemyQueue: CharacterStateCreate[][],
  map: string,
  icon: string,
  name: string,
  position: Vec3
} 

const levels: Record<string, ILevel> = {
  level1,
  level2
}

export default levels