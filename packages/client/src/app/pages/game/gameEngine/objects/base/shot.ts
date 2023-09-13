import Trajectory from '../trajectory';
import { ShotState } from '../../store/objectState';
import { ShotParametersValues } from '../../parameters/objectsParameters';
import { ShotType, TPoint } from '../../types/common';
import { BaseGameObject } from '../../core/baseObject';

class GameShot extends BaseGameObject {
    private type: ShotType;

    constructor(type: ShotType, startPoint: TPoint, startTime: number) {
        const parameters = ShotParametersValues[type];
        const trajectory = new Trajectory([
            { x: startPoint.x, y: startPoint.y },
            { x: startPoint.x, y: -parameters.height },
        ]);
        const state = new ShotState(startPoint, trajectory, true, startTime);
        super(state, parameters);
        this.type = type;
    }

    public isVisible = () => (this.getState() as ShotState).isVisible();

    public isPlayerShot = () => +this.type === ShotType.Player;

    public updateState = (time: number, shouldChangeFrame: boolean) => {
        (this.getState() as ShotState).update(time, shouldChangeFrame, this.parameters.frameCount);
    };
}

export default GameShot;
