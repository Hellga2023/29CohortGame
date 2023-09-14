import React, { FC, useState } from 'react';
import Input from '@/app/components/common/input/input';
import Form from '@/app/components/common/form/form';
import Button from '@/app/components/common/button/button';
import './signup.scss';
import AuthAPI from '@/app/api/AuthAPI';
import { TResponse } from '@/const/types';

const Signup: FC = () => {
    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const handleChangeFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value);
    };

    const handleChangeSecondName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSecondName(event.target.value);
    };

    const handleChangeLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target.value);
    };

    const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleChangePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(event.target.value);
    };

    const handleSubmitForm = () => {
        AuthAPI.signup({
            first_name: firstName,
            second_name: secondName,
            login,
            email,
            password,
            phone,
        }).then(response => {
            // eslint-disable-next-line no-alert
            alert((response as TResponse)?.status);
        });
    };

    return (
        <div className="formWrapper">
            <Form className="column withGap">
                <Input
                    value={firstName}
                    onChange={handleChangeFirstName}
                    name="first_name"
                    label="first_name"
                    placeholder="first_name"
                    inputStyle="normal"
                    className="column"
                />
                <Input
                    value={secondName}
                    onChange={handleChangeSecondName}
                    name="second_name"
                    label="second_name"
                    placeholder="second_name"
                    className="column"
                />
                <Input
                    value={login}
                    onChange={handleChangeLogin}
                    name="login"
                    label="login"
                    placeholder="login"
                    className="column"
                />
                <Input
                    value={email}
                    onChange={handleChangeEmail}
                    name="email"
                    label="email"
                    placeholder="email"
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
                <Input
                    value={phone}
                    onChange={handleChangePhone}
                    name="phone"
                    label="phone"
                    placeholder="phone"
                    className="column"
                />

                <Button text="Signup" click={handleSubmitForm} buttonStyle="withoutBackGround" />
            </Form>
        </div>
    );
};

export default Signup;
