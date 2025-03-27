import { _decorator, Component, instantiate, Label, Node, Prefab, RichText, Sprite, SpriteFrame, Vec3 } from 'cc';
import { ItemDetail } from './ItemDetail';
import { TurretManagementController } from '../Turret/TurretManagementController';
const { ccclass, property } = _decorator;

@ccclass('UpdateTurret')
export class UpdateTurret extends Component {

    public static Instance: UpdateTurret;

    public isHide: boolean = false;

    @property({type: Prefab})
    private prefabItemDetail: Prefab;

    @property({type: Node})
    private itemDetailParent: Node;

    public listItemDetail: Node[] = []

    @property({type: Sprite})
    public listTurrets: Sprite[] = [];

    public currentTurretType: number = 0;

    @property({type: RichText})
    public richTextInfor: RichText;

    @property({type: Label})
    public listLabelBtnPrice: Label[] = [];

    protected onLoad(): void {
        UpdateTurret.Instance = this;
        this.initItemDetail();
    }

    public show(worldPositionTurret: Vec3, typeTurret: number): void {
        this.isHide = false;
        if(worldPositionTurret.x >= 540){
            this.node.setPosition(-230, 0, 0);
        }else{
            this.node.setPosition(230, 0, 0);
        }
        this.node.active = true;
        this.currentTurretType = typeTurret;
    }

    public hide(): void {
        this.node.active = false;
        this.isHide = true;
    }

    public initItemDetail(): void {
        for (let i = 0; i < 4; i++) {
            const item = instantiate(this.prefabItemDetail);
            this.itemDetailParent.addChild(item);
            this.listItemDetail.push(item);
        }
    }

    public changeTurretUI(listSprire: SpriteFrame[]): void {
        for (let i = 0; i < this.listTurrets.length; i++) {
            const element = this.listTurrets[i];
            element.spriteFrame = listSprire[i];
        }
    }
}


