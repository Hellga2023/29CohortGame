import { ShipType, TEnemyType, TPoint } from '../types/commonTypes';

export enum GameLevelList {
    Level1,
    Level2,
}

type TEnemyLevelParams = {
    number: number;
    trajectoryPoints: TPoint[];
};

type TLevelParams = {
    time: number;
    enemies: Record<TEnemyType, TEnemyLevelParams | null>;
};

const GameLevels: Record<GameLevelList, TLevelParams> = {
    [GameLevelList.Level1]: {
        time: 500000,
        enemies: {
            [ShipType.Fighter]: {
                number: 5,
                trajectoryPoints: [
                    { x: 0, y: 0 },
                    { x: 0, y: 100 },
                    { x: 50, y: 150 },
                    { x: 100, y: 100 },
                    { x: 250, y: 230 },
                    { x: 253, y: 160 },
                    { x: 210, y: 115 },
                    { x: 120, y: 150 },
                    { x: 80, y: 230 },
                    { x: 80, y: 330 },
                    { x: 150, y: 370 },
                    { x: 250, y: 380 },
                    { x: 330, y: 390 },
                    { x: 350, y: 390 },
                    { x: 350, y: 800 },
                ],
            },
            [ShipType.Battlecruiser]: {
                number: 3,
                trajectoryPoints: [
                    { x: 600, y: 0 },
                    { x: 570, y: 120 },
                    { x: 550, y: 230 },
                    { x: 510, y: 280 },
                    { x: 470, y: 230 },
                    { x: 420, y: 110 },
                    { x: 330, y: 100 },
                    { x: 190, y: 90 },
                    { x: 0, y: 0 },
                    { x: -128, y: -128 },
                ],
            },
            [ShipType.Bomber]: {
                number: 3,
                trajectoryPoints: [
                    { x: 300, y: 0 },
                    { x: 300, y: 100 },
                    { x: 250, y: 250 },
                    { x: 300, y: 300 },
                    { x: 800, y: 300 },
                ],
            },
        },
    },
    [GameLevelList.Level2]: {
        time: 1000,
        enemies: {
            [ShipType.Fighter]: null,
            [ShipType.Battlecruiser]: null,
            [ShipType.Bomber]: null,
        },
    },
};

export default GameLevels;
