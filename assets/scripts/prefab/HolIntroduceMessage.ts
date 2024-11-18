import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

export type HolIntroduceOption = {
    // 内容
    message: string;
    // 按钮一
    buttonOne?: {
        message: string,
        callback: any
    },
    // 按钮二
    buttonTwo?: {
        message: string,
        callback: any
    },
};

@ccclass('HolIntroduceMessage')
export class HolIntroduceMessage extends Component {

    @property(Node) ContentNode: Node;

    private $closeQueue: Function[] = []

    listen(e: 'close', fn: Function) {
        if (e === 'close') this.$closeQueue.push(fn)
    }

    // 设置内容
    public setContent(option: HolIntroduceOption) {
        this.ContentNode.getComponent(Label).string = option.message;
        if (option.buttonOne) {
            const buttonOne = this.ContentNode.getChildByName('ButtonOne');
            buttonOne.getChildByName('text').getComponent(Label).string = option.buttonOne.message;
            buttonOne.active = true;
            buttonOne.on('click', async() => {
                await option.buttonOne.callback();
                this.closeNode();
            });
        }
        if (option.buttonTwo) {
            const buttonTwo = this.ContentNode.getChildByName('ButtonTwo');
            buttonTwo.getChildByName('text').getComponent(Label).string = option.buttonTwo.message;
            buttonTwo.active = true;
            buttonTwo.on('click', async() => {
                await option.buttonTwo.callback();
                this.closeNode();
            });
        }
    }

    // 关闭函数
    public closeNode() {
        const introduceNode = this.node.getChildByName('Introduce');
        introduceNode.getChildByName('ButtonOne').off('click');
        introduceNode.getChildByName('ButtonTwo').off('click');
        for (const close of this.$closeQueue) close();
    }
}


