import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RiversController')
export class RiversController extends Component {

    @property(Node) river1: Node
    @property(Node) river2: Node
    

    private speed: number = 80
    private background_Height: number = 720

    update(deltaTime: number) {
        this.river1.setPosition(this.river1.position.x, this.river1.position.y - this.speed * deltaTime)
        this.river2.setPosition(this.river2.position.x, this.river2.position.y - this.speed * deltaTime)

        if (this.river1.position.y < -this.background_Height) {
            this.river1.setPosition(this.river1.position.x, this.background_Height)
        }
        if (this.river2.position.y < -this.background_Height) {
            this.river2.setPosition(this.river2.position.x, this.background_Height)
        }
    }
}


