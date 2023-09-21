import Painter from './painter';
import gameState from '../store/gameState';
import GameShot from '../objects/gameShot';
import { ShotType } from '../types/commonTypes';
import { GlobalGameState } from '../store/objectState';
import { store } from '@/app/store/store';
import { setGameState } from '@/app/store/slices/gameSlice';
import CollisionManager from './collisionManager';

class GameEngine {
    // eslint-disable-next-line no-use-before-define
    // private static instance?: GameEngine;

    private painter: Painter;

    private frameCount = 0;

    private IMAGE_CHANGE_SPEED = 5; // 1 per 5 frames image changes

    private isStopped = false;

    public mainLoopIndex = 0;

    private requestId = -1;

    constructor(contextDelegate: () => CanvasRenderingContext2D) {
        this.painter = new Painter(contextDelegate);
    }

    /* public static getInstance = (ctx?: CanvasRenderingContext2D) => {
        if (!GameEngine.instance && ctx) {
            GameEngine.instance = new GameEngine(ctx);
        }

        if (GameEngine.instance) {
            return GameEngine.instance;
        }

        throw new Error('no context provided for gameEngine');
    }; */

    private drawGameFrame = () => {
        const { player } = gameState;
        !player.isDead() && this.painter.drawFrame(player);
        gameState.enemies.forEach(enemy => {
            !enemy.isDead() && !enemy.isWaiting() && this.painter.drawFrame(enemy);
        });

        gameState.shots.forEach(shot => {
            shot.isVisible() && this.painter.drawFrame(shot);
        });
    };

    private updateObjectsState = (shouldChangeFrame: boolean) => {
        const { player } = gameState;
        !player.isDead() && player.updateState(shouldChangeFrame);
        gameState.enemies.forEach(enemy => {
            !enemy.isDead() && enemy.updateState(this.mainLoopIndex, shouldChangeFrame);
        });

        gameState.shots.forEach(shot => {
            shot.isVisible() && shot.updateState(this.mainLoopIndex, shouldChangeFrame);
        });
    };

    private mainLoop = () => {
        if (this.isStopped) {
            window.cancelAnimationFrame(this.requestId);
            return;
        }

        this.painter.drawBackground();

        this.frameCount++;

        const shouldChangeFrame = this.frameCount === this.IMAGE_CHANGE_SPEED;

        /* update objects state and draw them */
        this.updateObjectsState(shouldChangeFrame);

        if (shouldChangeFrame) {
            this.frameCount = 0;
        }

        this.drawGameFrame();

        /* detect if any ship is hit */

        CollisionManager.collisionDetection();

        /* game state logic */

        if (gameState.player.isDead()) {
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

    public stop = () => {
        this.isStopped = true;
        window.cancelAnimationFrame(this.requestId);
    };

    public continue = () => {
        this.isStopped = false;
        this.requestId = window.requestAnimationFrame(this.mainLoop);
    };

    public reset = () => {
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

    // TODO: remove later
    private load = () => this.painter.drawLoadScreen();

    private levelEnd = () => {
        this.stop();
        this.painter.drawLevelEnd();
    };

    // remove end

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
            case GlobalGameState.Ended:
                this.stop();
                break;
            case GlobalGameState.Resumed:
                this.continue();
                break;
            case GlobalGameState.LevelEnded:
                this.levelEnd();
                break;
        }
    };

    public setGameState = (state: GlobalGameState) => {
        // console.log('in set state');
        // console.log(gameState.getState());
        gameState.setState(state);
        // console.log(gameState.getState());
        store.dispatch(setGameState(state));
        this.processNewGameState();
    };

    public playerShoot = () => {
        const { player } = gameState;
        const coordinates = player.getState().getCoordinates();
        console.log(coordinates);
        gameState.shots.push(new GameShot(ShotType.Player, coordinates, this.mainLoopIndex));
    };

    public static isGameRunning = () => {
        const globalGameState = gameState.getState();
        return (
            globalGameState === GlobalGameState.LevelStarted ||
            globalGameState === GlobalGameState.Resumed
        );
    };
}

export default GameEngine;
