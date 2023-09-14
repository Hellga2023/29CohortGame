import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import style from './layout.module.scss';
import Header from '@/app/components/header/header';
import AnimatedBackground from '../animatedBackground/animatedBackground';

// todo move this to redux later
type TLayoutProps = {
    isAuthorized?: boolean;
};

const Layout: FC<TLayoutProps> = ({ isAuthorized = true }) => (
    <div className={style.wrapper}>
        <Header isAuthorized={isAuthorized} />
        <AnimatedBackground />
        <div className={style.content}>
            <Outlet />
        </div>
    </div>
);

export default Layout;
