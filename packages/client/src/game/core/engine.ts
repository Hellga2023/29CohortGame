import Painter from './painter';
import gameState from '../store/gameState';
import GameShot from '../objects/gameShot';
import { ShotType } from '../types/commonTypes';
import { GlobalGameState } from '../store/objectState';
import { store } from '@/app/store/store';
import { setGameState, setKilledNumber, setScore } from '@/app/store/slices/gameSlice';
import collisionModule from './collisionModule';
import controlModule from './controlModule';

class GameEngine {
    private painter: Painter;

    private frameCount = 0;

    private IMAGE_CHANGE_SPEED = 5; // 1 per 5 frames image changes

    private isStopped = false;

    public mainLoopIndex = 0;

    private requestId = -1;

    constructor(contextDelegate: () => CanvasRenderingContext2D) {
        this.painter = new Painter(contextDelegate);
    }

    private drawGame = () => {
        this.painter.drawBackground();

        const { player } = gameState;
        this.painter.drawFrame(player);

        gameState.enemies.forEach(
            enemy => !enemy.isDead() && !enemy.isWaiting() && this.painter.drawFrame(enemy)
        );

        gameState.shots.forEach(shot => shot.isVisible() && this.painter.drawFrame(shot));
    };

    private shouldChangeFrame = (): boolean => {
        this.frameCount++;
        const shouldChangeFrame = this.frameCount === this.IMAGE_CHANGE_SPEED;
        if (shouldChangeFrame) {
            this.frameCount = 0;
        }
        return shouldChangeFrame;
    };

    private updateObjects = () => {
        const shouldChangeFrame = this.shouldChangeFrame();

        const { player } = gameState;
        player.updateState(shouldChangeFrame);

        gameState.enemies.forEach(
            enemy => !enemy.isDead() && enemy.updateState(this.mainLoopIndex, shouldChangeFrame)
        );

        gameState.shots.forEach(
            shot => shot.isVisible() && shot.updateState(this.mainLoopIndex, shouldChangeFrame)
        );
    };

    private checkPlayerDead = () => {
        if (gameState.player.isDead()) {
            console.log('game ends');
            this.isStopped = true;
            window.cancelAnimationFrame(this.requestId);
            this.setGameState(GlobalGameState.Ended);
        }
    };

    private checkLevelEnds = () => {
        console.log(this.mainLoopIndex);
        console.log(gameState.getLevelTime());
        if (this.mainLoopIndex === gameState.getLevelTime()) {
            console.log('level ends');
            this.isStopped = true;
            window.cancelAnimationFrame(this.requestId);
            this.setGameState(GlobalGameState.LevelEnded);
        }
    };

    private setDeadCounter = () => {
        const { enemiesKilled } = store.getState().game;
        const actualKilledNumber = gameState.enemies.filter(e => e.isDead()).length;
        if (enemiesKilled !== actualKilledNumber) {
            // TODO: remove from redux!!!
            store.dispatch(setKilledNumber(actualKilledNumber));
        }
        // todo get from level
        // const DEMO_ENEMIES_COUNT = 11;
        // if (actualKilledNumber == DEMO_ENEMIES_COUNT) {
        // set win state?
        this.setScore(actualKilledNumber);
        // }
    };

    // eslint-disable-next-line class-methods-use-this
    private setScore = (kills: number) => {
        const SCORE_COEFFICIENT = 10;
        store.dispatch(setScore((kills || 0) * SCORE_COEFFICIENT));
    };

    private mainLoop = () => {
        if (this.isStopped) {
            window.cancelAnimationFrame(this.requestId);
            return;
        }

        /* update objects state and draw them */
        this.updateObjects();

        this.drawGame();

        /* detect if any ship is hit */

        collisionModule.checkCollisions();

        /* set number of killed enemies */

        this.setDeadCounter();

        /* set proper state if game or level ends */

        this.checkPlayerDead();

        this.checkLevelEnds();

        this.mainLoopIndex++; // do we need to replace this with time?

        this.requestId = window.requestAnimationFrame(this.mainLoop);
    };

    /* game loop start, pause, continue and reset */
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
    // remove start
    private load = () => this.painter.drawLoadScreen();

    private levelEnd = () => {
        this.stop();
        this.painter.drawLevelEnd();
    };
    // remove end

    private processNewGameState = () => {
        const { gameState: state } = store.getState().game;
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
        store.dispatch(setGameState(state));
        this.processNewGameState();
    };

    public playerShoot = () => {
        const { player } = gameState;
        const coordinates = player.getState().getCoordinates();
        // console.log(coordinates);
        // TODO: check if coordinates are th same ref?
        gameState.shots.push(new GameShot(ShotType.Player, coordinates, this.mainLoopIndex));
    };

    public gameControlPressed = (event: KeyboardEvent) => {
        const { player } = gameState;
        const coordinates = player.getState().getCoordinates();
        controlModule.gameControlPressed(event, coordinates, this.mainLoopIndex);
    };

    // eslint-disable-next-line class-methods-use-this
    public isGameRunning = () => {
        const { gameState: state } = store.getState().game;
        return state === GlobalGameState.LevelStarted || state === GlobalGameState.Resumed;
    };
}

export default GameEngine;
