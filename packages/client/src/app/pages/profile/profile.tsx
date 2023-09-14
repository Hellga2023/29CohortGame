import React, { FC, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import utils from '@/utils';

import { API_URL } from '@/app/api';
import UserAPI from '@/app/api/UserAPI';
import AuthAPI from '@/app/api/AuthAPI';

import Button from '@/app/components/common/button/button';
import LazyForm from '@/app/components/lazy/lazyForm/lazyForm';
import InputFile from '@/app/components/common/inputFile/inputFile';

import TUser from '@/const/dataTypes/dataTypes';
import { TResponse } from '@/const/types';
import './profile.scss';

type TProfileData = TUser;

type TProfilePageProps = {
    data?: TProfileData;
};

const Profile: FC<TProfilePageProps> = ({ data }) => {
    const [avatar, setAvatar] = useState(data?.login);

    const [login, setLogin] = useState(data?.login || '');
    const [displayName, setDisplayName] = useState(data?.displayName || '');
    const [firstName, setFirstName] = useState(data?.firstName || '');
    const [secondName, setSecondName] = useState(data?.secondName || '');
    const [email, setEmail] = useState(data?.email || '');
    const [phone, setPhone] = useState(data?.phone || '');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        AuthAPI.getAuthUser().then((response: TResponse | unknown) => {
            const responseData = utils.safeGetData(response);

            setAvatar(responseData.avatar);

            setLogin(responseData.login);
            setDisplayName(responseData.display_name);
            setFirstName(responseData.first_name);
            setSecondName(responseData.second_name);
            setEmail(responseData.email);
            setPhone(responseData.phone);
        });
    }, []);

    const handleChangeAvatar = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = (target.files as FileList)[0];
        const form = new FormData();

        form.set('avatar', file);

        UserAPI.updateAvatar(form).then(response => {
            const responseData = utils.safeGetData(response);
            setAvatar(responseData.avatar);
        });
    };

    const handleSubmitForm = () => {
        UserAPI.update({
            login,
            first_name: firstName,
            second_name: secondName,
            email,
            display_name: displayName,
            phone,
        }).then(response => {
            // eslint-disable-next-line no-alert
            alert((response as TResponse)?.status);
        });
    };

    const handleSubmitPassword = () => {
        UserAPI.updatePassword({
            oldPassword,
            newPassword,
        }).then(response => {
            // eslint-disable-next-line no-alert
            alert((response as TResponse)?.status);
        });
    };

    return (
        <div className="page profile">
            <div className="box">
                <header className="flex">
                    <div>
                        <h1>{login}</h1>
                        <h3>{displayName}</h3>
                    </div>
                    <div className={classNames('avatar', { empty: !avatar })}>
                        {!!avatar && <img src={`${API_URL.RESOURCES}/${avatar}`} alt="" />}

                        <InputFile onChange={handleChangeAvatar} />
                    </div>
                </header>

                <div className="formWrapper onOneLine">
                    <LazyForm
                        wrapType="onOneLine row stretch"
                        inputs={useMemo(
                            () => [
                                { name: 'login', value: login, handler: setLogin },
                                {
                                    name: 'displayName',
                                    value: displayName,
                                    handler: setDisplayName,
                                },
                                { name: 'firstName', value: firstName, handler: setFirstName },
                                { name: 'secondName', value: secondName, handler: setSecondName },
                                { name: 'email', value: email, handler: setEmail },
                                { name: 'phone', value: phone, handler: setPhone },
                            ],
                            [login, displayName, firstName, secondName, email, phone]
                        )}>
                        <Button
                            text="Save"
                            click={handleSubmitForm}
                            buttonStyle="withoutBackGround"
                        />
                    </LazyForm>
                </div>

                <div className="formWrapper onOneLine">
                    <LazyForm
                        wrapType="onOneLine row stretch"
                        inputs={useMemo(
                            () => [
                                {
                                    name: 'oldPassword',
                                    value: oldPassword,
                                    handler: setOldPassword,
                                    type: 'password',
                                },
                                {
                                    name: 'newPassword',
                                    value: newPassword,
                                    handler: setNewPassword,
                                    type: 'password',
                                },
                            ],
                            [oldPassword, newPassword]
                        )}>
                        <Button
                            text="Change password"
                            click={handleSubmitPassword}
                            buttonStyle="withoutBackGround"
                        />
                    </LazyForm>
                </div>
            </div>
        </div>
    );
};

export default Profile;
