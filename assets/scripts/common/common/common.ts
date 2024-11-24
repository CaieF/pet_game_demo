import { CharacterStateCreate } from "../../game/fight/character/CharacterState";

class Common {
    // 左侧队伍
    leftCharacter: Map<{row: number, col: number}, CharacterStateCreate> = new Map();
    // 右侧队伍
    rightCharacter: Map<{row: number, col: number}, CharacterStateCreate> = new Map();
}

// 公共内存
export const common = new Common
 



// common.rightCharacter.set({row:2, col: 1}, {
//     id: 'Orc',
//     lv: 1,
//     star: 1,
//     equipment: []
// })

// common.rightCharacter.set({row:2, col: 2}, {
//     id: 'Orc',
//     lv: 1,
//     star: 1,
//     equipment: []
// })

// common.rightCharacter.set({row:2, col: 3}, {
//     id: 'Orc',
//     lv: 1,
//     star: 1,
//     equipment: []
// })

common.rightCharacter.set({row:1, col: 3}, {
    id: 'cat4',
    lv: 100,
    star: 3,
    equipment: []
})

common.rightCharacter.set({row:2, col: 3}, {
    id: 'cat4',
    lv: 100,
    star: 3,
    equipment: []
})

common.rightCharacter.set({row:3, col: 3}, {
    id: 'cat3',
    lv: 100,
    star: 3,
    equipment: []
})



common.rightCharacter.set({row:2, col: 2}, {
    id: 'cat1',
    lv: 100,
    star: 3,
    equipment: []
})

common.rightCharacter.set({row:2, col: 1}, {
    id: 'WereBear',
    lv: 100,
    star: 4,
    equipment: []
})