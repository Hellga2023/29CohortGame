import BaseObject from '@game/objects/base/baseObject';
import { ShipTypesParameterValues } from '@game/parameters/gameObjectsParameters';
import { LiveState, ShipState } from '@game/store/objectState';
import { ShipType } from '@game/types/commonTypes';

export default class GameShip extends BaseObject {
    // todo do we need this?
    public type: ShipType;

    constructor(state: ShipState, type: ShipType) {
        super(state, ShipTypesParameterValues[type]);
        this.type = type;
    }

    protected getShipState = () => this.state as ShipState;

    public setLiveState = (state: LiveState) => this.getShipState().setLiveState(state);

    public setHit = () => this.setLiveState(LiveState.Exploiding);

    public isDead = () => this.getShipState().isDead();

    public shouldCheckCollision = () => this.getShipState().isFlying();
}
