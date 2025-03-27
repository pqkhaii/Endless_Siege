import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Constants')
export class Constants extends Component {

    public static readonly listTextItemDetail = ['Damage', 'Reload', 'Range',]

    public static readonly maxUpgrade: number = 3;
    public static readonly maxLevel: number = 9;
    public static readonly maxWave: number = 200;

    public static readonly enemyNames = ["ENEMY_DEVIL_1", "ENEMY_DEVIL_2", "ENEMY_DEVIL_3", "ENEMY_DEVIL_4", "ENEMY_DEVIL_5"];
}


