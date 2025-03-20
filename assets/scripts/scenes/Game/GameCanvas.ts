import { _decorator, Component, Node } from 'cc';
import { SCENE } from '../../common/enums';
import { util } from '../../util/util';
import { LeverGame } from './Lever/LeverGame';
import { ILevel } from '../../game/fight_entity/level';
import { common } from '../../common/common/common';
import { getConfig, stockConfig } from '../../common/config/config';
const { ccclass, property } = _decorator;

@ccclass('GameCanvas')
export class GameCanvas extends Component {
    @property(Node) CommonUiNode: Node = null!

    level: ILevel = null

    protected start(): void {
        this.level = common.level
        
        if (!this.level) {
            util.subdry.sceneDirector(SCENE.GAME, SCENE.HOME)
            return
        }

        this.node.getChildByName(this.level.gameType).active = true
    }

    // 回到主页
    async GoBack() {
        this.node.getChildByName('Lever').getComponent(LeverGame).isGameStart = false
        await util.subdry.sceneDirector(SCENE.GAME, SCENE.HOME)
    }

    // 重新加载游戏
    async ReLoadGame() {
        await util.subdry.sceneDirector(SCENE.GAME, SCENE.GAME)
    }

    // 游戏失败
    public async fightFailure() {
        this.CommonUiNode.getChildByName('FightFailure').active = true
        this.CommonUiNode.getChildByName('FightSuccess').active = false
    }

    // 游戏胜利
    public async fightSuccess() {
        const config = getConfig()
        config.userData.levelProcess.levels[`level${this.level.id}`].star = 3
        if (this.level.id === config.userData.levelProcess.currentLevel) {
            config.userData.levelProcess.currentLevel++
            if (config.userData.levelProcess.levels[`level${config.userData.levelProcess.currentLevel}`])
                config.userData.levelProcess.levels[`level${config.userData.levelProcess.currentLevel}`].isUnlock = true
            if (this.level.unlockPageId && this.level.unlockPageId.length > 0) {
                for (let i = 0; i < this.level.unlockPageId.length; i++) {
                    const page = config.userData.bookPageProgress.find(p => p.id === (this.level.unlockPageId[i]))
                    if (page) {
                        page.isUnlock = true
                    }
                }
            }
        }
        
        this.CommonUiNode.getChildByName('FightFailure').active = false
        this.CommonUiNode.getChildByName('FightSuccess').active = true
        stockConfig();
    }
}


