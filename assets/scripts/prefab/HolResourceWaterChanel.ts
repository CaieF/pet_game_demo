import { _decorator, Component, Node } from 'cc';
import { RiverGame } from '../scenes/Game/RiverGame/RiverGame';
const { ccclass, property } = _decorator;

@ccclass('HolResourceWaterChanel')
export class HolResourceWaterChanel extends Component {
    @property(Node) water_chanel1: Node
    @property(Node) water_chanel2: Node
    @property(Node) water_chanel3: Node

    private speed: number = 80
    private water_chanel_width: number = 431


    update(deltaTime: number) {

        this.water_chanel1.setPosition(this.water_chanel1.position.x - this.speed * deltaTime, this.water_chanel1.position.y)
        this.water_chanel2.setPosition(this.water_chanel2.position.x - this.speed * deltaTime, this.water_chanel2.position.y)
        this.water_chanel3.setPosition(this.water_chanel3.position.x - this.speed * deltaTime, this.water_chanel3.position.y)

        if (this.water_chanel1.position.x + this.water_chanel_width <= 0) {
            this.water_chanel1.setPosition(this.water_chanel3.position.x + this.water_chanel_width, this.water_chanel1.position.y);
        }
        if (this.water_chanel2.position.x + this.water_chanel_width <= 0) {
            this.water_chanel2.setPosition(this.water_chanel1.position.x + this.water_chanel_width, this.water_chanel2.position.y);
        }
        if (this.water_chanel3.position.x + this.water_chanel_width <= 0) {
            this.water_chanel3.setPosition(this.water_chanel2.position.x + this.water_chanel_width, this.water_chanel3.position.y);
        }
    }

    changeRation() {
        if (this.node.parent.parent.getComponent(RiverGame).isGameOver) return
        this.node.angle += 90
    }
}


