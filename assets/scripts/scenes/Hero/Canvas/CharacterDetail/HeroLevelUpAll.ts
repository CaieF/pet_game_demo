import { _decorator, AudioSource, Component, find, Label, Node, sp, Toggle } from 'cc';
import { getConfig, stockConfig } from 'db://assets/scripts/common/config/config';
import { CharacterState } from 'db://assets/scripts/game/fight/character/CharacterState';
import { util } from 'db://assets/scripts/util/util';
import { HeroCharacterProperty } from './HeroCharacterProperty';
import { HolUserResource } from 'db://assets/scripts/prefab/HolUserResource';
const { ccclass, property } = _decorator;

@ccclass('HeroLevelUpAll')
export class HeroLevelUpAll extends Component {
    @property(Node) HeroCharacterPropertyNode: Node = null;
    @property(Node) TipNode: Node = null;

    // 角色状态
    public state: CharacterState

    needGold: number = 0;   // 需要的金币
    levelNum: number = 0; // 升级的等级

    protected onEnable(): void {
        
        this.state = this.HeroCharacterPropertyNode.getComponent(HeroCharacterProperty).$state;
        // 设置第一个为true
        if (this.node.getChildByName("ToggleGroup").children[0].getComponent(Toggle).isChecked == true) {
            this.levelNum = 5
            if (this.state.create.lv + this.levelNum > 100) this.levelNum = 100 - this.state.create.lv;
            this.needGold = util.resourceCost.levelUpNeedGoldByNum(this.state.create, this.levelNum)
            this.updateTips()
        } else {
            this.node.getChildByName("ToggleGroup").children[0].getComponent(Toggle).isChecked = true;
        }
        // this.selectLevel(this.node.getChildByName("ToggleGroup").children[0].getComponent(Toggle), "5")
    }

    protected start(): void {
        
    }

    // 返回
    async goBack() {
        this.node.active = false;
    }

    // 确实升级
    async confirmLevelUp() {
        const config = getConfig();
        if (this.needGold > config.userData.gold) return await util.message.prompt({message: "铜钱不足"})
        config.userData.gold -= this.needGold;
        this.state.create.lv += this.levelNum;
        this.HeroCharacterPropertyNode.getComponent(HeroCharacterProperty).LevelUpEffect(); // 升级特效以及渲染
        this.node.active = false;
        stockConfig();
    }

    // 选择对应的等级
    selectLevel(toggle: Toggle, level: string) {
        if (this.state === null) return
        this.levelNum = parseInt(level);

        if (this.levelNum === 100) this.levelNum = util.resourceCost.getMaxLevelByGold(this.state.create, getConfig().userData.gold);
        if (this.state.create.lv + this.levelNum > 100) this.levelNum = 100 - this.state.create.lv;
        this.needGold = util.resourceCost.levelUpNeedGoldByNum(this.state.create, this.levelNum);
        this.updateTips();
    }

    updateTips() {
        this.TipNode.getComponent(Label).string = `将花费铜钱    ：${this.needGold},升到${this.state.create.lv + this.levelNum}级`;
    }
}


