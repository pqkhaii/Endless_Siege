import { _decorator, Component, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HpEnemy')
export class HpEnemy extends Component {
    @property({type: ProgressBar})
    private hp: ProgressBar;
    
    public setHp(current: number, max: number): void {
        this.hp.progress = current/max;
    }
}


