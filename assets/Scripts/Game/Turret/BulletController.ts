import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, RigidBody2D, Sprite, Vec2, Vec3 } from 'cc';
import { EnemyController } from '../Enemy/EnemyController';
import { turretConfig } from '../DataGame';
import { EnemyManagementController } from '../Enemy/EnemyManagementController';
import { BulletPool } from '../Pool/BulletPool';
import { GameModel } from '../GameModel';
const { ccclass, property } = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {

    @property({type: RigidBody2D})
    private rb: RigidBody2D;

    @property({type: Sprite})
    public bulletSprite: Sprite;

    public speedBullet: number = 10;

    public bulletDamage: number = 1;

    private maxDistance: number = 0;

    private turretPosition: Vec3 = null;

    private target: Node;

    public typeParent: number = 0;

    protected start(): void {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            // collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }
    
    public setConfig(speedBullet: number, bulletDamage: number, range: number): void {
        this.speedBullet = speedBullet;
        this.bulletDamage = bulletDamage;
        this.maxDistance = range;

        this.turretPosition = this.node.position.clone();
    }

    public seek(_target: Node, _turretPosition: Vec3): void {
        this.target = _target;
        this.turretPosition = _turretPosition.clone(); // Lưu vị trí turret
    }

    protected update(dt: number): void {
        if(GameModel.Instance.gameOver) return;
        if(GameModel.Instance.gamePause) return;

        if (!this.target || !this.target.isValid) {
            this.explode();
            return;
        }

        // Kiểm tra nếu enemy đã đi ra khỏi range của turret
        if (Vec3.distance(this.turretPosition, this.target.position) > this.maxDistance) {
            this.explode();
            return;
        }

        // Tính hướng bay về enemy
        const dir = new Vec2(
            this.target.position.x - this.node.position.x,
            this.target.position.y - this.node.position.y
        );
        dir.normalize();

        const angle = Math.atan2(dir.y, dir.x) * (180 / Math.PI); // Chuyển radian sang độ
        this.node.angle = angle;

        const velocity = dir.multiplyScalar(this.speedBullet);
        this.rb.linearVelocity = velocity;

        // Kiểm tra nếu đạn đã di chuyển quá `maxDistance`
        if (Vec3.distance(this.turretPosition, this.node.position) > this.maxDistance) {
            this.explode();
        }
    }

    private explode(): void {
        // Hiệu ứng nổ (nếu có)
        // this.showExplosionEffect(); // Nếu có hiệu ứng nổ thì gọi ở đây

        // Thu hồi về BulletPool
        BulletPool.Instance.recycleBullet(this.node);
    }

    private onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if(otherCollider.tag === 0){ //enemy tag 0
            selfCollider.node.active = false;
            const enemyController = otherCollider.node.getComponent(EnemyController);
            
            enemyController.handleHp(this.bulletDamage);
            EnemyManagementController.Instance.recycleEnemy(otherCollider.node, enemyController.type);
        }
    }
}


