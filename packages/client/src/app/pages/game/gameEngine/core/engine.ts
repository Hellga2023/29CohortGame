import Painter from './painter';
import gameState from '../store/gameState';
import { GlobalGameState } from '../store/objectState';
import { store } from '@/app/store/store';
import { setGameState } from '@/app/store/slices/gameSlice';
import ControlManager from './controlModule';
import CollisionModule from './collisionModule';
import { ShotType, TPoint } from '../types/common';
import GameShot from '../objects/base/shot';
import { Direction, TDirection } from '../types/direction';
import utils from '@/utils';

class GameEngine {
    // eslint-disable-next-line no-use-before-define
    private static instance?: GameEngine;

    private painter: Painter;

    public mainLoopIndex = 0;

    private requestId = -1;

    private isStopped = false;

    private frameCount = 0;

    private IMAGE_CHANGE_SPEED = 5; // 1 per 5 frames image changes

    private constructor(ctx: CanvasRenderingContext2D) {
        this.painter = new Painter(ctx);
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

    private mainLoop = () => {
        if (this.isStopped) {
            window.cancelAnimationFrame(this.requestId);
            return;
        }

        this.frameCount++;
        const shouldChangeFrame = this.frameCount === this.IMAGE_CHANGE_SPEED;

        /* update objects state and draw them */

        const { player } = gameState;

        this.painter.drawBackground();

        if (!player.isDead()) {
            player.updateState(shouldChangeFrame);
            this.painter.drawFrame(player);
        }

        gameState.enemies.forEach(enemy => {
            if (!enemy.isDead()) {
                enemy.updateState(this.mainLoopIndex, shouldChangeFrame);
                if (!enemy.isWaiting()) {
                    this.painter.drawFrame(enemy);
                }
            }
        });

        gameState.shots.forEach(shot => {
            if (shot.isVisible()) {
                shot.updateState(this.mainLoopIndex, shouldChangeFrame);
                this.painter.drawFrame(shot);
            }
        });

        if (shouldChangeFrame) {
            this.frameCount = 0;
        }

        /* detect if any ship is hit */

        CollisionModule.collisionDetection();

        /* game state logic */

        if (player.isDead()) {
            console.log('game ends');
            this.isStopped = true;
            window.cancelAnimationFrame(this.requestId);
            this.setGameState(GlobalGameState.Ended);
        }

        if (this.mainLoopIndex === gameState.getLevelTime()) {
            console.log('level ends');
            this.isStopped = true;
            window.cancelAnimationFrame(this.requestId);
            this.setGameState(GlobalGameState.LevelEnded);
        }

        this.mainLoopIndex++; // do we need to replace this with time?

        this.requestId = window.requestAnimationFrame(this.mainLoop);
    };

    /* main loop state methods */

    private stop = () => {
        this.isStopped = true;
        window.cancelAnimationFrame(this.requestId);
    };

    private continue = () => {
        console.log('in animator start');
        this.isStopped = false;
        this.requestId = window.requestAnimationFrame(this.mainLoop);
    };

    private reset = () => {
        console.log('in animator reset');
        this.stop();
        this.frameCount = 0;
        this.mainLoopIndex = 0;
        this.requestId = -1;
    };

    private start = () => {
        gameState.startLevel();
        this.reset();
        this.continue();
    };

    private load = () => this.painter.drawLoadScreen();

    private levelEnd = () => {
        this.stop();
        this.painter.drawLevelEnd();
    };

    /* game global state processing */

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
                this.stop();
                break;
            case GlobalGameState.Resumed:
                this.continue();
                break;
            case GlobalGameState.LevelEnded:
                this.levelEnd();
                // todo navigating to level
                break;
            case GlobalGameState.Ended:
                this.stop();
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

    /* game control logic */

    public gameControlPressed = (event: KeyboardEvent) =>
        ControlManager.gameControlPressed(event, this.mainLoopIndex);

    public static isGameRunning = () => {
        const globalGameState = gameState.getState();
        return (
            globalGameState === GlobalGameState.LevelStarted ||
            globalGameState === GlobalGameState.Resumed
        );
    };

    public playerShot = () => {
        const { player } = gameState;
        const coordinates = player.getState().getCoordinates();
        console.log(coordinates);
        gameState.shots.push(new GameShot(ShotType.Player, coordinates, this.mainLoopIndex));
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
