import { _decorator, Color, Component, director, find, Graphics, Input, input, instantiate, Light, math, MeshRenderer, misc, Node, ParticleSystem, Prefab, Sprite, spriteAssembler, tween, UITransform, Vec2, Vec3 } from 'cc';
import { BulletController } from './BulletController';
import { turretConfig, typeTurret } from '../DataGame';
import { GameModel } from '../GameModel';
import { UpdateTurret } from '../UpdateTurret/UpdateTurret';
import { BulletPool } from '../Pool/BulletPool';
import { EnemyController } from '../Enemy/EnemyController';
import { EnemyManagementController } from '../Enemy/EnemyManagementController';
import { Constants } from '../../Constants/Constants';
import { GameView } from '../GameView';
import { ItemDetail } from '../UpdateTurret/ItemDetail';
const { ccclass, property } = _decorator;

interface TurretStats {
    bulletDamage: number;
    range: number;
    reload: number;
    speedBullet: number;
    level: number;
    upgrade: number
}

@ccclass('TurretController')
export class TurretController extends Component {

    private stats: TurretStats;

    public type: number;

    @property(Node)
    private partToRotate: Node = null;

    @property(Node)
    private firePoint: Node = null;

    @property(Node)
    private nodeRange: Node = null;

    private target: Node = null;
    private fireCountdown: number = 0;

    public damageOverTime: number = 3;

    public row: number = 0;
    public col: number = 0;

    private level: number = 1;
    private upgrade: number = 1;

    @property({type: Sprite})
    private baseSprite: Sprite;

    protected start() {
        this.setStats();
    }

    protected update(dt: number) {
        if(GameModel.Instance.gameOver) return;
        if(GameModel.Instance.gamePause) return;
        if (UpdateTurret.Instance.isHide === true) this.offRangeDraw();

        if (this.type === typeTurret.ICE && this.level <= 1) {
            this.applySlowToEnemiesInRange(0.2); // 0.7
        }

        // Tìm mục tiêu mới nếu chưa có target hoặc target đã rời khỏi range
        if (!this.target || Vec3.squaredDistance(this.node.position, this.target.position) > this.stats.range ** 2) {
            // Nếu có target trước đó mà giờ đã ra khỏi range, thì xóa slow effect
            if (this.target) {
                const enemyController = this.target.getComponent(EnemyController);
                if (enemyController) {
                    // enemyController.removeSlowEffect(this.node.uuid);
                }
            }
            this.findNearestTarget(); // Tìm mục tiêu mới
        }
        // console.log(this.target)
        if (!this.target) return; // Không có mục tiêu thì dừng lại
    
        // Xử lý bắn đạn
        if(this.type === typeTurret.FIRE){
            this.fireCountdown -= dt * GameModel.Instance.gameSpeed;
            if (this.fireCountdown <= 0) {
                // console.log('shoot')
                this.shoot();
                this.fireCountdown = 1 / this.stats.reload;
            }
        }

        if(this.type === typeTurret.EARTH){
            this.fireCountdown -= dt * GameModel.Instance.gameSpeed;
            if (this.fireCountdown <= 0) {
                // console.log('shoot')
                this.shoot();
                this.fireCountdown = 1 / this.stats.reload;
            }
        }
    }

    private applySlowToEnemiesInRange(slowAmount: number): void {
        let rangeSquared = this.stats.range ** 2;
    
        for (const enemy of EnemyManagementController.Instance.ListEnemy) {
            if (!enemy.active) continue;
            const distanceToEnemy = Vec3.squaredDistance(this.node.position, enemy.position);
            const enemyController = enemy.getComponent(EnemyController);
            if (!enemyController) continue;
    
            if (distanceToEnemy <= rangeSquared) {
                // Nếu enemy trong phạm vi, áp dụng hiệu ứng slow
                enemyController.applySlowEffect(slowAmount, this.node.uuid);
            } else {
                // Nếu enemy ngoài phạm vi, chỉ xóa slow effect của turret này
                enemyController.removeSlowEffect(this.node.uuid);
            }
        }
    }
    
    private findNearestTarget() {
        const enemies = find("Canvas/Mask/Enemies").children;
        let shortestDistance = this.stats.range ** 2; // Dùng squaredDistance để tối ưu
        let nearestEnemy: Node = null;
    
        for (const enemy of enemies) {
            if (!enemy.active) continue;
            const distanceToEnemy = Vec3.squaredDistance(this.node.position, enemy.position);
            if (distanceToEnemy < shortestDistance) {
                shortestDistance = distanceToEnemy;
                nearestEnemy = enemy;
            }
        }
    
        this.target = nearestEnemy; // Cập nhật target mới hoặc null nếu không tìm thấy
    }

    private lockOnTarget() {
        if (!this.target || !this.target.isValid) return;

        // Lấy vị trí hiện tại và vị trí mục tiêu
        const currentPos = this.node.getPosition();
        const targetPos = this.target.getPosition();

        // Tính vector hướng từ node đến target
        const dir = new Vec2(targetPos.x - currentPos.x, targetPos.y - currentPos.y);

        const angle = Math.atan2(-dir.y, -dir.x) * (180 / Math.PI);
        this.partToRotate.angle = angle;
    }

    private shoot(): void {
        if (!this.firePoint) return;
    
        const getMainScene = find("Canvas/Mask");
        const bullet = BulletPool.Instance.getBullet(this.type, getMainScene);
    
        bullet.setWorldPosition(this.firePoint.worldPosition);
    
        // Thiết lập mục tiêu cho đạn
        const bulletController = bullet.getComponent(BulletController);
        bulletController.setConfig(this.stats.speedBullet, this.stats.bulletDamage, this.stats.range);
        bulletController.bulletSprite.spriteFrame = GameView.Instance.spriteBullet(this.type, this.upgrade);
        if (bulletController && this.target) {
            bulletController.seek(this.target, this.node.position);
        }
    }

