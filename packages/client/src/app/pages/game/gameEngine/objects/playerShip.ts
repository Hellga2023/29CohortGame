import { TDirection } from '../core/controlModule';
import { LiveState, ShipState } from '../store/objectState';
import { ShipType, TPoint } from '../types/common';
import Ship from './base/ship';
import Trajectory from './trajectory';
import params from '../parameters/globalParameters';

class PlayerShip extends Ship {
    constructor(coordinates: TPoint) {
        const trajectory = new Trajectory([coordinates]); // todo can we remove trajectory?
        const state = new ShipState(coordinates, trajectory, LiveState.Flying);
        super(state, ShipType.Player);
    }

    public updateState = (shouldChangeFrame: boolean, direction?: TDirection) => {
        const step = 7;
        const state = this.getShipState();
        const coordinates = state.getCoordinates();
        if (direction) {
            switch (direction) {
                case 'Up':
                    state.setCoordinates({
                        x: coordinates.x,
                        y: Math.max(coordinates.y - step, 0),
                    });
                    break;
                case 'Down':
                    state.setCoordinates({
                        x: coordinates.x,
                        y: Math.min(coordinates.y + step, params.WIDTH - 64),
                    });
                    break;
                case 'Left':
                    state.setCoordinates({
                        x: Math.max(coordinates.x - step, 0),
                        y: coordinates.y,
                    });
                    break;
                case 'Right':
                    state.setCoordinates({
                        x: Math.min(coordinates.x + step, params.WIDTH - 64),
                        y: coordinates.y,
                    });
                    break;
            }
        }

        state.changeFrameIndex(this.parameters.frameCount, shouldChangeFrame);
    };
}

export default PlayerShip;
