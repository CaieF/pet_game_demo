import { error } from "../../../util/out/error"
import { EquipmentMetaState } from "./EquipmentMetaStata"


type Option = {
    id: string
}

export const EquipmentEnum: {[key: string]: EquipmentMetaState} = {}

export function RegisterEquipment(o: Option): ClassDecorator {
    return (TargetClass: any) => {
        if (EquipmentEnum[o.id]) return error(`装备 ${o.id} 已存在`)
        EquipmentEnum[o.id] = TargetClass.getMetaInstance(o.id)
    }
}