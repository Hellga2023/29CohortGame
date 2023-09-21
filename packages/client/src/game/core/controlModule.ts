import utils from '@/utils';
import gameState from '../store/gameState';
import { TPoint } from '../types/commonTypes';

// TODO: choose control by keyboard or mouse
/* const ControlKeys = {
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    PAUSE: 'Enter',
    SHOOT: 'a',
}; */

export type TDirection =
    | 'Up'
    | 'Down'
    | 'Left'
    | 'Right'
    | 'UpLeft'
    | 'UpRight'
    | 'DownLeft'
    | 'DownRight';

export enum Direction {
    'Up' = 'Up',
    'Down' = 'Down',
    'Left' = 'Left',
    'Right' = 'Right',
    'UpLeft' = 'UpLeft',
    'UpRight' = 'UpRight',
    'DownLeft' = 'DownLeft',
    'DownRight' = 'DownRight',
}

class ControlModule {
    private changePlayerCoordinatesInterval: ReturnType<typeof setInterval> | null = null;

    /* public gameControlPressed = (event: KeyboardEvent) => {
        let direction: TDirection | undefined;
        if (event.key === ControlKeys.UP) {
            direction = 'Up';
        } else if (event.key === ControlKeys.DOWN) {
            direction = 'Down';
        } else if (event.key === ControlKeys.LEFT) {
            direction = 'Left';
        } else if (event.key === ControlKeys.RIGHT) {
            direction = 'Right';
        }
        const { player } = gameState;
        if (direction) {
            player.updateState(false, direction);
        }

        if (event.key === ControlKeys.SHOOT) {
            console.log(event.key);
            console.log('add shot');
            const coordinates = player.getState().getCoordinates();
            gameState.shots.push(
                new GameShot(ShotType.Player, coordinates, this.animator.mainLoopIndex)
            );
        }
    }; */

    // eslint-disable-next-line class-methods-use-this
    private setDirectionForPlayer = (direction: TDirection) => {
        const { player } = gameState;
        // todo index not used
        player.updateState(false, direction); // todo shouldChangeFrame can be overwritten
    };

    // eslint-disable-next-line class-methods-use-this
    public getPlayerCoordinates = () => {
        const { player } = gameState;
        return { x: player.getState().getCoordinates().x, y: player.getState().getCoordinates().y };
    };

    public setTargetedCoordinatesForPlayer = (point: TPoint) => {
        // TODO: move const
        const halfShipHeight = 35;
        const halfShipWidth = 30;
        const mouseX = point.x - halfShipHeight;
        const mouseY = point.y - halfShipWidth;

        if (this.changePlayerCoordinatesInterval) {
            clearInterval(this.changePlayerCoordinatesInterval);
        }

        this.changePlayerCoordinatesInterval = setInterval(() => {
            const { x: playerX, y: playerY } = this.getPlayerCoordinates();

            if (
                utils.approximatelyEqual(playerX, mouseX, 2) &&
                utils.approximatelyEqual(playerY, mouseY, 2) &&
                this.changePlayerCoordinatesInterval
            ) {
                clearInterval(this.changePlayerCoordinatesInterval);
                return;
            }

            let direction = '';
            if (mouseY < playerY) {
                direction += Direction.Up;
            }
            if (mouseY > playerY) {
                direction += Direction.Down;
            }
            if (mouseX > playerX) {
                direction += Direction.Right;
            }
            if (mouseX < playerX) {
                direction += Direction.Left;
            }

            this.setDirectionForPlayer(direction as TDirection);
        }, 0);
    };
}

export default new ControlModule();
