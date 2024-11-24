import { _decorator, Component, director, EventTouch, math, Node, screen } from 'cc';
import { getConfig } from '../../../common/config/config';
import { log } from '../../../util/out/log';
import { util } from '../../../util/util';
const { ccclass, property } = _decorator;

@ccclass('HomeBuildings')
export class HomeBuildings extends Component {

    private $FrameSize: math.Size;
    private $lastPositionX: number = -1;
    protected async start() {
        const config = getConfig();
        // 触摸事件开始
        this.node.on(Node.EventType.TOUCH_MOVE, this.onNodeTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onNodeTouchEnd, this);
        // 初始化宽度
        this.$FrameSize = screen.windowSize
    }

    protected onDestroy() {
        this.node.off(Node.EventType.TOUCH_MOVE, this.onNodeTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onNodeTouchEnd, this);
    }

    private onNodeTouchMove(event: EventTouch) {
        const currentPositionX = event.touch.getLocationX();
        if (this.$lastPositionX !== -1) {
            const positionX = this.node.position.x + (currentPositionX - this.$lastPositionX) * 0.9;
            if (Math.abs(positionX) <= (1826 - this.$FrameSize.width) / 2) {
                this.node.setPosition(positionX, this.node.position.y, this.node.position.z)
            }
        }
        this.$lastPositionX = currentPositionX;
        return;
    }
    
    private onNodeTouchEnd() {
        this.$lastPositionX = -1;
    }

    // 打开关卡选择场景
    public async OpenLevelMap() {
        const close = await util.message.load();
        director.preloadScene("Fight", ()=> {
            close();
        })
        director.loadScene("Fight");
    }

    // 打开商店场景
    public async OpenShopMap() {
        const close = await util.message.load();
        console.log(this.node.parent);
        
        this.node.parent.getChildByName("HolShopping").active = true;
        close();
    }
    
}


