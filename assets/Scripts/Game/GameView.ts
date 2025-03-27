import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { GameModel } from './GameModel';
import { textTypeWaves, typeTurret, typeWaves } from './DataGame';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {

    public static Instance: GameView;

    @property({type: SpriteFrame})
    private listSpriteFrameTile: SpriteFrame[] = [];

    public get ListSpriteFrameTile() : SpriteFrame[] {
        return this.listSpriteFrameTile
    }

    @property({type: SpriteFrame})
    private listSpriteObject: SpriteFrame[] = [];

    public get ListSpriteObject() : SpriteFrame[] {
        return this.listSpriteObject
    }

    @property({type: SpriteFrame})
    private listSpriteFrameRoad: SpriteFrame[] = [];

    public get ListSpriteFrameRoad() : SpriteFrame[] {
        return this.listSpriteFrameRoad
    }
    
    @property({type: SpriteFrame})
    private listSpriteFrameBtnTurret: SpriteFrame[] = [];

    public get ListSpriteFrameBtnTurret() : SpriteFrame[] {
        return this.listSpriteFrameBtnTurret
    }

    @property({type: Node})
    private uiUpdateTurret: Node;

    // header
    @property({type: Label, tooltip: "Header"})
    private labelScore: Label;

    @property({type: Label})
    private labelCoin: Label;

    @property({type: Label})
    private labelHeart: Label;

    //button footer
    @property({type: Label})
    private labelGameSpeed: Label;

    @property({type: Label})
    private labelTypeWave: Label;

    @property({type: Label})
    private labelRound: Label;
    
    //detail update turret
    @property({type: SpriteFrame})
    private listSpriteItemDetail: SpriteFrame[] = [];

    public get ListSpriteItemDetail() : SpriteFrame[] {
        return this.listSpriteItemDetail
    }

    @property({type: Node})
    public nodeSelectTurret: Node;

    @property({type: SpriteFrame})
    private listSpriteTurretFire: SpriteFrame[] = [];

    @property({type: SpriteFrame})
    private listSpriteTurretIce: SpriteFrame[] = [];

    @property({type: SpriteFrame})
    private listSpriteTurretEarth: SpriteFrame[] = [];

    @property({type: SpriteFrame})
    private listSpriteTurretElectric: SpriteFrame[] = [];
    
    //GAME OVER
    @property({type: Node})
    private nodeGameOver: Node;

    @property({type: Label})
    private labelRound_GO: Label;

    @property({type: Label})
    private labelScore_GO: Label;
    
    //Sprite bullets
    @property({type: SpriteFrame})
    private listSpriteBullet: SpriteFrame[] = [];

    protected start(): void {
        GameView.Instance = this;
        this.handleAddLogicUpdateTurret();
        this.setAmountScore(0);
        this.setAmountCoin(0);
        this.setAmountHeart(0);

        this.setTextGameSpeed(GameModel.Instance.gameSpeed);
        this.setTextTypeWaves(GameModel.Instance.typeWave);
        this.setAmountRound();
    }

    private handleAddLogicUpdateTurret(): void {
        this.uiUpdateTurret.active = true;
        this.uiUpdateTurret.active = false;
    }

    public setAmountScore(number: number): void {
        GameModel.Instance.score += number;
        this.labelScore.string = GameModel.Instance.score.toString();
    }

    public setAmountCoin(number: number): void {
        GameModel.Instance.coin += number;
        this.labelCoin.string = GameModel.Instance.coin.toString();
    }

    public setAmountHeart(number: number): void {
        GameModel.Instance.heart += number;
        this.labelHeart.string = GameModel.Instance.heart.toString();
        if(GameModel.Instance.heart <= 0){
            GameModel.Instance.gameOver = true;
        }
    }

    public setAmountRound(): void {
        this.labelRound.string = `ROUND ${GameModel.Instance.round.toString()}`;
    }

    public setTextGameSpeed(number: number): void {
        this.labelGameSpeed.string = `X${number}`;
    }

    public setTextTypeWaves(type: number): void {
        const textType = type === typeWaves.MANUAL_WAVE ? 'MANUAL' : 'AUTO';
        this.labelTypeWave.string = textType + ' WAVES';
    }

    public spriteTurret(type: number): SpriteFrame[] {
        let listSpriteFrameTurret: SpriteFrame[] = [];
        switch(type){
            case typeTurret.FIRE:
                listSpriteFrameTurret = this.listSpriteTurretFire;
                break;
            case typeTurret.ICE:
                listSpriteFrameTurret = this.listSpriteTurretIce;
                break;
            case typeTurret.EARTH:
                listSpriteFrameTurret = this.listSpriteTurretEarth;
                break;
            case typeTurret.ELECTRIC:
                listSpriteFrameTurret = this.listSpriteTurretElectric;
                break;
        }
        return listSpriteFrameTurret;
    }

    public uiGameOver(): void {
        this.nodeGameOver.active = true;
        this.labelRound_GO.string = GameModel.Instance.round.toString();
        this.labelScore_GO.string = GameModel.Instance.score.toString();
    }

    public spriteBullet(type: number, upgrade: number): SpriteFrame {
        let spriteFrameBullet: SpriteFrame = null;
        switch(type){
            case typeTurret.FIRE:
                if(upgrade <= 1){
                    spriteFrameBullet = this.listSpriteBullet[0];
                }else if(upgrade === 2){
                    spriteFrameBullet = this.listSpriteBullet[1];
                }else{
                    spriteFrameBullet = this.listSpriteBullet[2];
                }
                break;
            case typeTurret.ICE:
                if(upgrade <= 1){
                    spriteFrameBullet = this.listSpriteBullet[3];
                }else if(upgrade === 2){
                    spriteFrameBullet = this.listSpriteBullet[4];
                }else{
                    spriteFrameBullet = this.listSpriteBullet[5];
                }
                break;
            case typeTurret.EARTH:
                if(upgrade <= 1){
                    spriteFrameBullet = this.listSpriteBullet[6];
                }else if(upgrade === 2){
                    spriteFrameBullet = this.listSpriteBullet[7];
                }else{
                    spriteFrameBullet = this.listSpriteBullet[8];
                }
                break;
            case typeTurret.ELECTRIC:
                if(upgrade <= 1){
                    spriteFrameBullet = this.listSpriteBullet[9];
                }else if(upgrade === 2){
                    spriteFrameBullet = this.listSpriteBullet[10];
                }else{
                    spriteFrameBullet = this.listSpriteBullet[11];
                }
                break;
        }
        return spriteFrameBullet;
    }
}


