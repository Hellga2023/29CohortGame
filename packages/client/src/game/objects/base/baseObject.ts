import Trajectory from '../trajectory';
import { TPoint } from '../../types/commonTypes';

/* Common state for ships and shots */
export class BaseState {
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
export class BaseParams {
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

/* Base object that can be drawn by Painter */
export default class BaseObject {
    public readonly image = new Image();

    public readonly width: number;

    public readonly height: number;

    public readonly frameCount: number;

    protected readonly state: BaseState;

    constructor(state: BaseState, parameters: BaseParams) {
        this.state = state;
        this.width = parameters.width;
        this.height = parameters.height;
        this.frameCount = parameters.frameCount;
        this.image.src = parameters.image;
    }

    public getState(): BaseState {
        return this.state;
    }
}
