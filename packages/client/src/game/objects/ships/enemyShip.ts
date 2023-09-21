import Trajectory from '../../../../../../game/objects/trajectory';
import { LiveState, ShipState } from '../../store/objectState';
import { ShipType } from '../../types/commonTypes';
import GameShip from './gameShip';

export default class EnemyShip extends GameShip {
    constructor(type: ShipType, trajectory: Trajectory) {
        const state = new ShipState(trajectory.getStartPoint(), trajectory, LiveState.WaitForStart);
        super(state, type);
    }

    public updateState = (time: number, shouldChangeFrame: boolean) => {
        this.getShipState().updateEnemyState(time, this.parameters.frameCount, shouldChangeFrame);
    };

    public isWaiting = () => this.getShipState().isWaiting();
}
