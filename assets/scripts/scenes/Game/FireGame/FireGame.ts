import { _decorator, Component, dragonBones, Node } from 'cc';
import { log } from '../../../util/out/log';
import { GameCanvas } from '../GameCanvas';
const { ccclass, property } = _decorator;

@ccclass('FireGame')
export class FireGame extends Component {

    @property(Node) SwordNode: Node;
    @property(Node) FireNode: Node;

    @property(Node) FireProgressValue: Node;
    @property(Node) TimeProgressValue: Node;

    private isGameOver: boolean = false;

    private timeScale: number = 1;

    private fireTemp: number = 0;  // 火焰温度

    /** 
     * 0-175度剑缩小： 缩放比 0.5-1  scaledRatio = 0.5 + 0.5 * (this.fireTemp - this.minTemp) / (this.minSafeTemp - this.minTemp);
     * 175-200度剑不缩小： 缩放比 1-1
     * 200-1000度剑放大： 缩放比 1-2.5  scaledRatio = 1 + 1.5 * (this.maxTemp - this.fireTemp) / (this.maxTemp - this.maxSafeTemp);
    */

    private minTemp: number = 0;
    private maxTemp: number = 1000;

    private minSafeTemp: number = 175;
    private maxSafeTemp: number = 200;

    private scaledRatio: number = 1;

    private fireSafeTime: number = 10;

    private fireSafeTimer: number = 0;

    protected update(dt: number): void {
        if (this.isGameOver) return;

        if (this.fireTemp > 0)
            this.fireTemp -= 10 * dt;


        if (this.fireTemp < this.minSafeTemp) {
            // 剑缩小
            this.scaledRatio = 0.5 + 0.5 * (this.fireTemp - this.minTemp) / (this.minSafeTemp - this.minTemp);
            if (this.fireSafeTimer > 0)
                this.fireSafeTimer -= dt;
            if (this.timeScale !== 1) this.setTimeScale(1);
        } else if (this.fireTemp > this.maxSafeTemp) {
            this.scaledRatio = 1 + 1.5 * (1 -(this.maxTemp - this.fireTemp) / (this.maxTemp - this.maxSafeTemp));
            if (this.fireSafeTimer > 0)
                this.fireSafeTimer -= dt;
            if (this.timeScale !== 3) this.setTimeScale(3);
        } else {
            // 剑不缩小
            this.scaledRatio = 1;
            if (this.fireSafeTimer < this.fireSafeTime)
            this.fireSafeTimer += dt;
            if (this.timeScale !== 2 ) this.setTimeScale(2);
        }
        
        this.TimeProgressValue.setScale(this.fireSafeTimer / this.fireSafeTime, 1, 1);
        this.FireProgressValue.setScale(this.fireTemp / 1000, 1, 1);
        this.SwordNode.setScale(this.scaledRatio, this.scaledRatio, 1);

        if (this.fireSafeTimer >= this.fireSafeTime) {
            this.isGameOver = true;
            this.node.parent.getComponent(GameCanvas).fightSuccess()
            return
        }
    }

    clickAddFire() {
        if (this.isGameOver) return;

        if (this.fireTemp < this.maxTemp)
            this.fireTemp += 20;
    }

    setTimeScale(value: number)
    {
        this.timeScale = value;
        this.FireNode.getComponent(dragonBones.ArmatureDisplay).timeScale = value;
    }
}


