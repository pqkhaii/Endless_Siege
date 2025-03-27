import { _decorator, Component, Node, Vec3 } from 'cc';
import { WayPoint } from './WayPoint';
import { enemyConfig } from '../DataGame';
import { GameModel } from '../GameModel';
import { EnemyManagementController } from './EnemyManagementController';
import { HpEnemy } from './HpEnemy';
import { GameView } from '../GameView';
const { ccclass, property } = _decorator;

interface enemyStats {
    hp: number, 
    speed: number, 
    coin: number, 
    point: number
}

@ccclass('EnemyController')
export class EnemyController extends Component {
    private stats: enemyStats;

    @property({type: HpEnemy})
    private hpEnemy: HpEnemy;

    public baseSpeed: number = 0
    public moveSpeed: number = 0;
    public baseHp: number = 0;
    public type: number = 0;

    private target: Node;
    private wavepointIndex: number = 0;
    
    private slowEffects: Map<string, number> = new Map(); // Lưu turret làm chậm
    
    protected onEnable(): void {
        this.target = WayPoint.points[0];
        this.wavepointIndex = 0;
        
        this.stats = { ...enemyConfig[this.type] }; //tranh thay doi du lieu goc
        this.baseSpeed = enemyConfig[this.type].speed;
        this.baseHp = this.stats.hp;

        this.hpEnemy.setHp(this.baseHp, this.baseHp);
        this.hpEnemy.node.active = false;

        this.slowEffects.clear();
    }

    protected update(dt: number): void {
        if(GameModel.Instance.gameOver) return;
        if(GameModel.Instance.gamePause) return;
        if (!this.target) return;

        // console.log('speed', this.speed)

        const dirX = this.target.position.x - this.node.position.x;
        const dirY = this.target.position.y - this.node.position.y;

        // Xác định hướng di chuyển và chọn animation phù hợp
        if (Math.abs(dirX) > Math.abs(dirY)) {
            if (dirX > 0) {
                // console.log("move_right");
                this.node.setScale(-0.4, this.node.scale.y, this.node.scale.z);
                this.hpEnemy.node.setScale(-1, 1, 1);
            } else {
                // console.log("move_left");
                this.node.setScale(0.4, this.node.scale.y, this.node.scale.z);
                this.hpEnemy.node.setScale(1, 1, 1);
            }
        } else {
            if (dirY > 0) {
                // console.log("move_up");
            } else {
                // console.log("move_down");
            }
        }

        const dir = new Vec3(
            this.target.position.x - this.node.position.x,
            this.target.position.y - this.node.position.y,
            this.target.position.z - this.node.position.z
        );

        dir.normalize();
        // Tính khoảng cách di chuyển
        let moveDistance = this.stats.speed * dt * GameModel.Instance.gameSpeed;
        let move = new Vec3(dir.x * moveDistance, dir.y * moveDistance, 0);

        // Kiểm tra nếu đi qua waypoint
        if (Vec3.distance(this.node.position, this.target.position) <= moveDistance + 2) {
            this.getNextWayPoint();
        } else {
            this.node.position = this.node.position.add(move);
        }  
    }

    public applySlowEffect(slowAmount: number, turretId: string): void {
        this.slowEffects.set(turretId, slowAmount);
        this.calculateSpeed();
    }
    
    /** Xóa hiệu ứng slow của một turret */
    public removeSlowEffect(turretId: string): void {
        this.slowEffects.delete(turretId);
        this.calculateSpeed();
    }
    
    /** Cập nhật tốc độ theo tất cả hiệu ứng slow hiện tại */
    private calculateSpeed(): void {
        let totalSlow = 0;
        this.slowEffects.forEach((slow) => {
            totalSlow = Math.max(totalSlow, slow); // Chọn slow lớn nhất
        });
    
        this.stats.speed = this.baseSpeed * (1 - totalSlow);
    }

    private getNextWayPoint(): void {
        if(this.wavepointIndex >= WayPoint.points.length - 1){
            GameView.Instance.setAmountHeart(-1);
            EnemyManagementController.Instance.recycleEnemy(this.node, this.type);
            return;
        }
        this.wavepointIndex++;
        this.target = WayPoint.points[this.wavepointIndex];
    }

    public handleHp(number: number): void {
        this.stats.hp -= number;
        if(this.hpEnemy.node.active === false) this.hpEnemy.node.active = true;
        this.hpEnemy.setHp(this.stats.hp, this.baseHp);
        // console.log('hp enemy', this.hp)
        if(this.stats.hp <= 0){
            // this.node.destroy();
            EnemyManagementController.Instance.recycleEnemy(this.node, this.type);
            GameView.Instance.setAmountCoin(this.stats.coin);
            GameView.Instance.setAmountScore(this.stats.point);
        }
    }
}
