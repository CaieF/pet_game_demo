import { CharacterStateCreate } from "../../game/fight/character/CharacterState";
import { EquipmentStateCreate } from "../../game/fight/equipment/EquipmentState";
import { ItemStateCreate } from "../../game/fight/item/ItemState";

// 资源
export class Resource {
    gold: number = 2000;
    diamond: number = 1000
    soul: number = 10
}

class VolumeDetail {
    // 战斗音量
    fight: number = 1;
    // 家园音量
    home: number = 1;
    // 角色音量
    character: number = 1;

    constructor(v?: Partial<VolumeDetail>) {
        if (!v) return;
        Object.keys(v).forEach(k => this[k] = v[k])
    }
}

let globalId: number = 1;

class UserData extends Resource {

    public lv: number = 1;

    public exp: number = 0;

    public name: string = '用户54088'

    public backpack: ItemStateCreate[] = [];

    public characters: CharacterStateCreate[] = [];

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
        this.addNewCharacter({
            id: "SlimeOrdinary" ,
            lv: 1 ,
            star: 1 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "SlimeGold" ,
            lv: 1 ,
            star: 1 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "SlimeTree" ,
            lv: 5 ,
            star: 1 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "SlimeWater" ,
            lv: 5 ,
            star: 1 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "SlimeFire" ,
            lv: 10 ,
            star: 1 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "SlimeStone" ,
            lv: 100 ,
            star: 1 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "Orc" ,
            lv: 100 ,
            star: 1 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "OrcArmored" ,
            lv: 1 ,
            star: 2 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "OrcElite" ,
            lv: 10 ,
            star: 2 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "OrcRider" ,
            lv: 100 ,
            star: 1 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "cat3" ,
            lv: 1 ,
            star: 1 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "cat1" ,
            lv: 10 ,
            star: 1 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "cat2" ,
            lv: 99 ,
            star: 1 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "cat4" ,
            lv: 100 ,
            star: 1 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "catGril" ,
            lv: 100 ,
            star: 3 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "WereWolf" ,
            lv: 99 ,
            star: 1 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "WereBear" ,
            lv: 100 ,
            star: 4 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "WereBison" ,
            lv: 100 ,
            star: 4 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "DinoRex" ,
            lv: 100 ,
            star: 4 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "FireWorm" ,
            lv: 100 ,
            star: 4 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "WereBisonKing" ,
            lv: 100 ,
            star: 5 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "SonGoku" ,
            lv: 100 ,
            star: 5 ,
            equipment: []
        })
        this.addNewCharacter({
            id: "Panda" ,
            lv: 100 ,
            star: 5 ,
            equipment: []
        })
        
        
        if (!or) { return }
        this.lv = or.lv || 1
        this.exp = or.exp || 1
        this.gold = or.gold || 1000
        this.diamond = or.diamond || 100
        this.soul = or.soul || 1000
        this.hasCollectCharacterId = or.hasCollectCharacterId || []
        // 原有角色
        ;(or.characters || []).forEach(c => { this.addNewCharacter(c) })
        // 原有出战角色
        ;or.characterQueue.forEach((cq , i) => cq.forEach((c , j) => this.characterQueue[i][j] = {...c , uuid: ++globalId}))
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

    /** 
    // 筛选对应品质并且等级为一级的角色
    public filterCharacterByQuality(quality: number): CharacterStateCreate[] {
        // 检测是否在characterQueue中
        const result: CharacterStateCreate[] = [];
        for (let i = 0; i < this.characterQueue.length; i++) {
            for (let j = 0; j < this.characterQueue[i].length; j++) {
                if (this.characterQueue[i][j] && CharacterEnum[this.characterQueue[i][j].id].CharacterQuality === quality && this.characterQueue[i][j].lv === 1) {
                    result.push(this.characterQueue[i][j]);
                }
            }
        }
        // 再检查characters中
        this.characters.forEach(c => {
            if (CharacterEnum[c.id].CharacterQuality === quality && c.lv === 1) {
                result.push(c);
            }
        })
        return result;
    }
    */
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
    return config;
}