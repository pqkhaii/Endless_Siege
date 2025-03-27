import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { BulletController } from '../Turret/BulletController';
const { ccclass, property } = _decorator;

@ccclass('BulletPool')
export class BulletPool extends Component {

    public static Instance: BulletPool;

    public bulletPools: Map<number, Node[]> = new Map(); 

    @property({type: Prefab})
    private prefabBullets: Prefab[] = [];

    protected start(): void {
        BulletPool.Instance = this;
    }

    public getBullet(type: number, parent: Node): Node {
        if (!this.bulletPools.has(type)) {
            this.bulletPools.set(type, []);
        }

        let pool = this.bulletPools.get(type);

        let bullet: Node;
        if (pool.length > 0) {
            bullet = pool.pop();
            bullet.active = true;
        } else {
            bullet = instantiate(this.prefabBullets[type]);
            bullet.getComponent(BulletController).typeParent = type;
        }

        bullet.setParent(parent);
        return bullet;
    }

    public recycleBullet(bullet: Node): void {
        const type = bullet.getComponent(BulletController).typeParent;
        
        if (!this.bulletPools.has(type)) {
            this.bulletPools.set(type, []);
        }

        bullet.active = false;
        bullet.setParent(null); // Đưa về Pool
        this.bulletPools.get(type).push(bullet);
    }
}


