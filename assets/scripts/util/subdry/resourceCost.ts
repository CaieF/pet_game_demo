import { BASE_GOLD_COST, BASE_SOUL_COST, qualityFactors, qualitySouls, starFactors } from "../../common/factors";
import { CharacterEnum } from "../../game/fight/character/CharacterEnum";
import { CharacterStateCreate } from "../../game/fight/character/CharacterState";
import level from "../../game/fight_entity/level/level1";

// 升级所需的金币
export function levelUpNeedGold(create: CharacterStateCreate): number {
    // 获取品质系数
    const qualityFactor = qualityFactors[CharacterEnum[create.id].CharacterQuality - 1]

    // 等级系数（非线性增长，随等级增加而增加）
    const levelFactor = 1 + 0.1 * (create.lv - 1);

    // 计算升级所需金币
    return Math.ceil(BASE_GOLD_COST * qualityFactor * levelFactor);
}

// 升星所需灵魂
export function levelStarNeedSoule(create: CharacterStateCreate): number {
    // return Math.ceil(
    //     CharacterEnum[create.id].CharacterQuality * create.lv * (create.lv / (create.lv + 80) + 1) * 100 * 0.5
    // )
    return Math.ceil(BASE_SOUL_COST * qualityFactors[CharacterEnum[create.id].CharacterQuality - 1] * starFactors[create.star - 1]);
}

// 计算升级 num 级所需金币
export function levelUpNeedGoldByNum(create: CharacterStateCreate, num: number): number {
    let totalGold = 0;
    const tempCreate = { ...create }; // 临时角色状态，用于计算每级消耗
    for (let i = 1; i <= num; i++) {
        totalGold += levelUpNeedGold(tempCreate);
        tempCreate.lv++;
    }
    return totalGold;
}

// 根据金币数计算能升的最大等级
export function getMaxLevelByGold(create: CharacterStateCreate, gold: number): number {
    const tempCreate = { ...create }; // 临时角色状态，用于计算每级消耗
    let levelUpNum = 0;
    while (gold >= levelUpNeedGold(tempCreate)) {
        gold -= levelUpNeedGold(tempCreate);
        tempCreate.lv++;
        levelUpNum++;
    }
    return levelUpNum;
}

// 计算角色已经消耗的金币
export function getTotalGoldCost(create: CharacterStateCreate): number {
    let totalGold = 0;
    // 从1级到当前等级，累加每级升级所需金币
    for (let lv = 1; lv < create.lv; lv++) {
        const tempCreate = { ...create, lv }; // 临时角色状态，用于计算每级消耗
        totalGold += levelUpNeedGold(tempCreate);
    }
    return totalGold;
}

// 计算角色已经消耗的灵魂
export function getTotalSoulCost(create: CharacterStateCreate): number {
    let totalSoul = 0;
    // 从1星到当前星级，累加每星升星所需灵魂
    for (let star = 1; star < create.star; star++) {
        const tempCreate = { ...create, star }; // 临时角色状态，用于计算每星消耗
        totalSoul += levelStarNeedSoule(tempCreate);
    }
    return totalSoul;
}

// 计算分解角色获得的金币和灵魂
export function getDecomposeGoldSoul(create: CharacterStateCreate): { gold: number, soul: number } {
    const totalGold = getTotalGoldCost(create);
    const totalSoul = getTotalSoulCost(create);
    const qualitySoul = qualitySouls[CharacterEnum[create.id].CharacterQuality - 1];
    const gold = Math.ceil(totalGold * 0.5);
    const soul = Math.ceil(totalSoul * 0.5 + qualitySoul);
    return { gold, soul };
}