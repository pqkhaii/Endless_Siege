import { _decorator, Component, director, Node } from 'cc';
import { GameModel } from '../GameModel';
import { scene } from '../DataGame';
const { ccclass, property } = _decorator;

@ccclass('SettingController')
export class SettingController extends Component {

    protected onEnable(): void {
        GameModel.Instance.gamePause = true;
    }
    
    private hide(): void {
        this.node.active = false;
        GameModel.Instance.gamePause = false;
    }

    private show(): void {
        this.node.active = true;
    }

    private gameRestart(): void {
        director.loadScene(scene.GAME);
    }
}


