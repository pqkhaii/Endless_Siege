export enum scene {
    GAME = 'Game',
    ENTRY = 'Entry',
    LOADING = 'Loading'
}

export enum typeTile {
    LAND = 0,
    ROAD = 1,
    PLANT = 2,
    WATER = 3,
}

export enum typeTurret {
    FIRE = 0,
    ICE = 1,
    EARTH = 2,
    ELECTRIC = 3
}

export enum typeEnemy {
    ENEMY_DEVIL_1 = 0,
    ENEMY_DEVIL_2 = 1,
    ENEMY_DEVIL_3 = 2,
    ENEMY_DEVIL_4 = 3,
    ENEMY_DEVIL_5 = 4,
}

// export const turretConfig: Record<typeTurret, { range: number; bulletDamage: number; reload: number; speedBullet: number, levelUp: number, upgrade: number}> = {
//     [typeTurret.FIRE]: {
//         range: 300,
//         bulletDamage: 1,
//         reload: 1.2,
//         speedBullet: 30,
//         levelUp: 1,
//         upgrade: 1
//     },
//     [typeTurret.ICE]: {
//         range: 300, 
//         bulletDamage: 5,
//         reload: 1,
//         speedBullet: 200,
//         levelUp: 1,
//         upgrade: 1
//     },
//     [typeTurret.EARTH]: {
//         range: 250,
//         bulletDamage: 1,
//         reload: 1,
//         speedBullet: 20,
//         levelUp: 1,
//         upgrade: 1
//     },
//     [typeTurret.ELECTRIC]: {
//         range: 280,
//         bulletDamage: 1,
//         reload: 1,
//         speedBullet: 150,
//         levelUp: 1,
//         upgrade: 1
//     }
// };

