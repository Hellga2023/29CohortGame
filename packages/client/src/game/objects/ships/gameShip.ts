import BaseObject, { DrawableObjectState } from '../baseObject';
import { ShipTypesParameterValues } from '../../parameters/gameObjectsParameters';
import { LiveState, ShipState } from '../../store/objectState';
import { ShipType } from '../../types/commonTypes';

export default class GameShip extends BaseObject {
    // todo do we need this?
    public type: ShipType;

    constructor(state: DrawableObjectState, type: ShipType) {
        super(state, ShipTypesParameterValues[type]);
        this.type = type;
    }

    protected getShipState = () => this.getState() as ShipState;

    public setLiveState = (state: LiveState) => this.getShipState().setLiveState(state);

    public setHit = () => this.setLiveState(LiveState.Exploiding);

    public isDead = () => this.getShipState().isDead();

    public shouldDetectCollision = () => this.getShipState().isFlying();
}
