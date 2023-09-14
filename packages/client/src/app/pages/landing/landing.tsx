/* eslint-disable quotes */
/* eslint-disable object-curly-spacing */
import React, { FC } from 'react';
import style from './landing.module.scss';
import AnimatedBackground from '@/app/components/animatedBackground/animatedBackground';

const Landing: FC = () => (
    <div className={style.landingBackground}>
        <AnimatedBackground noInvert />

        <main>
            <h1 className={style.landingBackground_title}>Black Star</h1>
            <img
                className={style.landingBackground_battleCruiser}
                src="/src/assets/images/battle-cruiser.png"
                alt="battle cruiser"
            />
            <div className={style.landingBackground_planet} />
            <div className={style.landingBackground_console}>
                <span className={style.landingBackground_typeConsole}>
                    Black star it`s arcade shooting space game from RE4M team by Yandex.Practicum.
                    Please check your ammunition and fasten your seat belts
                </span>
            </div>
            <a className={style.landingBackground_playBtn} href="/game">
                Play
            </a>
        </main>
    </div>
);

export default Landing;
