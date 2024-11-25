import { error } from "../../../util/out/error"
import { EffectMetaState } from "./EffectMetaState"


type Option = {
    id: string
}

export const EffectEnum: {[key: string]: EffectMetaState} = {}

export function RegisterEffect(o: Option): ClassDecorator {
    return (TargetClass: any) => {
        if (EffectEnum[o.id]) return error(`特效 ${o.id} 已注册`)
        EffectEnum[o.id] = TargetClass.getMetaInstance(o.id)
    }
}