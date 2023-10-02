import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import style from './gameOver.module.scss';
import styleLanding from '../../pages/landing/landing.module.scss';
import Button from '../common/button/button';
import { RootState } from '@/app/store/store';

const GameOver: FC = () => {
    const [renderScore, setRenderScore] = useState(0);

    //  check location reload? hw to restart?

    // TODO: remove score and killed number from redux!!!
    const { score, enemiesKilled } = useSelector((rootState: RootState) => rootState.game);
    const isWin = enemiesKilled === 11; // todo remove this

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
                {score}
            </div>

            <Button text="Restart" click={() => location.reload()} />
        </div>
    );
};

export default GameOver;
