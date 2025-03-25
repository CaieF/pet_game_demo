import { CharacterStateCreate } from "../../game/fight/character/CharacterState";
import { EquipmentStateCreate } from "../../game/fight/equipment/EquipmentState";
import { ItemStateCreate } from "../../game/fight/item/ItemState";
import { bookPages, IBookPage } from "../../game/fight_entity/bookPages";
import { exchangeLabels, IExchangeLabel } from "../../game/fight_entity/exchangeLabel";
import levels, { IUserLevelProcess } from "../../game/fight_entity/level";


// 资源
export class Resource {
    gold: number = 2000;
    diamond: number = 1000
    soul: number = 10
    draw: number = 20
}

class VolumeDetail {
    // 战斗音量
    fight: number = 1;
    // 家园音量
    home: number = 1;
    // 角色音量
    character: number = 1;
    // 商店音量
    shop: number = 2;

    constructor(v?: Partial<VolumeDetail>) {
        if (!v) return;
        Object.keys(v).forEach(k => this[k] = v[k])
    }
}

let globalId: number = 1;

class UserData extends Resource {

    public isNew: boolean = true;  // 是否是新用户

    public lv: number = 1;

    public exp: number = 0;

    public name: string = '用户54088'

    public backpack: ItemStateCreate[] = [];

    public characters: CharacterStateCreate[] = [];

    // 关卡进度
    public levelProcess: IUserLevelProcess = {
        levels: levels,
        currentLevel: 1,
    }

    // 书页进度
    public bookPageProgress: IBookPage[] = bookPages

    // 兑换码兑换记录
    public exchangeRecord: IExchangeLabel[] = exchangeLabels

    public characterQueue: CharacterStateCreate[][] = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]

    // 已经收集到的英雄
    public hasCollectCharacterId: string[] = [];
    constructor(or?: Partial<UserData>) {
        super();
        // 测试角色
        if (!or) { return }
        
        this.isNew = or.isNew || true
        this.lv = or.lv || 1
        this.exp = or.exp || 1
        this.gold = or.gold || 1000
        this.diamond = or.diamond || 100
        this.draw = or.draw || 20
        this.soul = or.soul || 1000
        this.hasCollectCharacterId = or.hasCollectCharacterId || []
        this.levelProcess = or.levelProcess || this.initLevelProcess()
        this.bookPageProgress = or.bookPageProgress || bookPages
        // 原有角色
        ;(or.characters || []).forEach(c => { this.addNewCharacter(c) })
        // 原有出战角色
        ;or.characterQueue.forEach((cq , i) => cq.forEach((c , j) => {
            if (!c) return;
            this.characterQueue[i][j] = {...c , uuid: ++globalId}
        }))
    }

    // 添加新角色
    public addNewCharacter(character: CharacterStateCreate) {
        const equipment: EquipmentStateCreate[] = [];
        (character.equipment || []).forEach(e => equipment.push({...e, uuid: ++globalId}))
        this.characters.push({
            ...character,
            star: character.star || 1,
            equipment,
            uuid: ++globalId
        })
        if (this.hasCollectCharacterId.indexOf(character.id) === -1) this.hasCollectCharacterId.push(character.id)
    }

    // 删除角色
    public deleteCharacter(uuid: number) {
        // 检测是否在characterQueue中
        for (let i = 0; i < this.characterQueue.length; i++) {
            for (let j = 0; j < this.characterQueue[i].length; j++) {
                if (this.characterQueue[i][j] && this.characterQueue[i][j].uuid === uuid) {
                    this.characterQueue[i][j] = null;
                    return;
                }
            }
        }
        
        const index = this.characters.findIndex(c => c.uuid === uuid);
        if (index === -1) return;
        this.characters.splice(index, 1);
    }

    // 初始化关卡进度
    public initLevelProcess() {
        const levelProcess: IUserLevelProcess = {
            levels: levels,
            currentLevel: 1,
        }
        return levelProcess;
    }

    // 一键通关所有关卡 
    public getAllLevel(levelnum: number) {
        for (let i = 1; i <= levelnum; i++) {
            this.levelProcess.levels[`level${i}`].isUnlock = true;
            this.levelProcess.levels[`level${i}`].star = 3;

            if (this.levelProcess.levels[`level${i}`].unlockPageId && this.levelProcess.levels[`level${i}`].unlockPageId.length > 0) {
                for (let j = 0; j < this.levelProcess.levels[`level${i}`].unlockPageId.length; j++) {
                    config.userData.bookPageProgress[this.levelProcess.levels[`level${i}`].unlockPageId[j] - 1].isUnlock = true;
                }
            }
        }
        this.levelProcess.currentLevel = levelnum + 1;
    }

    // 判断characterQueue是否全空
    public isCharacterQueueEmpty() {
        for (let i = 0; i < this.characterQueue.length; i++) {
            for (let j = 0; j < this.characterQueue[i].length; j++) {
                if (this.characterQueue[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
}

class Config {
    // 版本
    public version: string = "0.0.1";

    // 总音量
    public volume: number = 0.1;

    // 用户数据
    public userData: UserData = new UserData();

    // 用户数据 todo

    // 详细音量
    public volumeDetail: VolumeDetail = new VolumeDetail();

    constructor(con?: Partial<Config>) {
        if (!con) return;
        if (con.version !== this.version) return;
        Object.keys(con).forEach(k => this[k] = con[k])
        // 用户数据todo
        this.userData = new UserData(con.userData);
        this.volumeDetail = new VolumeDetail(con.volumeDetail)
    }

}

// 如果没有用户数据则创建一个新的数据
let config: Config = null;

// 存储config信息
export function stockConfig() {
    config.userData
    localStorage.setItem("UserConfigData", JSON.stringify(config))
}

// 获取config
export function getConfig(): Config {
    if (config) return config;
    const configJSON = localStorage.getItem("UserConfigData");
    config = configJSON ? new Config(JSON.parse(configJSON)) : new Config();
    config.userData.isNew = configJSON ? false : true;
    return config;
}