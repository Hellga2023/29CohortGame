import DrawableGameObject, { DrawableObjectState } from '../core/drawableGameObject';
import GameShip from '../objects/ships/gameShip';
import Trajectory from '../objects/trajectory';
import { ShipType } from '../types/commonTypes';

describe('Тесты GameShip', () => {
    const trajectory = new Trajectory([{ x: 0, y: 0 }]);
    const ship = new GameShip(new DrawableObjectState({ x: 0, y: 0 }, trajectory), ShipType.Bomber);

    test('GameShip instanceof DrawableGameObject', () => {
        expect(ship instanceof DrawableGameObject).toEqual(true);
    });

    test('GameShip type is number', () => {
        expect(typeof ship.type).toEqual('number');
    });
});

export {};
