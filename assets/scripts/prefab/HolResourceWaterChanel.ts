import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HolResourceWaterChanel')
export class HolResourceWaterChanel extends Component {
    @property(Node) water_chanel1: Node
    @property(Node) water_chanel2: Node

    private speed: number = 80
    private water_chanel_width: number = 431
    private rationSpeed: number = 60
    

    update(deltaTime: number) {
        this.node.angle += this.rationSpeed * deltaTime

        this.water_chanel1.setPosition(this.water_chanel1.position.x - this.speed * deltaTime, this.water_chanel1.position.y)
        this.water_chanel2.setPosition(this.water_chanel2.position.x - this.speed * deltaTime, this.water_chanel2.position.y)
        
        if (this.water_chanel1.position.x + this.water_chanel_width <= 0) {
            this.water_chanel1.setPosition(this.water_chanel_width, this.water_chanel1.position.y)
        }

        if (this.water_chanel2.position.x + this.water_chanel_width <= 0) {
            this.water_chanel2.setPosition(this.water_chanel_width, this.water_chanel2.position.y)
        }
    }
}


