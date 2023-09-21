import { TPoint } from '../types/commonTypes';
import Trajectory from '../objects/trajectory';
import { DrawableObjectState } from '../objects/baseObject';

export enum GlobalGameState {
    Loaded,
    LevelLoading,
    LevelStarted,
    Paused,
    Resumed,
    LevelEnded,
    Ended,
}

// we draw ship in Flying, Shooting and Exploiding states
export enum LiveState {
    WaitForStart,
    Flying,
    Shooting,
    Exploiding,
    Dead,
}

// TODO: remove? store changed -> all reducers are called
export const GAME_EVENTS = {
    objectIsDead: 'objectIsDead',
};

export const EVENTS = {
    [GAME_EVENTS.objectIsDead]: new Event(GAME_EVENTS.objectIsDead),
};

export class ShipState extends DrawableObjectState {
    private liveState: LiveState;

    constructor(coordinates: TPoint, trajectory: Trajectory, liveState: LiveState) {
        super(coordinates, trajectory);
        this.liveState = liveState;
    }

    // todo check do we need +
    public isExploiding = () => this.liveState === LiveState.Exploiding;

    public isWaiting = () => this.liveState === LiveState.WaitForStart;

    public isFlying = () => this.liveState === LiveState.Flying;

    public isDead = () => this.liveState === LiveState.Dead;

    public setLiveState = (liveState: LiveState) => {
        if (liveState === LiveState.Dead && this.liveState !== LiveState.Dead) {
            window.dispatchEvent(EVENTS.objectIsDead);
        }

        this.liveState = liveState;
    };

    // 2 action change index and set dead
    public changeFrameIndex = (frameCount: number, shouldChangeFrame: boolean) => {
        if (this.isExploiding() && shouldChangeFrame) {
            this.frameIndex++;

            if (this.frameIndex >= frameCount) {
                this.setLiveState(LiveState.Dead);
            }
        }
    };

    public updateEnemyState = (time: number, frameCount: number, shouldChangeFrame: boolean) => {
        this.followTrajectory(time);

        if (this.isWaiting() && this.trajectory.shouldStartMoving(time)) {
            // if ship should starts moving set state to Flying
            this.setLiveState(LiveState.Flying);
        } else if (!this.isDead() && this.trajectory.movedOutOfGameField(time)) {
            // if ship flied out of canvas set state to Dead
            this.setLiveState(LiveState.Dead);
        }

        this.changeFrameIndex(frameCount, shouldChangeFrame);
    };
}

export class ShotState extends DrawableObjectState {
    private show: boolean;

    private startTime: number;

    constructor(coordinates: TPoint, trajectory: Trajectory, show: boolean, startTime: number) {
        super(coordinates, trajectory);
        this.show = show;
        this.startTime = startTime;
    }

    private hide = () => {
        this.show = false;
    };

    public isVisible = () => this.show;

    public changeFrameIndex = (shouldChangeFrame: boolean, frameCount: number) => {
        if (shouldChangeFrame) {
            this.frameIndex += 1;
            if (this.frameIndex >= frameCount) {
                this.frameIndex = 0;
            }
        }
    };

    public update = (time: number, shouldChangeFrame: boolean, frameCount: number) => {
        const { trajectory } = this;
        const deltaTime = time - this.startTime;
        if (trajectory && trajectory.shouldMove(deltaTime)) {
            this.setCoordinates(trajectory.getCoordinates(deltaTime));
        }
        this.changeFrameIndex(shouldChangeFrame, frameCount);

        if (trajectory.movedOutOfGameField(time)) {
            this.hide();
        }
    };
}
