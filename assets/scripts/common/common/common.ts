import { CharacterStateCreate } from "../../game/fight/character/CharacterState";
import levels, { ILevel } from "../../game/fight_entity/level";
import { SCENE } from "../enums";

class Common {
    // 左侧队伍
    leftCharacter: Map<{row: number, col: number}, CharacterStateCreate> = new Map();
    // 右侧队伍
    rightCharacter: Map<{row: number, col: number}, CharacterStateCreate> = new Map();
    // 选择关卡
    level: ILevel = null
    // 关卡倍速
    timeScale: number = 1
}

class SceneCommon {
    // 上一个场景
    lastScene: string = SCENE.Preload
    // 当前场景
    currentScene: string = SCENE.Preload
}

//const lastScene: string = SCENE.Preload

// 公共内存
export const common = new Common
 
// 上一个场景
export const sceneCommon = new SceneCommon


common.rightCharacter.set({row:1, col: 3}, {
    id: 'cat4',
    lv: 100,
    star: 3,
    equipment: []
})

common.rightCharacter.set({row:2, col: 3}, {
    id: 'catGril',
    lv: 100,
    star: 3,
    equipment: []
})

common.rightCharacter.set({row:3, col: 3}, {
    id: 'WereBisonKing',
    lv: 100,
    star: 5,
    equipment: []
})



common.rightCharacter.set({row:2, col: 2}, {
    id: 'cat1',
    lv: 100,
    star: 3,
    equipment: []
})

common.rightCharacter.set({row:2, col: 1}, {
    id: 'DinoRex',
    lv: 100,
    star: 4,
    equipment: []
})