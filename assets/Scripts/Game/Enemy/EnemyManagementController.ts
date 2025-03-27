import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { dataEnemy } from './DataEnemy';
import { EnemyController } from './EnemyController';
import { Constants } from '../../Constants/Constants';
import { GameModel } from '../GameModel';
import { GameView } from '../GameView';
const { ccclass, property } = _decorator;

@ccclass('EnemyManagementController')
export class EnemyManagementController extends Component {

    public static Instance: EnemyManagementController;

    @property({type: Prefab})
    private prefabEnemy: Prefab[] = []

    @property({type: Node})
    private parentEnemy: Node;

    private listEnemy: Node[] = [];

    public get ListEnemy() : Node[] {
        return this.listEnemy;
    }
    
    public set ListEnemy(v : Node[]) {
        this.listEnemy = v;
    }

    private enemyPool: Map<number, Node[]> = new Map();

    protected start(): void {
        EnemyManagementController.Instance = this;
        this.nextWave();
    }

    private async spawnWave(waveData: Record<string, number>): Promise<void> {
        for (const enemyType of Object.keys(waveData)) {
            const count = waveData[enemyType];
            const enemyIndex = this.getEnemyIndexByName(enemyType);
            if (enemyIndex === -1) continue;
    
            
            for (let i = 0; i < count; i++) {
                this.initEnemy(enemyIndex);
                await this.delay(500);
            }
        }
    }
    
    // Hàm chuyển tên enemy thành index trong mảng prefab
    private getEnemyIndexByName(name: string): number {
        const enemyNames = Constants.enemyNames;
        return enemyNames.indexOf(name);
    }
    
    // Hàm delay để tạo quái có khoảng cách thời gian
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public initEnemy(type: number): void {
        let enemy: Node | null = null;
        // console.log(`Spawning enemy type ${type}`);
        // Kiểm tra xem có enemy nào trong pool không
        if (this.enemyPool.has(type) && this.enemyPool.get(type)!.length > 0) {
            enemy = this.enemyPool.get(type)!.pop()!;
        } else {
            // Nếu không có, tạo mới
            enemy = instantiate(this.prefabEnemy[type]);
            enemy.parent = this.parentEnemy;
            const enemyController = enemy.getComponent(EnemyController);
            enemyController.type = type;
        }
        
        this.listEnemy.push(enemy);
        enemy.setPosition(-600, 800, 0);
        enemy.active = true; // Bật enemy lên
    }
    
    // Khi enemy chết, không destroy mà đưa về pool
    public recycleEnemy(enemy: Node, type: number): void {
    
        // Nếu enemy đã có trong pool, không cần thêm lại
        if (this.enemyPool.has(type) && this.enemyPool.get(type)!.some(e => e === enemy)) {
            return;
        }
    
        enemy.active = false;
        enemy.setPosition(9999, 9999, 0); // Đưa ra khỏi màn hình
        
        // Đảm bảo danh sách enemy đang hoạt động được cập nhật
        this.listEnemy = this.listEnemy.filter(e => e !== enemy);
    
        // Đưa enemy về pool
        if (!this.enemyPool.has(type)) {
            this.enemyPool.set(type, []);
        }
        this.enemyPool.get(type)!.push(enemy);
    } 

    public nextWave(): void {
        const wave = dataEnemy[GameModel.Instance.round].data
        this.spawnWave(wave);
        if(GameModel.Instance.round < Constants.maxWave){
            GameModel.Instance.round++;
        }
        GameView.Instance.setAmountRound();
    }
}