    private setStats() {
        const config = turretConfig[this.type];
        // console.log('config', config)
        // console.log('upgradeStats', config.upgradeStats[this.upgrade- 1].bulletDamage[this.level-1])

        this.stats = {
            bulletDamage: config.upgradeStats[this.upgrade - 1].bulletDamage[this.level - 1],
            range: config.upgradeStats[this.upgrade - 1].range[this.level - 1],
            reload: config.upgradeStats[this.upgrade - 1].reload[this.level - 1],
            speedBullet: config.upgradeStats[this.upgrade - 1].speedBullet[this.level - 1],
            level: this.level,
            upgrade: this.upgrade
        };
    }

    public levelUp() {
        if (this.level <= Constants.maxLevel) {
            this.level++;
            this.setStats();
            
            this.showUIUpdateTurret();
        }
    }

    public upgradeTurret() {
        // console.log('giá upgrade', this.getUpgradeCost());
        // if(this.getUpgradeCost() <= GameModel.Instance.coin){
            GameModel.Instance.coin -= this.getUpgradeCost();
            if (this.upgrade < Constants.maxUpgrade) {
                this.upgrade++;
                this.level = 1;
                this.setStats();
    
                this.showUIUpdateTurret();
            }
        // }
    }

    public showUIUpdateTurret(): void {
        UpdateTurret.Instance.show(this.node.worldPosition, this.type);
        UpdateTurret.Instance.richTextInfor.string = `<outline color=black width = 3><color=#ffffff>Ice - </color><color=#07D10F>level ${this.level}/10</color></outline>`
        this.drawTargetingRange();
        const listItemDetail = UpdateTurret.Instance.listItemDetail;
        const data = [
            { key: 'Damage', value: this.stats.bulletDamage, nextValue: this.getNextValue('bulletDamage') },
            { key: 'Range', value: this.stats.range, nextValue: this.getNextValue('range') },
            { key: 'Reload', value: this.stats.reload, nextValue: this.getNextValue('reload') },
            { key: 'Speed', value: this.stats.speedBullet, nextValue: this.getNextValue('speedBullet') },
        ];

        listItemDetail.forEach((item, i) => {
            const detailComponent = item.getComponent(ItemDetail);
            if (detailComponent) {
                const { key, value, nextValue } = data[i];
                detailComponent.setItem(GameView.Instance.ListSpriteItemDetail[i], key, value, nextValue);
            }
        });

        let spriteFrameTurret = GameView.Instance.spriteTurret(this.type);
        UpdateTurret.Instance.changeTurretUI(spriteFrameTurret);

        //show price
        const levelUpPrice = this.getLevelUpCost();
        const upgradePrice = this.getUpgradeCost();
        const sellPrice = this.getSellPrice();

        const listPrice = [levelUpPrice, upgradePrice, sellPrice];

        UpdateTurret.Instance.listLabelBtnPrice.forEach((label, i) => {
            label.string = listPrice[i] > 0 ? GameModel.Instance.formatNumber(listPrice[i]) : '';
        });


        //ui demo turret level
        UpdateTurret.Instance.listTurrets.forEach((sprite, i) => {
            const color = i != (this.upgrade - 1) ? new Color(255, 255, 255, 180) : new Color(255, 255, 255, 250)
            sprite.color = color;
        });
        this.baseSprite.spriteFrame = GameView.Instance.spriteTurret(this.type)[this.upgrade - 1];
        
    }

    // **Hàm tính chỉ số tiếp theo**
    private getNextValue(stat: keyof TurretStats): number {
        const config = turretConfig[this.type];
    
        if (this.level <= Constants.maxLevel) {
            return (config.upgradeStats?.[this.upgrade - 1]?.[stat][this.level]) - (config.upgradeStats?.[this.upgrade - 1]?.[stat][this.level - 1]);
        }
    
        if (this.upgrade < Constants.maxUpgrade) {
            return config.upgradeStats?.[this.upgrade]?.[0]?.[stat] ?? 0;
        }
    
        return 0;
    }
    

    public getLevelUpCost(): number {
        return turretConfig[this.type].upgradeStats[this.upgrade - 1].levelUpCost[this.level];
    }
    
    public getUpgradeCost(): number {
        return turretConfig[this.type].upgradeCost[this.upgrade - 1];
    }
    
    public getSellPrice(): number {
        return turretConfig[this.type].upgradeStats[this.upgrade - 1].sellPrice[this.level - 1];
    }

    private drawTargetingRange() {
        this.nodeRange.active = true;
        let graphics = this.nodeRange.getComponent(Graphics);
        if (!graphics) {
            graphics = this.nodeRange.addComponent(Graphics);
        }
        graphics.clear(); // Xóa bản vẽ cũ nếu có
    
        // Thiết lập màu sắc
        graphics.lineWidth = 10;
        graphics.strokeColor = new Color(128, 0, 128, 255); // Viền tím (RGB: 128, 0, 128)
        graphics.fillColor = new Color(128, 0, 128, 40); // Màu nền tím nhạt
    
        // Vẽ vòng tròn phạm vi turret
        graphics.circle(0, 0, this.stats.range);
        graphics.fill();
        graphics.stroke();
    }

    public offRangeDraw(): void {
        this.nodeRange.active = false;
    }
}


