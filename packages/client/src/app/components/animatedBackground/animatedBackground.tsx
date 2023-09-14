import React, { FC } from 'react';
import classNames from 'classnames';

import style from './animatedBackground.module.scss';

type AnimatedBackgroundProps = {
    noInvert?: boolean;
};

const AnimatedBackground: FC<AnimatedBackgroundProps> = ({ noInvert }) => (
    <div className={classNames(style.wrapper, { [style.noInvert]: noInvert })}>
        <div className={classNames(style.bgBefore, style.bg)} />
        <div className={classNames(style.bgAfter, style.bg)} />

        <div>
            <div className={style.stars} />
            <div className={style.stars} />

            <div className={style.stars} />
            <div className={style.stars} />
        </div>
    </div>
);

export default AnimatedBackground;
