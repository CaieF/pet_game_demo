import { HolEffect } from "../../../prefab/HolEffect";
import { BasicMetaState } from "../BasicMetaState";
import { BasicState } from "../BasicState";
import { BuffEnum } from "../buff/BuffEnum";
import { CharacterState } from "../character/CharacterState";
import { EffectEnum } from "./EffectEnum";
import { EffectMetaState } from "./EffectMetaState";

export type EffectStateCreate = {
  // id
  id: string;
}

export class EffectState extends BasicState<EffectMetaState> {

    /**
     * 所属组件
     */
    component: HolEffect

    // 所属角色
    character: CharacterState

    // 存储状态
    state: Map<string, any> = new Map()

    // 创建时的函数
    OnCreate: (self: EffectState, option?: any) => Promise<void>
    

    constructor(create: EffectStateCreate, option?: any) {
      const meta = EffectEnum[create.id]
      super(meta);
      this.OnCreate = meta.GetOnCreate()
      
      this.OnCreate(this, option)
    } 
}
