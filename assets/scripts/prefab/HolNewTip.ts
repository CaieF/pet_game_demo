import { _decorator, Component, Label, Node } from 'cc';
import { NewTip } from '../common/Tips';
const { ccclass, property } = _decorator;

@ccclass('HolNewTip')
export class HolNewTip extends Component {
    @property(Label) label: Label = null!;

    speed: number = 0.1;  // 每个字符显示的时间间隔
    
    private currentIndex: number = 0; // 当前索引
    private currentStringIndex: number = 0; // 当前显示的字符串

    protected start(): void {
        this.startTypewriter()
    }

    startTypewriter(): void {
        this.currentIndex = 0
        this.currentStringIndex = 0
        this.label.string = ''
        this.schedule(this.updateText, this.speed)
    }

    updateText () {
        if (this.currentStringIndex < NewTip.length) {
            if (this.currentIndex < NewTip[this.currentStringIndex].length) {
                this.label.string += NewTip[this.currentStringIndex][this.currentIndex]
                this.currentIndex++
            } else {
                this.currentIndex = 0
                this.currentStringIndex++
                this.label.string += '\n'
            }
        } else {
            this.unschedule(this.updateText) // 停止计时器
            // this.node.destroy()
        }
    }

    skipTypewritter() {
        if (this.currentStringIndex >= NewTip.length) {
            return this.node.destroy()
        }
        this.label.string = ''
        for (let i = 0; i <= this.currentStringIndex; i++) {
            this.label.string += NewTip[i] + '\n'
        }
        this.currentStringIndex ++
        this.currentIndex = 0
        if (this.currentStringIndex >= NewTip.length) this.unschedule(this.updateText) // 停止计时器
    }
}


