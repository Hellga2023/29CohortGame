export type TPoint = {
    x: number;
    y: number;
};

export enum ShipType {
    Battlecruiser,
    Bomber,
    Fighter,
    Player,
}

export type TEnemyType = Exclude<ShipType, ShipType.Player>;

export enum ShotType {
    Enemy,
    Player,
}
