import { BaseGameObject, BaseObjectState } from '../../core/baseObject';
import { ShipTypesParameterValues } from '../../parameters/objectsParameters';
import { LiveState, ShipState } from '../../store/objectState';
import { ShipType } from '../../types/common';

class Ship extends BaseGameObject {
    // todo do we need this?
    public type: ShipType;

    constructor(state: BaseObjectState, type: ShipType) {
        super(state, ShipTypesParameterValues[type]);
        this.type = type;
    }

    protected getShipState = () => this.getState() as ShipState;

    public setLiveState = (state: LiveState) => this.getShipState().setLiveState(state);

    public setIsHit = () => this.setLiveState(LiveState.Exploiding);

    public isDead = () => this.getShipState().isDead();

    public shouldDetectCollision = () => this.getShipState().isFlying();
}

export default Ship;
