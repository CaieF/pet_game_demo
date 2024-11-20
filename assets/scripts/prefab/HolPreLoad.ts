import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HolPreLoad')
export class HolPreLoad extends Component {

    @property(Node) public ValueNode: Node; // 进度条节点
    @property(Node) public TipNode: Node; // 进度文字节点

    private $tips: string[] = ["提示\n我是一个小提示"];

    private $current: number = 0;  // 进度条进度
    private $process: number = 0;  // 加载进度
    private $completeQueue: Function[] = [];  // 完成回调队列

    setProcess(num: number) {
        this.$process = num;
    }

    setTips(tips: string[]) {
        this.$tips = tips;
    }

    listenComplete(cb: Function) {
        this.$completeQueue.push(cb);
    }

    private $currentIndex: number = 0;  // 当前提示索引
    private $accumulateTime: number = 0; // 累计时间
    
    protected update(deltaTime: number) {
        if (this.$current >= 100) { // 进度条完成
            this.$completeQueue.forEach(cb => cb());
            this.node.active = false;
            return;
        }

        if (this.$current < this.$process) {
            this.$current += deltaTime * 45;
            this.ValueNode.setScale(this.$current / 100, 1, 1);
        }
        this.$accumulateTime -= deltaTime;
        if (this.$accumulateTime <= 0) {
            this.TipNode.getComponent(Label).string = this.$tips[this.$currentIndex];
            this.$currentIndex++;
            this.$accumulateTime = 2;
            if (this.$currentIndex >= this.$tips.length)  this.$currentIndex = 0;
        }
    }
}
