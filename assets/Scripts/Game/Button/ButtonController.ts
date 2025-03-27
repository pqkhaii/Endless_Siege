import { _decorator, ButtonComponent, Component, director, instantiate, Node, Prefab, SpriteFrame, Vec3 } from 'cc';
import { ButtonTurret } from './ButtonTurret';
import { GameView } from '../GameView';
import { GameModel } from '../GameModel';
import { typeWaves } from '../DataGame';
const { ccclass, property } = _decorator;

@ccclass('ButtonController')
export class ButtonController extends Component {

    @property({type: GameView})
    private gameView: GameView;

    @property({type: Prefab})
    private buttonTurretPrefab: Prefab;

    private listBtnTurret: Node[] = [];

    private countClick: number = 0;

    public get ListBtnTurret() : Node[] {
        return this.listBtnTurret;
    }
    
    protected start(): void {
        this.createButtonTurret();
    }

    private createButtonTurret(): void {
        const startX = -230;  // Điểm bắt đầu
        const spacing = 155;  // Khoảng cách giữa các button
        const yPos = 0;  
        for (let i = 0; i < 4; i++) {
            const btnTurret = instantiate(this.buttonTurretPrefab);
            btnTurret.parent = this.node;
            this.listBtnTurret.push(btnTurret);
            btnTurret.setPosition(new Vec3(startX + i * spacing, yPos, 0));

            const buttonTurret = btnTurret.getComponent(ButtonTurret);
            buttonTurret.setPrice(i * 100);
            const spriteBtnTurret: SpriteFrame = this.gameView.ListSpriteFrameBtnTurret[i];
            buttonTurret.setSprite(spriteBtnTurret);
            buttonTurret.setType(i)
        }
    }

    private onClickGameSpeed(): void {
        GameModel.Instance.gameSpeed += 1;
        if(GameModel.Instance.gameSpeed > 3){
            GameModel.Instance.gameSpeed = 1;
        }
        this.gameView.setTextGameSpeed(GameModel.Instance.gameSpeed);
    }

    public onClickTypeWave(): void {
        const currentType = GameModel.Instance.typeWave === typeWaves.MANUAL_WAVE ? typeWaves.AUTO_WAVE : typeWaves.MANUAL_WAVE
        GameModel.Instance.typeWave = currentType;
        console.log(currentType)
        this.gameView.setTextTypeWaves(currentType);
    }

    public onClickPauseEnemy(): void {
        GameModel.Instance.gamePause = !GameModel.Instance.gamePause;
    }
}


