import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonTurret')
export class ButtonTurret extends Component {

    @property({type: Label})
    private labelPrice: Label;

    @property({type: Sprite})
    private spriteTurret: Sprite;

    private type: number = null;
    
    public get Type() : number {
        return this.type;
    }
    

    public setPrice(num: number):void{
        this.labelPrice.string = num.toString();
    }

    public setSprite(spriteFrame: SpriteFrame): void {
        this.spriteTurret.spriteFrame = spriteFrame
    }

    public setType(number: number): void {
        this.type = number;
    }
}


