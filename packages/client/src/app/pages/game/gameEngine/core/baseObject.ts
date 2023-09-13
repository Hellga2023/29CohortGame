import Trajectory from '../objects/trajectory';
import { TPoint } from '../types/common';

/* Common state for ships and shots */
export class BaseObjectState {
    private coordinates: TPoint;

    protected frameIndex = 0;

    protected trajectory: Trajectory;

    constructor(coordinates: TPoint, trajectory: Trajectory) {
        this.coordinates = coordinates;
        this.trajectory = trajectory;
    }

    public setCoordinates = (coordinates: TPoint) => {
        this.coordinates = coordinates;
    };

    public getCoordinates = () => this.coordinates;

    public getFrameIndex = () => this.frameIndex;

    public followTrajectory = (time: number) => {
        const { trajectory } = this;
        if (trajectory.shouldMove(time)) {
            this.setCoordinates(trajectory.getCoordinates(time));
        }
    };
}

/* Common parameters type for ships and shots */
export class BaseObjectParams {
    public width: number;

    public height: number;

    public image: string;

    public frameCount: number;

    constructor(width: number, height: number, image: string, imageSpriteWidth: number) {
        this.width = width;
        this.height = height;
        this.image = image;
        this.frameCount = imageSpriteWidth / width;
    }
}

/* Common object that can be drawn */

export class BaseGameObject {
    public image = new Image();

    protected state: BaseObjectState;

    protected parameters: BaseObjectParams;

    constructor(state: BaseObjectState, parameters: BaseObjectParams) {
        this.state = state;
        this.parameters = parameters;
        this.image.src = parameters.image;
    }

    public getState(): BaseObjectState {
        return this.state;
    }

    public getParameters(): BaseObjectParams {
        return this.parameters;
    }
}
