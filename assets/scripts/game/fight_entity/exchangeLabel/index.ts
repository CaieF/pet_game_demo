import { RESOURCE, REWARDType } from "../../../common/enums";
import { CharacterStateCreate } from "../../fight/character/CharacterState";

export interface IExchangeLabel {
    id: number,
    string: string,
    isRepeat: boolean,   // 是否可以重复使用
    isExchange: boolean,  // 是否兑换了
    rewardType: REWARDType,
    resourceReward?: RESOURCE,
    petReward?: CharacterStateCreate,
    rewardNum: number,
}

const exchangeLabel1: IExchangeLabel = {
    id: 1,
    string: '10000gold',
    isRepeat: true,
    isExchange: false,
    rewardType: REWARDType.RESOURCE,
    resourceReward: RESOURCE.GOLD,
    rewardNum: 10000,
}

const exchangeLabel2: IExchangeLabel = {
    id: 2,
    string: 'vivo50',
    isRepeat: true,
    isExchange: false,
    rewardType: REWARDType.RESOURCE,
    resourceReward: RESOURCE.DIAMOND,
    rewardNum: 50,
}

const exchangeLabel3: IExchangeLabel = {
    id: 3,
    string: 'panda',
    isRepeat: false,
    isExchange: false,
    rewardType: REWARDType.PET,
    petReward: {id: 'Panda', lv: 5, star: 1, equipment: []},
    rewardNum: 1,
}

export const exchangeLabels: IExchangeLabel[] = [exchangeLabel1, exchangeLabel2, exchangeLabel3]