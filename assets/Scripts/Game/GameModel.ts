import { _decorator, Component, Game, Node } from 'cc';
import { typeWaves } from './DataGame';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {
    
    public static Instance: GameModel;

    public gameSpeed: number = 1;
    public typeWave: number = typeWaves.MANUAL_WAVE;
    public gamePause: boolean = false;
    public gameOver: boolean = false;

    //header
    public score: number = 0;
    public coin: number = 500;
    public heart: number = 20;
    public round: number = 0;

    protected start(): void {
        GameModel.Instance = this;
    }

    public formatNumber(num: number): string {
        const number = Number.isInteger(num) ? num : Math.round(num * 100) / 100;
        return number.toString();
    }
}


