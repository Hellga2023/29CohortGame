import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '@/app/components/common/form/form';
import Button from '@/app/components/common/button/button';
import Input from '@/app/components/common/input/input';
import AuthAPI from '@/app/api/AuthAPI';
import { RoutePaths } from '@/app/router/router';

const Signin: FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleChangeLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target.value);
    };

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmitForm = () => {
        AuthAPI.login(
            {
                login,
                password,
            },
            () => {
                console.log('in callback');
                navigate(RoutePaths.GAME);
            }
        );
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

                <Button text="Signin" click={handleSubmitForm} buttonStyle="withoutBackGround" />
            </Form>
        </div>
    );
};

export default Signin;
