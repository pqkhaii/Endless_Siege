import { _decorator, Component, instantiate, Node, Prefab, Animation } from 'cc';
import { BulletController } from '../Turret/BulletController';
const { ccclass, property } = _decorator;

@ccclass('BulletPool')
export class BulletPool extends Component {

    public static Instance: BulletPool;

    public bulletPools: Map<number, Node[]> = new Map(); 

    public bulletHitPool: Node[] = [];

    @property({type: Prefab})
    private prefabBullets: Prefab[] = [];

    @property({type: Prefab})
    private prefabBulletHit: Prefab;

    @property({type: Node})
    private parentBulletHit: Node;

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

    public spawnBulletHit(enemy: Node): Node {
        if(this.checkStatus(this.bulletHitPool) !== null ){
            const bulletHit = this.checkStatus(this.bulletHitPool);
            bulletHit.active = true;
            bulletHit.getComponent(Animation).play();
            bulletHit.worldPosition = enemy.worldPosition;
            setTimeout(() => {
                bulletHit.active = false;
            }, 1000);

            return bulletHit;
        }
    }

    public checkStatus(node: Node[]): Node {
        for(let i = 0; i < node.length; i++){
            if(node[i].active === false){
                return node[i];
            }
        }
        const bulletHit = instantiate(this.prefabBulletHit);
        bulletHit.parent =  this.parentBulletHit;
        bulletHit.active = false;
        this.bulletHitPool.push(bulletHit);
        return bulletHit;
    }

}


