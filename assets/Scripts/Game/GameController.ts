import { _decorator, Button, color, Color, Component, director, EventMouse, Input, input, instantiate, Node, Prefab, randomRangeInt, Sprite, SpriteFrame, UITransform, v3, Vec2, Vec3 } from 'cc';
import { DataMap } from './Map/DataMap';
import { scene, typeRoad, typeTile } from './DataGame';
import { GameView } from './GameView';
import { GameModel } from './GameModel';
import { ButtonController } from './Button/ButtonController';
import { ButtonTurret } from './Button/ButtonTurret';
import { TurretManagementController } from './Turret/TurretManagementController';
import { WayPoint } from './Enemy/WayPoint';
import { UpdateTurret } from './UpdateTurret/UpdateTurret';
import { TurretController } from './Turret/TurretController';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {

    @property({type: GameView})
    private gameView: GameView = null;

    @property({type: GameModel})
    private gameModel: GameModel = null;

    @property({type: ButtonController})
    private buttonController: ButtonController = null;

    @property({type: TurretManagementController})
    private turretManagementController: TurretManagementController = null;

    @property(Prefab)
    private tilePrefab: Prefab = null;

    @property(Prefab)
    private objectPrefab: Prefab = null;

    @property(Node)
    private tileParent: Node = null;

    @property({type: Node})
    private nodeCheckTile: Node;

    @property(Prefab)
    private wayPointPrefab: Prefab = null;

    @property(Node)
    private wayPointParent: Node = null;

    @property({type: Node})
    private templateTurret: Node = null;

    private tileSize: number = 120;

    private isDragging: boolean = false;

    private tileMap: Node[][] = [];

    private hoveredTile: Node = null;
    private hoveredButton: Node | null = null; // Lưu nút đang hover
    private typeBtnTurret: number = null;
    private isTurretPlacementValid: boolean = false;
    private hoveredTileRow: number | null = null;
    private hoveredTileCol: number | null = null;

    private waypoints: { node: Node, row: number, col: number }[] = [];

    @property({type: Node})
    private btnLevelUp: Node;

    @property({type: Node})
    private btnUpgrade: Node;

    @property({type: Node})
    private btnSellTurret: Node;

    protected start(): void {
        this.createTileGrid();
        this.addMouseEvents();
        this.sortWaypointsByPath();
    }

    protected update(dt: number): void {
        if(this.gameModel.gameOver === true){
            this.gameOver();
        }
    }

    private createTileGrid(): void {
        const screenWidth = 1080;
        const screenHeight = 1920;
        const rows = DataMap[0].shape.length;  // Số hàng (dọc)
        const cols = DataMap[0].shape[0].length; // Số cột (ngang)
        // console.log(DataMap[0].shape[2])
        // console.log(cols)

        for (let row = 0; row < rows; row++) {
            if (!this.tileMap[row]) this.tileMap[row] = [];
            for (let col = 0; col < cols; col++) {
                const tileNode = instantiate(this.tilePrefab);
                tileNode.setParent(this.tileParent);
                this.tileMap[row][col] = tileNode;
                
                // Tính toán vị trí của mỗi ô
                const startX = -cols * this.tileSize / 2 + this.tileSize / 2;
                const startY = rows * this.tileSize / 2 - this.tileSize / 2;
                const posX = startX + col * this.tileSize;
                const posY = startY - row * this.tileSize;
                tileNode.setPosition(new Vec3(posX, posY, 0));

                let spriteTileNode = tileNode.getComponent(Sprite);
                if(DataMap[0].shape[row][col] === 0){
                    spriteTileNode.spriteFrame = this.gameView.ListSpriteFrameTile[typeTile.LAND];
                }else if(DataMap[0].shape[row][col] === 1){
                    spriteTileNode.spriteFrame = this.getRoadSprite(row, col);

                    //create waypoints
                    const wayPoint = instantiate(this.wayPointPrefab);
                    // wayPoint.setParent(this.wayPointParent);
                    WayPoint.points.push(wayPoint)
                    wayPoint.setPosition(new Vec3(posX, posY, 0));
                    this.waypoints.push({ node: wayPoint, row, col });
                }else{
                    spriteTileNode.spriteFrame = this.gameView.ListSpriteFrameTile[typeTile.LAND];
                    const object = instantiate(this.objectPrefab);
                    object.parent = tileNode;
                    const objectSprite = object.getComponent(Sprite);
                    objectSprite.spriteFrame = this.gameView.ListSpriteObject[randomRangeInt(0,5)];
                }
            }
        }
    }

    private getRoadSprite(row: number, col: number): SpriteFrame {
        const up = row > 0 && DataMap[0].shape[row - 1][col] === 1;
        const down = row < DataMap[0].shape.length - 1 && DataMap[0].shape[row + 1][col] === 1;
        const left = col > 0 && DataMap[0].shape[row][col - 1] === 1;
        const right = col < DataMap[0].shape[0].length - 1 && DataMap[0].shape[row][col + 1] === 1;
    
        if (left && right) return this.gameView.ListSpriteFrameRoad[0]; // Đường ngang
        if (up && down) return this.gameView.ListSpriteFrameRoad[1]; // Đường dọc
        if (up && right) return this.gameView.ListSpriteFrameRoad[2]; // Góc dưới phải
        if (up && left) return this.gameView.ListSpriteFrameRoad[3]; // Góc dưới trái
        if (down && right) return this.gameView.ListSpriteFrameRoad[4]; // Góc trên phải
        if (down && left) return this.gameView.ListSpriteFrameRoad[5]; // Góc trên trái
        if (up && !down) return this.gameView.ListSpriteFrameRoad[7]; // len - 1 hướng
        if (!up && down) return this.gameView.ListSpriteFrameRoad[8]; // xuong 1 hướng
        if (left && !right) return this.gameView.ListSpriteFrameRoad[9]; //trai - 1 huong
        if (!left && right) return this.gameView.ListSpriteFrameRoad[10]; // phai - 1 huong
    
        return this.gameView.ListSpriteFrameRoad[6]; // Mặc định
    }

    private sortWaypointsByPath(): void {
        if (this.waypoints.length === 0) return;

        // Tìm điểm bắt đầu (giả sử là waypoint đầu tiên có giá trị 1)
        const start = this.waypoints[0];
        const orderedWaypoints: { node: Node, row: number, col: number }[] = [];
        const visited = new Set<string>();

        // Hàm DFS để tìm đường đi
        const dfs = (current: { node: Node, row: number, col: number }) => {
            const key = `${current.row},${current.col}`;
            if (visited.has(key)) return;

            visited.add(key);
            orderedWaypoints.push(current);

            // Các hướng di chuyển: lên, xuống, trái, phải
            const directions = [
                { dr: -1, dc: 0 }, // lên
                { dr: 1, dc: 0 },  // xuống
                { dr: 0, dc: -1 }, // trái
                { dr: 0, dc: 1 },  // phải
            ];

            for (const dir of directions) {
                const newRow = current.row + dir.dr;
                const newCol = current.col + dir.dc;

                // Kiểm tra nếu ô hợp lệ và là đường (1)
                if (
                    newRow >= 0 && newRow < DataMap[0].shape.length &&
                    newCol >= 0 && newCol < DataMap[0].shape[0].length &&
                    DataMap[0].shape[newRow][newCol] === 1
                ) {
                    const nextWaypoint = this.waypoints.find(wp => wp.row === newRow && wp.col === newCol);
                    if (nextWaypoint && !visited.has(`${newRow},${newCol}`)) {
                        dfs(nextWaypoint);
                    }
                }
            }
        };

        // Bắt đầu DFS từ waypoint đầu tiên
        dfs(start);

        // Sắp xếp lại children trong wayPointParent
        orderedWaypoints.forEach(wp => {
            this.wayPointParent.addChild(wp.node); // Thêm lại theo thứ tự mới
        });

        // Cập nhật lại danh sách waypoints (nếu cần)
        this.waypoints = orderedWaypoints;

        // // Debug: In thứ tự waypoint
        // console.log("Thứ tự waypoint theo đường đi:");
        // this.waypoints.forEach((wp, index) => {
        //     console.log(`Waypoint ${index}: (${wp.row}, ${wp.col})`);
        // });
    }

    private addMouseEvents(): void {
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    private onMouseDown(event: EventMouse): void {
        const mousePos = event.getUILocation();
        this.isDragging = false;
    
        for (const buttonNode of this.buttonController.ListBtnTurret) {
            const uiTransform = buttonNode.getComponent(UITransform);
            const buttonTurret = buttonNode.getComponent(ButtonTurret);
            if (!uiTransform || !buttonTurret) continue;
    
            const localPos = uiTransform.convertToNodeSpaceAR(new Vec3(mousePos.x, mousePos.y, 0));
            const { width, height } = uiTransform.contentSize;
    
            if (localPos.x > -width / 2 && localPos.x < width / 2 &&
                localPos.y > -height / 2 && localPos.y < height / 2) {
                
                this.typeBtnTurret = buttonTurret.Type;
                this.isDragging = true;
                this.setTemplateTurret(this.typeBtnTurret);
                this.templateTurret.worldPosition = v3(mousePos.x, mousePos.y, 0);
                this.templateTurret.active = true;
                // console.log(`Bắt đầu kéo button: ${buttonTurret.Type}`);
                return;
            }
        }
    
        this.typeBtnTurret = null;
        this.templateTurret.active = false;

        //check click turret in listTurrets
        for (const turret of this.turretManagementController.ListTurrets) {
            const uiTransform = turret.getComponent(UITransform);
            const turretController = turret.getComponent(TurretController)
            if (!uiTransform) continue;
    
            // Chuyển vị trí click về không gian turret
            const localPos = uiTransform.convertToNodeSpaceAR(new Vec3(mousePos.x, mousePos.y, 0));
            const { width, height } = uiTransform.contentSize;
    
            if (localPos.x > -width / 2 && localPos.x < width / 2 &&
                localPos.y > -height / 2 && localPos.y < height / 2) {
                
                // console.log("Clicked on turret:", turret.name);
                this.turretManagementController.ListTurrets.forEach(t => {
                    const tController = t.getComponent(TurretController);
                    if (tController) tController.offRangeDraw();
                });

                turretController.showUIUpdateTurret();
                this.gameView.nodeSelectTurret.worldPosition = turret.worldPosition;
                this.gameView.nodeSelectTurret.active = true;

                this.btnLevelUp.off(Button.EventType.CLICK);
                this.btnLevelUp.on(Button.EventType.CLICK, () => {
                    turretController.levelUp();
                    console.log('level up', turret)
                }, this);

                this.btnUpgrade.off(Button.EventType.CLICK);
                this.btnUpgrade.on(Button.EventType.CLICK, () => {
                    console.log('upgrade', turret)
                    turretController.upgradeTurret();
                }, this);

                this.btnSellTurret.off(Button.EventType.CLICK);
                this.btnSellTurret.on(Button.EventType.CLICK, () => {
                    console.log('sell turret', turret)
                    this.turretManagementController.removeTurret(turretController.row, turretController.col)
                    this.hideUISelectTurret();
                    // + coin
                    
                }, this);

                return;
            }
        }

        this.hideUISelectTurret();
    }
    
    private onMouseMove(event: EventMouse): void {
        if (!this.isDragging) return;
        const mousePos = event.getUILocation();
        this.hoverBtnTurret(mousePos);
        this.templateTurret.worldPosition = v3(mousePos.x, mousePos.y, 0);
        this.templateTurret.active = true;
    
        const uiTransform = this.tileParent.getComponent(UITransform);
        if (!uiTransform) return;
    
        const localPos = uiTransform.convertToNodeSpaceAR(new Vec3(mousePos.x, mousePos.y, 0));
    
        const col = Math.floor((localPos.x + 540) / this.tileSize);
        const row = Math.floor((960 - localPos.y) / this.tileSize);
    
        if (row < 0 || row >= this.tileMap.length || col < 0 || col >= this.tileMap[0].length) return;
    
        const newTile = this.tileMap[row][col];
        const map = DataMap[0].shape[row][col];
    
        if (this.hoveredTile !== newTile) {
            this.hoveredTile = newTile;
            this.hoveredTileRow = row;
            this.hoveredTileCol = col;
            // console.log(row, col)
        }
    
        if (map === typeTile.ROAD || map === typeTile.PLANT || this.turretManagementController.hasTurret(row, col)) {
            this.setTileColor(newTile, false);
            this.isTurretPlacementValid = false;
        } else {
            this.setTileColor(newTile, true);
            this.isTurretPlacementValid = true;
        }
    }
    
    private onMouseUp(): void {
        if(this.isDragging === false) return;

        this.isDragging = false;
        this.resetTileColor();
        
        if (this.isTurretPlacementValid && this.hoveredTile) {
            const pos = this.hoveredTile.position;
            this.turretManagementController.placeTurret(this.hoveredTileRow, this.hoveredTileCol, this.typeBtnTurret, pos);
        }
        
        this.typeBtnTurret = null;
        this.hoveredTile = null;
        this.hoveredTileRow = null;
        this.hoveredTileCol = null;

        this.templateTurret.active = false;
    }
    
    private hoverBtnTurret(mousePos: Vec2): void {
        for (const buttonNode of this.buttonController.ListBtnTurret) {
            const uiTransform = buttonNode.getComponent(UITransform);
            if (!uiTransform) continue;
    
            const localPos = uiTransform.convertToNodeSpaceAR(new Vec3(mousePos.x, mousePos.y, 0));
            const { width, height } = uiTransform.contentSize;
    
            if (localPos.x > -width / 2 && localPos.x < width / 2 &&
                localPos.y > -height / 2 && localPos.y < height / 2) {
                buttonNode.setScale(1.1, 1.1, 1);
            } else {
                buttonNode.setScale(1, 1, 1);
            }
        }
    }
    

    private resetTileColor() {
        if (this.hoveredTile) {
            this.nodeCheckTile.active = false;
        }
    }

    private setTileColor(tileNode: Node, status: boolean) {
        this.nodeCheckTile.active = true;
        const sprite = this.nodeCheckTile.getComponent(Sprite);
        sprite.color = status ? color('#E4E4E481') : color('#FF000081');
        
        this.nodeCheckTile.position = tileNode.position
    }
    
    private setTemplateTurret(type: number): void {
        for (const element of this.templateTurret.children) {
            element.active = false;
        }
        this.templateTurret.children[type].active = true;
    }

    private hideUISelectTurret(): void {
        UpdateTurret.Instance.hide();
        this.gameView.nodeSelectTurret.active = false;
    }

    public gameOver(): void {
        this.gameView.uiGameOver();
    }

    private onClickHome(): void {
        director.loadScene(scene.ENTRY);
    }
}