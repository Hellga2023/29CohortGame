import { LiveState, ShipState } from '../store/objectState';
import { ShipType } from '../types/common';
import Ship from './base/ship';
import Trajectory from './trajectory';

class EnemyShip extends Ship {
    constructor(type: ShipType, trajectory: Trajectory) {
        const state = new ShipState(trajectory.getStartPoint(), trajectory, LiveState.WaitForStart);
        super(state, type);
    }

    public updateState = (time: number, shouldChangeFrame: boolean) => {
        this.getShipState().updateEnemyState(time, this.parameters.frameCount, shouldChangeFrame);
    };

    public isWaiting = () => this.getShipState().isWaiting();
}

export default EnemyShip;
