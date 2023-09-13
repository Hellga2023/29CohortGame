import React, { FC, useEffect, useRef, useState, SyntheticEvent } from 'react';
import { useSelector } from 'react-redux';
import style from './game.module.scss';
import Button from '@/app/components/common/button/button';
import params from './gameEngine/parameters/globalParameters';
import GameEngine from './gameEngine/core/engine';
import { GlobalGameState } from './gameEngine/store/objectState';
import { RootState } from '@/app/store/store';
import GameOver from '@/app/components/gameOver/gameOver';
import StartGame from '../startGame/startGame';
import mockRedux from './gameEngine/store/gameState';

const Game: FC = () => {
    const ref = useRef<HTMLCanvasElement | null>(null);
    const [paused, setIsPaused] = useState(false);
    const { gameState: state, score } = useSelector((rootState: RootState) => rootState.game);
    let shootInterval: ReturnType<typeof setInterval> | null = null;

    const onKeyDown = (event: KeyboardEvent) => {
        GameEngine.getInstance().gameControlPressed(event);
    };

    const startGame = () => {
        // GameEngine.getInstance().setGameState(GlobalGameState.LevelLoading);
        // Временно включаю сразу состояние начало игры из-за бага, к зачету починим
        GameEngine.getInstance().setGameState(GlobalGameState.LevelStarted);

        shootInterval = setInterval(() => {
            console.log('ddd');
            GameEngine.getInstance().playerShot();
        }, 500);
    };

    const pauseGame = () => {
        const globalState = paused ? GlobalGameState.Resumed : GlobalGameState.Paused;
        GameEngine.getInstance().setGameState(globalState);
        setIsPaused(!paused);
    };

    const handleMouseMove = (ev: SyntheticEvent) => {
        if (
            mockRedux.getState() !== GlobalGameState.LevelStarted &&
            mockRedux.getState() !== GlobalGameState.Resumed
        ) {
            return;
        }
        const halfShipHeight = 35;
        const halfShipWidth = 30;
        const mouseX =
            (ev.nativeEvent as MouseEvent).clientX -
            (ev.target as HTMLElement).offsetLeft -
            halfShipHeight;
        const mouseY =
            (ev.nativeEvent as MouseEvent).clientY -
            (ev.target as HTMLElement).offsetTop -
            halfShipWidth;
        const gameEngine = GameEngine.getInstance();

        gameEngine.setTargetedCoordinatesForPlayer({ x: mouseX, y: mouseY });
    };

    useEffect(() => {
        if (state === GlobalGameState.LevelStarted || state === GlobalGameState.Resumed) {
            window.addEventListener('keydown', onKeyDown);
            shootInterval = setInterval(() => {
                GameEngine.getInstance().playerShot();
            }, 500);
        }
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            if (shootInterval) {
                clearInterval(shootInterval);
            }
        };
    }, [state]);

    useEffect(() => {
        const context = (ref.current as HTMLCanvasElement).getContext('2d');
        if (context) {
            const gameEngine = GameEngine.getInstance(context);
            gameEngine.setGameState(GlobalGameState.Loaded);
        } else {
            console.log('no context found');
        }
    }, []);

    useEffect(() => {
        if (GameEngine.isGameRunning()) {
            window.addEventListener('keydown', onKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [state]);

    if (state === GlobalGameState.Ended) {
        return <GameOver score={score} />;
    }

    if (state === GlobalGameState.LevelLoading) {
        return <StartGame />;
    }

    return (
        <div className={style.game}>
            <div className={style.game__header}>Play game online</div>
            <div className={style.game__controls}>
                Game controls: Arrow buttons to move. A button to fire
            </div>
            <div>
                <canvas
                    ref={ref}
                    width={params.WIDTH}
                    height={params.HEIGHT}
                    onMouseMove={handleMouseMove}
                    className={style.game__canvas}>
                    the game should be here
                </canvas>
            </div>
            <div className={style.game__buttons}>
                <Button text="Start game" size="medium" click={startGame} />

                <Button text="Pause game" size="medium" click={pauseGame} />
            </div>
        </div>
    );
};
export default Game;
