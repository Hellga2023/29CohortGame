import GameAnimator from './gameAnimator';
import params from '../parameters/gameParameters';
import gameState from '../store/gameState';
import GameShot from '../objects/gameShot';
import { ShotType, TPoint } from '../types/commonTypes';
import { GlobalGameState } from '../store/objectState';
import { store } from '@/app/store/store';
import { setGameState } from '@/app/store/slices/gameSlice';
import utils from '@/utils';

// todo move it in some control module ?
const ControlKeys = {
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    PAUSE: 'Enter',
    SHOOT: 'a',
};

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

class GameEngine {
    // eslint-disable-next-line no-use-before-define
    private static instance?: GameEngine;

    private context: CanvasRenderingContext2D;

    private bgImage = new Image();

    public animator: GameAnimator;

    public constructor(ctx: CanvasRenderingContext2D) {
        this.context = ctx;
        this.bgImage.src = ''; // params.BACKGROUND_IMAGE
        this.animator = new GameAnimator(this.context, this.renderGameField);
    }

    public static getInstance = (ctx?: CanvasRenderingContext2D) => {
        if (!GameEngine.instance && ctx) {
            GameEngine.instance = new GameEngine(ctx);
        }

        if (GameEngine.instance) {
            return GameEngine.instance;
        }

        throw new Error('no context provided for gameEngine');
    };

    private renderGameField = () => {
        this.context.clearRect(0, 0, params.WIDTH, params.HEIGHT);
        this.context.drawImage(this.bgImage, 0, 0, params.WIDTH, params.HEIGHT);
    };

    private load = () => {
        this.bgImage.onload = () => {
            this.renderGameField();
            this.context.font = 'bold 48px serif';
            this.context.fillStyle = '#fff';
            this.context.fillText('START GAME', 140, 200);
        };
    };

    private levelEnd = () => {
        this.renderGameField();
        this.context.font = 'bold 48px serif';
        this.context.fillStyle = '#fff';
        this.context.fillText('LEVEL FINISHED', 100, 200);
    };

    private start = () => {
        gameState.startLevel();
        this.animator.reset();
        this.animator.start();
    };

    private cancelAnimation = () => {
        this.animator.stop();
    };

    private pause = () => {
        this.cancelAnimation();
    };

    private resume = () => {
        this.animator.start();
    };

    private finish = () => {
        this.cancelAnimation();
        this.renderGameField();
        this.context.font = 'bold 48px serif';
        this.context.fillStyle = '#fff';
        this.context.fillText('GAME FINISHED', 150, 200);
    };

    private processNewGameState = () => {
        const state = gameState.getState();
        switch (state) {
            case GlobalGameState.Loaded:
                this.load();
                break;
            case GlobalGameState.LevelStarted:
                this.start();
                break;
            case GlobalGameState.Paused:
                this.pause();
                break;
            case GlobalGameState.Resumed:
                this.resume();
                break;
            case GlobalGameState.LevelEnded:
                this.levelEnd();
                break;
            case GlobalGameState.Ended:
                this.finish();
                break;
        }
    };

    public setGameState = (state: GlobalGameState) => {
        console.log('in set state');
        console.log(gameState.getState());
        gameState.setState(state);
        console.log(gameState.getState());

        store.dispatch(setGameState(state));
        this.processNewGameState();
    };

    public playerShot = () => {
        const { player } = gameState;
        const coordinates = player.getState().getCoordinates();
        console.log(coordinates);
        gameState.shots.push(
            new GameShot(ShotType.Player, coordinates, this.animator.mainLoopIndex)
        );
    };

    public gameControlPressed = (event: KeyboardEvent) => {
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
    };

    // eslint-disable-next-line class-methods-use-this
    public getPlayerCoordinates = () => {
        const { player } = gameState;
        return { x: player.getState().getCoordinates().x, y: player.getState().getCoordinates().y };
    };

    // eslint-disable-next-line class-methods-use-this
    private setDirectionForPlayer = (direction: TDirection) => {
        const { player } = gameState;
        // todo index not used
        player?.updateState(false, direction); // todo shouldChangeFrame can be overwritten
    };

    private changePlayerCoordinatesInterval: ReturnType<typeof setInterval> | null = null;

    public setTargetedCoordinatesForPlayer = ({ x: mouseX, y: mouseY }: TPoint) => {
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

export default GameEngine;