export const turretConfig: Record<typeTurret, { 
    upgradeStats: { 
        bulletDamage: number[], 
        range: number[], 
        reload: number[], 
        speedBullet: number[], 
        levelUpCost: number[],  // Giá nâng cấp level
        sellPrice: number[]      // Giá bán turret theo level
    }[], 
    upgradeCost: number[]        // Giá nâng cấp upgrade
}> = {
    [typeTurret.FIRE]: {
        upgradeStats: [
            { // Upgrade 1 (level 1 - 10)
                bulletDamage: [2, 12, 14, 16, 18, 20, 22, 24, 26, 28],
                range: [300, 310, 320, 330, 340, 350, 360, 370, 380, 390],
                reload: [1.2, 1.15, 1.1, 1.05, 1.0, 0.95, 0.9, 0.85, 0.8, 0.75],
                speedBullet: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
                levelUpCost: [100, 120, 140, 160, 180, 200, 250, 300, 350, 400],
                sellPrice: [50, 60, 70, 80, 90, 100, 120, 140, 160, 180],
            },
            { // Upgrade 2 (level 1 - 10)
                bulletDamage: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
                range: [400, 410, 420, 430, 440, 450, 460, 470, 480, 490],
                reload: [0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25],
                speedBullet: [50, 52, 54, 56, 58, 60, 62, 64, 66, 68],
                levelUpCost: [500, 520, 540, 560, 580, 600, 650, 700, 750, 800],
                sellPrice: [250, 260, 270, 280, 290, 300, 320, 340, 360, 380],
            },
            { // Upgrade 3 (level 1 - 10) (MAX)
                bulletDamage: [50, 55, 60, 65, 70, 75, 80, 85, 90, 100],
                range: [500, 510, 520, 530, 540, 550, 560, 570, 580, 600],
                reload: [0.2, 0.18, 0.16, 0.14, 0.12, 0.1, 0.08, 0.06, 0.04, 0.02],
                speedBullet: [70, 72, 74, 76, 78, 80, 82, 84, 86, 90],
                levelUpCost: [900, 950, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1800],
                sellPrice: [450, 460, 470, 480, 490, 500, 520, 540, 560, 600],
            }
        ],
        upgradeCost: [1000, 5000, 0], // Giá nâng cấp upgrade 1 → 2, 2 → 3
    },
    [typeTurret.ICE]: {
        upgradeStats: [
            { // Upgrade 1 (level 1 - 10)
                bulletDamage: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28],
                range: [300, 310, 320, 330, 340, 350, 360, 370, 380, 390],
                reload: [1.2, 1.15, 1.1, 1.05, 1.0, 0.95, 0.9, 0.85, 0.8, 0.75],
                speedBullet: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
                levelUpCost: [100, 120, 140, 160, 180, 200, 250, 300, 350, 400],
                sellPrice: [50, 60, 70, 80, 90, 100, 120, 140, 160, 180],
            },
            { // Upgrade 2 (level 1 - 10)
                bulletDamage: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
                range: [400, 410, 420, 430, 440, 450, 460, 470, 480, 490],
                reload: [0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25],
                speedBullet: [50, 52, 54, 56, 58, 60, 62, 64, 66, 68],
                levelUpCost: [500, 520, 540, 560, 580, 600, 650, 700, 750, 800],
                sellPrice: [250, 260, 270, 280, 290, 300, 320, 340, 360, 380],
            },
            { // Upgrade 3 (level 1 - 10) (MAX)
                bulletDamage: [50, 55, 60, 65, 70, 75, 80, 85, 90, 100],
                range: [500, 510, 520, 530, 540, 550, 560, 570, 580, 600],
                reload: [0.2, 0.18, 0.16, 0.14, 0.12, 0.1, 0.08, 0.06, 0.04, 0.02],
                speedBullet: [70, 72, 74, 76, 78, 80, 82, 84, 86, 90],
                levelUpCost: [900, 950, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1800],
                sellPrice: [450, 460, 470, 480, 490, 500, 520, 540, 560, 600],
            }
        ],
        upgradeCost: [1000, 5000, 0], // Giá nâng cấp upgrade 1 → 2, 2 → 3
    },
    [typeTurret.EARTH]: {
        upgradeStats: [
            { // Upgrade 1 (level 1 - 10)
                bulletDamage: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28],
                range: [300, 310, 320, 330, 340, 350, 360, 370, 380, 390],
                reload: [1.2, 1.15, 1.1, 1.05, 1.0, 0.95, 0.9, 0.85, 0.8, 0.75],
                speedBullet: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
                levelUpCost: [100, 120, 140, 160, 180, 200, 250, 300, 350, 400],
                sellPrice: [50, 60, 70, 80, 90, 100, 120, 140, 160, 180],
            },
            { // Upgrade 2 (level 1 - 10)
                bulletDamage: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
                range: [400, 410, 420, 430, 440, 450, 460, 470, 480, 490],
                reload: [0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25],
                speedBullet: [50, 52, 54, 56, 58, 60, 62, 64, 66, 68],
                levelUpCost: [500, 520, 540, 560, 580, 600, 650, 700, 750, 800],
                sellPrice: [250, 260, 270, 280, 290, 300, 320, 340, 360, 380],
            },
            { // Upgrade 3 (level 1 - 10) (MAX)
                bulletDamage: [50, 55, 60, 65, 70, 75, 80, 85, 90, 100],
                range: [500, 510, 520, 530, 540, 550, 560, 570, 580, 600],
                reload: [0.2, 0.18, 0.16, 0.14, 0.12, 0.1, 0.08, 0.06, 0.04, 0.02],
                speedBullet: [70, 72, 74, 76, 78, 80, 82, 84, 86, 90],
                levelUpCost: [900, 950, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1800],
                sellPrice: [450, 460, 470, 480, 490, 500, 520, 540, 560, 600],
            }
        ],
        upgradeCost: [1000, 5000, 0], // Giá nâng cấp upgrade 1 → 2, 2 → 3
    },
    [typeTurret.ELECTRIC]: {
        upgradeStats: [
            { // Upgrade 1 (level 1 - 10)
                bulletDamage: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28],
                range: [300, 310, 320, 330, 340, 350, 360, 370, 380, 390],
                reload: [1.2, 1.15, 1.1, 1.05, 1.0, 0.95, 0.9, 0.85, 0.8, 0.75],
                speedBullet: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
                levelUpCost: [100, 120, 140, 160, 180, 200, 250, 300, 350, 400],
                sellPrice: [50, 60, 70, 80, 90, 100, 120, 140, 160, 180],
            },
            { // Upgrade 2 (level 1 - 10)
                bulletDamage: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
                range: [400, 410, 420, 430, 440, 450, 460, 470, 480, 490],
                reload: [0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25],
                speedBullet: [50, 52, 54, 56, 58, 60, 62, 64, 66, 68],
                levelUpCost: [500, 520, 540, 560, 580, 600, 650, 700, 750, 800],
                sellPrice: [250, 260, 270, 280, 290, 300, 320, 340, 360, 380],
            },
            { // Upgrade 3 (level 1 - 10) (MAX)
                bulletDamage: [50, 55, 60, 65, 70, 75, 80, 85, 90, 100],
                range: [500, 510, 520, 530, 540, 550, 560, 570, 580, 600],
                reload: [0.2, 0.18, 0.16, 0.14, 0.12, 0.1, 0.08, 0.06, 0.04, 0.02],
                speedBullet: [70, 72, 74, 76, 78, 80, 82, 84, 86, 90],
                levelUpCost: [900, 950, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1800],
                sellPrice: [450, 460, 470, 480, 490, 500, 520, 540, 560, 600],
            }
        ],
        upgradeCost: [1000, 5000, 0], // Giá nâng cấp upgrade 1 → 2, 2 → 3
    }
};

export const enemyConfig: Record<typeEnemy, {hp: number, speed: number, coin: number, point: number}> = {
    [typeEnemy.ENEMY_DEVIL_1]: {
        hp: 10,
        speed: 100,
        coin: 20,
        point: 1,
    },
    [typeEnemy.ENEMY_DEVIL_2]: {
        hp: 2,
        speed: 120,
        coin: 20,
        point: 2,
    },
    [typeEnemy.ENEMY_DEVIL_3]: {
        hp: 3,
        speed: 130,
        coin: 30,
        point: 3,
    },
    [typeEnemy.ENEMY_DEVIL_4]: {
        hp: 4,
        speed: 140,
        coin: 40,
        point: 4,
    },
    [typeEnemy.ENEMY_DEVIL_5]: {
        hp: 5,
        speed: 150,
        coin: 50,
        point: 5,
    },
}

export enum typeWaves {
    MANUAL_WAVE = 0,
    AUTO_WAVE = 1,
}

export enum textTypeWaves {
    MANUAL_WAVE = 'MANUAL WAVES',
    AUTO_WAVE = 'AUTO WAVES',
}

export enum typeRoad {
    START,        // Ô bắt đầu
    END,          // Ô kết thúc
    VERTICAL,     // Đường thẳng dọc
    HORIZONTAL,   // Đường thẳng ngang
    CORNER_TL,    // Góc trên xuống qua trái
    CORNER_TR,    // Góc trên qua phải
    CORNER_BL,    // Góc dưới qua trái
    CORNER_BR,    // Góc trái qua phải, lên trên
}
