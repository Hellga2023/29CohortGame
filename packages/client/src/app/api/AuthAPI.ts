import HTTPTransport from '@/utils/HTTPTransport/HTTPTransport';
import BaseAPI, { API_URL } from '../api';
import { AuthUserData } from '@/const/dataTypes/dataTypes';
import { TResponse } from '@/const/types';
import utils from '@/utils';
import { store } from '../store/store';
import { signIn, signOut } from '../store/slices/userSlice';

const http = HTTPTransport;
const options = {};
const headersJSON = {
    'content-type': 'application/json', // Данные отправляем в формате JSON
};

class AuthAPI extends BaseAPI {
    url = `${API_URL.HOST}/auth`;

    async login(data: AuthUserData, callback: () => void) {
        const userResponse = (await this.getAuthUser()) as Response;

        // todo handle logged in users so that signin form
        // will not be shown until logout
        if (userResponse.status === 200) {
            callback();
        }

        return this.signin(callback, data);
    }

    signin(callback: () => void, data: object = {}) {
        const reqOptions = {
            ...options,
            headers: headersJSON,
            data: JSON.stringify(data),
        };

        http.post(`${this.url}/signin`, reqOptions)
            .then(response => {
                const status = (response as TResponse)?.status;
                if (status === 200) {
                    return this.getAuthUser();
                }

                return null;
            })
            .then(response => {
                const responseData = utils.safeGetData(response, true);
                store.dispatch(signIn(responseData));
                console.log('before callback');
                callback();
            });
    }

    signup(data: object = {}) {
        const reqOptions = {
            ...options,
            headers: headersJSON,
            data: JSON.stringify(data),
        };

        return http.post(`${this.url}/signup`, reqOptions);
    }

    getAuthUser() {
        return http.get(`${this.url}/user`);
    }

    logout(callback: () => void) {
        http.post(`${this.url}/logout`).then(() => {
            store.dispatch(signOut());
            callback();
        });
    }
}

export default new AuthAPI();
