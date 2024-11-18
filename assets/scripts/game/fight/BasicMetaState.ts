import { BasicState } from "./BasicState";


// 状态元基类
export class BasicMetaState {
    
    // id
    id: string
    // 状态名称
    name: string
    // 状态描述
    introduce: string

    // 创建基类对象
    static getMetaInstance(id: string) {
        const instance = new this();
        instance.id = id;
        return instance;
    }

    /**
     * 创建时的函数 在创建本状态对象时调用
     * self 当前状态对象  
     */
    onCreateState(self: BasicState<any>) { }

    /**
     * 创建时的函数，在创建本状态对象时调用
     * self 当前状态对象
     * fightMap 战斗场景对象
     */
    // GetOnFightBegan(self: BasicState<any>, fightMap):
}