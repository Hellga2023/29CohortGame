import { LiveState, ShipState } from '@game/store/objectState';
import { ShipType, TPoint } from '@game/types/commonTypes';
import Trajectory from '@game/objects/trajectory';
import params from '@game/parameters/gameParameters';
import GameShip from './gameShip';
import { TDirection, Direction } from '@/game/core/controlModule';

export default class PlayerShip extends GameShip {
    constructor(coordinates: TPoint) {
        const trajectory = new Trajectory([coordinates]); // todo can we remove trajectory?
        const state = new ShipState(coordinates, trajectory, LiveState.Flying);
        super(state, ShipType.Player);
    }

    public updateState = (shouldChangeFrame: boolean, direction?: TDirection) => {
        const step = 7; // 2;
        const state = this.getShipState();
        const coordinates = state.getCoordinates();

        if (direction) {
            switch (direction) {
                case Direction.Up:
                    state.setCoordinates({
                        x: coordinates.x,
                        y: Math.max(coordinates.y - step, 0),
                    });
                    break;
                case Direction.Down:
                    state.setCoordinates({
                        x: coordinates.x,
                        y: Math.min(coordinates.y + step, params.HEIGHT - this.height),
                    });
                    break;
                case Direction.Left:
                    state.setCoordinates({
                        x: Math.max(coordinates.x - step, 0),
                        y: coordinates.y,
                    });
                    break;
                case Direction.Right:
                    state.setCoordinates({
                        x: Math.min(coordinates.x + step, params.WIDTH - this.width),
                        y: coordinates.y,
                    });
                    break;
                case Direction.UpLeft:
                    state.setCoordinates({
                        x: Math.max(coordinates.x - step, 0),
                        y: Math.max(coordinates.y - step, 0),
                    });
                    break;
                case Direction.DownLeft:
                    state.setCoordinates({
                        x: Math.max(coordinates.x - step, 0),
                        y: Math.min(coordinates.y + step, params.HEIGHT - this.height),
                    });
                    break;
                case Direction.UpRight:
                    state.setCoordinates({
                        x: Math.min(coordinates.x + step, params.WIDTH - this.width),
                        y: Math.max(coordinates.y - step, 0),
                    });
                    break;
                case Direction.DownRight:
                    state.setCoordinates({
                        x: Math.min(coordinates.x + step, params.WIDTH - this.width),
                        y: Math.min(coordinates.y + step, params.HEIGHT - this.height),
                    });
                    break;
            }
        }

        state.changeFrameIndex(shouldChangeFrame);

        state.setDead(this.frameCount);
    };
}
