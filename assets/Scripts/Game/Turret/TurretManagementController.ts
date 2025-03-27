import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { TurretController } from './TurretController';
const { ccclass, property } = _decorator;

@ccclass('TurretManagementController')
export class TurretManagementController extends Component {

    @property({type: Prefab})
    private prefabTurrets: Prefab[] = []

    @property({type: Node})
    private parentTurret: Node;

    private listTurrets: Node[] = [];

    public get ListTurrets() : Node[] {
        return this.listTurrets;
    }
    
    public set ListTurrets(v : Node[]) {
        this.listTurrets = v;
    }

    // Quản lý turret theo vị trí (row, col)
    public turretMap: Map<string, Node> = new Map();

    /** Kiểm tra ô có turret chưa */
    public hasTurret(row: number, col: number): boolean {
        return this.turretMap.has(`${row},${col}`);
    }

    /** Đặt turret vào vị trí tile */
    public placeTurret(row: number, col: number, type: number, worldPos: Vec3): boolean {
        if (this.hasTurret(row, col)) {
            return false;
        }
    
        const turret = instantiate(this.prefabTurrets[type]);
        turret.setPosition(worldPos);
        turret.setParent(this.parentTurret);
    
        const turretController = turret.getComponent(TurretController);
        turretController.type = type;
        turretController.row = row;
        turretController.col = col;
    
        // Lưu turret vào map
        this.turretMap.set(`${row},${col}`, turret);
    
        // Chỉ thêm turret mới vào danh sách, tránh thêm lại toàn bộ
        this.listTurrets.push(turret);
    
        // Sắp xếp lại thứ tự hiển thị của các turret
        this.listTurrets.sort((a, b) => b.position.y - a.position.y);
        this.listTurrets.forEach((child, index) => {
            child.setSiblingIndex(index);
        });
    
        console.log(this.listTurrets);
        return true;
    }
    

    /** Xóa turret tại vị trí row, col */
    public removeTurret(row: number, col: number): boolean {
        const key = `${row},${col}`;
        if (!this.turretMap.has(key)) {
            // console.warn(`Không tìm thấy turret tại ô (${row}, ${col})!`);
            return false;
        }

        const turret = this.turretMap.get(key);
        const index = this.listTurrets.indexOf(turret);
        if (index !== -1) {
            this.listTurrets.splice(index, 1);
        }
        turret.destroy();
        this.turretMap.delete(key);
        console.log(this.listTurrets)
        return true;
    }
}


