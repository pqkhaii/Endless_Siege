import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { GameModel } from '../GameModel';
const { ccclass, property } = _decorator;

@ccclass('ItemDetail')
export class ItemDetail extends Component {

    @property({type: Sprite})
    private iconSprite: Sprite;

    @property({type: Label})
    private labelDetail: Label;

    @property({type: Label})
    private labelAmount: Label;

    @property({type: Label})
    private labelNextAmount: Label;

    public setItem(spriteFrame?: SpriteFrame, detail?: string, amount?: number, nextAmount?: number): void {
        this.iconSprite.spriteFrame = spriteFrame;
        this.labelDetail.string = detail;
        this.labelAmount.string = GameModel.Instance.formatNumber(amount);//amount.toFixed(2);
        if (nextAmount === 0 || nextAmount === undefined) {
            this.labelNextAmount.string = ''; // Nếu nextAmount = 0 hoặc undefined thì hiển thị rỗng
        } else {
            const sign = nextAmount > 0 ? '+' : ''; // Nếu số dương, thêm dấu +
            this.labelNextAmount.string = `${sign}${GameModel.Instance.formatNumber(nextAmount)}`;
        }
    }
}


