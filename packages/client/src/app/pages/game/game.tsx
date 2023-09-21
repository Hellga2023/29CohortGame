// TODO: read about useCallback and expencive cascading rerenders
import React, { FC, useEffect, useCallback, useRef, useState, SyntheticEvent } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import params from '@game/parameters/gameParameters';
import GameEngine from '@game/core/engine';
import { GAME_EVENTS, GlobalGameState } from '@game/store/objectState';
import { RootState } from '@/app/store/store';
import GameOver from '@/app/components/gameOver/gameOver';
import StartGame from '../startGame/startGame';
import AnimatedBackground from '@/app/components/animatedBackground/animatedBackground';
import controlModule from '@/game/core/controlModule';
import style from './game.module.scss';
import Button from '@/app/components/common/button/button';

const DEMO_ENEMIES_COUNT = 11; // TODO: автоматизировать процессы игры

const Game: FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextDelegate = useCallback((): CanvasRenderingContext2D => {
        if (!canvasRef.current) {
            throw Error('contextDelegate no context found');
        }
        return canvasRef.current.getContext('2d')!;
    }, []);
    const gameEngineRef = useRef<GameEngine | null>(new GameEngine(contextDelegate));

    const [paused, setIsPaused] = useState(false);
    const [counter, setCounter] = useState(0);
    const { gameState: state, score } = useSelector((rootState: RootState) => rootState.game);
    let shootInterval: ReturnType<typeof setInterval> | null = null;
    let component;

    /* const onKeyDown = (event: KeyboardEvent) => {
        GameEngine.getInstance().gameControlPressed(event);
    }; */

    const startGame = () => {
        // gameEngineRef.current?.setGameState(GlobalGameState.LevelLoading);
        // Временно включаю сразу состояние начало игры из-за бага, к зачету починим
        gameEngineRef.current?.setGameState(GlobalGameState.LevelStarted);

        // todo move to engine
        shootInterval = setInterval(() => {
            console.log('ddd');
            gameEngineRef.current?.playerShoot();
        }, 500);
    };

    const pauseGame = () => {
        if (paused) {
            gameEngineRef.current?.setGameState(GlobalGameState.Resumed);
            setIsPaused(false);
        } else {
            gameEngineRef.current?.setGameState(GlobalGameState.Paused);
            setIsPaused(true);
        }
    };

    const resumeGame = () => {
        gameEngineRef.current?.setGameState(GlobalGameState.Resumed);
        setIsPaused(false);
    };

    const handleMouseMove = (ev: SyntheticEvent) => {
        if (GameEngine.isGameRunning()) {
            return;
        }
        const mouseX =
            (ev.nativeEvent as MouseEvent).clientX - (ev.target as HTMLElement).offsetLeft;
        const mouseY =
            (ev.nativeEvent as MouseEvent).clientY - (ev.target as HTMLElement).offsetTop;

        controlModule.setTargetedCoordinatesForPlayer({ x: mouseX, y: mouseY });
    };

    useEffect(() => {
        if (state === GlobalGameState.LevelStarted || state === GlobalGameState.Resumed) {
            // window.addEventListener('keydown', onKeyDown);
            // TODO: move to game engine?
            shootInterval = setInterval(() => {
                gameEngineRef.current?.playerShoot();
            }, 500);
        }
        return () => {
            // window.removeEventListener('keydown', onKeyDown);
            if (shootInterval) {
                clearInterval(shootInterval);
            }
        };
    }, [state]);

    const increment = () => {
        setCounter(counter + 1);
    };

    // TODO: replace with redux
    window.addEventListener(GAME_EVENTS.objectIsDead, increment);

    // TODO: replace
    /* useEffect(() => {
        if (counter === DEMO_ENEMIES_COUNT) {
            const gameEngine = GameEngine.getInstance();
            gameEngine.setGameState(GlobalGameState.Ended);
            setIsPaused(true);
        }
    }, [counter]); */

    useEffect(() => {
        gameEngineRef.current?.setGameState(GlobalGameState.Loaded);

        return () => window.removeEventListener(GAME_EVENTS.objectIsDead, increment);
    }, []);

    if (state === GlobalGameState.Ended) {
        component = (
            <GameOver score={score} isWin={counter === DEMO_ENEMIES_COUNT} kills={counter} />
        );
    } else if (state === GlobalGameState.LevelLoading) {
        component = <StartGame />;
    } else {
        component = (
            <main className={classNames({ [style.default]: state === GlobalGameState.Loaded })}>
                <div className={style.game__canvasWrapper}>
                    <canvas
                        ref={canvasRef}
                        width={params.WIDTH}
                        height={params.HEIGHT}
                        onMouseMove={handleMouseMove}
                        className={style.game__canvas}>
                        the game should be here
                    </canvas>
                </div>

                <div className={style.game__buttons}>
                    {state === GlobalGameState.Loaded && (
                        <Button text="Start game" size="medium" click={startGame} />
                    )}
                    {state === GlobalGameState.Paused && (
                        <Button text="Resume game" size="medium" click={resumeGame} />
                    )}
                    {(state === GlobalGameState.LevelStarted ||
                        state === GlobalGameState.Resumed) && (
                        <Button text="Pause game" size="medium" click={pauseGame} />
                    )}
                </div>
            </main>
        );
    }

    return (
        <div className={style.game}>
            <AnimatedBackground noInvert />
            {component}
        </div>
    );
};

export default Game;
