import { error } from "../../../util/out/error"
import { CharacterMetaState } from "./CharacterMetaState"


type Option = {
    id: string
}

export const CharacterEnum: {[key: string]: CharacterMetaState} = {}

export function RegisterCharacter(o: Option): ClassDecorator {
    return (TargetClass: any) => {
        if (CharacterEnum[o.id]) return error(`角色 ${o.id} 已注册`)
        CharacterEnum[o.id] = TargetClass.getMetaInstance()
    }
}