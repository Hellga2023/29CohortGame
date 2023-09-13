/* eslint-disable no-plusplus */
import React, { FC, useEffect, useState } from 'react';
import Progressbar from '@/app/components/common/progressbar/progressbar';
import style from './startgame.module.scss';
import { GlobalGameState } from '../game/gameEngine/types/objectState';
import GameEngine from '../game/gameEngine/gameEngine';

const StartGame: FC = () => {
    const [value, setValue] = useState(0);
    useEffect(() => {
        const interval = window.setInterval(() => {
            if (value >= 100) {
                clearInterval(interval);
                GameEngine.getInstance().setGameState(GlobalGameState.LevelStarted);
                return;
            }
            setValue(value + 1);
        }, 30);
        return () => {
            clearInterval(interval);
        };
    });

    return (
        <div>
            <div className={style.startGameBackground}>
                <h1 className={style.startGameBackground_title}>Get Ready</h1>
                <div className={style.startGameBackground_footer}>
                    <Progressbar value={value} text="Loading" />
                    {value >= 100 ? (
                        <a className={style.startGameBackground_footer_playBtn} href="/game">
                            START
                        </a>
                    ) : (
                        ''
                    )}
                </div>
                <img
                    className={style.startGameBackground_battleCruiser}
                    src="/src/assets/images/battle-cruiser.png"
                    alt="battle cruiser"
                />
            </div>
        </div>
    );
};

export default StartGame;
