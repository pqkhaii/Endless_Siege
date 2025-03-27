import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WayPoint')
export class WayPoint extends Component {

    public static points: Node[] = [];

    start() {
        let length = WayPoint.points.length//this.node.children.length
        for (let index = 0; index < length; index++) {
            WayPoint.points[index] = this.node.children[index];
        }
    }
}
