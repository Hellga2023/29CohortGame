// TODO: read about useCallback and expencive cascading rerenders
import React, { FC, useEffect, useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import params from '@game/parameters/gameParameters';
import GameEngine from '@game/core/engine';
import { GAME_EVENTS, GlobalGameState } from '@game/store/objectState';
import { RootState } from '@/app/store/store';
import GameOver from '@/app/components/gameOver/gameOver';
import StartGame from '../startGame/startGame';
import AnimatedBackground from '@/app/components/animatedBackground/animatedBackground';
// import controlModule from '@/game/core/controlModule';
import style from './game.module.scss';
import Button from '@/app/components/common/button/button';

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
    const { gameState: state } = useSelector((rootState: RootState) => rootState.game);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let shootInterval: ReturnType<typeof setInterval> | null = null;
    let component;

    console.log('in game.tsx');
    console.log('gameState is loading', state === GlobalGameState.LevelLoading);
    console.log('gameState is started', state === GlobalGameState.LevelStarted);
    console.log(state);

    const onKeyDown = (event: KeyboardEvent) => gameEngineRef.current?.gameControlPressed(event);

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

    // pause game is active if game started

    // TODO: remove if keyboard control will be used
    /* const handleMouseMove = (ev: SyntheticEvent) => {
        // console.log('handleMouseMove');
        if (gameEngineRef.current?.isGameRunning()) {
            return;
        }
        console.log('handleMouseMove2');
        const mouseX =
            (ev.nativeEvent as MouseEvent).clientX - (ev.target as HTMLElement).offsetLeft;
        const mouseY =
            (ev.nativeEvent as MouseEvent).clientY - (ev.target as HTMLElement).offsetTop;

        controlModule.setTargetedCoordinatesForPlayer({ x: mouseX, y: mouseY });
    }; */

    useEffect(() => {
        if (gameEngineRef.current?.isGameRunning()) {
            window.addEventListener('keydown', onKeyDown);
            // TODO: move to game engine?
            shootInterval = setInterval(() => {
                gameEngineRef.current?.playerShoot();
            }, 500);
        }
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            /* if (shootInterval) {
                clearInterval(shootInterval);
            } */
        };
    }, [state]);

    // this is engine logic!!!
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

    const mainClass = classNames({ [style.default]: state === GlobalGameState.Loaded });

    // <GameOver score={score} isWin={counter === DEMO_ENEMIES_COUNT} kills={counter} />
    if (state === GlobalGameState.Ended) {
        component = <GameOver />;
    } else if (state === GlobalGameState.LevelLoading) {
        component = <StartGame />;
    } else {
        component = (
            <main className={mainClass}>
                <div className={style.game__canvasWrapper}>
                    <canvas
                        ref={canvasRef}
                        width={params.WIDTH}
                        height={params.HEIGHT}
                        // onMouseMove={handleMouseMove}
                        className={style.game__canvas}>
                        the game should be here
                    </canvas>
                </div>

                <div className={style.game__buttons}>
                    <Button text="Start game" size="medium" click={startGame} />
                    <Button
                        text={paused ? 'Resume game' : 'Pause game'}
                        size="medium"
                        click={pauseGame}
                        // isActive={''}
                    />
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
