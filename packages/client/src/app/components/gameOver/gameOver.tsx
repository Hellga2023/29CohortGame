import React, { FC, useState } from 'react';
import style from './gameOver.module.scss';
import styleLanding from '../../pages/landing/landing.module.scss';
import { TGameScore } from '@/const/dataTypes/dataTypes';
import Button from '../common/button/button';

const SCORE_COEFFICIENT = 10; // TODO: переделать на внешний подсчет

const GameOver: FC<TGameScore> = ({ score, isWin, kills }) => {
    const [renderScore, setRenderScore] = useState(0);

    setTimeout(() => {
        // document.documentElement.style.cssText = `--game-score: ${score}`;
        setRenderScore(score);
    }, 500);
    return (
        <div className={style.gameoverBackground}>
            <img
                className={styleLanding.landingBackground_battleCruiser}
                src="/src/assets/images/battle-cruiser.png"
                alt="battle cruiser"
            />
            <h1 className={style.gameoverBackground_title}>{isWin ? 'You win!' : 'Game Over'}</h1>
            <div
                className={style.gameoverBackground_score}
                style={{ '--game-score': renderScore } as React.CSSProperties}>
                Total score:
                {(kills || 0) * SCORE_COEFFICIENT}
            </div>

            <Button text="Restart" click={() => location.reload()} />
        </div>
    );
};

export default GameOver;
