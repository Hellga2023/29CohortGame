import React, { FC, MouseEventHandler, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames';
import Button from '@/app/components/common/button/button';
import UserInfo from '@/app/components/userInfo/userInfo';
import Logo from '@/assets/images/logo.svg';
import Moon from '@/assets/images/moon.svg';
import Sun from '@/assets/images/sun.svg';
import { RoutePaths as Paths } from '@/app/router/router';
import style from './header.module.scss';
import AuthAPI from '@/app/api/AuthAPI';
import { signOut } from '@/app/store/reducers/user';
import TUser from '@/const/dataTypes/dataTypes';
import changeColorMode from '@/app/helpers/changeColorMode';

// todo move this to redux later
type THeaderProps = {
    isAuthorized?: boolean;
};

const Header: FC<THeaderProps> = () => {
    const [imageForChangeColorMode, setimageForChangeColorMode] = useState(Moon);
    const user = useSelector(state => (state as { user: unknown }).user) as TUser;
    const dispatch = useDispatch();

    const logout: MouseEventHandler = () => {
        AuthAPI.logout().then(() => dispatch(signOut()));

        // AuthAPI.logout()
        //  .then(() => alert('success logout'))
        // .catch((err) => console.log(err));
    };

    const calculateLinkClass = (isActive: boolean) => {
        const activeClass = isActive ? style.header__link_active : '';
        return classNames(style.header__link, activeClass);
    };

    const onClickColorModeButton = () => {
        if (imageForChangeColorMode === Moon) {
            setimageForChangeColorMode(Sun);

            changeColorMode('Dark');
        } else {
            setimageForChangeColorMode(Moon);

            changeColorMode('Light');
        }
    };

    return (
        <div className={style.header}>
            <div>
                <Link to={Paths.LANDING}>
                    <img className={style.header__logo} src={Logo} alt="Home" />
                </Link>
            </div>

            <div className={style.header__navigation}>
                <Button buttonStyle="withoutBackGround" size="small" click={onClickColorModeButton}>
                    <img
                        className={style.header__changeColorMode}
                        src={imageForChangeColorMode}
                        alt="change color mode"
                    />
                </Button>
                <nav className={style.header__links}>
                    <NavLink
                        to={Paths.GAME}
                        className={({ isActive }) => calculateLinkClass(isActive)}>
                        Game
                    </NavLink>
                    {!user && (
                        <NavLink
                            to={Paths.SIGNIN}
                            className={({ isActive }) => calculateLinkClass(isActive)}>
                            Login
                        </NavLink>
                    )}

                    {user && (
                        <>
                            <NavLink
                                to={Paths.FORUM__URL}
                                className={({ isActive }) => calculateLinkClass(isActive)}>
                                Forum
                            </NavLink>
                            <NavLink
                                to={Paths.LEADERBOARD}
                                className={({ isActive }) => calculateLinkClass(isActive)}>
                                Leaderboard
                            </NavLink>
                        </>
                    )}
                </nav>

                {user && (
                    <>
                        <UserInfo user={user} />
                        <Button size="medium" text="Logout" click={logout} />
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;
