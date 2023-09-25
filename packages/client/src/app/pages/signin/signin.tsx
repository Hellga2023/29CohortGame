/* eslint-disable consistent-return */
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Form from '@/app/components/common/form/form';
import Button from '@/app/components/common/button/button';
import Input from '@/app/components/common/input/input';
import AuthAPI from '@/app/api/AuthAPI';
import OAuthAPI from '@/app/api/OAuthAPI';
import { RoutePaths } from '@/app/router/router';
import { TResponse } from '@/const/types';
import utils from '@/utils';
import { signIn } from '@/app/store/slices/userSlice';

const Signin: FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChangeLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target.value);
    };

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleOAuth = () => {
        console.log(OAuthAPI, AuthAPI);
        OAuthAPI.getServiceId().then((response: any) => {
            const responseData = utils.safeGetData(response);
            // navigate();
            window.location.replace(
                `https://oauth.yandex.ru/authorize?response_type=code&client_id=${responseData.service_id}&redirect_uri=http://localhost:3000`
            );
            // window.location = '';
            // debugger;
            // console.log(responseData.service_id);
        });
        // OAuthAPI.oautj
    };

    const handleSubmitForm = () => {
        AuthAPI.login({
            login,
            password,
        })
            .then(response => {
                const status = (response as TResponse)?.status;

                if (status === 200) {
                    navigate(RoutePaths.GAME);

                    return AuthAPI.getAuthUser();
                }
            })
            .then(response => {
                const responseData = utils.safeGetData(response);
                dispatch(signIn(responseData));
            });
    };

    return (
        <div className="formWrapper">
            <Form className="column withGap">
                <Input
                    value={login}
                    onChange={handleChangeLogin}
                    name="login"
                    label="login"
                    placeholder="login"
                    className="column"
                />

                <Input
                    value={password}
                    onChange={handleChangePassword}
                    name="password"
                    label="password"
                    placeholder="password"
                    className="column"
                />

                <Button text="OAuth" click={handleOAuth} buttonStyle="withoutBackGround" />

                <Button text="Signin" click={handleSubmitForm} buttonStyle="withoutBackGround" />

                <Button text="Signup" click={() => navigate(RoutePaths.SIGNUP)} />
            </Form>
        </div>
    );
};

export default Signin;
